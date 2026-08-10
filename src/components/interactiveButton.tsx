import React from "react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    hoverIcon?: React.ReactNode;
}

export function InteractiveHoverButton({
    children,
    className,
    icon,
    hoverIcon,
    ...props
}: InteractiveHoverButtonProps) {
    return (
        <button
            className={cn(
                "group relative h-9 cursor-pointer overflow-hidden rounded-none border px-5 text-xs md:text-sm font-semibold transition-all duration-300 select-none flex items-center justify-center",
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-x-2.5">
                {icon && <span className="flex items-center justify-center shrink-0 w-4 h-4 text-current">{icon}</span>}
                <span className="whitespace-nowrap">{children}</span>
            </div>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-x-0 flex items-center justify-center w-4 h-4 text-current pointer-events-none">
                {hoverIcon}
            </div>
        </button>
    );
}