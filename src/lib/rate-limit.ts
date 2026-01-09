// Rate limiting via Upstash Redis

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";


const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 3 signups per IP per day
export const signupRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "24 h"),
    prefix: "ratelimit:signup",
    analytics: true,
});

// 1 review per user every 5 minutes
export const reviewRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, "5 m"),
    prefix: "ratelimit:review",
    analytics: true,
});


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
        // Fail open if Redis is down
        return { success: true, remaining: 3, reset: new Date() };
    }
}


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
        // Fail open if Redis is down
        return { success: true, remaining: 1, reset: new Date() };
    }
}


export function getTimeUntilReset(reset: Date): string {
    const now = new Date();
    const diff = reset.getTime() - now.getTime();

    if (diff <= 0) return "ora";

    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        if (minutes > 0) {
            return `${hours} or${hours === 1 ? "a" : "e"} e ${minutes} minut${minutes === 1 ? "o" : "i"}`;
        }
        return `${hours} or${hours === 1 ? "a" : "e"}`;
    }

    if (totalMinutes > 0) {
        if (seconds > 0 && totalMinutes < 5) {
            return `${totalMinutes} minut${totalMinutes === 1 ? "o" : "i"} e ${seconds} second${seconds === 1 ? "o" : "i"}`;
        }
        return `${totalMinutes} minut${totalMinutes === 1 ? "o" : "i"}`;
    }

    return `${seconds} second${seconds === 1 ? "o" : "i"}`;
}
