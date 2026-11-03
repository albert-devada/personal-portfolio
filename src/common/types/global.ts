import type { PersonalProfile } from "./navigation";

export interface PortfolioSessionPayload {
    refresh_token: string;
    expires_at: number;
    is_anonymous: boolean;
}

export interface RateLimitRecord {
    count: number;
    resetTime: number;
}

export interface RateLimitResponse {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

export interface Author {
    version: string;
    name: string;
    displayName: string;
    username: string;
    nickname: string;
    jobTitle: string;
    titles: string[];
    description: {
        en: string;
        id: string;
    };
    location: string;
    activity: string;
    status_work: boolean;
    url: string;
    instagram: string;
    github: string;
    linkedin: string;
    hackerone?: string;
}

export interface PlayListItems {
    id: number;
    title: string;
    artist: string;
    file: string;
    cover?: string;
}

export interface ViewPagesProps {
    profile?: PersonalProfile | null;
    certificates?: Record<string, string | number | boolean | null | undefined>[];
    workings?: Record<string, string | number | boolean | null | undefined>[];
    experiences?: Record<string, string | number | boolean | null | undefined>[];
    blogs?: Record<string, string | number | boolean | string[] | null | undefined>[];
    article?: Record<string, string | number | boolean | string[] | null | undefined> | null;
    isFullPage?: boolean;
}

export interface ArticleMetadataProps {
    title_en?: string | null;
    title_id?: string | null;
    summary_en?: string | null;
    summary_id?: string | null;
    category?: string | null;
    tags?: string[] | null;
    author_name?: string | null;
    cover_image?: string | null;
    published_at?: string | Date | null;
    updated_at?: string | Date | null;
    [key: string]: unknown;
}

export interface AstNode {
    type?: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    value?: string;
    children?: AstNode[];
}
