import type { Metadata } from "next";
import { ChatAssistant } from "@/contents";

export const metadata: Metadata = {
    title: "AI Assistant",
    description: "An interactive AI chat assistant trained on portfolio projects, technical expertise, and cybersecurity insights.",
    alternates: {
        canonical: "/chat",
    },
};

export default function ChatPage() {
    return <ChatAssistant />;
}
