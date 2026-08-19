import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Box, Check, ShieldCheck, Truck } from 'lucide-react'
import { getProductBySlug } from '@/lib/catalog'
import { money } from '@/lib/money'
import { ProductActions } from '@/components/ProductActions'
import { ProductMedia } from '@/components/ProductMedia'

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const p=await getProductBySlug(slug); if(!p)notFound(); const currency=p.currency??'UAH'
 return <main className="product-page shell"><Link href="/catalog" className="back"><ArrowLeft size={16}/>Назад в каталог</Link><div className="product-detail"><div className="detail-image"><ProductMedia src={p.imageUrl} alt={p.name} loading="eager"/><span>{p.season}</span></div><div className="detail-copy"><small className="sku">Артикул {p.sku}</small><h1>{p.name}</h1><p className="lead">Оптовая упаковка из актуального каталога Victoria/Forsage. Фактическое наличие подтверждается менеджером перед оплатой.</p><div className="detail-price"><div><strong>{money(p.unitPrice,currency)}</strong><span>за единицу</span></div><div><strong>{money(p.unitPrice*p.packSize,currency)}</strong><span>за упаковку</span></div></div><div className="detail-grid"><div><span>В упаковке</span><b>{p.packSize} шт.</b></div><div><span>Размерный ряд</span><b>{p.sizeGrid}</b></div><div><span>Сезон</span><b>{p.season}</b></div><div><span>Категория</span><b>{p.category}</b></div></div><ProductActions product={p}/><div className="detail-trust"><span><ShieldCheck/>Проверяем наличие</span><span><Truck/>Доставка по Украине</span><span><Box/>Опт упаковками</span></div><ul className="clean-list"><li><Check/>Менеджер подтверждает заказ до предоплаты</li><li><Check/>Количество упаковок можно изменить в корзине</li><li><Check/>Стоимость упаковки рассчитывается автоматически</li></ul></div></div></main>
}
