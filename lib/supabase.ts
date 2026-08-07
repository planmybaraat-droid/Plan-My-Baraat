import { createClient } from "@supabase/supabase-js";
import { publicSupabaseKey, publicSupabaseUrl } from "./deployment-config";

const supabaseUrl = publicSupabaseUrl;
const supabaseAnonKey = publicSupabaseKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
