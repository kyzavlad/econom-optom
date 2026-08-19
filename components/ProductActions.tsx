'use client'
import type { Product } from '@/lib/types'
import { useStore } from './StoreProvider'
export function ProductActions({product}:{product:Product}){const {add}=useStore();return <button className="primary full" onClick={()=>add(product)}>Добавить 1 упаковку в корзину</button>}
