'use client'

import Link from 'next/link'
import { Search, ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { useStore } from './StoreProvider'

const links = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/#how', label: 'Как заказать' },
  { href: '/#wholesale', label: 'Для магазинов' },
]

export function Header(){
  const {boxCount,setDrawer}=useStore()
  const [menuOpen,setMenuOpen]=useState(false)
  const close=()=>setMenuOpen(false)
  return <>
    <div className="topline"><div className="shell topline-inner"><span>Оптовые поставки по Украине</span><span className="status"><i/>Каталог Victoria/Forsage</span><span>Одесса</span></div></div>
    <header className="header shell">
      <Link href="/" className="brand" onClick={close}><span className="brand-mark">EO</span><span><b>ECONOM OPTOM</b><small>одежда • обувь • опт</small></span></Link>
      <nav>{links.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
      <div className="header-actions">
        <Link href="/catalog" className="icon-btn" aria-label="Поиск"><Search size={18}/></Link>
        <button className="cart-btn" onClick={()=>setDrawer(true)}><ShoppingBag size={17}/>Корзина <b>{boxCount}</b></button>
        <button className="mobile-menu" aria-label="Открыть меню" aria-expanded={menuOpen} onClick={()=>setMenuOpen(true)}><Menu size={21}/></button>
      </div>
    </header>
    {menuOpen&&<>
      <button className="mobile-nav-overlay" aria-label="Закрыть меню" onClick={close}/>
      <aside className="mobile-nav" aria-label="Мобильная навигация">
        <div className="mobile-nav-head"><div className="brand"><span className="brand-mark">EO</span><span><b>ECONOM OPTOM</b><small>оптовый каталог</small></span></div><button onClick={close} aria-label="Закрыть меню"><X/></button></div>
        <nav>{links.map((link,index)=><Link key={link.href} href={link.href} onClick={close}><span>0{index+1}</span>{link.label}<ArrowUpRight size={17}/></Link>)}</nav>
        <button className="primary full" onClick={()=>{close();setDrawer(true)}}><ShoppingBag size={17}/>Открыть корзину · {boxCount}</button>
        <small>Ящики, размерные ряды и стоимость заказа видны сразу.</small>
      </aside>
    </>}
  </>
}
