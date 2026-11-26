# Decisions after looking at the contact sheets. type -> candidate index. Re-run after every review round.
import json,sys
sys.path.insert(0,'/tmp/night/pw')
from dtypes_pm import TYPES
# ---- PRIMO: types accepted (candidate idx) ; dishes of a type come from dtypes_pm
PT={'bruschettaham':0,'caprese':0,'burrata':0,'hammelon':0,'springrolls':0,'satay':0,'tartare':0,'carpaccio_beef':0,'croquettes':0,
'mushroomsoup':0,'broccolisoup':0,'pumpkinsoup':0,'greensalad':0,'caesar':0,'caesarchicken':0,'salmonsalad':0,'glassnoodle':0,
'scampipasta':0,'bolognese':0,'carbonara':0,'seafoodspaghetti':0,'alfredo':0,'salmonpasta':0,'chickenparm':0,'aglioolio':0,'shrimpaglio':0,'lasagna':0,
'bakedpasta':0,'meatballs':0,'maccheese':0,'pennetomato':0,'pennesausage':0,'pennegorgonzola':0,'penneparma':0,'ravioli_cream':0,
'pz_hawaii':0,'pz_capricciosa':0,'pz_margherita':0,'pz_meat':0,'pz_pesto':0,'pz_napoli':0,'pz_seafood':0,'pz_salmon':0,'calzone':0,
'tenderloin':0,'ribeye':0,'picanha':0,'rump':0,'hamburger':0,'bbqburger':0,'gourmetburger':0,'bigburger':0,'schnitzel':0,'porkchop':0,'surfturf':0,
'grilledseafood':0,'seafoodtomato':0,'seabassfillet':0,'mussels':0,'massaman':0,'friedrice_cp':0,'panini':0,'paninichicken':0,'avotoast':0,
'hamcroissant':0,'blt':0,'grilledcheese':0,'tiramisu':0,'pannacotta':0,'brownie':0,'sparklingwater':0,'colaglass':0,'coffee':0,'tea':0,'beerbottles':0,
'thaibeer':0,'cider':0,'cocktails':0,'spirits_house':0,'cognac':0,'tequila':0,'redwine':0,'sparklingwine':0}
EXTRA_PT=json.load(open('/tmp/night/extra_pt.json')) if __import__('os').path.exists('/tmp/night/extra_pt.json') else {}
PT.update(EXTRA_PT.get('primo',{}))
primo={}
for t,i in PT.items():
    for did in TYPES.get(t,(0,0,[]))[2]:
        if did.startswith('primo:'): primo[did[6:]]=f'{t}-{i}'
primo.update({'th01':'lib:tomyum-1','th02':'lib:tomyum-0','th03':'lib:tomkha-1','th04':'lib:green-1','th05':'lib:green-0','th07':'lib:panang-0','th08':'lib:seabass3-0',
 'th10':'lib:cashew-0','th11':'lib:shrimpstir-0','th14':'lib:garlicshrimp-1','th16':'lib:padthai-0','th17':'lib:krapao-1','th19':'lib:sfrice-1'})
primo.update(EXTRA_PT.get('primo_dishes',{}))
primo['_featured']=EXTRA_PT.get('primo_featured',['st03','sf01','pz05','pa04','de02','s07'])
primo['_hero']=EXTRA_PT.get('primo_hero')
json.dump(primo,open('/tmp/night/picks_primo.json','w'),indent=0)
# ---- MONY
MT=EXTRA_PT.get('mony_types',{})
MD={'bf1':'englishbreakfast','bf2':'americanbreakfast','bf4':'omelette_cheese','bf5':'omelette_ham','bf6':'omelette_mush','bf7':'omelette_spinach','bf8':'tortilla','bf9':'boiledeggs','bf10':'croissant','bf11':'painauchocolat','bf12':'toastjam',
 'st2':'bruschetta','st3':'falafel','st4':'hummus','st5':'eggmayo','st6':'springrolls_fried','st8':'satay',
 'sa1':'tunasalad','sa2':'salmonsalad','sa3':'salad_shrimpavo','sa4':'friedchickensalad','sa5':'chickensalad','sa6':'chickenavo',
 'sw1':'sandwich_tuna','sw2':'sandwich_chicken','sw3':'merguez','sw4':'sandwich_hamcheese','sw5':'panini','sw6':'paninichicken','sw7':'paninibeef','sw8':'adana','sw9':'cheesekebab','sw10':'chickenkebab','sw11':'hamburger','sw12':'chickenburger',
 'mn1':'orangeduck','mn2':'steakhache','mn3':'tenderloin','mn4':'ribeye','mn5':'picanha','mn6':'bbqbeef','mn7':'bbqchicken','mn8':'beefgrill','mn9':'lambshank','mn10':'salmonsteak','mn11':'cordonbleu','mn12':'chickenbreast','mn13':'chickenparm','mn14':'hachis','mn15':'bourguignon','mn16':'basquaise','mn17':'merguezfries','mn18':'couscous','mn19':'lasagna',
 'pz1':'pz_margherita','pz2':'pz_pepperoni','pz3':'pz_4cheese','pz5':'pz_veg','pz6':'pz_hawaii','pz7':'pz_seafood','pz8':'pz_chicken',
 'pa1':'bolognese','pa2':'chickenspaghetti','pa3':'alfredo','pa6':'scampipasta',
 'th5':'glassnoodle','th7':'mamanoodles','th8':'morningglory','th13':'thaiomelet','th14':'friedrice_cp','th15':'friednoodleshrimp','th16':'vegoyster','th19':'massaman',
 'de1':'bananaflambe','de2':'tiramisu','de3':'mousse','de4':'cremecaramel','de5':'chocfondue','de6':'icecream','de9':'banoffee','de10':'bananasplit','de11':'fruitplate',
 'cf2':'espresso','cf3':'coffee','cf4':'latte','cf5':'hotchocolate','sd1':'juices','sd5':'sparklingwater','sd6':'colaglass','sd11':'bitterlemon',
 'bs1':'thaibeer','bs4':'beerbottles','bs6':'pastis','bs7':'limoncello','wi11':'redwine'}
ACC_M={'salad_shrimpavo':0,'chickensalad':0,'chickenavo':0,'sandwich_tuna':0,'sandwich_chicken':0,'adana':0,'chickenkebab':0,'orangeduck':0,'bbqbeef':0,'bourguignon':0,'basquaise':0,'merguezfries':0,'couscous':0,'mousse':0,'cremecaramel':0,'banoffee':0,'fruitplate':0,'espresso':0,'latte':0,'pastis':0,'limoncello':0,'mamanoodles':0,'morningglory':0,'thaiomelet':0,'friednoodleshrimp':0,
 'englishbreakfast':0,'americanbreakfast':0,'omelette_cheese':0,'omelette_ham':0,'omelette_spinach':0,'tortilla':0,'boiledeggs':0,'falafel':0,'hummus':0,
 # shared with primo (accepted there)
 'tunasalad':None,'salmonsalad':0,'satay':0,'panini':0,'paninichicken':0,'hamburger':0,'tenderloin':0,'ribeye':0,'picanha':0,'chickenparm':0,'lasagna':0,'pz_margherita':0,'pz_hawaii':0,'pz_seafood':0,'bolognese':0,'alfredo':0,'scampipasta':0,'glassnoodle':0,'massaman':0,'friedrice_cp':0,'tiramisu':0,'coffee':0,'sparklingwater':0,'colaglass':0,'thaibeer':0,'beerbottles':0,'redwine':0,'chickenbreast':None}
ACC_M.update(MT)
mony={}
for did,t in MD.items():
    i=ACC_M.get(t)
    if i is not None: mony[did]=f'{t}-{i}'
mony.update({'th2':'lib:krapao-1','th3':'lib:cashew-0','th4':'lib:panang-0','th10':'lib:tomkha-1','th11':'lib:green-1','th12':'lib:tomyum-0','th17':'lib:wings-1','th18':'lib:padthai-0'})
mony.update(EXTRA_PT.get('mony_dishes',{}))
mony['_featured']=EXTRA_PT.get('mony_featured',['mn1','mn18','bf1','pz1','de3','th18'])
mony['_hero']=EXTRA_PT.get('mony_hero')
json.dump(mony,open('/tmp/night/picks_mony.json','w'),indent=0)
print('primo picks',len([k for k in primo if not k.startswith('_')]),'| mony picks',len([k for k in mony if not k.startswith('_')]))
