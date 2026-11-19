import subprocess
import os
import time

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out_dir = r"C:\Users\user\OneDrive\Desktop\FSD\report_assets"
os.makedirs(out_dir, exist_ok=True)

targets = [
    ("live_landing.png", "http://localhost:5173/", 2000),
    ("live_login.png", "http://localhost:5173/login", 2000),
    ("live_discovery.png", "http://localhost:5173/restaurants", 3000),
    ("live_floorplan.png", "http://localhost:5173/restaurants/6ad042c54486104814ba93b7", 4000),
    ("live_admin_dashboard.png", "http://localhost:5173/admin_autologin.html", 5000),
    ("live_virtual_queue.png", "http://localhost:5173/diner_autologin.html", 5000),
]

for filename, url, budget_ms in targets:
    out_path = os.path.join(out_dir, filename)
    cmd = [
        edge_path,
        "--headless=new",
        "--disable-gpu",
        f"--virtual-time-budget={budget_ms}",
        "--window-size=1400,900",
        f"--screenshot={out_path}",
        url
    ]
    print(f"Capturing {url} (budget: {budget_ms}ms) -> {filename}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_path):
        size = os.path.getsize(out_path)
        print(f" -> SUCCESS: {filename} ({size} bytes)")
    else:
        print(f" -> FAILED: {filename}")
