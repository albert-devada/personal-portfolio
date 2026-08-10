import React from "react";
import { MediaSocials } from "@/lib/profile";
import { useLanguage } from "@/language/languageProvider";

export const ContactOutput: React.FC = () => {
    const { lang } = useLanguage();

    const labels = {
        en: "* Type 'back' to return to the help payload menu.",
        id: "* Ketik 'back' untuk kembali ke menu payload."
    };

    const hintText = labels[lang as "en" | "id"] || labels.en;

    return (
        <div className="mt-2 font-mono text-xs sm:text-sm text-[#d1d5db] space-y-1 select-none">
            <div>
                <span className="text-[#00b0ff]">naufal㉿kali</span>
                <span className="text-zinc-400">:</span>
                <span className="text-white">~$</span>
                <span className="text-[#e0e0e0] ml-2">netstat -an | grep ESTABLISHED</span>
            </div>
            <div className="pt-1.5 text-[12px] sm:text-xs text-zinc-400">
                <div className="text-[#00c875] font-bold grid grid-cols-[100px_1fr] gap-x-4 border-b border-zinc-800/80 pb-1">
                    <span>LOCAL_PORT</span><span>REMOTE_ENDPOINT</span>
                </div>
                <div className="mt-1.5 space-y-1 text-zinc-300">
                    {MediaSocials.map((item, index) => {
                        let port = "443/tcp";
                        switch (item.title.toLowerCase()) {
                            case "linkedin": port = "80/tcp"; break;
                            case "hackerone": port = "8080/tcp"; break;
                            case "instagram": port = "9443/tcp"; break;
                            case "github": default: port = "443/tcp"; break;
                        }
                        return (
                            <div key={index} className="grid grid-cols-[100px_1fr] gap-x-4 items-center">
                                <span className="text-zinc-500">{port}</span>
                                <a 
                                    href={item.href} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[#00b0ff] hover:underline select-text break-all font-normal"
                                >
                                    {item.href}
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="text-zinc-500 text-[12px] pt-1 select-none font-light animate-pulse">{hintText}</div>
        </div>
    );
};