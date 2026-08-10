"use client";

import React, { useEffect, useState } from "react";
import { getPersonalProfile } from "@/common/supabase/client";
import { getAuthor } from "@/common/constants/author";
import { useLanguage } from "@/language/languageProvider";

interface PersonalProfile {
    full_name?: string;
    username?: string;
    location?: string;
    activity?: string;
    status_work?: boolean;
}

const formatUsername = (str?: string) => {
    if (!str) return "";
    return str.replace(/^@/, "").replace(/[_-]/g, " ").split(" ").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};

export const WhoamiOutput: React.FC = () => {
    const { lang } = useLanguage();
    const [profile, setProfile] = useState<PersonalProfile | null>(null);
    const mainAuthor = getAuthor("mainAuthor");
    const fullName = profile?.full_name || mainAuthor.name;
    const nickname = formatUsername(profile?.username || mainAuthor.username);
    const location = profile?.location || mainAuthor.location;
    const isWorking = profile?.status_work ?? false;
    const activity = profile?.activity || mainAuthor.activity;

    useEffect(() => {
        let isMounted = true;

        getPersonalProfile().then((data) => {
            if (isMounted && data) {
                setProfile(data);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

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
                        <span className="text-amber-400 font-medium">{mainAuthor.jobTitle}</span>
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
