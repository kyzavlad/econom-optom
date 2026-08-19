import { createClient } from '@supabase/supabase-js'
import { products as fallbackProducts } from '@/data/products'
import type { Product } from '@/lib/types'

type DbProduct = {
  source_id: string; sku: string; slug: string; name: string; category: string | null;
  gender: string | null; season: string | null; material: string | null;
  unit_price_uah: number | string; pack_size: number; size_grid: string | null;
  image_urls: unknown; source_url: string | null; is_active: boolean;
}

function dbToProduct(row: DbProduct): Product {
  const urls = Array.isArray(row.image_urls) ? row.image_urls.filter((v):v is string => typeof v === 'string') : []
  return {
    id: row.source_id,
    sourceId: row.source_id,
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    category: row.category ?? 'Другое',
    unitPrice: Number(row.unit_price_uah),
    packSize: row.pack_size,
    sizeGrid: row.size_grid ?? 'Уточняется',
    season: row.season ?? 'Всесезон',
    gender: row.gender ?? 'Унисекс',
    material: row.material ?? 'Уточняется',
    imageUrl: urls[0] ?? '',
    sourceUrl: row.source_url ?? undefined,
    status: row.is_active ? 'active' : 'archived',
  }
}

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export async function getProducts(): Promise<Product[]> {
  const supabase = serverClient()
  if (!supabase) return fallbackProducts.filter(p => p.status === 'active')
  const { data, error } = await supabase.from('products').select('source_id,sku,slug,name,category,gender,season,material,unit_price_uah,pack_size,size_grid,image_urls,source_url,is_active').eq('is_active', true).order('created_at', { ascending: true })
  if (error || !data?.length) return fallbackProducts.filter(p => p.status === 'active')
  return (data as DbProduct[]).map(dbToProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = serverClient()
  if (supabase) {
    const { data, error } = await supabase.from('products').select('source_id,sku,slug,name,category,gender,season,material,unit_price_uah,pack_size,size_grid,image_urls,source_url,is_active').eq('slug', slug).eq('is_active', true).maybeSingle()
    if (!error && data) return dbToProduct(data as DbProduct)
  }
  return fallbackProducts.find(p => p.slug === slug && p.status === 'active') ?? null
}
