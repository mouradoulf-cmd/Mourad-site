# Pull every subagent hand-back JSON out of the session transcript and merge them into cands_all.json
import json,re,glob,os
T='/root/.claude/projects/-home-user-Mourad-site/6cd2a4ff-3cb3-5e36-8f4c-e71c271c0c73.jsonl'
out=json.load(open('/tmp/night/pw/cands_all.json')) if os.path.exists('/tmp/night/pw/cands_all.json') else {}
seen_agents=set(json.load(open('/tmp/night/pw/seen_agents.json'))) if os.path.exists('/tmp/night/pw/seen_agents.json') else set()
n=0
for line in open(T,encoding='utf8'):
    if 'Subagent hand-back' not in line: continue
    try: rec=json.loads(line)
    except Exception: continue
    s=json.dumps(rec,ensure_ascii=False)
    for m in re.finditer(r'agent-message from=\\?"([a-z0-9]+)\\?"',s):
        aid=m.group(1)
    # find all blocks: from="id" ... report follows: \n  {json}
    txt=rec if isinstance(rec,str) else json.dumps(rec,ensure_ascii=False)
    for blk in re.finditer(r'from=\\"([a-z0-9]+)\\">.*?The report follows:\\n  (\{.*?\})\\n</agent-message>',txt,re.S):
        aid,js=blk.group(1),blk.group(2)
        if aid in seen_agents: continue
        try:
            js=js.replace('\\"','"').replace('\\\\','\\')
            d=json.loads(js)
        except Exception as e:
            continue
        for k,v in d.items():
            if isinstance(v,list): out[k]=v
        seen_agents.add(aid);n+=1
json.dump(out,open('/tmp/night/pw/cands_all.json','w'),ensure_ascii=False,indent=0)
json.dump(sorted(seen_agents),open('/tmp/night/pw/seen_agents.json','w'))
print('new agent reports',n,'| types with candidates',sum(1 for v in out.values() if v),'| empty',[k for k,v in out.items() if not v])
