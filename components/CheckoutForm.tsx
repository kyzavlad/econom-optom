'use client'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useStore } from './StoreProvider'
import { money } from '@/lib/money'

type SubmitResult={ok:boolean;persisted?:boolean;number?:number|null;error?:string;currency?:'UAH'|'USD'}

export function CheckoutForm(){
 const store=useStore(); const [done,setDone]=useState<SubmitResult|null>(null); const [sending,setSending]=useState(false); const [error,setError]=useState('')
 const currency=store.lines[0]?.product.currency??'UAH'
 async function submit(e:React.FormEvent<HTMLFormElement>){
   e.preventDefault(); if(!store.lines.length){setError('Добавьте хотя бы одну упаковку в корзину.');return}
   setSending(true); setError('')
   const form=new FormData(e.currentTarget)
   const payload={company:String(form.get('company')||''),contactName:String(form.get('name')||''),phone:String(form.get('phone')||''),city:String(form.get('city')||''),deliveryMethod:String(form.get('delivery')||''),comment:String(form.get('comment')||''),items:store.lines.map(l=>({sourceId:l.product.sourceId,boxes:l.boxes}))}
   try{
     const response=await fetch('/api/order-requests',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)})
     const result=await response.json() as SubmitResult
     if(!response.ok||!result.ok) throw new Error(result.error||'request_failed')
     if(result.persisted) store.clear()
     setDone(result)
   } catch(err){setError('Не удалось отправить заявку. Проверьте данные и попробуйте ещё раз.');console.error(err)} finally{setSending(false)}
 }
 if(done)return <div className="checkout-success"><CheckCircle2 size={40}/><h2>{done.persisted?'Заявка принята':'Заказ готов к отправке'}</h2><p>{done.persisted?(done.number?<>Номер заявки <b>#{done.number}</b>. Менеджер проверит наличие, подтвердит сумму и условия предоплаты.</>:<>Заявка сохранена. Менеджер проверит наличие, подтвердит сумму и условия предоплаты.</>):<>В демонстрационной версии расчёт и форма работают полностью. После подключения рабочей базы эта же кнопка сохранит заявку менеджеру.</>}</p><a className="primary" href="/catalog">Вернуться в каталог</a></div>
 return <div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><div><span className="eyebrow">Оптовый заказ</span><h1>Контакты покупателя</h1><p>Заказ сначала подтверждает менеджер, потому что фактическое наличие отдельных моделей проверяется перед оплатой.</p></div><div className="form-grid"><label>Компания / магазин<input name="company" required maxLength={120} autoComplete="organization" placeholder="Название магазина"/></label><label>Контактное лицо<input name="name" required maxLength={100} autoComplete="name" placeholder="Имя"/></label><label>Телефон<input name="phone" required maxLength={40} autoComplete="tel" inputMode="tel" placeholder="+380 __ ___ __ __"/></label><label>Город<input name="city" required maxLength={100} autoComplete="address-level2" placeholder="Одесса"/></label><label>Доставка<select name="delivery" required defaultValue=""><option value="" disabled>Выберите</option><option>Новая почта</option><option>Укрпочта</option><option>Самовывоз</option></select></label><label className="wide">Комментарий<textarea name="comment" maxLength={1000} placeholder="Уточнения по заказу"/></label></div>{error&&<p className="form-error">{error}</p>}<button className="primary full" disabled={sending||!store.lines.length}>{sending?'Отправляем…':'Отправить заявку менеджеру'}</button></form><aside className="order-summary"><small>Ваш заказ</small><h2>{store.boxCount} уп.</h2>{store.lines.map(l=><div className="summary-line" key={l.product.id}><span>{l.product.name}<small>{l.boxes} × {l.product.packSize} шт.</small></span><b>{money(l.product.unitPrice*l.product.packSize*l.boxes,l.product.currency??'UAH')}</b></div>)}<div className="summary-total"><span>Итого</span><strong>{money(store.total,currency)}</strong></div><p>Финальная сумма и наличие подтверждаются менеджером до предоплаты.</p></aside></div>
}
