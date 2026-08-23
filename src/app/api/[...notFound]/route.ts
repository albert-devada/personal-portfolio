import { NextResponse } from "next/server";
import { authors } from "@/common/constants/author";

export const dynamic = "force-dynamic";

const API_CONFIG = {
    version: authors.mainAuthor.version,
    author: { name: authors.mainAuthor.nickname, github: authors.mainAuthor.github, instagram: authors.mainAuthor.instagram, linkedin: authors.mainAuthor.linkedin },
};

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
