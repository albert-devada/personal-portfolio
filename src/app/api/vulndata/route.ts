import { NextResponse } from "next/server";
import { authors } from "@/common/constants";
import { VerifedSession } from "@/lib/server";
import { fetchExploitedData } from "@/common/service";

export const dynamic = "force-dynamic";

const API_CONFIG = {
    version: authors.mainAuthor.version,
    author: { name: authors.mainAuthor.nickname, github: authors.mainAuthor.github, instagram: authors.mainAuthor.instagram, linkedin: authors.mainAuthor.linkedin },
};

const getMeta = () => ({ ...API_CONFIG });

export async function GET() {
    try {
        const clientSession = await VerifedSession();

        if (!clientSession) {
            return NextResponse.json(
                { success: false, meta: getMeta(), error: "Your request is invalid, Please try again.",  timestamp: new Date().toISOString() },
                { status: 401 }
            );
        }

        const vulnData = await fetchExploitedData();

        if (!vulnData || (Array.isArray(vulnData) && vulnData.length === 0)) {
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
        console.error("[EXPLOITED_API_ERROR]:", error);

        return NextResponse.json(
            { success: false, meta: getMeta(), error: "An internal system error occurred. Try again later.", timestamp: new Date().toISOString() },
            { status: 500 }
        );
    }
}