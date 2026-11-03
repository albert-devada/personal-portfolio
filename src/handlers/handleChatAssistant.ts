"use server";

import { headers } from "next/headers";
import { GenerateAssistantReply } from "@/common/service";
import { CheckRateLimit, getClientIP } from "@/utils";
import type { ChatHistoryContext } from "@/common/types"

/**
 * Server Action Controller for Chat Assistant. Handles IP-based rate limiting and delegates generation to Gemini 3.5 Flash-Lite.
 */
export async function HandleChatAssistant(userMessage: string, history: ChatHistoryContext[] = [], lang: "en" | "id" = "id"): Promise<string> {
    const headerList = await headers();
    const clientIp = getClientIP({ headers: headerList });
    const rateLimit = CheckRateLimit(`chat_${clientIp}`, 10, 60000);

    if (!rateLimit.success) {
        return lang === "en" ? "Message rate limit reached (maximum 10 messages per minute). Please wait a moment before sending another message." : "Batas frekuensi pesan tercapai (maksimal 10 pesan per menit). Mohon tunggu sebentar sebelum mengirim pesan berikutnya.";
    }

    return await GenerateAssistantReply(userMessage, history, lang);
}

