import React from "react";
import type { CommandContext, CommandHandler } from "@/common/types";
import { 
    HelpOutput, 
    CertificateMenuOutput, 
    CertificateDetailOutput, 
    NeofetchOutput, 
    WhoamiOutput, 
    IfconfigOutput, 
    ExperienceOutput, 
    ContactOutput, 
    LsOutput 
} from "@/components/linux";
import { formatCertificateData } from "@/function";

export const CommandPromptLine: React.FC<{ input: string; isExit?: boolean }> = ({ input, isExit }) => {
    if (isExit) {
        return (
            <div className="text-xs sm:text-sm mt-2 flex items-center gap-1 text-zinc-400 select-none">
                <span>user@local-pc:~$</span>
                <span className="text-[#e0e0e0] ml-1 select-text">{input}</span>
            </div>
        );
    }
    return (
        <div className="text-xs sm:text-sm mt-2 select-none">
            <div className="text-[#00c875]">
                ┌──(<span className="text-[#00b0ff]">naufal㉿kali</span>)-[<span className="text-[#e0e0e0]">~/.env</span>]
            </div>
            <div className="flex items-center gap-1">
                <span className="text-[#00c875]">└─<span className="text-[#00b0ff] ml-1">$</span></span>
                <span className="text-[#e0e0e0] ml-2 select-text">{input}</span>
            </div>
        </div>
    );
};

export const SshReconnectPrompt: React.FC<{ input: string }> = ({ input }) => (
    <div className="text-[#ff5555] text-xs sm:text-sm">
        bash: {input}: command not found. Type &apos;ssh&apos; to reconnect.
    </div>
);

const commandMap: Record<string, CommandHandler> = {
    help: (ctx: CommandContext) => {
        ctx.setActiveContext("help");
        return <HelpOutput />;
    },
    "./help": (ctx: CommandContext) => commandMap.help(ctx),

    neofetch: (ctx: CommandContext) => {
        ctx.setActiveContext("info");
        return <NeofetchOutput />;
    },

    whoami: (ctx: CommandContext) => {
        ctx.setActiveContext("info");
        return <WhoamiOutput profile={ctx.initialData?.profile} />;
    },

    ifconfig: (ctx: CommandContext) => {
        ctx.setActiveContext("info");
        return <IfconfigOutput initialIp={ctx.initialIp} geoData={ctx.geoData} />;
    },

    certificate: (ctx: CommandContext) => {
        ctx.setActiveContext("certificate");
        return <CertificateMenuOutput initialData={ctx.initialData?.certificates} />;
    },

    experience: (ctx: CommandContext) => {
        ctx.setActiveContext("info");
        return <ExperienceOutput input={ctx.input} initialData={ctx.initialData?.experiences} />;
    },

    contact: (ctx: CommandContext) => {
        ctx.setActiveContext("info");
        return <ContactOutput />;
    },

    ls: (ctx: CommandContext) => {
        ctx.setActiveContext("info");
        return <LsOutput />;
    },

    clear: (ctx: CommandContext) => {
        ctx.setActiveContext("none");
        ctx.setHistory([]);
        ctx.setShowBanner(false);
        ctx.setCursorPosition(0);
        return null;
    },

    back: (ctx: CommandContext) => {
        if (ctx.activeContext === "certificate-detail") {
            ctx.setActiveContext("certificate");
            return <CertificateMenuOutput initialData={ctx.initialData?.certificates} />;
        } else if (["certificate", "info", "help"].includes(ctx.activeContext)) {
            ctx.setActiveContext("help");
            return <HelpOutput />;
        } else {
            return <div className="text-[#ff5555] text-xs sm:text-sm mt-1">bash: back: command not found</div>;
        }
    },

    exit: (ctx: CommandContext) => {
        ctx.setActiveContext("none");
        ctx.setIsExit(true);
        return (
            <div className="text-zinc-400 text-xs sm:text-sm space-y-1 mt-1">
                <div>Connection to 10.10.14.5 closed.</div>
                <div className="text-zinc-500 text-[11px]">To reconnect, type &apos;ssh&apos; in the terminal.</div>
            </div>
        );
    }
};

// Aliases
["credentials", "credentials/", "./credentials", "cd credentials", "cd credentials/"].forEach(alias => {
    commandMap[alias] = commandMap.certificate;
});

["operational_audit.log", "cat operational_audit.log", "./operational_audit.log"].forEach(alias => {
    commandMap[alias] = commandMap.experience;
});

export async function executeCommand(ctx: CommandContext): Promise<React.ReactNode | null | void> {
    const cmd = ctx.trimmedCommand;

    if (commandMap[cmd]) {
        return commandMap[cmd](ctx);
    }

    if (["cat credentials", "cat credentials/", "cat ./credentials"].includes(cmd)) {
        return <div className="text-white text-xs sm:text-sm mt-1">cat: credentials: Is a directory</div>;
    }

    if (["cd operational_audit.log", "cd help"].includes(cmd)) {
        return <div className="text-white text-xs sm:text-sm mt-1">bash: cd: {cmd.replace("cd ", "")}: Not a directory</div>;
    }

    const parsedIndex = parseInt(cmd, 10) - 1;

    if (ctx.activeContext === "certificate" && !isNaN(parsedIndex) && parsedIndex >= 0) {
        const rawData = ctx.initialData?.certificates || [];
        const certificates = formatCertificateData(rawData);
        
        if (parsedIndex < certificates.length) {
            const cert = certificates[parsedIndex];
            ctx.setActiveContext("certificate-detail");
            return <CertificateDetailOutput cert={cert} />;
        }
    }

    return (
        <div className="text-[#ff5555] text-xs sm:text-sm mt-1">[-] Command &apos;{ctx.input}&apos; not found. Type &apos;help&apos; to view available payloads.</div>
    );
}
