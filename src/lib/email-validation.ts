/**
 * Email Validation & Normalization
 * Prevents duplicate accounts and blocks disposable emails
 */

import disposableDomains from "disposable-email-domains";

// Additional commonly used disposable/temporary email domains
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

// Create a Set for O(1) lookups
const disposableDomainSet = new Set<string>([
    ...disposableDomains,
    ...ADDITIONAL_DISPOSABLE_DOMAINS,
]);

/**
 * Normalize email address:
 * 1. Convert to lowercase
 * 2. Remove plus aliases (user+alias@gmail.com → user@gmail.com)
 * 3. For Gmail: remove dots (u.s.e.r@gmail.com → user@gmail.com)
 */
export function normalizeEmail(email: string): string {
    const lowercased = email.toLowerCase().trim();
    const [localPart, domain] = lowercased.split("@");

    if (!localPart || !domain) {
        return lowercased;
    }

    // Remove plus alias (everything after +)
    let normalizedLocal = localPart.split("+")[0];

    // For Gmail and Google domains, also remove dots
    const googleDomains = ["gmail.com", "googlemail.com"];
    if (googleDomains.includes(domain)) {
        normalizedLocal = normalizedLocal.replace(/\./g, "");
    }

    return `${normalizedLocal}@${domain}`;
}

/**
 * Check if email domain is a disposable/temporary email provider
 */
export function isDisposableEmail(email: string): boolean {
    const domain = email.toLowerCase().split("@")[1];

    if (!domain) {
        return false;
    }

    // Check exact match
    if (disposableDomainSet.has(domain)) {
        return true;
    }

    // Check for subdomains of known disposable domains
    for (const disposable of disposableDomainSet) {
        if (domain.endsWith(`.${disposable}`)) {
            return true;
        }
    }

    return false;
}

/**
 * Validate email format and check if it's allowed
 * Returns error message if invalid, null if valid
 */
export function validateEmail(email: string): string | null {
    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Formato email non valido.";
    }

    // Check for disposable email
    if (isDisposableEmail(email)) {
        return "Non è possibile registrarsi con email temporanee. Usa un indirizzo email permanente.";
    }

    return null;
}

/**
 * Get the normalized email for database comparison
 * Use this to check for duplicate accounts
 */
export function getEmailForDuplicateCheck(email: string): string {
    return normalizeEmail(email);
}
