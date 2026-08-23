import { NextResponse } from "next/server";
import { authors } from "@/common/constants";
import { supabase } from "@/common/supabase";

export const dynamic = "force-dynamic";

const API_CONFIG = {
    version: authors.mainAuthor.version,
    author: { name: authors.mainAuthor.nickname, github: authors.mainAuthor.github, instagram: authors.mainAuthor.instagram, linkedin: authors.mainAuthor.linkedin },
};

const getMeta = () => ({ ...API_CONFIG });

async function checkHealth() {
    const vercelStart = performance.now();
    let isSupabaseHealthy = false;
    let supabaseLatency = 0;

    try {
        const supabaseStart = performance.now();
        const { error, data } = await supabase.from("personal").select("id").limit(1);
        const supabaseEnd = performance.now();
        supabaseLatency = Math.round(supabaseEnd - supabaseStart);

        if (!error && data) {
            isSupabaseHealthy = true;
        }
    } catch {
        isSupabaseHealthy = false;
    }

    const vercelEnd = performance.now();
    const vercelLatency = Math.round(vercelEnd - vercelStart);

    return NextResponse.json(
        {
            success: isSupabaseHealthy,
            meta: getMeta(),
            data: {
                status: isSupabaseHealthy ? "healthy" : "unhealthy",
                services: {
                    server: { status: "healthy", latency: `${vercelLatency}ms` },
                    database: { status: isSupabaseHealthy ? "healthy" : "unhealthy", latency: `${supabaseLatency}ms` },
                    ai_model: { status: "unavailable", latency: `0ms` },
                },
            },
            timestamp: new Date().toISOString(),
        },
        { status: isSupabaseHealthy ? 200 : 503 }
    );
}

export async function GET() {
    return checkHealth();
}

export async function POST() {
    return checkHealth();
}

export async function HEAD() {
    return checkHealth();
}
