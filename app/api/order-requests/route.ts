import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getProducts } from '@/lib/catalog'
import { getPublicSupabaseConfig } from '@/lib/public-supabase-config'

type IncomingLine = { sourceId?: string; boxes?: number }
type IncomingBody = { company?: string; contactName?: string; phone?: string; city?: string; deliveryMethod?: string; comment?: string; items?: IncomingLine[] }
const text=(value:unknown,max:number)=>String(value??'').trim().slice(0,max)

export async function POST(request: Request) {
  try {
    const body = await request.json() as IncomingBody
    const company=text(body.company,120), contactName=text(body.contactName,100), phone=text(body.phone,40), city=text(body.city,100), deliveryMethod=text(body.deliveryMethod,80), comment=text(body.comment,1000)
    if(!company||!contactName||phone.replace(/\D/g,'').length<8||!city||!deliveryMethod) return NextResponse.json({ok:false,error:'invalid_contact_data'},{status:400})

    const requested=Array.isArray(body.items)?body.items.slice(0,100):[]
    if(!requested.length) return NextResponse.json({ok:false,error:'empty_cart'},{status:400})
    const catalog=await getProducts(); const bySourceId=new Map(catalog.map(product=>[product.sourceId,product]))
    const items=requested.flatMap(line=>{
      const product=bySourceId.get(text(line.sourceId,120)); const boxes=Math.min(100,Math.max(1,Math.floor(Number(line.boxes)||0)))
      if(!product||product.status!=='active')return []
      return [{source_id:product.sourceId,sku:product.sku,name:product.name,boxes,pack_size:product.packSize,unit_price:product.unitPrice,currency:product.currency??'UAH',line_total:boxes*product.packSize*product.unitPrice}]
    })
    if(!items.length||items.length!==requested.length)return NextResponse.json({ok:false,error:'catalog_changed'},{status:409})
    const currencies=new Set(items.map(item=>item.currency)); if(currencies.size!==1)return NextResponse.json({ok:false,error:'mixed_currency'},{status:409})
    const total=items.reduce((sum,item)=>sum+item.line_total,0); const currency=items[0].currency

    const config=getPublicSupabaseConfig(); if(!config)return NextResponse.json({ok:true,persisted:false,total,currency})
    const supabase=createClient(config.url,config.publishableKey,{auth:{persistSession:false,autoRefreshToken:false}})
    const {data,error}=await supabase.rpc('econom_submit_order_request',{p_company_name:company,p_contact_name:contactName,p_phone:phone,p_city:city,p_delivery_method:deliveryMethod,p_comment:comment||null,p_items:requested.map(line=>({source_id:text(line.sourceId,120),boxes:Math.min(100,Math.max(1,Math.floor(Number(line.boxes)||0)))}))})
    if(error){console.error('econom_order_request_rpc_failed',error.code,error.message);return NextResponse.json({ok:false,error:'save_failed'},{status:500})}
    const saved=Array.isArray(data)?data[0]:data; const persistedTotal=Number(saved?.total_amount??total); const persistedCurrency=String(saved?.currency??currency)
    if(!Number.isFinite(persistedTotal)||Math.abs(persistedTotal-total)>0.01||persistedCurrency!==currency){console.error('econom_order_request_total_mismatch',{expected:total,persisted:persistedTotal,currency,persistedCurrency});return NextResponse.json({ok:false,error:'catalog_changed'},{status:409})}
    return NextResponse.json({ok:true,persisted:true,number:saved?.number??null,total:persistedTotal,currency:persistedCurrency})
  } catch(error){console.error('econom_order_request_unhandled',error);return NextResponse.json({ok:false,error:'invalid_request'},{status:400})}
}
