'use client'
import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import type { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

const PAGE_SIZE=48

export function CatalogClient({products}:{products:Product[]}){
 const categories=['Все',...Array.from(new Set(products.map(p=>p.category)))]
 const seasons=['Все сезоны',...Array.from(new Set(products.map(p=>p.season).filter(v=>v!=='Не указано')))]
 const [cat,setCat]=useState('Все'); const [season,setSeason]=useState('Все сезоны'); const [query,setQuery]=useState(''); const [sort,setSort]=useState('default'); const [visible,setVisible]=useState(PAGE_SIZE)
 const activeFilters=(cat!=='Все'?1:0)+(season!=='Все сезоны'?1:0)+(query?1:0)
 const view=useMemo(()=>{
   const q=query.trim().toLowerCase()
   let arr=products.filter(p=>(cat==='Все'||p.category===cat)&&(season==='Все сезоны'||p.season===season)&&(!q||`${p.name} ${p.sku} ${p.category} ${p.sizeGrid}`.toLowerCase().includes(q)))
   if(sort==='asc')arr=[...arr].sort((a,b)=>a.unitPrice-b.unitPrice)
   if(sort==='desc')arr=[...arr].sort((a,b)=>b.unitPrice-a.unitPrice)
   if(sort==='box-asc')arr=[...arr].sort((a,b)=>a.unitPrice*a.packSize-b.unitPrice*b.packSize)
   return arr
 },[products,cat,season,query,sort])
 useEffect(()=>setVisible(PAGE_SIZE),[cat,season,query,sort])
 const reset=()=>{setCat('Все');setSeason('Все сезоны');setQuery('');setSort('default');setVisible(PAGE_SIZE)}
 const shown=view.slice(0,visible)
 return <>
   <div className="catalog-tools">
     <div className="chips">{categories.map(c=><button className={c===cat?'active':''} onClick={()=>setCat(c)} key={c}>{c}</button>)}</div>
     <div className="tool-right"><label className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Артикул или товар"/></label><label className="sort"><SlidersHorizontal size={16}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="default">По умолчанию</option><option value="asc">Цена за единицу ↑</option><option value="desc">Цена за единицу ↓</option><option value="box-asc">Цена упаковки ↑</option></select></label></div>
   </div>
   <div className="catalog-subtools"><label>Сезон<select value={season} onChange={e=>setSeason(e.target.value)}>{seasons.map(v=><option key={v}>{v}</option>)}</select></label>{activeFilters>0&&<button className="reset-filters" onClick={reset}><X size={14}/>Сбросить {activeFilters}</button>}<span className="result-count">Показано {Math.min(visible,view.length)} из {view.length} • всего {products.length}</span></div>
   {view.length?<><div className="product-grid">{shown.map(p=><ProductCard key={p.id} product={p}/>)}</div>{shown.length<view.length&&<div className="hero-actions" style={{justifyContent:'center',marginTop:32}}><button className="secondary" onClick={()=>setVisible(v=>v+PAGE_SIZE)}>Показать ещё {Math.min(PAGE_SIZE,view.length-shown.length)}</button></div>}</>:<div className="catalog-empty"><Search size={25}/><h2>Ничего не найдено</h2><p>Измените фильтры или сбросьте поиск.</p><button className="secondary" onClick={reset}>Показать весь каталог</button></div>}
 </>
}
