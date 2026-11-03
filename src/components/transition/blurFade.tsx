"use client";

import React, { useRef } from "react";
import { motion, useInView, type MotionProps, type UseInViewOptions, type Variants } from "motion/react";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    variant?: {
        hidden: { y?: number; x?: number; opacity?: number; filter?: string };
        visible: { y?: number; x?: number; opacity?: number; filter?: string };
    };
    duration?: number;
    delay?: number;
    offset?: number;
    direction?: "up" | "down" | "left" | "right";
    inView?: boolean;
    inViewOnce?: boolean;
    inViewMargin?: MarginType;
    blur?: string;
    trigger?: boolean;
}


export const BlurFade = React.memo(function BlurFade({
    children,
    className,
    variant,
    duration = 1.15,
    delay = 0,
    offset = 12,
    direction = "down",
    inView = false,
    inViewOnce = false,
    inViewMargin = "-50px",
    blur = "6px",
    trigger,
    ...props
}: BlurFadeProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inViewResult = useInView(ref, { once: inViewOnce, margin: inViewMargin });
    const isInView = trigger !== undefined ? trigger : (!inView || inViewResult);

    const defaultVariants: Variants = {
        hidden: {
            x: direction === "right" ? -offset : direction === "left" ? offset : 0,
            y: direction === "down" ? -offset : direction === "up" ? offset : 0,
            opacity: 0,
            filter: `blur(${blur})`,
            pointerEvents: "none",
            transition: {
                duration: 0.2,
                ease: "easeOut",
            },
        },
        visible: {
            x: 0,
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            pointerEvents: "auto",
            transition: {
                delay: 0.04 + delay,
                duration,
                ease: [0.16, 1, 0.3, 1],
                filter: { duration: Math.min(duration, 0.6), ease: [0.16, 1, 0.3, 1] },
            },
        },
    };

    const combinedVariants = variant ?? defaultVariants;

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={combinedVariants}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
});