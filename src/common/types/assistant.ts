export interface ChatMessageItems {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

export interface ChatHistoryContext {
    role: "user" | "assistant" | "model";
    content: string;
}