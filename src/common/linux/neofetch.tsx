import React from "react";
import { authors } from "@/common/constants/author";

export const NeofetchOutput: React.FC = () => (
    <div className="flex items-start gap-4 sm:gap-6 mt-3 font-mono text-xs sm:text-sm select-none overflow-x-auto whitespace-pre">
        <pre className="text-[#00b0ff] font-bold leading-tight select-none">
{` ▄██████▄
 ▐█▀▀▀▀▀█▌
 ▐█ ▀  ▀ █▌
  ▀██████▀
   ▄████▄

█▄▀ ▄▀█ █   █
█ █ █▀█ █▄▄ █`}
        </pre>
        <div className="space-y-0.5 text-[#d1d5db]">
            <div className="font-bold">
                <span className="text-[#00c875]">naufal</span>
                <span className="text-zinc-400">@</span>
                <span className="text-[#00b0ff]">kali</span>
            </div>
            <div className="text-zinc-500">--------------------</div>
            <div><span className="text-[#00b0ff] font-semibold">OS</span>: Kali GNU/Linux interactive</div>
            <div><span className="text-[#00b0ff] font-semibold">Host</span>: Portfolio Terminal v{authors.mainAuthor.version}</div>
            <div><span className="text-[#00b0ff] font-semibold">React</span>: Version 19.2.4</div>
            <div><span className="text-[#00b0ff] font-semibold">Terminal</span>: <span className="text-[#00c875] animate-pulse">● Online SSH (React)</span></div>
            <div className="flex gap-1 pt-2 select-none">
                <span className="w-4 h-3 bg-black inline-block" />
                <span className="w-4 h-3 bg-red-500 inline-block" />
                <span className="w-4 h-3 bg-green-500 inline-block" />
                <span className="w-4 h-3 bg-yellow-500 inline-block" />
                <span className="w-4 h-3 bg-blue-500 inline-block" />
                <span className="w-4 h-3 bg-purple-500 inline-block" />
                <span className="w-4 h-3 bg-cyan-500 inline-block" />
                <span className="w-4 h-3 bg-zinc-300 inline-block" />
            </div>
        </div>
    </div>
);