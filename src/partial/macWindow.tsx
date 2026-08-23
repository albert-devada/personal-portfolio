import { cn } from "@/lib";

interface MacWindowProps {
    title?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    bodyClassName?: string;
}

export function MacWindow({ title, children, className, bodyClassName }: Readonly<MacWindowProps>) {
    return (
        <div className={cn("rounded-2xl border border-border/60 bg-background/40 shadow-sm backdrop-blur-sm", className,)}>
            <div className="flex items-center gap-3 rounded-t-2xl border-b border-border/60 bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400/90" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
                    <span className="h-3 w-3 rounded-full bg-green-400/90" />
                </div>
                {title && (
                    <div className="flex-1 truncate text-center font-mono text-xs text-muted-foreground">
                        {title}
                    </div>
                )}
                <div className="w-11.5 shrink-0" aria-hidden />
            </div>
            <div className={cn("p-4 sm:p-6", bodyClassName)}>{children}</div>
        </div>
    );
}

export default MacWindow;