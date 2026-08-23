"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

export function ScrollToTopButton() {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-50 sm:bottom-32 lg:bottom-10 right-8 p-3 md:p-4 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-teal-600 dark:text-teal-400 shadow-lg z-50 focus:outline-none cursor-pointer transition-colors duration-300 hover:bg-white dark:hover:bg-slate-800"
                    aria-label="Back To Top"
                    title="Back To Top">
                    <ArrowUp size={22} strokeWidth={2.5} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}