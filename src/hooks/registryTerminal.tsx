import React from "react";
import { getCertificateList } from "@/common/supabase";
import { CommandContext, CommandHandler } from "@/common/types";
import { HelpOutput, CertificateMenuOutput, CertificateDetailOutput, formatCertificateData, NeofetchOutput, WhoamiOutput, IfconfigOutput, ExperienceOutput, ContactOutput, LsOutput } from "@/components/linux";

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
        return <WhoamiOutput />;
    },

    ifconfig: (ctx: CommandContext) => {
        ctx.setActiveContext("info");
        return <IfconfigOutput initialIp={ctx.initialIp} geoData={ctx.geoData} />;
    },

    certificate: (ctx: CommandContext) => {
        ctx.setActiveContext("certificate");
        return <CertificateMenuOutput />;
    },

    experience: (ctx: CommandContext) => {
        ctx.setActiveContext("info");
        return <ExperienceOutput input={ctx.input} />;
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
            return <CertificateMenuOutput />;
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
        const rawData = await getCertificateList();
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