import { authors } from "@/common/constants";
import { fetchBreachData } from "@/common/service";
import { NextRequest, NextResponse } from "next/server";
import { VerifedSession, VerifedTurnstileToken } from "@/lib/server";

export const dynamic = "force-dynamic";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const API_CONFIG = {
    version: authors.mainAuthor.version,
    author: { name: authors.mainAuthor.nickname, github: authors.mainAuthor.github, instagram: authors.mainAuthor.instagram, linkedin: authors.mainAuthor.linkedin },
};

const getMeta = () => ({ ...API_CONFIG });

export async function POST(request: NextRequest) {
    try {
        const clientSession = await VerifedSession();

        if (!clientSession) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Your request is invalid, Please try again.", timestamp: new Date().toISOString() },
                { status: 401 }
            );
        }

        const body = await request.json().catch(() => ({}));
        const { email, turnstileToken } = body || {};
        const isValidHuman = await VerifedTurnstileToken(turnstileToken);

        if (!turnstileToken || typeof turnstileToken !== "string" || !turnstileToken.trim() || !isValidHuman) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Please complete the verification check.", timestamp: new Date().toISOString() },
                { status: 403 }
            );
        }

        if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email) || email.length > 254) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Invalid parameter format, Please try again.", timestamp: new Date().toISOString() },
                { status: 400 }
            );
        }

        const requestBreaches = await fetchBreachData(email);

        if (!requestBreaches) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Request is temporarily unavailable. Try again later.", timestamp: new Date().toISOString() },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: true, meta: getMeta(), data: requestBreaches, timestamp: new Date().toISOString() },
            { status: 200 }
        );

    } catch (error) {
        console.error("[BREACH_API_ERROR]:", error);

        return NextResponse.json(
            { success: false, meta: getMeta(), error: "An internal system error occurred. Try again later.", timestamp: new Date().toISOString() },
            { status: 500 }
        );
    }
}