"""Premium dish grade + crops for QR menus.
usage: python3 -I grade.py SRC_DIR CROPS_JSON OUT_DIR [name ...]
Per dish writes  <n>-c-800/1200.webp (4:5 card), <n>-w-1280/2048.webp (4:3 sheet), <n>.webp (720 square, legacy)
"""
import sys, json, os, numpy as np, cv2

SRC, CROPS, OUT = sys.argv[1:4]
only = set(sys.argv[4:])
crops = json.load(open(CROPS))
os.makedirs(OUT, exist_ok=True)


def grade(bgr):
    x = bgr.astype(np.float32) / 255.0
    # 1. gentle auto-levels (0.3% / 99.7% per luminance) so flat shots get real blacks & whites
    lum = 0.114 * x[..., 0] + 0.587 * x[..., 1] + 0.299 * x[..., 2]
    lo, hi = np.percentile(lum, [0.3, 99.7])
    lo = min(lo, 0.06); hi = max(hi, 0.985)
    x = np.clip((x - lo) / (hi - lo), 0, 1)
    # 2. warm "candle-light" balance: a touch more red/gold, less blue
    x[..., 2] *= 1.035; x[..., 1] *= 1.01; x[..., 0] *= 0.965
    x = np.clip(x, 0, 1)
    # 3. soft S-curve (contrast without crushing)
    s = 0.5 - 0.5 * np.cos(np.pi * x)
    x = 0.7 * x + 0.3 * s
    # 4. vibrance: boost unsaturated colours more than already-saturated ones
    hsv = cv2.cvtColor((x * 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
    sat = hsv[..., 1] / 255.0
    sat = np.clip(sat + 0.26 * sat * (1 - sat), 0, 1)
    hsv[..., 1] = sat * 255
    x = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32) / 255.0
    # 5. clarity: large-radius local contrast on luminance only
    lab = cv2.cvtColor((x * 255).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
    L = lab[..., 0]
    r = max(3, int(min(L.shape) * 0.012))
    blur = cv2.GaussianBlur(L, (0, 0), r)
    L = L + 0.22 * (L - blur)
    lab[..., 0] = np.clip(L, 0, 255)
    x = cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32) / 255.0
    # 6. subtle vignette (draws the eye to the plate)
    h, w = x.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    v = 1 - 0.16 * np.clip(d - 0.55, 0, 1) ** 1.6
    x = x * v[..., None]
    return (np.clip(x, 0, 1) * 255).astype(np.uint8)


def crop(img, cx, cy, aspect, side_hint):
    H, W = img.shape[:2]
    # largest crop of `aspect` (w/h) that still roughly frames what the curated square framed
    h = min(H, int(side_hint * 1.45)) if aspect < 1 else min(H, int(side_hint * 1.1))
    w = int(h * aspect)
    if w > W:
        w = W; h = int(w / aspect)
    x0 = int(np.clip(cx - w / 2, 0, W - w)); y0 = int(np.clip(cy - h / 2, 0, H - h))
    return img[y0:y0 + h, x0:x0 + w]


def save(img, path, width, q):
    h = int(round(img.shape[0] * width / img.shape[1]))
    r = cv2.resize(img, (width, h), interpolation=cv2.INTER_AREA)
    # output sharpening after downscale
    b = cv2.GaussianBlur(r, (0, 0), 0.8)
    r = cv2.addWeighted(r, 1.35, b, -0.35, 0)
    cv2.imwrite(path, r, [cv2.IMWRITE_WEBP_QUALITY, q])


for n, c in crops.items():
    if only and n not in only:
        continue
    img = cv2.imread(os.path.join(SRC, n + ".jpg"))
    g = grade(img)
    cx, cy, side = c["x"] + c["side"] / 2, c["y"] + c["side"] / 2, c["side"]
    card = crop(g, cx, cy, 4 / 5, side)
    wide = crop(g, c.get("wcx", cx), c.get("wcy", cy), 4 / 3, c.get("wside", side))
    sq = crop(g, cx, cy, 1, side / 1.1)
    save(card, f"{OUT}/{n}-c-800.webp", 800, 82)
    save(card, f"{OUT}/{n}-c-1200.webp", 1200, 80)
    save(wide, f"{OUT}/{n}-w-1280.webp", 1280, 82)
    save(wide, f"{OUT}/{n}-w-2048.webp", 2048, 80)
    save(sq, f"{OUT}/{n}.webp", 720, 84)
    cv2.imwrite(f"{OUT}/_full-{n}.jpg", cv2.resize(g, (1600, int(g.shape[0] * 1600 / g.shape[1]))), [cv2.IMWRITE_JPEG_QUALITY, 85])
    print(n, card.shape, wide.shape)
