import { Config } from "@/common/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Config.Supabase.Url || "https://placeholder.supabase.co";
const supabaseKey = Config.Supabase.Key || "placeholder-key";
export const supabase = createClient(supabaseUrl, supabaseKey);