import { cn } from "@/lib";
import React from "react";

type TypographyComponent = (() => null) & {
    H1: React.FC<React.ComponentPropsWithoutRef<"h1">>;
    H2: React.FC<React.ComponentPropsWithoutRef<"h2">>;
    H3: React.FC<React.ComponentPropsWithoutRef<"h3">>;
    H4: React.FC<React.ComponentPropsWithoutRef<"h4">>;
    P: React.FC<React.ComponentPropsWithoutRef<"div">>;
    quote: React.FC<React.ComponentPropsWithoutRef<"blockquote">>;
};

export const Typography: TypographyComponent = () => {
    return null;
};

// H1
export const TypographyH1 = ({
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"h1">) => {
    return (
        <h1
            className={cn(
                "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
                className,
            )}
            {...props}
        >
            {children}
        </h1>
    );
};

Typography.H1 = TypographyH1;

// H2
export const TypographyH2 = ({
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"h2">) => {
    return (
        <h2
            className={cn(
                "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
                className,
            )}
            {...props}
        >
            {children}
        </h2>
    );
};

Typography.H2 = TypographyH2;

// H3
export const TypographyH3 = ({
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"h3">) => {
    return (
        <h3
            className={cn(
                "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
                className,
            )}
            {...props}
        >
            {children}
        </h3>
    );
};

Typography.H3 = TypographyH3;

// H4
export const TypographyH4 = ({
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"h4">) => {
    return (
        <h4
            className={cn(
                "scroll-m-20 text-xl font-semibold tracking-tight",
                className,
            )}
            {...props}
        >
            {children}
        </h4>
    );
};

Typography.H4 = TypographyH4;

// Paragraph (P)
export const TypographyP = ({
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) => {
    return (
        <div className={cn("leading-7", className)} {...props}>
            {children}
        </div>
    );
};

Typography.P = TypographyP;

// Blockquote (quote)
export const TypographyBlockquote = ({
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"blockquote">) => {
    return (
        <blockquote
            className={cn("mt-6 border-l-2 pl-6 italic", className)}
            {...props}
        >
            {children}
        </blockquote>
    );
};

Typography.quote = TypographyBlockquote;

export default Typography;
