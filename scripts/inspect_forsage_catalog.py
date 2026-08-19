from pathlib import Path
import json,re,urllib.request

URL='https://www.forsage-studio.com/victoria'
req=urllib.request.Request(URL,headers={'User-Agent':'Mozilla/5.0'})
with urllib.request.urlopen(req,timeout=30) as r:
    html=r.read().decode('utf-8','replace')
Path('forsage-victoria-page1.html').write_text(html,encoding='utf-8')

links=[]
for m in re.finditer(r'href=["\']([^"\']*/victoria/[^"\']+)["\']',html,re.I):
    href=m.group(1)
    if href not in links: links.append(href)
imgs=[]
for m in re.finditer(r'<img\b[^>]*?src=["\']([^"\']+)["\'][^>]*>',html,re.I|re.S):
    src=m.group(1)
    if src not in imgs: imgs.append(src)

summary={'bytes':len(html.encode()),'product_links':len(links),'images':len(imgs),'links_sample':links[:30],'images_sample':imgs[:60]}
Path('forsage-victoria-page1-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False,indent=2))
