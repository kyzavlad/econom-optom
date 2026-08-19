'use client'
import Link from 'next/link'
import { Minus, Plus, X } from 'lucide-react'
import { useStore } from './StoreProvider'
import { ProductMedia } from './ProductMedia'
const money=(n:number)=>new Intl.NumberFormat('uk-UA').format(n)+' ₴'
export function CartDrawer(){
 const {lines,total,drawer,setDrawer,setBoxes,remove}=useStore()
 if(!drawer)return null
 return <><button className="overlay" aria-label="Закрыть корзину" onClick={()=>setDrawer(false)}/><aside className="cart-drawer">
   <div className="drawer-head"><div><small>Оптовый заказ</small><h2>Корзина</h2></div><button className="close" onClick={()=>setDrawer(false)} aria-label="Закрыть корзину"><X/></button></div>
   <div className="cart-lines">{lines.length===0?<div className="empty"><b>Корзина пока пустая</b><span>Добавьте ящик из каталога.</span></div>:lines.map(({product,boxes})=><div className="cart-line" key={product.id}>
     <ProductMedia src={product.imageUrl} alt={product.name}/><div className="cart-line-copy"><b>{product.name}</b><small>{product.packSize} пар • {product.sizeGrid}</small><div className="qty"><button onClick={()=>setBoxes(product.id,boxes-1)} aria-label="Уменьшить количество"><Minus size={14}/></button><span>{boxes} ящ.</span><button onClick={()=>setBoxes(product.id,boxes+1)} aria-label="Увеличить количество"><Plus size={14}/></button><button className="remove" onClick={()=>remove(product.id)}>Удалить</button></div></div><strong>{money(product.unitPrice*product.packSize*boxes)}</strong>
   </div>)}</div>
   {lines.length>0&&<div className="drawer-total"><div><span>Итого</span><strong>{money(total)}</strong></div><Link className="primary full" href="/checkout" onClick={()=>setDrawer(false)}>Оформить оптовый заказ</Link><small>Менеджер подтвердит фактическое наличие и условия предоплаты.</small></div>}
 </aside></>
}
