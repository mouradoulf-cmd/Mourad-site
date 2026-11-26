# Builds the menu.js (+ photo variants) of the two overnight prospect demos. usage: python3 build_menu.py primo|mony
import json,os,re,sys,glob
from PIL import Image,ImageFilter,ImageEnhance
import numpy as np
from opencc import OpenCC
T2S=OpenCC('tw2sp')
WHICH=sys.argv[1]
N='/tmp/night';PW=N+'/pw'
LANGS=['th','en','zh','zt','ru','ko','ja','hi','ms','id','lo','de','fr','it','vi','km','fil','ar','he','es']
T15=['zt','ko','ja','hi','id','lo','de','fr','it','vi','km','fil','ar','he','es']
SLUG={'primo':'primo-bistro-demo','mony':'chez-mony-demo','azur':'azur-restaurant-demo'}[WHICH]
OUT=f'/tmp/hub/menus/{SLUG}'
os.makedirs(OUT,exist_ok=True)

# ---------- helpers
def rows(path,order,skip=0):
    d={}
    for l in open(path,encoding='utf8'):
        p=l.rstrip('\n').split('|')
        if len(p)<2: continue
        d[p[0]]={lg:v for lg,v in zip(order,p[1:])}
    return d
def add_zh(d):
    if 'zt' in d and 'zh' not in d: d['zh']=T2S.convert(d['zt'])
    return d
def clean(d): return {k:v for k,v in d.items() if v and v.strip()}

# ---------- photos
def tone(im):
    a=np.asarray(im,dtype=np.float32)/255.;lo=np.percentile(a,.6);hi=np.percentile(a,99.6);a=np.clip((a-lo)/(hi-lo+1e-6),0,1)
    im=Image.fromarray((a*255).astype(np.uint8));return ImageEnhance.Color(im).enhance(1.06).filter(ImageFilter.UnsharpMask(1.0,40,2))
def cover(im,w,h,fy=.5):
    s=max(w/im.width,h/im.height);r=im.resize((max(w,int(im.width*s)+1),max(h,int(im.height*s)+1)),Image.LANCZOS);x=(r.width-w)//2;y=int((r.height-h)*fy);return r.crop((x,y,x+w,y+h))
def src_path(ref):
    if ref.startswith('lib:'): return f'/tmp/wp/d/{ref[4:]}.jpg'
    hq=f'{PW}/hq/{ref}.jpg'
    return hq if os.path.exists(hq) else f'{PW}/cp/{ref}.jpg'
def make_photo(ref,key,fy=.5,sc=False):
    base=f'{OUT}/{key}'
    if os.path.exists(base+'-w-2048.webp') and (not sc or os.path.exists(base+'-sc.webp')): return
    im=Image.open(src_path(ref)).convert('RGB');im=tone(im)
    cover(im,720,540,fy).save(base+'-m.webp','WEBP',quality=76,method=6)
    cover(im,288,288,fy).save(base+'-t.webp','WEBP',quality=76,method=6)
    cover(im,800,1000,fy).save(base+'-c-800.webp','WEBP',quality=70,method=6)
    cover(im,1200,1500,fy).save(base+'-c-1200.webp','WEBP',quality=56,method=6)
    cover(im,1280,960,fy).save(base+'-w-1280.webp','WEBP',quality=78,method=6)
    cover(im,2048,1536,fy).save(base+'-w-2048.webp','WEBP',quality=54,method=6)
    if sc: cover(im,720,900,fy).save(base+'-sc.webp','WEBP',quality=78,method=6)

PICKS=json.load(open(f'{N}/picks_{WHICH}.json'))   # {"dishId": "type-idx" | "lib:name", "_featured":[...], "_hero": "type-idx", "_credits":{}}
FEAT=PICKS.pop('_featured',[]);HERO=PICKS.pop('_hero',None)
def img_key(ref): return 'ph-'+re.sub(r'[^a-z0-9]+','-',ref.lower().replace('lib:','l-')).strip('-')
def attach(it,dish_id):
    ref=PICKS.get(dish_id)
    if ref:
        k=img_key(ref);make_photo(ref,k,sc=(dish_id in FEAT));it['img']=k;CRED[k]=ref

CRED={}
FOOT=rows(f'{N}/meta_texts.txt',[],0)
META={}
for l in open(f'{N}/meta_texts.txt',encoding='utf8'):
    a,b,c=l.rstrip('\n').split('|',2);META.setdefault(a,{})[b]=c

def build_primo():
    j=json.load(open(f'{N}/primo.json'))
    tr={}
    for f in sorted(glob.glob(f'{N}/tr_primo_[1-5].txt')): tr.update(rows(f,T15))
    meta_rows={};
    for l in open(f'{N}/tr_primo_meta.txt',encoding='utf8'):
        p=l.rstrip('\n').split('|');meta_rows[p[0]]={lg:v for lg,v in zip(T15,p[1:])}
    SM={'en':'small','th':'เล็ก','zh':'小份','ms':'kecil','ru':'малая'};LG={'en':'large','th':'ใหญ่','zh':'大份','ms':'besar','ru':'большая'}
    SM.update(meta_rows['W:small']);LG.update(meta_rows['W:large'])
    GL={'en':'glass','th':'แก้วละ','zh':'单杯','ms':'gelas','ru':'бокал'};GL.update(meta_rows['W:glass'])
    TW={'red':{'en':'Red wine','th':'ไวน์แดง','zh':'红葡萄酒','ms':'Wain merah','ru':'Красное вино'},'white':{'en':'White wine','th':'ไวน์ขาว','zh':'白葡萄酒','ms':'Wain putih','ru':'Белое вино'},
        'rose':{'en':'Rosé wine','th':'ไวน์โรเซ่','zh':'桃红葡萄酒','ms':'Wain rosé','ru':'Розовое вино'},'sparkling':{'en':'Sparkling wine','th':'ไวน์สปาร์กลิง','zh':'起泡酒','ms':'Wain berkilau','ru':'Игристое вино'},
        'champagne':{'en':'Champagne','th':'แชมเปญ','zh':'香槟','ms':'Champagne','ru':'Шампанское'}}
    for k in TW: TW[k].update(meta_rows['W:'+k])
    EACH={'en':'each','th':'ต่อแก้ว','zh':'每杯','ms':'setiap gelas','ru':'за бокал'};EACH.update(meta_rows['N:each'])
    STEAK={'en':'Premium cut, with 2 sides and a sauce of your choice','th':'เนื้อพรีเมียม พร้อมเครื่องเคียง 2 อย่างและซอสที่คุณเลือก','zh':'优质部位，含2份配菜和1款酱汁（任选）','ms':'Potongan premium, termasuk 2 hidangan sampingan dan 1 sos pilihan','ru':'Премиальный отруб, 2 гарнира и соус на выбор включены'}
    STEAK.update(meta_rows['N:Premium cut, with 2 sides and a sauce of your choice'])
    NOTES={k[2:]:v for k,v in meta_rows.items() if k.startswith('N:')}
    SIZES={'so01':(120,230),'so02':(120,230),'so04':(120,200),'so05':(120,200),'so06':(120,200)}
    SKIP={'st09','st10','st11','w-reserve'}
    secs=[]
    for c in j['categories']:
        t=dict(c['name']);t.update(meta_rows.get('S:'+c['id'],{}))
        items=[]
        for it in c['items']:
            if it['id'] in SKIP: continue
            sn={k:v for k,v in it['name'].items() if v};sn.update(tr.get(it['id'],{}))
            en=sn['en']
            note=(it.get('note') or {});nen=(note.get('en') or '').strip()
            d=None
            if it['id'].startswith('w-'):
                typ='red' if '-red-' in it['id'] else ('champagne' if 'champagne' in it['id'] else ('sparkling' if '-spark-' in it['id'] else ('rose' if 'rose' in it['id'] else 'white')))
                g=re.search(r'Glass (\d+)',nen);alc=re.search(r'Alc ([\d.]+%)',nen);yr=re.search(r'\b(20\d\d)\b',nen)
                d={}
                for lg in LANGS:
                    parts=[TW[typ].get(lg,TW[typ]['en'])]
                    if g: parts.append(f"{GL.get(lg,GL['en'])} {g.group(1)} ฿")
                    if alc: parts.append(alc.group(1))
                    if yr: parts.append(yr.group(1))
                    d[lg]=' · '.join(parts)
            elif it['id'].startswith('st') and it['id'] in ['st01','st02','st03','st04','st05','st06','st07','st08']: d=dict(STEAK)
            elif it['id']=='dr11': d=dict(EACH)
            elif nen and not re.search(r'small.*large',nen,re.I) and not re.fullmatch(r'\+\d+฿',nen):
                d={k:v for k,v in note.items() if v}
                if nen in NOTES: d.update(NOTES[nen])
            base={'id':it['id'],'n':en,'sn':sn}
            if d: base['d']=clean(d)
            if it['id'] in SIZES:
                a,b=SIZES[it['id']]
                s={lg:f"{sn.get(lg,en)} · {SM.get(lg,SM['en'])}" for lg in LANGS};l={lg:f"{sn.get(lg,en)} · {LG.get(lg,LG['en'])}" for lg in LANGS}
                r1=dict(base,id=it['id']+'_s',n=s['en'],sn=s,p=str(a));r2=dict(base,id=it['id']+'_l',n=l['en'],sn=l,p=str(b))
                attach(r1,it['id']);items+= [r1,r2]
            else:
                p=it.get('price') or 0
                base['p']=str(p) if p else ''
                attach(base,it['id']);items.append(base)
        secs.append({'id':c['id'],'t':clean(t),'items':items})
    return secs

def build_mony():
    M=json.load(open(f'{N}/mony_menu.json'))
    names={}
    names.update(rows(f'{N}/tr_mony_1.txt',['th','zh_old','zt','ru','ko','ja','hi','ms','id','lo','de','fr','it','vi','km','fil','ar','he','es']))
    for f in ['tr_mony_2.txt','tr_mony_3.txt','tr_mony_4.txt']: names.update(rows(f'{N}/{f}',['th','zt','ru','ko','ja','hi','ms','id','lo','de','fr','it','vi','km','fil','ar','he','es']))
    desc={}
    for f in ['trd_mony_1.txt','trd_mony_2.txt','trd_mony_3.txt']: desc.update(rows(f'{N}/{f}',['th','zt','ru','fr','de','ar']))
    wfr=rows(f'{N}/trdw_mony_fr.txt',['fr'])
    SEC={ # section titles in 20 langs (en + th + fr given by the restaurant's site; others by me)
     'bf':{'en':'Breakfast','th':'อาหารเช้า','zt':'早餐','ru':'Завтрак','ko':'아침 식사','ja':'朝食','hi':'नाश्ता','ms':'Sarapan','id':'Sarapan','lo':'ອາຫານເຊົ້າ','de':'Frühstück','fr':'Petit-déjeuner','it':'Colazione','vi':'Bữa sáng','km':'អាហារពេលព្រឹក','fil':'Almusal','ar':'الفطور','he':'ארוחת בוקר','es':'Desayuno'},
     'st':{'en':'Starters','th':'อาหารเรียกน้ำย่อย','zt':'開胃菜','ru':'Закуски','ko':'에피타이저','ja':'前菜','hi':'स्टार्टर्स','ms':'Pembuka selera','id':'Hidangan pembuka','lo':'ອາຫານຮັບປະທານກ່ອນ','de':'Vorspeisen','fr':'Entrées','it':'Antipasti','vi':'Món khai vị','km':'ម្ហូបចាប់ផ្តើម','fil':'Panimula','ar':'المقبلات','he':'מנות ראשונות','es':'Entrantes'},
     'sa':{'en':'Salads','th':'สลัด','zt':'沙拉','ru':'Салаты','ko':'샐러드','ja':'サラダ','hi':'सलाद','ms':'Salad','id':'Salad','lo':'ສະຫຼັດ','de':'Salate','fr':'Salades','it':'Insalate','vi':'Salad','km':'សាឡាត់','fil':'Mga Salad','ar':'السلطات','he':'סלטים','es':'Ensaladas'},
     'sw':{'en':'Sandwiches & Kebabs','th':'แซนด์วิชและเคบับ','zt':'三明治與烤肉串','ru':'Сэндвичи и кебабы','ko':'샌드위치 & 케밥','ja':'サンドイッチ＆ケバブ','hi':'सैंडविच और कबाब','ms':'Sandwic & Kebab','id':'Sandwich & Kebab','lo':'ແຊນວິດ ແລະ ເຄບັບ','de':'Sandwiches & Kebabs','fr':'Sandwiches & Kebabs','it':'Panini e Kebab','vi':'Sandwich & Kebab','km':'សាំងវិច និងកេបាប','fil':'Sandwich at Kebab','ar':'ساندويتشات وكباب','he':'כריכים וקבב','es':'Sándwiches y Kebabs'},
     'mn':{'en':'Mains','th':'จานหลัก','zt':'主菜','ru':'Основные блюда','ko':'메인 요리','ja':'メインディッシュ','hi':'मुख्य व्यंजन','ms':'Hidangan utama','id':'Hidangan utama','lo':'ອາຫານຈານຫຼັກ','de':'Hauptgerichte','fr':'Plats','it':'Piatti principali','vi':'Món chính','km':'ម្ហូបសំខាន់','fil':'Pangunahing Putahe','ar':'الأطباق الرئيسية','he':'מנות עיקריות','es':'Platos principales'},
     'pz':{'en':'Pizza','th':'พิซซ่า','zt':'披薩','ru':'Пицца','ko':'피자','ja':'ピザ','hi':'पिज़्ज़ा','ms':'Pizza','id':'Pizza','lo':'ພິດຊ່າ','de':'Pizza','fr':'Pizzas','it':'Pizze','vi':'Pizza','km':'ភីហ្សា','fil':'Pizza','ar':'البيتزا','he':'פיצות','es':'Pizzas'},
     'pa':{'en':'Pasta','th':'พาสต้า','zt':'義大利麵','ru':'Паста','ko':'파스타','ja':'パスタ','hi':'पास्ता','ms':'Pasta','id':'Pasta','lo':'ພາສຕ້າ','de':'Pasta','fr':'Pâtes','it':'Pasta','vi':'Mì Ý','km':'ប៉ាស្តា','fil':'Pasta','ar':'الباستا','he':'פסטות','es':'Pastas'},
     'th':{'en':'Thai Food','th':'อาหารไทย','zt':'泰式料理','ru':'Тайская кухня','ko':'태국 요리','ja':'タイ料理','hi':'थाई व्यंजन','ms':'Masakan Thai','id':'Masakan Thailand','lo':'ອາຫານໄທ','de':'Thailändische Küche','fr':'Cuisine thaïe','it':'Cucina thailandese','vi':'Món Thái','km':'ម្ហូបថៃ','fil':'Pagkaing Thai','ar':'المأكولات التايلاندية','he':'אוכל תאילנדי','es':'Comida tailandesa'},
     'de':{'en':'Desserts','th':'ของหวาน','zt':'甜點','ru':'Десерты','ko':'디저트','ja':'デザート','hi':'मिठाई','ms':'Pencuci mulut','id':'Pencuci mulut','lo':'ຂອງຫວານ','de':'Desserts','fr':'Desserts','it':'Dolci','vi':'Tráng miệng','km':'បង្អែម','fil':'Mga Panghimagas','ar':'الحلويات','he':'קינוחים','es':'Postres'},
     'cf':{'en':'Café & Co','th':'กาแฟและเครื่องดื่มร้อน','zt':'咖啡與熱飲','ru':'Кофе и напитки','ko':'카페 & 음료','ja':'カフェ＆ドリンク','hi':'कैफ़े और पेय','ms':'Kafe & minuman','id':'Kafe & minuman','lo':'ກາເຟ ແລະ ເຄື່ອງດື່ມ','de':'Café & Co','fr':'Café & Co','it':'Caffetteria','vi':'Cà phê & đồ uống','km':'កាហ្វេ និងភេសជ្ជៈ','fil':'Kape at Iba Pa','ar':'القهوة والمشروبات','he':'קפה ומשקאות','es':'Café y más'},
     'sd':{'en':'Soft Drinks','th':'น้ำอัดลมและน้ำผลไม้','zt':'無酒精飲料','ru':'Безалкогольные напитки','ko':'음료수','ja':'ソフトドリンク','hi':'सॉफ़्ट ड्रिंक्स','ms':'Minuman ringan','id':'Minuman ringan','lo':'ເຄື່ອງດື່ມບໍ່ມີທາດເຫຼົ້າ','de':'Alkoholfreie Getränke','fr':'Boissons sans alcool','it':'Bevande analcoliche','vi':'Nước giải khát','km':'ភេសជ្ជៈគ្មានជាតិអាល់កុល','fil':'Mga Softdrinks','ar':'المشروبات الغازية','he':'משקאות קלים','es':'Refrescos'},
     'bs':{'en':'Beers & Spirits','th':'เบียร์และสุรา','zt':'啤酒與烈酒','ru':'Пиво и крепкие напитки','ko':'맥주 & 증류주','ja':'ビール＆スピリッツ','hi':'बीयर और स्पिरिट्स','ms':'Bir & minuman keras','id':'Bir & minuman keras','lo':'ເບຍ ແລະ ເຫຼົ້າ','de':'Bier & Spirituosen','fr':'Bières & spiritueux','it':'Birre e distillati','vi':'Bia & rượu mạnh','km':'ស្រាបៀរ និងស្រាខ្លាំង','fil':'Beer at Spirits','ar':'البيرة والمشروبات الروحية','he':'בירות ואלכוהול','es':'Cervezas y licores'},
     'wi':{'en':'French Wine Exclusive','th':'ไวน์ฝรั่งเศสพิเศษ','zt':'法國頂級葡萄酒','ru':'Эксклюзивные французские вина','ko':'프랑스 와인 엑스클루시브','ja':'フランスワイン・エクスクルーシブ','hi':'फ़्रेंच वाइन एक्सक्लूसिव','ms':'Wain Perancis eksklusif','id':'Wine Prancis eksklusif','lo':'ໄວນ໌ຝຣັ່ງພິເສດ','de':'Exklusive französische Weine','fr':'Vins français exclusifs','it':'Vini francesi esclusivi','vi':'Rượu vang Pháp cao cấp','km':'ស្រាបារាំងពិសេស','fil':'Eksklusibong Alak na Pranses','ar':'نبيذ فرنسي حصري','he':'יינות צרפתיים בלעדיים','es':'Vinos franceses exclusivos'}}
    for v in SEC.values(): v['zh']=T2S.convert(v['zt']);
    SEC['bf']['ms']='Sarapan';
    secs=[]
    for s in M:
        items=[]
        for i,it in enumerate(s['items'],1):
            did=f"{s['id']}{i}";nn=add_zh(dict(names.get(did,{})));nn['en']=it['n']
            if s['id']=='wi' and i<=10: nn={lg:it['n'] for lg in LANGS}   # wine names are proper names
            d={}
            if s['id'] not in ('sd','bs','cf') and it['d']:
                d['en']=it['d']
                dd=add_zh(dict(desc.get(did,{})));d.update({k:v for k,v in dd.items()})
                if did in wfr: d['fr']=wfr[did]['fr']
            row={'id':did,'n':it['n'],'p':str(it['p']),'sn':clean(nn)}
            if d: row['d']=clean(d)
            attach(row,did);items.append(row)
        secs.append({'id':s['id'],'t':clean(SEC[s['id']]),'items':items})
    return secs

def build_azur():
    A=json.load(open(f'{N}/azur_menu.json'))
    O19=['th','zt','ru','ko','ja','hi','ms','id','lo','de','fr','it','vi','km','fil','ar','he','es']
    names={}
    for f in ['tr_azur_1.txt','tr_azur_2.txt','tr_azur_3.txt']: names.update(rows(f'{N}/{f}',O19))
    for l in open(f'{N}/tr_azur_ru.txt',encoding='utf8'):
        p=l.rstrip('\n').split('|')
        names[p[0]]={lg:v for lg,v in zip(['en']+O19,p[1:])}
    desc=rows(f'{N}/trd_azur.txt',['th','zt','ru','fr','de','ar'])
    SEC={}
    for l in open(f'{N}/trs_azur.txt',encoding='utf8'):
        p=l.rstrip('\n').split('|');SEC[p[0]]={lg:v for lg,v in zip(['en']+O19,p[1:])}
    HOT={'en':'hot','th':'ร้อน','zt':'熱','ru':'горячий','ko':'핫','ja':'ホット','hi':'गर्म','ms':'panas','id':'panas','lo':'ຮ້ອນ','de':'heiß','fr':'chaud','it':'caldo','vi':'nóng','km':'ក្តៅ','fil':'mainit','ar':'ساخن','he':'חם','es':'caliente'}
    ICE={'en':'iced','th':'เย็น','zt':'冰','ru':'холодный','ko':'아이스','ja':'アイス','hi':'ठंडा','ms':'sejuk','id':'dingin','lo':'ເຢັນ','de':'eisgekühlt','fr':'glacé','it':'freddo','vi':'đá','km':'ត្រជាក់','fil':'malamig','ar':'مثلج','he':'קר','es':'frío'}
    for k in (HOT,ICE): k['zh']=T2S.convert(k['zt'])
    ENDESC={'c0.6':'lightly salted salmon, cream cheese','c0.7':'beef, rye bread, sour cream','c0.9':'salmon, potatoes, cream','c1.1':'Australian lamb','c1.2':'Australian beef','c1.3':'white wine sauce, broccoli'}
    secs=[]
    for ci,c in enumerate(A):
        sec=add_zh(dict(SEC[str(ci)]))
        items=[]
        for ii,it in enumerate(c['items'],1):
            did=f'c{ci}.{ii}'
            nn=add_zh(dict(names.get(did,{})))
            en=nn.get('en') or it['n'].strip()
            nn['en']=en
            if ci<=1 and 'ru' not in nn: nn['ru']=it['n'].strip()
            d={}
            if it['d'] or did in desc:
                if ci>1 and it['d']: d['en']=it['d'].strip()
                dd=add_zh(dict(desc.get(did,{})));d.update(dd)
                if ci<=1: d['ru']=it['d'].strip()
                if 'en' not in d and ci<=1 and d.get('ru'): d['en']=ENDESC.get(did,'')
            base_id=did.replace('.','_')
            ps=[x.strip() for x in str(it['p']).split('/')]
            if len(ps)==2:
                for suf,P,lab in (('h',ps[0],HOT),('i',ps[1],ICE)):
                    sn={lg:f"{nn.get(lg,en)} · {lab.get(lg,lab['en'])}" for lg in LANGS}
                    row={'id':base_id+'_'+suf,'n':sn['en'],'p':P,'sn':clean(sn)}
                    if d: row['d']=clean(d)
                    attach(row,did);items.append(row)
            else:
                row={'id':base_id,'n':en,'p':ps[0],'sn':clean(nn)}
                if d: row['d']=clean(d)
                attach(row,did);items.append(row)
        secs.append({'id':f's{ci}','t':clean(sec),'items':items})
    return secs

secs={'primo':build_primo,'mony':build_mony,'azur':build_azur}[WHICH]()
tag=META[{'primo':'TP','mony':'TM','azur':'TA'}[WHICH]];foot=META['F']
# hero
hero_ok=False
if HERO:
    hp=src_path(HERO)
    if os.path.exists(hp):
        im=Image.open(hp).convert('RGB');im=tone(im)
        W,H=im.size
        cover(im,2000,1125,.5).save(OUT+'/hero.webp','WEBP',quality=74,method=6)
        cover(im,1100,1600,.5).save(OUT+'/hero-m.webp','WEBP',quality=72,method=6);hero_ok=True
cfg={'slug':SLUG,'demo':True,'currency':'฿','langs':LANGS,'defaultLang':'en','origLang':'en','staffLang':'en','localTitles':True,'photoOne':True,'thumbs':True,'cards':True,'photoHD':True,'tapHint':False,'spice':False,
     'tagline':tag,'footnote':foot,'sections':secs}
if hero_ok: cfg['heroMobile']='hero-m.webp?v=1';cfg['heroWide']='hero.webp?v=1'
if WHICH=='primo':
    cfg.update({'name':'Primo Bistro & Wine Bar','wordmark':'Primo','wordmarkSub':'Bistro & Wine Bar · Jomtien'})
    cfg['plus']={'cards':True,'depth':False,'styles':False,'hero3d':False,'theme':'trattoria','layout':'large','featured':FEAT,'crops':FEAT,
      'info':{'hours':[['12:00','23:00']]*7,'utc':7,'address':'413/35 Thappraya Rd, Jomtien, Pattaya 20150','phone':'+66812435607','maps':'https://www.google.com/maps/place/?q=place_id:ChIJsx06dTOXAjERY0yohVa6VSg'}}
elif WHICH=='azur':
    cfg.update({'name':'AZUR Restaurant & Lounge','wordmark':'AZUR','wordmarkSub':'Restaurant & Lounge · Jomtien'})
    cfg['plus']={'cards':True,'depth':False,'styles':False,'hero3d':False,'theme':'ivoire','layout':'large','featured':[f.replace('.','_') for f in FEAT],'crops':[f.replace('.','_') for f in FEAT],
      'info':{'hours':[['11:00','22:00']]*7,'utc':7,'address':'Seven Seas Côte d\'Azur, Na Jomtien, Pattaya','phone':'+66946580105','maps':'https://maps.app.goo.gl/6BqnJsn1rBHX2g9j9','instagram':'https://www.instagram.com/azur_restaurant_th/'}}
else:
    cfg.update({'name':'Chez Mony','wordmark':'Chez Mony','wordmarkSub':'Pattaya · Jomtien'})
    cfg['plus']={'cards':True,'depth':False,'styles':False,'hero3d':False,'theme':'bistro','layout':'large','featured':FEAT,'crops':FEAT,
      'info':{'hours':[None,['09:00','24:00'],['09:00','24:00'],['09:00','24:00'],['09:00','24:00'],['09:00','24:00'],['09:00','24:00']],'utc':7,'address':'Pattaya, Bang Lamung District, Chon Buri 20150','phone':'+66959246204','maps':'https://maps.app.goo.gl/cCaX3ZmLDL7cTHLF9','instagram':'https://www.instagram.com/chezmonyrestaurant/'}}
js='/* '+cfg['name']+' — UNOFFICIAL prototype by NM Studio from the venue\'s public online menu */\nwindow.NM_MENU = '+json.dumps(cfg,ensure_ascii=False,separators=(',',':'))+';\n'
open(OUT+'/menu.js','w',encoding='utf8').write(js)
# credits file
cj=json.load(open(f'{PW}/cands_all.json'))
lines=['# Photo credits (illustrations, free licences — Wikimedia Commons, reviewed by eye)\n']
for k,ref in sorted(CRED.items()):
    if ref.startswith('lib:'):
        idx=json.load(open('/tmp/wp/d/index.json')).get('d/'+ref[4:]+'.jpg',{});lines.append(f"- {k}: {idx.get('title','')} — {idx.get('lic','')}")
    else:
        t,i=ref.rsplit('-',1);c=(cj.get(t) or [{}]*(int(i)+1))[int(i)]
        lines.append(f"- {k}: {c.get('title','')[5:]} — {c.get('au','')} — {c.get('lic','')} — https://commons.wikimedia.org/wiki/{c.get('title','').replace(' ','_')}")
open(OUT+'/CREDITS.md','w',encoding='utf8').write('\n'.join(lines)+'\n')
n=sum(len(s['items']) for s in secs);ph=sum(1 for s in secs for it in s['items'] if it.get('img'))
print(WHICH,'rows',n,'with photo',ph,'hero',hero_ok)
