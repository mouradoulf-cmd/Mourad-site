"""Builds the improved NM Studio film: grade (cool problem / warm solution), push-in zooms, captions,
phone cards, sound cues and an end card. Usage: python3 build.py <lang|site>"""
import subprocess, sys, os
D = os.path.dirname(os.path.abspath(__file__))
SRC = "/home/user/Mourad-site/media-sources/nm-film/film-v1-gemini-original.mp4"
lang = sys.argv[1]
site = lang == "site"
END = 4.5
TOTAL = 41.0 + END

COOL = "eq=saturation=0.74:brightness=-0.025:contrast=1.04,colorbalance=rs=-0.03:bs=0.05:rm=-0.02:bm=0.03"
WARM = "eq=saturation=1.12:contrast=1.05,colorbalance=rs=0.04:gs=0.01:bs=-0.04:rm=0.03:bm=-0.03"
SEGS = [(0, 11.4, COOL, 0), (11.4, 20.1, COOL, 0.07), (20.1, 31.5, COOL, 0.03), (31.5, 37.9, WARM, 0.08), (37.9, 41.0, WARM, 0.03)]
CAPS = [(0.6, 5.2), (5.4, 11.2), (11.7, 15.6), (15.8, 20.0), (20.3, 24.6), (24.8, 31.3), (31.7, 35.2), (35.4, 37.8), (38.1, 40.8)]
pfx = "site" if site else lang
CARDS = [(f"{pfx}-bad.png", 13.2, 19.8), (f"{pfx}-good.png", 32.2, 37.7)]

inputs = ["-i", SRC]
fc = []
# graded + zoomed segments
for i, (a, b, g, z) in enumerate(SEGS):
    d = b - a
    zoom = (f",scale=w='trunc(720*(1+{z}*t/{d:.2f})/2)*2':h=-2:eval=frame,crop=720:1280" if z else "")
    fc.append(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS,{g}{zoom},setsar=1[s{i}]")
fc.append("".join(f"[s{i}]" for i in range(len(SEGS))) + f"concat=n={len(SEGS)}:v=1:a=0,fps=24,format=yuv420p[main0]")
# end card
inputs += ["-loop", "1", "-t", str(END), "-i", f"{D}/ov/{pfx}-end.png"]
fc.append(f"[1:v]fps=24,scale=w='trunc(720*(1+0.04*t/{END})/2)*2':h=-2:eval=frame,crop=720:1280,fade=t=in:st=0:d=0.6,format=yuv420p,setsar=1[endv]")
fc.append("[main0][endv]concat=n=2:v=1:a=0,format=rgba[v0]")
last, n = "v0", 2
def add_overlay(png, t1, t2, slide=False):
    global last, n
    inputs.extend(["-loop", "1", "-t", f"{TOTAL}", "-i", f"{D}/ov/{png}"])
    fc.append(f"[{n}:v]format=rgba,fade=t=in:st={t1}:d=0.3:alpha=1,fade=t=out:st={t2 - 0.3:.2f}:d=0.3:alpha=1[o{n}]")
    y = f"'if(lt(t,{t1}+0.4),46*(1-(t-{t1})/0.4),0)'" if slide else "0"
    fc.append(f"[{last}][o{n}]overlay=x=0:y={y}:eval=frame:enable='between(t,{t1},{t2})'[v{n}]")
    last = f"v{n}"; n += 1
if not site:
    add_overlay("shade.png", 0.2, 41.0)
for png, t1, t2 in CARDS:
    add_overlay(png, t1, t2, slide=True)
if not site:
    for i, (t1, t2) in enumerate(CAPS):
        add_overlay(f"{lang}-cap{i + 1}.png", t1, t2)
fc.append(f"[{last}]format=yuv420p[vout]")

# audio: original ambience + subtle cues (soft "nope" on the empty search, bright "ding" on the menu, whoosh on the end card)
nope = "aevalsrc='0.22*sin(2*PI*330*t)*exp(-9*t)+0.22*sin(2*PI*262*(t-0.16))*exp(-9*(t-0.16))*gte(t,0.16)':d=0.7"
ding = "aevalsrc='0.20*sin(2*PI*1318*t)*exp(-5*t)+0.12*sin(2*PI*1975*t)*exp(-6*t)':d=1.2"
whoosh = "anoisesrc=d=0.9:c=pink:a=0.25,afade=t=in:d=0.45,afade=t=out:st=0.45:d=0.45,lowpass=f=1800"
fc.append(f"[0:a]apad=whole_dur={TOTAL},afade=t=out:st=40.4:d=0.6,volume=0.9[amb]")
fc.append(f"{nope},adelay=13300|13300,apad=whole_dur={TOTAL}[a1]")
fc.append(f"{ding},adelay=32300|32300,apad=whole_dur={TOTAL}[a2]")
fc.append(f"{whoosh},adelay=40700|40700,apad=whole_dur={TOTAL}[a3]")
fc.append("[amb][a1][a2][a3]amix=inputs=4:normalize=0,alimiter=limit=0.95[aout]")

out = f"{D}/out/nm-film-{lang}.mp4"
os.makedirs(f"{D}/out", exist_ok=True)
cmd = ["ffmpeg", "-loglevel", "error", "-y"] + inputs + ["-filter_complex", ";".join(fc), "-map", "[vout]", "-map", "[aout]",
       "-t", f"{TOTAL}", "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-profile:v", "high", "-pix_fmt", "yuv420p",
       "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-movflags", "+faststart", out]
subprocess.run(cmd, check=True)
print(out, os.path.getsize(out) // 1024, "KB")
