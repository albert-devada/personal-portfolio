"use client";

import { useLanguage } from "@/language";
import { AuthorData } from "@/common/config/author";
import React from "react";
import type { PersonalProfile } from "@/common/types";
import { formatOperatorNickname } from "@/function";

export const WhoamiOutput: React.FC<{ profile?: PersonalProfile | null }> = ({ profile }) => {
    const { lang } = useLanguage();
    const fullName = profile?.full_name || AuthorData.name;
    const nickname = formatOperatorNickname(profile?.username || AuthorData.username);
    const location = profile?.location || AuthorData.location;
    const isWorking = profile?.status_work ?? false;
    const activity = profile?.activity || AuthorData.activity;

    const labels = {
        en: {
            title: "[ OPERATOR PROFILE ]",
            fullname: "Fullname",
            nickname: "Nickname",
            roles: "Roles",
            location: "Location",
            status: "Status",
            activity: "Activity",
            statusOpen: "Open to Work",
            statusWorking: "Already Working",
        },
        id: {
            title: "[ PROFIL OPERATOR ]",
            fullname: "Nama",
            nickname: "Panggilan",
            roles: "Peran",
            location: "Lokasi",
            status: "Status",
            activity: "Aktivitas",
            statusOpen: "Open to Work",
            statusWorking: "Sudah Bekerja",
        },
    };

    const language = labels[lang as "en" | "id"] || labels.en;

    return (
        <div className="mt-3 font-mono text-xs sm:text-sm select-none text-[#d1d5db] max-w-xl w-full">
            <fieldset className="border border-[#55ffff]/80 px-4 py-2.5 rounded-none bg-zinc-900/30">
                <legend className="text-[#00b0ff] font-bold px-2 ml-2">{language.title}</legend>
                <div className="space-y-1 text-left">
                    <div>
                        <span className="text-[#00b0ff]">▸&nbsp;{language.fullname}</span>:
                        <span className="text-[#e0e0e0]">&nbsp;{fullName}</span>
                    </div>
                    <div>
                        <span className="text-[#00b0ff]">▸&nbsp;{language.nickname}</span>:
                        <span className="text-[#e0e0e0]">&nbsp;{nickname}</span>
                    </div>
                    <div>
                        <span className="text-[#00b0ff]">▸&nbsp;{language.roles}</span>:{" "}
                        <span className="text-amber-400 font-medium">{AuthorData.jobTitle}</span>
                    </div>
                    <div>
                        <span className="text-[#00b0ff]">▸&nbsp;{language.location}</span>:
                        <span className="text-[#e0e0e0]">&nbsp;{location}</span>
                    </div>
                    <div>
                        <span className="text-[#00b0ff]">▸&nbsp;{language.status}</span>:{" "}
                        {isWorking ? (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                                <span className="animate-pulse">●</span>{" "}
                                {language.statusWorking}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[#00c875] font-medium">
                                <span className="animate-pulse">●</span>{" "}
                                {language.statusOpen}
                            </span>
                        )}
                    </div>
                    <div>
                        <span className="text-[#00b0ff]">▸&nbsp;{language.activity}</span>:
                        <span className="text-[#e0e0e0]">&nbsp;{activity}</span>
                    </div>
                </div>
            </fieldset>
        </div>
    );
};
