import { createClient } from '@supabase/supabase-js'
import { products as fallbackProducts } from '@/data/products'
import type { Product } from '@/lib/types'
import type { Currency } from '@/lib/money'
import { getPublicSupabaseConfig } from '@/lib/public-supabase-config'

type DbProduct = {
  source_id: string; sku: string; slug: string; name: string; category: string | null;
  gender: string | null; season: string | null; material: string | null;
  unit_price: number | string; currency: string | null; pack_size: number; size_grid: string | null;
  image_urls: unknown; source_url: string | null; is_active: boolean;
}

function dbToProduct(row: DbProduct): Product {
  const urls = Array.isArray(row.image_urls) ? row.image_urls.filter((v):v is string => typeof v === 'string') : []
  return {
    id: row.source_id, sourceId: row.source_id, slug: row.slug, sku: row.sku, name: row.name,
    category: row.category ?? 'Другое', unitPrice: Number(row.unit_price),
    currency: (row.currency === 'USD' ? 'USD' : 'UAH') as Currency,
    packSize: row.pack_size, sizeGrid: row.size_grid ?? 'Уточняется', season: row.season ?? 'Не указано',
    gender: row.gender ?? 'Не указано', material: row.material ?? 'Уточняется', imageUrl: urls[0] ?? '',
    sourceUrl: row.source_url ?? undefined, status: row.is_active ? 'active' : 'archived',
  }
}

function serverClient() {
  const config = getPublicSupabaseConfig()
  if (!config) return null
  return createClient(config.url, config.publishableKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

const selectFields='source_id,sku,slug,name,category,gender,season,material,unit_price,currency,pack_size,size_grid,image_urls,source_url,is_active'
const PAGE_SIZE=1000

export async function getProducts(): Promise<Product[]> {
  const supabase=serverClient(); if(!supabase)return fallbackProducts.filter(p=>p.status==='active')
  const rows:DbProduct[]=[]
  for(let from=0;;from+=PAGE_SIZE){
    const {data,error}=await supabase.from('econom_products').select(selectFields).eq('is_active',true).order('source_id',{ascending:false}).range(from,from+PAGE_SIZE-1)
    if(error){console.error('econom_catalog_page_failed',from,error.code,error.message);return rows.length?rows.map(dbToProduct):fallbackProducts.filter(p=>p.status==='active')}
    const page=(data??[]) as unknown as DbProduct[]; rows.push(...page)
    if(page.length<PAGE_SIZE)break
  }
  return rows.length?rows.map(dbToProduct):fallbackProducts.filter(p=>p.status==='active')
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase=serverClient()
  if(supabase){const {data,error}=await supabase.from('econom_products').select(selectFields).eq('slug',slug).eq('is_active',true).maybeSingle();if(!error&&data)return dbToProduct(data as unknown as DbProduct)}
  return fallbackProducts.find(p=>p.slug===slug&&p.status==='active')??null
}
