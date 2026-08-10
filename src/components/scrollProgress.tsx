"use client";

import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleDocumentResize = () => {
            window.dispatchEvent(new Event("scroll"));
        };

        const observer = new ResizeObserver(() => {
            handleDocumentResize();
        });

        if (document.body) {
            observer.observe(document.body);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-teal-500 dark:bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.5)] z-50 origin-left"
            style={{ scaleX }}
        />
    );
}