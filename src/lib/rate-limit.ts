/**
 * Rate Limiting with Upstash Redis
 * Used for signup spam prevention and review rate limiting
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Rate limiter for signup: 3 accounts per 24 hours per IP
 */
export const signupRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "24 h"),
    prefix: "ratelimit:signup",
    analytics: true,
});

/**
 * Rate limiter for reviews: 1 review per 5 minutes per user
 */
export const reviewRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, "5 m"),
    prefix: "ratelimit:review",
    analytics: true,
});

/**
 * Check rate limit for signup by IP address
 */
export async function checkSignupRateLimit(ip: string): Promise<{
    success: boolean;
    remaining: number;
    reset: Date;
}> {
    try {
        const { success, remaining, reset } = await signupRateLimiter.limit(ip);
        return {
            success,
            remaining,
            reset: new Date(reset),
        };
    } catch (error) {
        console.error("Rate limit check failed:", error);
        // Fail open in case of Redis issues
        return { success: true, remaining: 3, reset: new Date() };
    }
}

/**
 * Check rate limit for reviews by user ID
 */
export async function checkReviewRateLimit(userId: string): Promise<{
    success: boolean;
    remaining: number;
    reset: Date;
}> {
    try {
        const { success, remaining, reset } = await reviewRateLimiter.limit(userId);
        return {
            success,
            remaining,
            reset: new Date(reset),
        };
    } catch (error) {
        console.error("Review rate limit check failed:", error);
        // Fail open in case of Redis issues
        return { success: true, remaining: 1, reset: new Date() };
    }
}

/**
 * Get remaining time until reset in human readable format
 */
export function getTimeUntilReset(reset: Date): string {
    const now = new Date();
    const diff = reset.getTime() - now.getTime();

    if (diff <= 0) return "ora";

    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        if (remainingMinutes > 0) {
            return `${hours} or${hours === 1 ? "a" : "e"} e ${remainingMinutes} minut${remainingMinutes === 1 ? "o" : "i"}`;
        }
        return `${hours} or${hours === 1 ? "a" : "e"}`;
    }

    if (minutes > 0) {
        if (seconds > 0 && minutes < 5) {
            return `${minutes} minut${minutes === 1 ? "o" : "i"} e ${seconds} second${seconds === 1 ? "o" : "i"}`;
        }
        return `${minutes} minut${minutes === 1 ? "o" : "i"}`;
    }

    return `${seconds} second${seconds === 1 ? "o" : "i"}`;
}
