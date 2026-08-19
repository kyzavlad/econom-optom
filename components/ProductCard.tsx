'use client'
import Link from 'next/link'
import { ArrowUpRight, Box } from 'lucide-react'
import type { Product } from '@/lib/types'
import { money } from '@/lib/money'
import { useStore } from './StoreProvider'
import { ProductMedia } from './ProductMedia'

export function ProductCard({product}:{product:Product}){
 const {add}=useStore()
 const currency=product.currency??'UAH'
 return <article className="product-card">
   <Link href={`/product/${product.slug}`} className="product-image"><ProductMedia src={product.imageUrl} alt={product.name}/><span className="badge">{product.season}</span></Link>
   <div className="product-copy"><small className="sku">{product.sku}</small><Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
     <div className="meta-row"><span>Размеры {product.sizeGrid}</span><span><Box size={13}/>{product.packSize} шт.</span></div>
     <div className="price-row"><div><strong>{money(product.unitPrice,currency)}</strong><small>за единицу</small></div><div className="pack-price"><strong>{money(product.unitPrice*product.packSize,currency)}</strong><small>за упаковку</small></div></div>
     <div className="card-actions"><button onClick={()=>add(product)}>Добавить упаковку</button><Link href={`/product/${product.slug}`} aria-label="Открыть товар"><ArrowUpRight size={18}/></Link></div>
   </div>
 </article>
}
