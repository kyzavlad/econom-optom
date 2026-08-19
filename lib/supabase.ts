import { createBrowserClient } from '@supabase/ssr'
import { getPublicSupabaseConfig } from '@/lib/public-supabase-config'

export function createClient() {
  const config = getPublicSupabaseConfig()
  if (!config) return null
  return createBrowserClient(config.url, config.publishableKey)
}
