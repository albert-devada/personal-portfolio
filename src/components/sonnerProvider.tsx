"use client";
import { Toaster as SonnerToaster, toast } from "sonner";
import { ShieldCheck, ShieldAlert, Info } from "lucide-react";
import { useTheme } from "next-themes";

export const appToast = {
    success: (message: string) => {
        toast.success("", {
            description: message,
            icon: <ShieldCheck className="w-5 h-5 text-emerald-500 animate-pulse" />,
            className: "border border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-slate-900 dark:border-emerald-700 dark:text-emerald-100 font-sans p-4",
        });
    },
    error: (message: string) => {
        toast.error("", {
            description: message,
            icon: <ShieldAlert className="w-5 h-5 text-rose-500 animate-bounce" />,
            className: "border border-rose-500 bg-rose-50 text-rose-950 dark:bg-slate-900 dark:border-rose-700 dark:text-rose-100 font-sans p-4",
        });
    },
    info: (message: string) => {
        toast.info("", {
            description: message,
            icon: <Info className="w-5 h-5 text-cyan-500" />,
            className: "border border-cyan-500 bg-cyan-50 text-cyan-950 dark:bg-slate-900 dark:border-cyan-700 dark:text-cyan-100 font-sans p-4",
        });
    },
};

export function ToasterProvider() {
    const { theme } = useTheme();

    return (
        <SonnerToaster
            richColors
            closeButton
            position="top-right"
            duration={3000}
            visibleToasts={3}
            theme={theme as "light" | "dark" | "system"}
        />
    );
}