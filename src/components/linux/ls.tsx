import React from "react";

export const LsOutput: React.FC = () => (
    <div className="mt-1 font-mono text-xs sm:text-sm select-none space-y-1">
        <div className="flex flex-wrap gap-x-6">
            <span className="text-[#00c875] font-bold">help</span>
            <span className="text-[#00b0ff] font-bold">credentials/</span>
            <span className="text-[#e0e0e0] font-normal">operational_audit.log</span>
        </div>
    </div>
);