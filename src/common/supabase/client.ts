import { supabase } from "./server";
import { ProfileData } from "@/lib/profile";

export async function getPersonalProfile() {

    try {
        const { data, error } = await supabase.from("personal").select("*").eq("id", 1).maybeSingle();
        if (error || !data) return ProfileData;;
        return data;
    } catch {
        return ProfileData;
    }
}

export async function getEducationList() {
    const { data, error } = await supabase.from("education").select("*").order("period", { ascending: false, nullsFirst: true });
    if (error) return [];
    return data;
}

export async function getCertificateList() {
    const { data, error } = await supabase.from("certificate").select("*").order("issued", { ascending: false });
    if (error) return [];
    return data;
}

export async function getWorkingList() {
    const { data, error } = await supabase.from("working").select("*").order("created_at", { ascending: false });
    if (error) return [];
    return data;
}

export async function getExperienceList() {
    const { data, error } = await supabase.from("experience").select("*").order("released", { ascending: false });

    if (error) return [];
    return data;
}

export async function getBlogList() {
    const { data, error } = await supabase.from("blog").select("*").order("published_at", { ascending: false });
    if (error) return [];
    return data;
}

export async function getBlogBySlug(slug: string) {
    const { data, error } = await supabase.from("blog").select("*").eq("slug", slug).maybeSingle();
    if (error || !data) return null;
    return data;
}
