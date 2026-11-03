import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/common/config";
import { ValidateSession, ValidateTurnstile, fetchExploitedSearch, fetchCVESearch, fetchBreachSearch } from "@/common/service";

export const dynamic = "force-dynamic";
const getMeta = () => ({ ...API_CONFIG });
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CVEID_REGEX = /^CVE-\d{4}-\d{4,}$/i;
const ALLOWED_PARAMS = new Set(["vulndata", "cvedata", "breach"]);

export async function POST(request: NextRequest) {
    try {
        const clientSession = await ValidateSession();

        if (!clientSession) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Your request is invalid, Please try again.", timestamp: new Date().toISOString() },
                { status: 401 }
            );
        }

        const body = await request.json().catch(() => ({}));
        const turnstileToken = body?.turnstileToken || request.headers.get("x-turnstile-token");
        const isValidHuman = await ValidateTurnstile(turnstileToken);

        if (!turnstileToken || typeof turnstileToken !== "string" || !turnstileToken.trim() || !isValidHuman) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Please complete the verification check.", timestamp: new Date().toISOString() },
                { status: 403 }
            );
        }

        const { searchParams } = request.nextUrl;
        const searchParamKeys = Array.from(searchParams.keys());

        const hasInvalidKey = searchParamKeys.some((key) => !ALLOWED_PARAMS.has(key));
        if (hasInvalidKey) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Invalid parameter format, Please try again.", timestamp: new Date().toISOString() },
                { status: 400 }
            );
        }

        const vulndata = searchParams.get("vulndata");
        const cvedata = searchParams.get("cvedata");
        const breach = searchParams.get("breach");

        const activeParams = [
            vulndata ? "vulndata" : null,
            cvedata ? "cvedata" : null,
            breach ? "breach" : null,
        ].filter(Boolean);

        if (activeParams.length !== 1) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Invalid parameter format, Please try again.", timestamp: new Date().toISOString() },
                { status: 400 }
            );
        }

        const selectedParam = activeParams[0];

        if (selectedParam === "vulndata") {
            const query = typeof vulndata === "string" ? vulndata.trim() : "";
            if (!query || !CVEID_REGEX.test(query) || query.length > 254) {
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
        }

        if (selectedParam === "cvedata") {
            const query = typeof cvedata === "string" ? cvedata.trim() : "";
            if (!query || !CVEID_REGEX.test(query) || query.length > 254) {
                return NextResponse.json(
                    { success: false, meta: getMeta(), error: "Invalid parameter format, Please try again.", timestamp: new Date().toISOString() },
                    { status: 400 }
                );
            }

            const CveData = await fetchCVESearch(query);

            if (!CveData) {
                return NextResponse.json(
                    { success: false, meta: getMeta(), error: "Request is temporarily unavailable. Try again later.", timestamp: new Date().toISOString() },
                    { status: 503 }
                );
            }

            return NextResponse.json(
                { success: true, meta: getMeta(), data: CveData, timestamp: new Date().toISOString() },
                { status: 200 }
            );
        }

        if (selectedParam === "breach") {
            const email = typeof breach === "string" ? breach.trim() : "";
            if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
                return NextResponse.json(
                    { success: false, meta: getMeta(), error: "Invalid parameter format, Please try again.", timestamp: new Date().toISOString() },
                    { status: 400 }
                );
            }

            const requestBreaches = await fetchBreachSearch(email);

            if (!requestBreaches) {
                return NextResponse.json(
                    { success: false, meta: getMeta(), error: "Request is temporarily unavailable. Try again later.", timestamp: new Date().toISOString() },
                    { status: 503 }
                );
            }

            return NextResponse.json(
                { success: true, meta: getMeta(), data: requestBreaches, timestamp: new Date().toISOString() },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: false, meta: getMeta(), error: "Invalid parameter format, Please try again.", timestamp: new Date().toISOString() },
            { status: 400 }
        );

    } catch (error) {
        console.error("[SEARCH_API_ERROR]:", error);

        return NextResponse.json(
            { success: false, meta: getMeta(), error: "An internal system error occurred. Try again later.", timestamp: new Date().toISOString() },
            { status: 500 }
        );
    }
}
