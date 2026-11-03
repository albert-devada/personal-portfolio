export interface ResumeButtonProps {
    portfolioUrl?: string | null;
    className?: string;
    fileName?: string;
}

export interface ResumeData {
    url: string;
    fileName?: string;
    lastUpdated?: string;
}