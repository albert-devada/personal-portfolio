import type { Metadata } from "next";
import { generateBreadcrumbJsonLd } from "@/common/config";
import { Section } from "@/components/base";
import { ChatAssistant } from "@/contents";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "AI Assistant",
    description: "Interactive AI assistant trained on portfolio projects and cybersecurity insights",
    alternates: {
        canonical: "/chat",
    },
};

export default function ChatPage() {
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "AI Assistant", url: "/chat" },
    ]);

    return (
        <Section id="AI Assistant">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ChatAssistant />
        </Section>
    );
}
