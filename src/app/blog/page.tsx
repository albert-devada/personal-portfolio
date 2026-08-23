import type { Metadata } from "next";
import { BlogInsights } from "@/contents";

export const metadata: Metadata = {
    title: "Technology Insights",
    description: "Explore articles, insights, and knowledge covering programming, cybersecurity, technology, and practical development.",
    alternates: {
        canonical: "/blog",
    },
};

export default function BlogPage() {
    return <BlogInsights />;
}
