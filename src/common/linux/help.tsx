import React from "react";
import { useLanguage } from "@/language/languageProvider";

export const HelpOutput: React.FC = () => {
    const { lang } = useLanguage();
    const content = {
        en: {
            title: "Available commands:",
            neofetch: "Show system specs",
            whoami: "Show creator profile",
            ifconfig: "Show your IP Address",
            certificate: "Show credentials list",
            experience: "Show operational logs",
            contact: "Get connection links",
            ls: "List directory files",
            clear: "Clear terminal screen",
            exit: "Close SSH session",
        },
        id: {
            title: "Perintah tersedia:",
            neofetch: "Lihat spesifikasi sistem",
            whoami: "Lihat profil pembuat",
            ifconfig: "Lihat Alamat IP anda",
            certificate: "Lihat daftar kredensial",
            experience: "Buka log operasional",
            contact: "Dapatkan kontak pembuat",
            ls: "Lihat daftar berkas direktori",
            clear: "Bersihkan layar terminal",
            exit: "Tutup sesi SSH",
        },
    };

    const language = content[lang as "en" | "id"] || content.en;

    return (
        <div className="mt-2 space-y-1 select-none text-xs sm:text-sm">
            <div className="text-zinc-400 font-normal mb-1">{language.title}</div>
            <div className="grid grid-cols-[110px_1fr] gap-x-2 font-mono">
                <span className="text-[#00c875]">neofetch</span>
                <span className="text-zinc-400">{language.neofetch}</span>
                <span className="text-[#00c875]">whoami</span>
                <span className="text-zinc-400">{language.whoami}</span>
                <span className="text-[#00c875]">ifconfig</span>
                <span className="text-zinc-400">{language.ifconfig}</span>
                <span className="text-[#00c875]">certificate</span>
                <span className="text-zinc-400">{language.certificate}</span>  
                <span className="text-[#00c875]">experience</span>
                <span className="text-zinc-400">{language.experience}</span> 
                <span className="text-[#00c875]">contact</span>
                <span className="text-zinc-400">{language.contact}</span>
                <span className="text-[#00c875]">ls</span>
                <span className="text-zinc-400">{language.ls}</span>
                <span className="text-[#00c875]">clear</span>
                <span className="text-zinc-400">{language.clear}</span>
                <span className="text-[#00c875]">exit</span>
                <span className="text-zinc-400">{language.exit}</span>
            </div>
        </div>
    );
};