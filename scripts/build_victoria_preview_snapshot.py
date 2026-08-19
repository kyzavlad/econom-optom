from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import Counter
import json,re,time,urllib.request

BASE='https://www.forsage-studio.com/victoria'
UA={'User-Agent':'Mozilla/5.0 (compatible; ECONOM-client-preview/1.0)'}

TYPE_TITLES={
'krossovki':'Кроссовки','bosonozhki':'Босоножки','shlepki':'Шлепанцы','shlepki-s':'Шлепанцы','tufli':'Туфли','tufli-baletka':'Туфли','botinki':'Ботинки','baletki':'Балетки','slipony':'Слипоны','sapogi':'Сапоги','sapogi-':'Сапоги','tapki':'Тапочки','kedy':'Кеды','sandalii':'Сандалии','uggi':'Угги','snikersy':'Сникерсы','kroksy':'Кроксы','pinetki':'Пинетки','pinetki-r-r':'Пинетки','vetnamki':'Вьетнамки','futbolnaya-obuv':'Футбольная обувь',
'trusy':'Белье','shorty':'Шорты','kofta':'Кофта','legginsy':'Леггинсы','losiny':'Лосины','losiny-losini':'Лосины','golfy':'Гольфы','bluzka':'Блузка','kolgoty':'Колготки','plate':'Платье','bryuki':'Брюки','sportivnye-bryuki':'Спортивные брюки','rubashka':'Рубашка','kurtka':'Куртка','kurtka-kurtka-cholovicha':'Куртка','kostyum':'Костюм','futbolka':'Футболка','yubka':'Юбка','sarafan':'Сарафан','byustgalter':'Бюстгальтер','palto':'Пальто','tunika':'Туника',
'sumka':'Сумка','ryukzak':'Рюкзак','ryukzak-meshok':'Рюкзак','noski':'Носки','noski-noski-zhinochi':'Носки','kepka':'Кепка','platok':'Платок','shapka-shapka-dlya-plavannya':'Шапка','kosmetichka':'Косметичка','klatch':'Клатч'}
FOOTWEAR={'krossovki','bosonozhki','shlepki','shlepki-s','tufli','tufli-baletka','baletki','slipony','sapogi','sapogi-','tapki','kedy','sandalii','uggi','snikersy','kroksy','pinetki','pinetki-r-r','vetnamki','futbolnaya-obuv'}
CLOTHING={'trusy','shorty','kofta','legginsy','losiny','losiny-losini','golfy','bluzka','kolgoty','plate','bryuki','sportivnye-bryuki','rubashka','kurtka','kurtka-kurtka-cholovicha','kostyum','futbolka','yubka','sarafan','byustgalter','palto','tunika'}
SEASONS={'демісезон':'Деми','літо':'Лето','зима':'Зима'}
GENDERS={'чоловіки':'Мужское','жінки':'Женское','діти':'Детское','унісекс':'Унисекс'}


def fetch(url,retries=4):
    last=None
    for attempt in range(retries):
        try:
            req=urllib.request.Request(url,headers=UA)
            with urllib.request.urlopen(req,timeout=25) as r:
                return r.read().decode('utf-8','replace')
        except Exception as exc:
            last=exc
            if attempt+1<retries: time.sleep(0.5*(attempt+1))
    raise last


def type_slug_from(href,sku):
    tail=urlparse(href).path.strip('/').split('/')[-1]
    m=re.match(r'^(\d+)-(.+)$',tail); slug=m.group(2) if m else tail
    sku_slug=re.sub(r'[^a-z0-9]+','-',sku.lower()).strip('-')
    if sku_slug and slug.endswith('-'+sku_slug): return slug[:-(len(sku_slug)+1)],slug,(m.group(1) if m else tail)
    for key in sorted(TYPE_TITLES,key=len,reverse=True):
        if slug==key or slug.startswith(key+'-'): return key,slug,(m.group(1) if m else tail)
    return slug.split('-')[0],slug,(m.group(1) if m else tail)


def parse_card(a):
    href=a.get('href',''); img=a.find('img'); text=' '.join(a.get_text(' ',strip=True).replace('Докладніше','').split())
    m=re.match(r'^(.*?),\s*(\d+)(?:\s*\(([^)]*)\))?,\s*([0-9]+(?:\.[0-9]+)?)(?:\s*,\s*(.+))?$',text)
    if not m or not img or not img.get('src'): return None
    sku=m.group(1).strip(); type_slug,slug,source_id=type_slug_from(href,sku)
    if type_slug not in TYPE_TITLES:return None
    category='Обувь' if type_slug in FOOTWEAR else ('Одежда' if type_slug in CLOTHING else 'Аксессуары')
    title=TYPE_TITLES[type_slug]
    return {'source_id':source_id,'sku':sku,'slug':slug,'name':f'{title} {sku}','category':category,'gender':'Не указано','season':SEASONS.get((m.group(5) or '').strip().lower(),'Не указано'),'material':'Уточняется','unit_price':float(m.group(4)),'currency':None,'pack_size':int(m.group(2)),'size_grid':(m.group(3) or 'One size').strip(),'image_url':img.get('src'),'source_url':href,'type_slug':type_slug}


def detail_values(html):
    values={}
    soup=BeautifulSoup(html,'html.parser')
    for row in soup.select('tr'):
        cells=row.find_all('td')
        if len(cells)<2: continue
        key=' '.join(cells[0].stripped_strings).strip()
        value=' '.join(cells[1].stripped_strings).strip()
        if key and value: values[key]=value
    return values


def normalize_currency(raw):
    value=(raw or '').strip().lower()
    if 'грив' in value: return 'UAH'
    if 'дол' in value: return 'USD'
    return None


def enrich_detail(product):
    html=fetch(product['source_url'])
    values=detail_values(html)
    currency=normalize_currency(values.get('Валюта продажу'))
    if not currency:
        raise RuntimeError(f"Unknown currency for {product['source_id']}: {values.get('Валюта продажу')!r}")
    enriched=dict(product)
    enriched['currency']=currency
    gender=GENDERS.get((values.get('Стать') or '').strip().lower())
    if gender: enriched['gender']=gender
    material=(values.get('Матеріал виробу') or '').strip()
    if material: enriched['material']=material
    return enriched


def cards(html):return BeautifulSoup(html,'html.parser').select('a.card[href*="/victoria/"]')


html1=fetch(BASE); soup=BeautifulSoup(html1,'html.parser'); pages=[1]
for a in soup.select('.pagination a'):
    m=re.search(r'[?&]page=(\d+)',a.get('href',''))
    if m:pages.append(int(m.group(1)))
last=max(pages); htmls={1:html1}
with ThreadPoolExecutor(max_workers=8) as pool:
    futures={pool.submit(fetch,f'{BASE}?page={p}'):p for p in range(2,last+1)}
    for f in as_completed(futures):htmls[futures[f]]=f.result()

products=[]; total_cards=0
for p in range(1,last+1):
    cs=cards(htmls[p]); total_cards+=len(cs); products.extend(x for x in (parse_card(a) for a in cs) if x)
products=list({p['source_id']:p for p in products}.values())

print(f'Parsed {len(products)} relevant products from {total_cards} public cards; enriching detail currency...')
enriched=[]; failures=[]; completed=0
with ThreadPoolExecutor(max_workers=6) as pool:
    futures={pool.submit(enrich_detail,p):p for p in products}
    for future in as_completed(futures):
        product=futures[future]
        try: enriched.append(future.result())
        except Exception as exc: failures.append({'source_id':product['source_id'],'url':product['source_url'],'error':str(exc)})
        completed+=1
        if completed%100==0 or completed==len(products): print(f'Detail progress: {completed}/{len(products)}; failures={len(failures)}')

if failures:
    print(json.dumps({'detail_failures':failures[:30],'failure_count':len(failures)},ensure_ascii=False,indent=2))
    raise SystemExit('Currency enrichment incomplete; refusing to publish a potentially mispriced snapshot.')

products=sorted(enriched,key=lambda p:p['source_id'],reverse=True)
currencies=Counter(p['currency'] for p in products)
if set(currencies)-{'UAH','USD'}: raise SystemExit(f'Unsupported currencies: {currencies}')

Path('data').mkdir(exist_ok=True)
Path('data/victoria-preview.json').write_text(json.dumps(products,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
meta={'source':BASE,'pages':last,'public_cards':total_cards,'fashion_products':len(products),'currencies':dict(currencies),'categories':dict(Counter(p['category'] for p in products)),'seasons':dict(Counter(p['season'] for p in products)),'missing_images':sum(not p['image_url'] for p in products),'unknown_currency':sum(not p['currency'] for p in products)}
Path('data/victoria-preview-meta.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(meta,ensure_ascii=False,indent=2))
