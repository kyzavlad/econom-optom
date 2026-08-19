'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CartLine, Product } from '@/lib/types'
import type { Currency } from '@/lib/money'

type StoreContextValue = {
  lines: CartLine[]
  total: number
  boxCount: number
  cartCurrency: Currency | null
  mixedCurrency: boolean
  notice: string
  clearNotice: () => void
  add: (p: Product) => void
  setBoxes: (id: string, boxes: number) => void
  remove: (id: string) => void
  clear: () => void
  drawer: boolean
  setDrawer: (open: boolean) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)
const productCurrency=(product:Product):Currency=>product.currency??'UAH'

export function StoreProvider({children}:{children:React.ReactNode}){
  const [lines,setLines] = useState<CartLine[]>([])
  const [drawer,setDrawer] = useState(false)
  const [notice,setNotice] = useState('')
  useEffect(()=>{
    try {
      const raw=localStorage.getItem('econom-cart')
      if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))setLines(parsed)}
    } catch {}
  },[])
  useEffect(()=>{ try { localStorage.setItem('econom-cart',JSON.stringify(lines)) } catch {} },[lines])
  const currencies=new Set(lines.map(line=>productCurrency(line.product)))
  const mixedCurrency=currencies.size>1
  const cartCurrency=lines.length&&!mixedCurrency?productCurrency(lines[0].product):null
  const value=useMemo<StoreContextValue>(()=>({
    lines,
    total: lines.reduce((sum,l)=>sum+l.product.unitPrice*l.product.packSize*l.boxes,0),
    boxCount: lines.reduce((sum,l)=>sum+l.boxes,0),
    cartCurrency,
    mixedCurrency,
    notice,
    clearNotice:()=>setNotice(''),
    add:(p)=>{
      const currency=productCurrency(p)
      const currentCurrency=lines[0]?productCurrency(lines[0].product):null
      if(currentCurrency&&currentCurrency!==currency){
        setNotice('В одной заявке товары в гривне и долларах не смешиваются. Оформите текущую корзину или очистите её, затем добавьте товар в другой валюте.')
        setDrawer(true)
        return
      }
      setNotice('')
      setLines(prev=>{const hit=prev.find(l=>l.product.id===p.id);return hit?prev.map(l=>l.product.id===p.id?{...l,boxes:l.boxes+1}:l):[...prev,{product:p,boxes:1}]})
      setDrawer(true)
    },
    setBoxes:(id,boxes)=>setLines(prev=>prev.map(l=>l.product.id===id?{...l,boxes:Math.max(1,boxes)}:l)),
    remove:(id)=>{setLines(prev=>prev.filter(l=>l.product.id!==id));setNotice('')},
    clear:()=>{setLines([]);setNotice('')}, drawer,setDrawer
  }),[lines,drawer,notice,cartCurrency,mixedCurrency])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(){const v=useContext(StoreContext);if(!v)throw new Error('useStore must be inside StoreProvider');return v}
