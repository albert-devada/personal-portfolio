import React from "react";
import { cn } from "@/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    id?: string;
    children?: React.ReactNode;
    className?: string;
}

export function Section({ id, children, className, ...props }: SectionProps) {
    return (
        <section id={id} className={cn("w-full max-w-full min-w-0 flex flex-col font-sans", className)} {...props}>
            {children}
        </section>
    );
}
