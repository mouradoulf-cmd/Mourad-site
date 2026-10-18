"""NM Studio film v3: assembles the three Gemini takes into one complete story, then grades, zooms,
captions, phone card, sound cues and end card. Usage: python3 build2.py <fr|en|th|site>"""
import subprocess, sys, os
D = os.path.dirname(os.path.abspath(__file__))
UP = "/root/.claude/uploads/561857c8-0286-5d7b-98e6-c0c358784b67"
SRC = {
    "B": f"{UP}/53b1e9cf-gemini_generated_video_2BD73623.mp4",   # common opening + new sofa/website scene
    "A": f"{UP}/2434d335-gemini_generated_video_48456284.mp4",   # night exterior ending
    "V": "/home/user/Mourad-site/media-sources/nm-film/film-v1-gemini-original.mp4",  # QR scene + owner smile
}
lang = sys.argv[1]
site = lang == "site"
END = 4.5
COOL = "eq=saturation=0.74:brightness=-0.025:contrast=1.04,colorbalance=rs=-0.03:bs=0.05:rm=-0.02:bm=0.03"
WARM = "eq=saturation=1.12:contrast=1.05,colorbalance=rs=0.04:gs=0.01:bs=-0.04:rm=0.03:bm=-0.03"
NIGHT = "eq=saturation=1.08:contrast=1.06,colorbalance=rs=0.03:bs=-0.02"
# (source, start, end, grade, zoom)
SEGS = [
    ("B", 2.0, 11.4167, COOL, 0.03),     # empty restaurant
    ("B", 11.4167, 20.125, COOL, 0.07),  # tourists search, nothing
    ("B", 20.125, 30.125, COOL, 0.02),   # paper menu, hesitation
    ("B", 30.125, 30.96, COOL, 0),       # evening, sofa
    ("B", 32.46, 41.0, WARM, 0),         # the new website with food photos
    ("V", 31.0417, 37.9583, WARM, 0.06), # full restaurant, QR menu
    ("V", 37.9583, 41.0, WARM, 0.03),    # owner smiles
    ("A", 30.96, 41.0, NIGHT, 0),        # night exterior, crane out
]
starts, t = [], 0.0
for s in SEGS:
    starts.append(t); t += s[2] - s[1]
BODY = t
TOTAL = BODY + END
S = starts  # segment start times on the final timeline

CAPS = [  # (cap index 1-12, start, end) on the final timeline
    (1, 0.3, 3.5), (2, 3.7, 9.2), (3, S[1] + 0.3, S[1] + 4.2), (4, S[1] + 4.4, S[2] - 0.1),
    (5, S[2] + 0.2, S[2] + 4.5), (6, S[2] + 4.7, S[3] + 0.8), (7, S[4] + 0.1, S[4] + 4.0), (8, S[4] + 4.2, S[5] - 0.1),
    (9, S[5] + 0.2, S[6] - 0.1), (10, S[6] + 0.1, S[7] - 0.1), (11, S[7] + 0.3, S[7] + 5.0), (12, S[7] + 5.2, BODY - 0.2),
]
pfx = "site" if site else lang
CARDS = [(f"{pfx}-bad.png", S[1] + 1.8, S[1] + 8.4), (f"{pfx}-good.png", S[5] + 0.6, S[6] - 0.2)]

order = ["B", "V", "A"]
inputs = []
for k in order: inputs += ["-i", SRC[k]]
idx = {k: i for i, k in enumerate(order)}
fc = []
for i, (src, a, b, g, z) in enumerate(SEGS):
    d = b - a
    zoom = (f",scale=w='trunc(720*(1+{z}*t/{d:.2f})/2)*2':h=-2:eval=frame,crop=720:1280" if z else "")
    fc.append(f"[{idx[src]}:v]trim={a}:{b},setpts=PTS-STARTPTS,fps=24,{g}{zoom},setsar=1,format=yuv420p[s{i}]")
    fc.append(f"[{idx[src]}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:d=0.08,afade=t=out:st={max(0, d - 0.12):.3f}:d=0.12[sa{i}]")
n_in = len(order)
inputs += ["-loop", "1", "-t", str(END), "-i", f"{D}/ov/{pfx}-end.png"]
fc.append(f"[{n_in}:v]fps=24,scale=w='trunc(720*(1+0.04*t/{END})/2)*2':h=-2:eval=frame,crop=720:1280,fade=t=in:st=0:d=0.6,format=yuv420p,setsar=1[endv]")
fc.append(f"anullsrc=r=48000:cl=stereo,atrim=0:{END}[enda]")
k = len(SEGS)
fc.append("".join(f"[s{i}][sa{i}]" for i in range(k)) + f"[endv][enda]concat=n={k + 1}:v=1:a=1[v0][a0]")
fc.append("[v0]format=rgba[vv0]")
last, n = "vv0", n_in + 1
def add_overlay(png, t1, t2, slide=False):
    global last, n
    inputs.extend(["-loop", "1", "-t", f"{TOTAL:.2f}", "-i", f"{D}/ov/{png}"])
    fc.append(f"[{n}:v]format=rgba,fade=t=in:st={t1:.2f}:d=0.3:alpha=1,fade=t=out:st={t2 - 0.3:.2f}:d=0.3:alpha=1[o{n}]")
    y = f"'if(lt(t,{t1:.2f}+0.4),46*(1-(t-{t1:.2f})/0.4),0)'" if slide else "0"
    fc.append(f"[{last}][o{n}]overlay=x=0:y={y}:eval=frame:enable='between(t,{t1:.2f},{t2:.2f})'[w{n}]")
    last = f"w{n}"; n += 1
if not site:
    add_overlay("shade.png", 0.1, BODY)
for png, t1, t2 in CARDS:
    add_overlay(png, t1, t2, slide=True)
if not site:
    for ci, t1, t2 in CAPS:
        add_overlay(f"{lang}-cap{ci}.png", t1, t2)
fc.append(f"[{last}]format=yuv420p[vout]")

nope = "aevalsrc='0.22*sin(2*PI*330*t)*exp(-9*t)+0.22*sin(2*PI*262*(t-0.16))*exp(-9*(t-0.16))*gte(t,0.16)':d=0.7"
ding = "aevalsrc='0.20*sin(2*PI*1318*t)*exp(-5*t)+0.12*sin(2*PI*1975*t)*exp(-6*t)':d=1.2"
whoosh = "anoisesrc=d=0.9:c=pink:a=0.25,afade=t=in:d=0.45,afade=t=out:st=0.45:d=0.45,lowpass=f=1800"
ms = lambda x: int(x * 1000)
fc.append(f"[a0]volume=0.9,apad=whole_dur={TOTAL:.2f}[amb]")
fc.append(f"{nope},adelay={ms(S[1] + 1.9)}|{ms(S[1] + 1.9)},apad=whole_dur={TOTAL:.2f}[x1]")
fc.append(f"{ding},adelay={ms(S[4] + 0.2)}|{ms(S[4] + 0.2)},apad=whole_dur={TOTAL:.2f}[x2]")
fc.append(f"{ding},adelay={ms(S[5] + 0.7)}|{ms(S[5] + 0.7)},volume=0.7,apad=whole_dur={TOTAL:.2f}[x3]")
fc.append(f"{whoosh},adelay={ms(BODY - 0.3)}|{ms(BODY - 0.3)},apad=whole_dur={TOTAL:.2f}[x4]")
fc.append("[amb][x1][x2][x3][x4]amix=inputs=5:normalize=0,alimiter=limit=0.95[aout]")

out = f"{D}/out/nm-film3-{lang}.mp4"
os.makedirs(f"{D}/out", exist_ok=True)
cmd = ["ffmpeg", "-loglevel", "error", "-y"] + inputs + ["-filter_complex", ";".join(fc), "-map", "[vout]", "-map", "[aout]",
       "-t", f"{TOTAL:.2f}", "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-profile:v", "high", "-pix_fmt", "yuv420p",
       "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-movflags", "+faststart", out]
subprocess.run(cmd, check=True)
print(out, f"{TOTAL:.1f}s", os.path.getsize(out) // 1024, "KB", "starts", [round(x, 2) for x in S])
