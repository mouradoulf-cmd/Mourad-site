"""Assemble les deux sites autonomes à partir du moteur commun.
   python3 build.py  →  iphone.html + pc.html"""
from pathlib import Path
here = Path(__file__).parent
engine = (here / "_engine.js").read_text()
for name in ("iphone", "pc"):
    tpl = (here / f"_{name}.tpl.html").read_text()
    (here / f"{name}.html").write_text(tpl.replace("{{ENGINE}}", engine))
    print("ok", name)
