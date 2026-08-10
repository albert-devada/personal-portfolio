import { NextRequest, NextResponse } from "next/server";
import { VerifedSession } from "@/lib/session";
import { VerifedTurnstileToken } from "@/lib/turnstile";
import { fetchCVESearch } from "@/common/service/cvedataService";
import { authors } from "@/common/constants/author";

export const dynamic = "force-dynamic";
const cveId_REGEX = /^CVE-\d{4}-\d{4,}$/i;

const API_CONFIG = {
    version: authors.mainAuthor.version,
    author: { name: authors.mainAuthor.nickname, github: authors.mainAuthor.github, linkedin: authors.mainAuthor.linkedin },
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
        const { cveId, turnstileToken } = body || {};
        const isValidHuman = await VerifedTurnstileToken(turnstileToken);

        if (!turnstileToken || typeof turnstileToken !== "string" || !turnstileToken.trim() || !isValidHuman) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Please complete the verification check.", timestamp: new Date().toISOString() },
                { status: 403 }
            );
        }

        if (!cveId || typeof cveId !== "string" || !cveId_REGEX.test(cveId) || cveId.length > 254) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Invalid parameter format, Please try again.", timestamp: new Date().toISOString() },
                { status: 400 }
            );
        }

        const CveData = await fetchCVESearch(cveId);

        if (!CveData) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Request is temporarily unavailable. Try again later.", timestamp: new Date().toISOString() },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: true, meta: getMeta(), data: CveData, timestamp: new Date().toISOString() },
            { status: 200 }
        );

    } catch (error) {
        console.error("[CVE_API_ERROR]:", error);

        return NextResponse.json(
            { success: false, meta: getMeta(), error: "An internal system error occurred. Try again later.", timestamp: new Date().toISOString() },
            { status: 500 }
        );
    }
}