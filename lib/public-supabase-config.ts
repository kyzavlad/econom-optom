// Supabase project URL and publishable keys are public client configuration, not secrets.
// Keep empty fallbacks until the dedicated ECONOM OPTOM project is created.
const fallbackUrl = ''
const fallbackPublishableKey = ''

export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || fallbackPublishableKey
  return url && publishableKey ? { url, publishableKey } : null
}
