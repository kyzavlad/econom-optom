'use client'
import Link from 'next/link'
import { ArrowUpRight, Box } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useStore } from './StoreProvider'
import { ProductMedia } from './ProductMedia'
const money=(n:number)=>new Intl.NumberFormat('uk-UA').format(n)+' ₴'
export function ProductCard({product}:{product:Product}){
 const {add}=useStore()
 return <article className="product-card">
   <Link href={`/product/${product.slug}`} className="product-image"><ProductMedia src={product.imageUrl} alt={product.name}/><span className="badge">{product.season}</span></Link>
   <div className="product-copy"><small className="sku">{product.sku}</small><Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
     <div className="meta-row"><span>Размеры {product.sizeGrid}</span><span><Box size={13}/>{product.packSize} пар</span></div>
     <div className="price-row"><div><strong>{money(product.unitPrice)}</strong><small>за пару</small></div><div className="pack-price"><strong>{money(product.unitPrice*product.packSize)}</strong><small>за ящик</small></div></div>
     <div className="card-actions"><button onClick={()=>add(product)}>Добавить ящик</button><Link href={`/product/${product.slug}`} aria-label="Открыть товар"><ArrowUpRight size={18}/></Link></div>
   </div>
 </article>
}
