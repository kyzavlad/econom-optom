import type { Metadata } from 'next'
import { getProducts } from '@/lib/catalog'
import { CatalogClient } from '@/components/CatalogClient'
export const metadata: Metadata={title:'Каталог'}
export default async function Catalog(){const products=await getProducts();return <main className="catalog-page shell"><div className="catalog-title"><span className="eyebrow">Victoria / Forsage</span><h1>Оптовый каталог</h1><p>Цена за пару, упаковка и стоимость ящика в одной карточке.</p></div><CatalogClient products={products}/></main>}
