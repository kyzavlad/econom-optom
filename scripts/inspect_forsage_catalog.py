from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
import json,re,urllib.request

BASE='https://www.forsage-studio.com/victoria'
UA={'User-Agent':'Mozilla/5.0 (compatible; ECONOM-preview-audit/1.0)'}


def fetch(url):
    req=urllib.request.Request(url,headers=UA)
    with urllib.request.urlopen(req,timeout=20) as r:
        return r.read().decode('utf-8','replace')


def parse_card(a):
    href=a.get('href','')
    img=a.find('img')
    text=' '.join(a.get_text(' ',strip=True).replace('Докладніше','').split())
    m=re.match(r'^(.*?),\s*(\d+)(?:\s*\(([^)]*)\))?,\s*([0-9]+(?:\.[0-9]+)?),\s*(.+)$',text)
    if not m or not img or not img.get('src'):
        return None, {'href':href,'text':text,'image':img.get('src') if img else None}
    sku=m.group(1).strip()
    pack=int(m.group(2))
    sizes=(m.group(3) or 'One size').strip()
    price=float(m.group(4))
    season=m.group(5).strip()
    path=urlparse(href).path.strip('/').split('/')[-1]
    id_match=re.match(r'^(\d+)-(.+)$',path)
    source_id=id_match.group(1) if id_match else path
    tail=id_match.group(2) if id_match else path
    sku_slug=re.sub(r'[^a-z0-9]+','-',sku.lower()).strip('-')
    product_type=tail
    if sku_slug and tail.endswith(sku_slug):
        product_type=tail[:-(len(sku_slug)+1)]
    else:
        product_type=tail.split('-')[0]
    return {
        'source_id':source_id,
        'sku':sku,
        'pack_size':pack,
        'size_grid':sizes,
        'unit_price':price,
        'season_raw':season,
        'source_url':href,
        'image_url':img.get('src'),
        'type_slug':product_type,
        'slug':tail,
    }, None


def parse_page(page,html):
    soup=BeautifulSoup(html,'html.parser')
    cards=soup.select('a.card[href*="/victoria/"]')
    products=[]; errors=[]
    for a in cards:
        product,error=parse_card(a)
        if product: products.append(product)
        else: errors.append(error)
    return page,products,errors,len(cards)

html1=fetch(BASE)
soup1=BeautifulSoup(html1,'html.parser')
page_nums=[1]
for a in soup1.select('.pagination a'):
    m=re.search(r'[?&]page=(\d+)',a.get('href',''))
    if m: page_nums.append(int(m.group(1)))
last_page=max(page_nums)

html_by_page={1:html1}
with ThreadPoolExecutor(max_workers=8) as pool:
    futures={pool.submit(fetch,f'{BASE}?page={page}'):page for page in range(2,last_page+1)}
    for future in as_completed(futures):
        page=futures[future]
        html_by_page[page]=future.result()

products=[]; errors=[]; page_stats=[]
for page in range(1,last_page+1):
    page,parsed,errs,cards=parse_page(page,html_by_page[page])
    products.extend(parsed); errors.extend(errs)
    page_stats.append({'page':page,'cards':cards,'parsed':len(parsed)})

unique={}
for p in products: unique[p['source_id']]=p
products=list(unique.values())
summary={
    'last_page':last_page,
    'products':len(products),
    'parse_errors':len(errors),
    'missing_images':sum(1 for p in products if not p['image_url']),
    'type_counts':Counter(p['type_slug'] for p in products).most_common(),
    'season_counts':Counter(p['season_raw'] for p in products).most_common(),
    'page_stats':page_stats,
    'sample':products[:30],
    'errors_sample':errors[:20],
}
Path('forsage-victoria-full.json').write_text(json.dumps(products,ensure_ascii=False,indent=2),encoding='utf-8')
Path('forsage-victoria-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False,indent=2))
