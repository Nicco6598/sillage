// Email normalization and disposable domain blocking

import disposableDomains from "disposable-email-domains";


const ADDITIONAL_DISPOSABLE_DOMAINS = [
    "tempmail.com",
    "guerrillamail.com",
    "10minutemail.com",
    "throwaway.email",
    "temp-mail.org",
    "fakeinbox.com",
    "mailinator.com",
    "yopmail.com",
    "trashmail.com",
    "getnada.com",
];


const disposableDomainSet = new Set<string>([
    ...disposableDomains,
    ...ADDITIONAL_DISPOSABLE_DOMAINS,
]);

const GOOGLE_DOMAINS = ["gmail.com", "googlemail.com"];

function isGoogleEmail(domain: string): boolean {
    return GOOGLE_DOMAINS.includes(domain);
}

export function normalizeEmail(email: string): string {
    const lowercased = email.toLowerCase().trim();
    const [localPart, domain] = lowercased.split("@");

    if (!localPart || !domain) {
        return lowercased;
    }

    // Strip +alias suffix
    let normalizedLocal = localPart.split("+")[0];

    // Gmail ignores dots in local part
    if (isGoogleEmail(domain)) {
        normalizedLocal = normalizedLocal.replace(/\./g, "");
    }

    return `${normalizedLocal}@${domain}`;
}


export function isDisposableEmail(email: string): boolean {
    const domain = email.toLowerCase().split("@")[1];

    if (!domain) {
        return false;
    }


    if (disposableDomainSet.has(domain)) {
        return true;
    }

    // Also check subdomains
    for (const disposable of disposableDomainSet) {
        if (domain.endsWith(`.${disposable}`)) {
            return true;
        }
    }

    return false;
}


export function validateEmail(email: string): string | null {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Formato email non valido.";
    }


    if (isDisposableEmail(email)) {
        return "Non è possibile registrarsi con email temporanee. Usa un indirizzo email permanente.";
    }

    return null;
}


export function getEmailForDuplicateCheck(email: string): string {
    return normalizeEmail(email);
}
