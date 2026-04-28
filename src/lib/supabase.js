import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
export const supabaseProductsTable =
  import.meta.env.VITE_SUPABASE_PRODUCTS_TABLE || "products";
export const supabaseProfilesTable =
  import.meta.env.VITE_SUPABASE_PROFILES_TABLE || "profiles";
export const supabaseStorageBucket =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "product-mockups";
export const supabaseRequestsTable =
  import.meta.env.VITE_SUPABASE_REQUESTS_TABLE || "requests";
export const supabaseRequestUploadsBucket =
  import.meta.env.VITE_SUPABASE_REQUEST_UPLOADS_BUCKET || "request-assets";
export const adminAllowedRoles = (
  import.meta.env.VITE_ADMIN_ALLOWED_ROLES || "owner,admin"
)
  .split(",")
  .map((role) => role.trim())
  .filter(Boolean);

let supabaseClient;

export function getSupabaseClient() {
  if (!hasSupabaseConfig) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });
  }

  return supabaseClient;
}

export function getSupabasePublicUrl(path, bucketName = supabaseStorageBucket) {
  if (!path || !hasSupabaseConfig) {
    return "";
  }

  if (/^(https?:|data:|\/)/i.test(path)) {
    return path;
  }

  const client = getSupabaseClient();

  if (!client) {
    return "";
  }

  const { data } = client.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
}
