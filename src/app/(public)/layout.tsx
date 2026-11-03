import { SidebarMain, MainFooter } from "@/components/navigation";
import { getPersonalProfile } from "@/supabase";
import { AuthorData } from "@/common/config";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const profile = await getPersonalProfile();

    return (
        <div className="relative z-10 flex max-w-7xl mx-auto w-full min-h-screen">
            <SidebarMain profile={profile} />
            <div className="flex-1 w-full max-w-4xl min-w-0 mx-auto pt-3 pb-60 lg:py-20 px-6">
                <main className="min-h-dvh pt-13 flex flex-col gap-10 sm:gap-14 relative w-full min-w-0 max-w-full">
                    {children}
                </main>
                <MainFooter name={AuthorData.nickname} instagram={AuthorData.instagram} />
            </div>
        </div>
    );
}