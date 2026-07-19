#!/usr/bin/env python3
"""Generate printable QR codes for all ESC Wayfinder checkpoints.
Usage: python generate_qr.py https://your-domain.example/esc-wayfinder/
"""
import sys
from pathlib import Path
from urllib.parse import urlencode
import qrcode
from PIL import Image, ImageDraw, ImageFont

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://YOUR-DOMAIN.example/esc-wayfinder/"
OUT = Path(__file__).parent / "qr-codes"
OUT.mkdir(exist_ok=True)
points = [
    ("entrance", "مدخل الكلية"),
    ("first-floor", "الدور الأول"),
    ("corner", "نقطة الانعطاف"),
    ("corridor", "الممر الأخير"),
    ("destination", "مقر المركز"),
]
for pid, label in points:
    sep = '&' if '?' in BASE else '?'
    url = f"{BASE}{sep}{urlencode({'start': pid})}"
    qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=12, border=4)
    qr.add_data(url); qr.make(fit=True)
    img = qr.make_image(fill_color="#06295f", back_color="white").convert("RGB")
    img.save(OUT / f"qr-{pid}.png")
    (OUT / f"qr-{pid}.txt").write_text(url, encoding="utf-8")
print(f"Created {len(points)} QR codes in {OUT}")
