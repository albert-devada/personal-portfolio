"use client";

import { useTheme, ThemeProvider as NextThemesProvider } from "next-themes";
import { motion } from "motion/react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

const DarkMode = React.memo(({ isActive }: { isActive: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isActive) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let resizeTimeout: ReturnType<typeof setTimeout>;
        let stars: { x: number; y: number; radius: number; alpha: number; delta: number }[] = [];
        
        const mouse = { x: -1000, y: -1000 };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
        let prevWidth = window.innerWidth;
        let prevHeight = window.innerHeight;

        const updateDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            prevWidth = window.innerWidth;
            prevHeight = window.innerHeight;
        };

        const initStars = (targetCount: number) => {
            stars = Array.from({ length: targetCount }).map(() => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                delta: Math.random() * 0.02 + 0.005,
            }));
        };

        updateDimensions();
        initStars(window.innerWidth < 768 ? 75 : 180);

        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            if (newWidth !== prevWidth || newHeight !== prevHeight) {
                const scaleX = newWidth / (prevWidth || newWidth);
                const scaleY = newHeight / (prevHeight || newHeight);
                canvas.width = newWidth;
                canvas.height = newHeight;

                stars.forEach((star) => {
                    star.x *= scaleX;
                    star.y *= scaleY;
                });

                prevWidth = newWidth;
                prevHeight = newHeight;
            }

            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const targetCount = window.innerWidth < 768 ? 75 : 180;
                if (stars.length < targetCount) {
                    const diff = targetCount - stars.length;
                    for (let i = 0; i < diff; i++) {
                        stars.push({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            radius: Math.random() * 1.5 + 0.5,
                            alpha: Math.random(),
                            delta: Math.random() * 0.02 + 0.005,
                        });
                    }
                } else if (stars.length > targetCount) {
                    stars.length = targetCount;
                }
            }, 150);
        };

        window.addEventListener("resize", handleResize, { passive: true });
        const frameInterval = 1000 / 60;
        let lastTime = 0;

        const render = (time: number) => {
            animationFrameId = requestAnimationFrame(render);
            if (document.hidden) return;

            const delta = time - lastTime;
            if (delta < frameInterval) return;
            lastTime = time - (delta % frameInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scrollY = window.scrollY;
            const maxDistSq = 150 * 150;
            const hasMouse = mouse.x >= 0 && mouse.y >= 0;

            stars.forEach((star) => {
                star.alpha += star.delta;
                if (star.alpha <= 0 || star.alpha >= 1) star.delta = -star.delta;

                const yPos = (star.y - scrollY * 0.15) % canvas.height;
                const finalY = yPos < 0 ? yPos + canvas.height : yPos;
                ctx.beginPath();
                ctx.arc(star.x, finalY, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();

                if (hasMouse) {
                    const dx = mouse.x - star.x;
                    const dy = mouse.y - finalY;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < maxDistSq) {
                        const distance = Math.sqrt(distSq);
                        ctx.beginPath();
                        ctx.moveTo(star.x, finalY);
                        ctx.lineTo(mouse.x, mouse.y);

                        const opacity = 1 - distance / 150;
                        ctx.strokeStyle = `rgba(147, 197, 253, ${opacity * 0.6})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            clearTimeout(resizeTimeout);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActive]);

    return <canvas ref={canvasRef} className="w-full h-full" />;
});
DarkMode.displayName = "DarkMode";

const LightMode = React.memo(({ isActive }: { isActive: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isActive) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let resizeTimeout: ReturnType<typeof setTimeout>;
        let clouds: { x: number; y: number; speed: number; scale: number }[] = [];
        let motes: { x: number; y: number; radius: number; speedX: number; speedY: number; alpha: number }[] = [];
        const mouse = { x: -1000, y: -1000 };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
        const sunGradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 100);
        sunGradient.addColorStop(0, "rgba(253, 224, 71, 0.9)");
        sunGradient.addColorStop(0.5, "rgba(253, 224, 71, 0.4)");
        sunGradient.addColorStop(1, "rgba(253, 224, 71, 0)");

        let prevWidth = window.innerWidth;
        let prevHeight = window.innerHeight;

        const updateDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            prevWidth = window.innerWidth;
            prevHeight = window.innerHeight;
        };

        const initParticles = () => {
            const isMobile = window.innerWidth < 768;

            clouds = Array.from({ length: isMobile ? 6 : 12 }).map(() => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height, 
                speed: Math.random() * 0.15 + 0.05, 
                scale: Math.random() * 0.3 + 0.4,
            }));

            motes = Array.from({ length: isMobile ? 35 : 80 }).map(() => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 0.5,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * -0.5 - 0.2,
                alpha: Math.random() * 0.5 + 0.2,
            }));
        };

        updateDimensions();
        initParticles();

        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            if (newWidth !== prevWidth || newHeight !== prevHeight) {
                const scaleX = newWidth / (prevWidth || newWidth);
                const scaleY = newHeight / (prevHeight || newHeight);
                canvas.width = newWidth;
                canvas.height = newHeight;

                clouds.forEach((cloud) => {
                    cloud.x *= scaleX;
                    cloud.y *= scaleY;
                });

                motes.forEach((mote) => {
                    mote.x *= scaleX;
                    mote.y *= scaleY;
                });

                prevWidth = newWidth;
                prevHeight = newHeight;
            }

            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const isMobile = window.innerWidth < 768;
                const cloudCount = isMobile ? 6 : 12;
                const moteCount = isMobile ? 35 : 80;

                if (clouds.length !== cloudCount || motes.length !== moteCount) {
                    initParticles();
                }
            }, 150);
        };

        window.addEventListener("resize", handleResize, { passive: true });
        const frameInterval = 1000 / 60;
        let lastTime = 0;

        const render = (time: number) => {
            animationFrameId = requestAnimationFrame(render);
            if (document.hidden) return;

            const delta = time - lastTime;
            if (delta < frameInterval) return;
            lastTime = time - (delta % frameInterval);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scrollY = window.scrollY;
            const sunX = canvas.width - 150;
            const sunY = (100 - scrollY * 0.2);
            ctx.save();
            ctx.translate(sunX, sunY);
            ctx.beginPath();
            ctx.arc(0, 0, 100, 0, Math.PI * 2);
            ctx.fillStyle = sunGradient;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 0, 50, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(253, 224, 71, 0.9)";
            ctx.fill();
            ctx.restore();

            clouds.forEach((cloud) => {
                cloud.x -= cloud.speed;
                if (cloud.x + 100 * cloud.scale < 0) cloud.x = canvas.width + 50;
                
                const yPos = (cloud.y - scrollY * 0.25) % canvas.height;
                const finalY = yPos < 0 ? yPos + canvas.height : yPos;
                ctx.beginPath();
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.arc(cloud.x, finalY, 40 * cloud.scale, 0, Math.PI * 2);
                ctx.arc(cloud.x + 40 * cloud.scale, finalY - 20 * cloud.scale, 50 * cloud.scale, 0, Math.PI * 2);
                ctx.arc(cloud.x + 80 * cloud.scale, finalY, 40 * cloud.scale, 0, Math.PI * 2);
                ctx.fill();
            });

            const repelRadiusSq = 120 * 120;
            const hasMouse = mouse.x >= 0 && mouse.y >= 0;

            motes.forEach((mote) => {
                mote.x += mote.speedX;
                mote.y += mote.speedY;

                const yPos = mote.y - scrollY * 0.4;

                if (hasMouse) {
                    const dx = mote.x - mouse.x;
                    const dy = yPos - mouse.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < repelRadiusSq) {
                        const distance = Math.sqrt(distSq);
                        if (distance > 0) {
                            const force = (120 - distance) / 120;
                            mote.x += (dx / distance) * force * 3;
                            mote.y += (dy / distance) * force * 3;
                        }
                    }
                }

                if (mote.y < -50) mote.y = canvas.height + 50;
                if (mote.x < -10) mote.x = canvas.width + 10;
                if (mote.x > canvas.width + 10) mote.x = -10;

                const finalY = (mote.y - scrollY * 0.4) % canvas.height;
                const renderY = finalY < 0 ? finalY + canvas.height : finalY;
                
                ctx.beginPath();
                ctx.arc(mote.x, renderY, mote.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${mote.alpha})`;
                ctx.fill();
            });
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            clearTimeout(resizeTimeout);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActive]);

    return <canvas ref={canvasRef} className="w-full h-full" />;
});
LightMode.displayName = "LightMode";

export function AnimatedBackground() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frameId);
    }, []);

    if (!mounted) return null;

    const isDark = resolvedTheme === "dark";

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-transparent">
            <motion.div initial={false} animate={{ opacity: isDark ? 1 : 0 }} transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute inset-0">
                <DarkMode isActive={isDark} />
            </motion.div>
            <motion.div initial={false} animate={{ opacity: isDark ? 0 : 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute inset-0">
                <LightMode isActive={!isDark} />
            </motion.div>
        </div>
    );
}

export const ThemeProvider = function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={true}
            {...props}>
            {children}
        </NextThemesProvider>
    );
};

export default ThemeProvider;