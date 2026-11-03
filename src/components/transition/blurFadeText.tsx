"use client";

import { cn } from "@/utils";
import { motion, useInView, Variants, type UseInViewOptions } from "motion/react";
import React, { useMemo, useRef } from "react";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeTextProps {
    text: string;
    className?: string;
    as?: "span" | "div";
    variant?: {
        hidden: { y?: number; x?: number };
        visible: { y?: number; x?: number };
    };
    duration?: number;
    characterDelay?: number;
    delay?: number;
    yOffset?: number;
    animateByCharacter?: boolean;
    inView?: boolean;
    inViewOnce?: boolean;
    inViewMargin?: MarginType;
    direction?: "up" | "down" | "left" | "right";
}

export const BlurFadeText = React.memo(function BlurFadeText({
    text,
    className,
    as: Component = "span",
    variant,
    duration = 1.1,
    characterDelay = 0.03,
    delay = 0,
    yOffset = 16,
    animateByCharacter = false,
    inView = true,
    inViewOnce = false,
    inViewMargin = "-50px",
    direction = "down"
}: BlurFadeTextProps) {
    const ref = useRef(null);
    const inViewResult = useInView(ref, { once: inViewOnce, margin: inViewMargin });
    const isInView = !inView || inViewResult;

    const isHorizontal = direction === "left" || direction === "right";
    const offsetVal = direction === "right" || direction === "down" ? -yOffset : yOffset;

    const defaultVariants: Variants = {
        hidden: {
            x: isHorizontal ? offsetVal : 0,
            y: isHorizontal ? 0 : offsetVal,
            opacity: 0,
            filter: "blur(6px)",
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
            transition: {
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };
    
    const combinedVariants = variant || defaultVariants;
    const characters = useMemo(() => Array.from(text), [text]);

    if (animateByCharacter) {
        return (
            <Component
                ref={ref}
                className={cn(
                    Component === "div" ? "flex flex-wrap w-full min-w-0 max-w-full" : "inline-flex flex-wrap w-full min-w-0 max-w-full"
                )}
            >
                {characters.map((char, i) => {
                    const charVariants: Variants = {
                        hidden: {
                            [direction === "left" || direction === "right" ? "x" : "y"]:
                                direction === "right" || direction === "down" ? -yOffset : yOffset,
                            opacity: 0,
                            filter: "blur(10px)",
                        },
                        visible: {
                            [direction === "left" || direction === "right" ? "x" : "y"]: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                        },
                    };
                    return (
                        <motion.span
                            key={i}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={charVariants}
                            transition={{
                                duration,
                                delay: delay + i * characterDelay,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className={cn("inline-block", className)}
                            style={{
                                width: char.trim() === "" ? "0.2em" : "auto",
                            }}
                        >
                            {char}
                        </motion.span>
                    );
                })}
            </Component>
        );
    }

    const isFitWidth = className?.includes("w-fit") || className?.includes("w-auto");
    const isCenter = className?.includes("text-center") || className?.includes("justify-center");
    const isMxAuto = className?.includes("mx-auto");

    return (
        <Component
            ref={ref}
            className={cn(
                Component === "div" ? "flex w-full min-w-0 max-w-full" : "inline-flex w-full min-w-0 max-w-full",
                isFitWidth && "w-fit max-w-fit",
                isCenter && "justify-center text-center",
                isMxAuto && "mx-auto"
            )}
        >
            <motion.span
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={combinedVariants}
                transition={{
                    duration,
                    delay,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className={cn("inline-block w-full max-w-full wrap-break-word", className)}
            >
                {text}
            </motion.span>
        </Component>
    );
});