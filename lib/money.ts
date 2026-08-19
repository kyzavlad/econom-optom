export type Currency = 'UAH' | 'USD'

export function money(value:number,currency:Currency='UAH'){
  if(currency==='USD') return '$'+new Intl.NumberFormat('uk-UA',{minimumFractionDigits:0,maximumFractionDigits:2}).format(value)
  return new Intl.NumberFormat('uk-UA',{minimumFractionDigits:0,maximumFractionDigits:2}).format(value)+' ₴'
}
