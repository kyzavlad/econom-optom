import type { Metadata } from 'next'
import './globals.css'
import './styles/part1.css'
import './styles/part2.css'
import './styles/part3.css'
import './styles/part4.css'
import './styles/part5.css'
import { StoreProvider } from '@/components/StoreProvider'
import { Header } from '@/components/Header'
import { CartDrawer } from '@/components/CartDrawer'

export const metadata: Metadata = {
  title: { default: 'ECONOM OPTOM — одежда и обувь оптом', template: '%s | ECONOM OPTOM' },
  description: 'Оптовый интернет-магазин одежды и обуви. Ящики, размерные ряды, доставка по Украине.',
  robots: { index: false, follow: false }
}

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="ru"><body><StoreProvider><Header/>{children}<CartDrawer/></StoreProvider></body></html>
}
