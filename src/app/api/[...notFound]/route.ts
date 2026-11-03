import { NextResponse } from "next/server";
import { API_CONFIG } from "@/common/config";

export const dynamic = "force-dynamic";
const getMeta = () => ({ ...API_CONFIG });

function notFoundResponse() {
    return NextResponse.json(
        { success: false, meta: getMeta(), error: "API endpoint not found. Please check the requested URL.", timestamp: new Date().toISOString() },
        { status: 404 }
    );
}

export async function GET() {
    return notFoundResponse();
}

export async function POST() {
    return notFoundResponse();
}

export async function PUT() {
    return notFoundResponse();
}

export async function DELETE() {
    return notFoundResponse();
}

export async function PATCH() {
    return notFoundResponse();
}

export async function HEAD() {
    return notFoundResponse();
}

export async function OPTIONS() {
    return notFoundResponse();
}
