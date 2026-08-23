import { NextRequest, NextResponse } from "next/server";
import { VerifedSession } from "@/lib/session";
import { VerifedTurnstileToken } from "@/lib/turnstile";
import { fetchExploitedSearch } from "@/common/service/exploitedService";
import { authors } from "@/common/constants/author";

export const dynamic = "force-dynamic";

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
        const { query, turnstileToken } = body || {};
        const isValidHuman = await VerifedTurnstileToken(turnstileToken);

        if (!turnstileToken || typeof turnstileToken !== "string" || !turnstileToken.trim() || !isValidHuman) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Please complete the verification check.", timestamp: new Date().toISOString() },
                { status: 403 }
            );
        }
        
        if (!query || typeof query !== "string" || !query.trim() || query.length > 100) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Invalid parameter format, Please try again.", timestamp: new Date().toISOString() },
                { status: 400 }
            );
        }

        const vulnData = await fetchExploitedSearch(query);

        if (!vulnData) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Request is temporarily unavailable. Try again later.", timestamp: new Date().toISOString() },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { success: true, meta: getMeta(), data: vulnData, timestamp: new Date().toISOString() },
            { status: 200 }
        );

    } catch (error) {
        console.error("[VULN_SEARCH_API_ERROR]:", error);

        return NextResponse.json(
            { success: false, meta: getMeta(), error: "An internal system error occurred. Try again later.", timestamp: new Date().toISOString() },
            { status: 500 }
        );
    }
}