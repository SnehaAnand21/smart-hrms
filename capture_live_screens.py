import subprocess
import os
import time

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out_dir = r"C:\Users\user\OneDrive\Desktop\FSD\report_assets"

pages = [
    ("live_landing.png", "http://localhost:5173/"),
    ("live_login.png", "http://localhost:5173/login"),
    ("live_restaurants.png", "http://localhost:5173/restaurants"),
    ("live_restaurant_detail.png", "http://localhost:5173/restaurants/6ad042c54486104814ba93b7"),
]

for filename, url in pages:
    out_path = os.path.join(out_dir, filename)
    cmd = [
        edge_path,
        "--headless=new",
        "--disable-gpu",
        "--window-size=1400,900",
        f"--screenshot={out_path}",
        url
    ]
    print(f"Capturing {url} -> {filename}...")
    subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_path):
        print(f"Captured {filename} ({os.path.getsize(out_path)} bytes)")
    else:
        print(f"Failed to capture {filename}")
