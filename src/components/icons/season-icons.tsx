/**
 * Season Icons - Minimalist SVG icons for fragrance seasons
 */

import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

export function SpringIcon({ className = "h-5 w-5", ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Cherry blossom / flower */}
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
        </svg>
    );
}

export function SummerIcon({ className = "h-5 w-5", ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Sun */}
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.22 4.22l1.42 1.42" />
            <path d="M18.36 18.36l1.42 1.42" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M4.22 19.78l1.42-1.42" />
            <path d="M18.36 5.64l1.42-1.42" />
        </svg>
    );
}

export function AutumnIcon({ className = "h-5 w-5", ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Falling leaf */}
            <path d="M6 3v11" />
            <path d="M6 14c0 2.5 3 6 6 6s6-3.5 6-6c0-3.5-3-6-6-11-3 5-6 7.5-6 11z" />
            <path d="M12 9c-2 2-3 4-3 5" />
        </svg>
    );
}

export function WinterIcon({ className = "h-5 w-5", ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Snowflake */}
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export const SEASON_ICONS = {
    spring: SpringIcon,
    summer: SummerIcon,
    autumn: AutumnIcon,
    winter: WinterIcon,
} as const;

export type SeasonKey = keyof typeof SEASON_ICONS;
