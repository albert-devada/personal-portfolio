import { NextResponse } from "next/server";
import { API_CONFIG } from "@/common/config";
import { CheckDatabaseHealth } from "@/supabase";
import { CheckModelAIHealth } from "@/common/service";

export const dynamic = "force-dynamic";
const getMeta = () => ({ ...API_CONFIG });

async function CheckHealth() {
    const vercelStart = performance.now();

    const [DatabaseHealth, ModelAIHealth] = await Promise.all([
        CheckDatabaseHealth(),
        CheckModelAIHealth(),
    ]);

    const vercelEnd = performance.now();
    const vercelLatency = Math.round(vercelEnd - vercelStart);
    const isDbHealthy = DatabaseHealth.status === "healthy";
    const isAllHealthy = isDbHealthy && ModelAIHealth.status === "healthy";

    return NextResponse.json(
        {
            success: isDbHealthy,
            meta: getMeta(),
            data: {
                status: isAllHealthy ? "healthy" : "unhealthy",
                services: {
                    server: { status: "healthy", latency: `${vercelLatency}ms` },
                    database: DatabaseHealth,
                    ai_model: ModelAIHealth,
                },
            },
            timestamp: new Date().toISOString(),
        },
        { status: isDbHealthy ? 200 : 503 }
    );
}

export async function GET() {
    return CheckHealth();
}

export async function POST() {
    return CheckHealth();
}

export async function HEAD() {
    return CheckHealth();
}
