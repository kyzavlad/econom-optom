// Supabase URL and publishable keys are public client configuration by design.
// ECONOM OPTOM currently shares the existing Supabase project at no extra project charge,
// while all of its tables/functions are isolated with the econom_ prefix.
const fallbackUrl = 'https://qpmktvybhlwbwsxevifj.supabase.co'
const fallbackPublishableKey = 'sb_publishable_Y3wbSyB1v3fSKOxC1UFrVQ_Pfde1EfL'

export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || fallbackPublishableKey
  return url && publishableKey ? { url, publishableKey } : null
}
