import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const allowedTypes = new Set(['BaseChars','OtherChars','NewProduct'])

type ForsagePush = { product_ids?: unknown; change_type?: unknown }

export async function POST(request: Request) {
  const expected = process.env.FORSAGE_WEBHOOK_SECRET
  const supplied = request.headers.get('x-econom-sync-secret')
  if (!expected || !supplied || supplied !== expected) return NextResponse.json({ ok:false }, { status:401 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return NextResponse.json({ ok:false, error:'database_not_configured' }, { status:503 })

  try {
    const body = await request.json() as ForsagePush
    const productIds = Array.isArray(body.product_ids)
      ? body.product_ids.map(Number).filter(Number.isFinite).slice(0,5000)
      : []
    const changeTypes = Array.isArray(body.change_type)
      ? body.change_type.filter((value): value is string => typeof value === 'string' && allowedTypes.has(value))
      : []
    if (!productIds.length || !changeTypes.length) return NextResponse.json({ ok:false, error:'invalid_payload' }, { status:400 })

    const supabase = createClient(url, serviceKey, { auth:{ persistSession:false, autoRefreshToken:false } })
    const { error } = await supabase.from('supplier_events').insert({ product_ids:productIds, change_types:changeTypes, status:'pending' })
    if (error) {
      console.error('forsage_event_insert_failed', error.code, error.message)
      return NextResponse.json({ ok:false, error:'queue_failed' }, { status:500 })
    }
    return NextResponse.json({ ok:true }, { status:202 })
  } catch (error) {
    console.error('forsage_webhook_invalid', error)
    return NextResponse.json({ ok:false, error:'invalid_json' }, { status:400 })
  }
}
