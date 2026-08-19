import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/CheckoutForm'
export const metadata:Metadata={title:'Оформление заказа'}
export default function Checkout(){return <main className="checkout-page shell"><CheckoutForm/></main>}
