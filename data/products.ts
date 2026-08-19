import type { Product } from '@/lib/types'

// Real Victoria/Forsage assortment. Images are supplier-product photos mirrored by a 7km wholesale catalog.
// We intentionally do not invent product imagery. Production sync will replace these snapshot URLs with the agreed source feed.
export const products: Product[] = [
  {
    id:'f11-2', sourceId:'1117620', slug:'sapogi-f11-2-mix', sku:'Ф11-2 mix', name:'Сапоги Ф11-2 mix', category:'Сапоги', unitPrice:185, packSize:16, sizeGrid:'34–38', season:'Зима', gender:'Детское', material:'Искусственная кожа / замша',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/de/de93a5fd-9c6d-11f0-baf2-005056003f72.jpg?v=1759096802',
    sourceUrl:'https://www.forsage-studio.com/victoria', status:'active'
  },
  {
    id:'f11-6', sourceId:'1117617', slug:'sapogi-f11-6-mix', sku:'Ф11-6 mix', name:'Сапоги Ф11-6 mix', category:'Сапоги', unitPrice:185, packSize:16, sizeGrid:'34–38', season:'Зима', gender:'Детское', material:'Искусственная кожа',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/de/de93a5fc-9c6d-11f0-baf2-005056003f72.jpg?v=1759096801',
    sourceUrl:'https://www.forsage-studio.com/victoria', status:'active'
  },
  {
    id:'f11-5', sourceId:'1117616', slug:'sapogi-f11-5-mix', sku:'Ф11-5 mix', name:'Сапоги Ф11-5 mix', category:'Сапоги', unitPrice:185, packSize:16, sizeGrid:'34–38', season:'Зима', gender:'Детское', material:'Искусственная кожа',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/de/de93a5fb-9c6d-11f0-baf2-005056003f72.jpg?v=1759096801',
    sourceUrl:'https://www.forsage-studio.com/victoria', status:'active'
  },
  {
    id:'n88-09', sourceId:'1120136', slug:'uggi-n88-09-mix', sku:'N88-09 mix', name:'Угги N88-09 mix', category:'Угги', unitPrice:255, packSize:10, sizeGrid:'31–35', season:'Зима', gender:'Детское', material:'Текстиль',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/49/49f90be5-a448-11f0-baf2-005056003f72.jpg?v=1759960763',
    sourceUrl:'https://www.forsage-studio.com/victoria/1120136-uggi-n88-09-mix', status:'active'
  },
  {
    id:'31-21', sourceId:'victoria-31-21', slug:'uggi-31-21-mix', sku:'31-21 mix', name:'Угги 31-21 mix', category:'Угги', unitPrice:255, packSize:10, sizeGrid:'31–35', season:'Зима', gender:'Детское', material:'Текстиль',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/49/49f90be6-a448-11f0-baf2-005056003f72.jpg?v=1759960764',
    sourceUrl:'https://www.forsage-studio.com/victoria', status:'active'
  },
  {
    id:'61-16', sourceId:'victoria-61-16', slug:'krossovki-61-16-mix', sku:'61-16 mix', name:'Кроссовки 61-16 mix', category:'Кроссовки', unitPrice:173, packSize:20, sizeGrid:'27–31', season:'Деми', gender:'Детское', material:'Искусственная кожа',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/f4/f4f665fb-a8d5-11f0-baf2-005056003f72.jpg?v=1760476082', status:'active'
  },
  {
    id:'86-68', sourceId:'victoria-86-68', slug:'krossovki-86-68-mix', sku:'86-68 утеплені mix', name:'Кроссовки 86-68 утепленные mix', category:'Кроссовки', unitPrice:173, packSize:20, sizeGrid:'27–31', season:'Деми', gender:'Детское', material:'Искусственная кожа / плащевка',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/f4/f4f665fa-a8d5-11f0-baf2-005056003f72.jpg?v=1760476082', status:'active'
  },
  {
    id:'64-46', sourceId:'victoria-64-46', slug:'krossovki-64-46-mix', sku:'64-46 утеплені mix', name:'Кроссовки 64-46 утепленные mix', category:'Кроссовки', unitPrice:173, packSize:20, sizeGrid:'27–31', season:'Деми', gender:'Детское', material:'Искусственный материал',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/f4/f4f665f9-a8d5-11f0-baf2-005056003f72.jpg?v=1760476082', status:'active'
  },
  {
    id:'72-11', sourceId:'victoria-72-11', slug:'krossovki-72-11-mix', sku:'72-11 mix', name:'Кроссовки 72-11 mix', category:'Кроссовки', unitPrice:210, packSize:12, sizeGrid:'32–37', season:'Деми', gender:'Детское', material:'Искусственная замша / текстиль',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/49/49f90be4-a448-11f0-baf2-005056003f72.jpg?v=1759960763', status:'active'
  },
  {
    id:'va03', sourceId:'victoria-va03', slug:'tapki-va03-pink', sku:'VA03 pink', name:'Тапочки VA03 pink', category:'Тапочки', unitPrice:57, packSize:10, sizeGrid:'14–18', season:'Деми', gender:'Детское', material:'Искусственный материал',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/c6/c6ea47cb-3596-11ef-bad8-00505600d7fd.jpg', status:'active'
  },
  {
    id:'2-22', sourceId:'victoria-2-22', slug:'krossovki-2-22', sku:'2-22', name:'Кроссовки 2-22', category:'Кроссовки', unitPrice:203, packSize:8, sizeGrid:'31–35', season:'Деми', gender:'Детское', material:'Искусственная кожа / текстиль',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/8b/8b239746-7d83-11f0-baf2-005056003f72.jpg?v=1755732438', status:'active'
  },
  {
    id:'33-5', sourceId:'1117366', slug:'sapogi-33-5-mix', sku:'33-5 mix', name:'Сапоги 33-5 mix', category:'Сапоги', unitPrice:185, packSize:16, sizeGrid:'34–38', season:'Зима', gender:'Детское', material:'Искусственный материал',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/d8/d8b3e377-9c50-11f0-baf2-005056003f72.jpg?v=1771966877', status:'active'
  },
  {
    id:'33-7', sourceId:'1117364', slug:'sapogi-33-7-mix', sku:'33-7 mix', name:'Сапоги 33-7 mix', category:'Сапоги', unitPrice:185, packSize:16, sizeGrid:'34–38', season:'Зима', gender:'Детское', material:'Искусственный материал',
    imageUrl:'https://paradobuvi.ua/import_files/storage/0/import_files/d8/d8b3e376-9c50-11f0-baf2-005056003f72.jpg?v=1771966877', status:'active'
  }
]

export const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))]
