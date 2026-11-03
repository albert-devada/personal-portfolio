import { cn } from "@/utils";
import React, { ComponentPropsWithoutRef } from "react";

// --- Hero & Dub.co Style Typography ---

// Hero Title 
export function HeroTitle({ className, children, as: Component = "h1", ...props }: ComponentPropsWithoutRef<"h1"> & { as?: React.ElementType }) {
    const Comp = Component as React.ElementType;
    return (
        <Comp className={cn("font-sans text-4xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-neutral-900 dark:text-white leading-[1.15] text-pretty", className)} {...props}>
            {children}
        </Comp>
    );
}

// Section Title 
export function SectionTitle({ className, children, as: Component = "h2", ...props }: ComponentPropsWithoutRef<"h2"> & { as?: React.ElementType }) {
    const Comp = Component as React.ElementType;
    return (
        <Comp className={cn("font-sans text-3xl sm:text-5xl font-medium tracking-[-0.02em] text-neutral-900 dark:text-white text-pretty", className)} {...props}>
            {children}
        </Comp>
    );
}

// Card Title 
export function CardTitle({ className, children, as: Component = "h3", ...props }: ComponentPropsWithoutRef<"h3"> & { as?: React.ElementType }) {
    const Comp = Component as React.ElementType;
    return (
        <Comp className={cn("font-sans text-xl font-semibold tracking-tight text-neutral-900 dark:text-white", className)} {...props}>
            {children}
        </Comp>
    );
}

// Subtitle / Paragraph Lead 
export function Subtitle({ className, children, as: Component = "p", ...props }: ComponentPropsWithoutRef<"p"> & { as?: React.ElementType }) {
    const Comp = Component as React.ElementType;
    return (
        <Comp className={cn("font-sans text-base sm:text-xl text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed text-pretty max-w-2xl mx-auto", className)} {...props}>
            {children}
        </Comp>
    );
}

// Body Text
export function Text({ className, children, as: Component = "p", ...props }: ComponentPropsWithoutRef<"p"> & { as?: React.ElementType }) {
    const Comp = Component as React.ElementType;
    return (
        <Comp className={cn("font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed", className)} {...props}>
            {children}
        </Comp>
    );
}

// Monospace Badge / Technical Label 
export function MonoText({ className, children, as: Component = "span", ...props }: ComponentPropsWithoutRef<"span"> & { as?: React.ElementType }) {
    const Comp = Component as React.ElementType;
    return (
        <Comp className={cn("font-mono text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider", className)} {...props}>
            {children}
        </Comp>
    );
}

// Serif Display Accent
export function SerifAccent({ className, children, as: Component = "span", ...props }: ComponentPropsWithoutRef<"span"> & { as?: React.ElementType }) {
    const Comp = Component as React.ElementType;
    return (
        <Comp className={cn("font-serif italic font-normal text-neutral-900 dark:text-neutral-100", className)} {...props}>
            {children}
        </Comp>
    );
}

// --- Standard / Shadcn Typography ---

export const TypographyH1 = ({ className, children, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)} {...props}>
        {children}
    </h1>
);

export const TypographyH2 = ({ className, children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)} {...props}>
        {children}
    </h2>
);

export const TypographyH3 = ({ className, children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props}>
        {children}
    </h3>
);

export const TypographyH4 = ({ className, children, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}>
        {children}
    </h4>
);

export const TypographyP = ({ className, children, ...props }: ComponentPropsWithoutRef<"div">) => (
    <div className={cn("leading-7", className)} {...props}>
        {children}
    </div>
);

export const TypographyBlockquote = ({ className, children, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props}>
        {children}
    </blockquote>
);

type TypographyComponent = (() => null) & {
    H1: React.FC<ComponentPropsWithoutRef<"h1">>;
    H2: React.FC<ComponentPropsWithoutRef<"h2">>;
    H3: React.FC<ComponentPropsWithoutRef<"h3">>;
    H4: React.FC<ComponentPropsWithoutRef<"h4">>;
    P: React.FC<ComponentPropsWithoutRef<"div">>;
    quote: React.FC<ComponentPropsWithoutRef<"blockquote">>;
    HeroTitle: React.FC<ComponentPropsWithoutRef<"h1"> & { as?: React.ElementType }>;
    SectionTitle: React.FC<ComponentPropsWithoutRef<"h2"> & { as?: React.ElementType }>;
    CardTitle: React.FC<ComponentPropsWithoutRef<"h3"> & { as?: React.ElementType }>;
    Subtitle: React.FC<ComponentPropsWithoutRef<"p"> & { as?: React.ElementType }>;
    Text: React.FC<ComponentPropsWithoutRef<"p"> & { as?: React.ElementType }>;
    MonoText: React.FC<ComponentPropsWithoutRef<"span"> & { as?: React.ElementType }>;
    SerifAccent: React.FC<ComponentPropsWithoutRef<"span"> & { as?: React.ElementType }>;
};

const Typography: TypographyComponent = () => {
    return null;
};

Typography.H1 = TypographyH1;
Typography.H2 = TypographyH2;
Typography.H3 = TypographyH3;
Typography.H4 = TypographyH4;
Typography.P = TypographyP;
Typography.quote = TypographyBlockquote;
Typography.HeroTitle = HeroTitle;
Typography.SectionTitle = SectionTitle;
Typography.CardTitle = CardTitle;
Typography.Subtitle = Subtitle;
Typography.Text = Text;
Typography.MonoText = MonoText;
Typography.SerifAccent = SerifAccent;

export default Typography;