'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CartLine, Product } from '@/lib/types'

type StoreContextValue = {
  lines: CartLine[]
  total: number
  boxCount: number
  add: (p: Product) => void
  setBoxes: (id: string, boxes: number) => void
  remove: (id: string) => void
  clear: () => void
  drawer: boolean
  setDrawer: (open: boolean) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({children}:{children:React.ReactNode}){
  const [lines,setLines] = useState<CartLine[]>([])
  const [drawer,setDrawer] = useState(false)
  useEffect(()=>{
    try { const raw=localStorage.getItem('econom-cart'); if(raw) setLines(JSON.parse(raw)) } catch {}
  },[])
  useEffect(()=>{ try { localStorage.setItem('econom-cart',JSON.stringify(lines)) } catch {} },[lines])
  const value=useMemo<StoreContextValue>(()=>({
    lines,
    total: lines.reduce((sum,l)=>sum+l.product.unitPrice*l.product.packSize*l.boxes,0),
    boxCount: lines.reduce((sum,l)=>sum+l.boxes,0),
    add:(p)=>{setLines(prev=>{const hit=prev.find(l=>l.product.id===p.id);return hit?prev.map(l=>l.product.id===p.id?{...l,boxes:l.boxes+1}:l):[...prev,{product:p,boxes:1}]});setDrawer(true)},
    setBoxes:(id,boxes)=>setLines(prev=>prev.map(l=>l.product.id===id?{...l,boxes:Math.max(1,boxes)}:l)),
    remove:(id)=>setLines(prev=>prev.filter(l=>l.product.id!==id)),
    clear:()=>setLines([]), drawer,setDrawer
  }),[lines,drawer])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(){const v=useContext(StoreContext);if(!v)throw new Error('useStore must be inside StoreProvider');return v}
