"use client";

import { useLanguage } from "@/language";
import type { CertificateItem, CertificationRawItem } from "@/common/types";
import { scrollTerminalToBottom, formatCertificateData } from "@/function";
import React, { useEffect, useState, useRef } from "react";

export const CertificateMenuOutput: React.FC<{ initialData?: CertificationRawItem[] }> = ({ initialData }) => {
    const { lang } = useLanguage();
    const [certificates, setCertificates] = useState<CertificateItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const content = {
        en: {
            gettingModules: "[i] Getting credential tracking modules...",
            fetching: "Fetching remote records from Credential cluster...",
            error: "ERR_DATABASE_SYNC_FAILED: Unable to fetch credentials.",
            synced: "Database sync established with local repository.",
            selectPrompt: (max: number) => `[?] Select a target to pipe (1-${max}):`,
        },
        id: {
            gettingModules: "[i] Memuat modul pelacakan kredensial...",
            fetching: "Mengambil catatan jarak jauh dari kluster Kredensial...",
            error: "ERR_DATABASE_SYNC_FAILED: Gagal mengambil kredensial.",
            synced: "Sinkronisasi basis data berhasil terhubung.",
            selectPrompt: (max: number) => `[?] Pilih target dihubungkan (1-${max}):`,
        },
    };

    const language = content[lang as "en" | "id"] || content.en;

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            return scrollTerminalToBottom(containerRef.current, 150);
        }
    }, [isLoading]);

    useEffect(() => {
        let isMounted = true;

        async function fetchCertificates() {
            try {
                setIsLoading(true);
                setIsError(false);

                await new Promise((resolve) => setTimeout(resolve, 800));

                const rawData = initialData;
                if (!rawData || rawData.length === 0) {
                    if (isMounted) {
                        setIsError(true);
                        setCertificates([]);
                    }
                    return;
                }

                if (isMounted) {
                    setCertificates(formatCertificateData(rawData));
                }
            } catch {
                if (isMounted) {
                    setIsError(true);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchCertificates();

        return () => {
            isMounted = false;
        };
    }, [initialData]);

    return (
        <div ref={containerRef} className="mt-2 font-mono text-xs sm:text-sm text-[#d1d5db] space-y-1 select-none">
            <div>
                <span className="text-[#00b0ff]">naufal㉿kali</span>
                <span className="text-zinc-400">:</span>
                <span className="text-white">~$</span>
                <span className="text-[#e0e0e0] ml-2">credentials --list-interactive</span>
            </div>
            <div className="text-zinc-500">{language.gettingModules}</div>
            {isLoading ? (
                <div className="text-zinc-400 animate-pulse pt-1">
                    <span className="text-amber-400 font-medium">[~]</span>{" "}{language.fetching}
                </div>
            ) : isError || certificates.length === 0 ? (
                <div className="pt-1 text-red-400 font-medium">
                    <span className="text-red-500 font-bold">[!]</span>{" "}{language.error}
                </div>
            ) : (
                <>
                    <div className="text-zinc-400">
                        <span className="text-zinc-400 font-medium">[+]</span>{" "}{language.synced}
                    </div>
                    <div className="my-2 space-y-1 pl-2 text-zinc-200">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="flex items-center gap-1.5">
                                <span className="text-zinc-400 font-semibold">{`[${cert.id}]`}</span>
                                <span className="text-[#00c875] select-text">{cert.title}</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-zinc-400 text-[11px] sm:text-xs pt-1 font-medium">{language.selectPrompt(certificates.length)}</div>
                </>
            )}
        </div>
    );
};

export const CertificateDetailOutput: React.FC<{ cert: CertificateItem }> = ({ cert }) => {
    const { lang } = useLanguage();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const content = {
        en: {
            handshake: (id: string) => `Handshaking with Gateway [${id}]...`,
            decrypting: "[i] Decrypting credential path payload...",
            connected: (id: string) => `[*] Connecting to Gateway [${id}] Success.`,
            credPath: "Credentials Path :",
            tokenAccess: "Token Access :",
            gatewayOpen: "[GATEWAY OPEN]",
            localOnly: "[LOCAL ARCHIVE ONLY]",
            backHint: "(Type 'back' to return to the credential menu)",
        },
        id: {
            handshake: (id: string) => `Handshaking dengan Gateway [${id}]...`,
            decrypting: "[i] Mendekripsi payload jalur kredensial...",
            connected: (id: string) => `[*] Berhasil terhubung ke Gateway [${id}].`,
            credPath: "Jalur Kredensial :",
            tokenAccess: "Akses Token :",
            gatewayOpen: "[GATEWAY TERBUKA]",
            localOnly: "[HANYA ARSIP LOKAL]",
            backHint: "(Ketik 'back' untuk kembali ke menu kredensial)",
        },
    };

    const language = content[lang as "en" | "id"] || content.en;
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            return scrollTerminalToBottom(containerRef.current, 100);
        }
    }, [isLoading]);

    return (
        <div ref={containerRef} className="mt-2 font-mono text-xs sm:text-sm text-[#d1d5db] space-y-1">
            {isLoading ? (
                <div className="text-zinc-400 animate-pulse space-y-0.5 select-none">
                    <div>
                        <span className="text-amber-400 font-medium">[~]</span> {language.handshake(cert.id)}
                    </div>
                    <div className="text-zinc-500 text-[11px] sm:text-xs">{language.decrypting}</div>
                </div>
            ) : (
                <>
                    <div className="text-[#00c875]">{language.connected(cert.id)}</div>
                    <div className="pl-4 border-l border-zinc-700 space-y-1 text-zinc-300">
                        <div>
                            <span className="text-zinc-500">{language.credPath}</span>{" "}
                            {cert.path}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-zinc-500">{language.tokenAccess}</span>
                            {cert.url ? (
                                <a
                                    href={cert.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#00b0ff] underline hover:text-sky-300 font-medium select-text transition-colors duration-150">
                                    {language.gatewayOpen}
                                </a>
                            ) : (
                                <span className="text-zinc-500 font-medium select-none">{language.localOnly}</span>
                            )}
                        </div>
                    </div>
                    <div className="text-zinc-500 text-[12px] pt-1 animate-pulse select-none">{language.backHint}</div>
                </>
            )}
        </div>
    );
};