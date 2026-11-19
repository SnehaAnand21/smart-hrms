import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

output_dir = r'C:\Users\user\OneDrive\Desktop\FSD\report_assets'

# 1. SCREENSHOT 1: Customer Discovery & Search
fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Browser Header
ax.add_patch(patches.Rectangle((0, 93), 100, 7, fc="#1e293b"))
ax.add_patch(patches.Circle((3, 96.5), 1.2, fc="#ef4444"))
ax.add_patch(patches.Circle((6, 96.5), 1.2, fc="#f59e0b"))
ax.add_patch(patches.Circle((9, 96.5), 1.2, fc="#10b981"))
ax.add_patch(patches.Rectangle((15, 94.2), 70, 4.6, fc="#334155", ec="#475569"))
ax.text(50, 96.5, "https://smarthrms.dining.local/restaurants", color="#cbd5e1", fontsize=8, ha='center', va='center')

# Navbar
ax.add_patch(patches.Rectangle((0, 85), 100, 8, fc="#ffffff", ec="#e2e8f0"))
ax.text(5, 89, "🍽️ SmartHRMS", fontsize=12, fontweight='bold', color="#065f46", va='center')
ax.text(28, 89, "Explore Restaurants", fontsize=9, fontweight='bold', color="#047857", va='center')
ax.text(46, 89, "My Reservations", fontsize=9, color="#64748b", va='center')
ax.text(62, 89, "Virtual Queue", fontsize=9, color="#64748b", va='center')
ax.text(82, 89, "🔔 (2)", fontsize=9, color="#d97706", va='center')
ax.text(92, 89, "👤 Sneha.A", fontsize=9, fontweight='bold', color="#0f172a", va='center')

# Hero / Filter Header
ax.add_patch(patches.Rectangle((5, 68), 90, 14, fc="#064e3b", ec="none"))
ax.text(8, 77, "Real-Time Seat Availability & Smart Dining", fontsize=13, fontweight='bold', color="#ffffff")
ax.text(8, 72, "Instant table booking with live visual floor plans and virtual queuing", fontsize=8.5, color="#a7f3d0")

# Search Bar
ax.add_patch(patches.Rectangle((8, 59), 42, 6, fc="#ffffff", ec="#cbd5e1"))
ax.text(10, 62, "🔍 Search restaurant or cuisine...", fontsize=8, color="#94a3b8", va='center')
# Filters
cuisines = ["All Cuisines", "Italian", "Indian", "Japanese", "Continental"]
for i, c in enumerate(cuisines):
    bg = "#065f46" if i == 0 else "#f1f5f9"
    fg = "#ffffff" if i == 0 else "#334155"
    ax.add_patch(patches.FancyBboxPatch((52 + i*9.2, 59), 8.5, 6, boxstyle="round,pad=0.2", fc=bg, ec="#cbd5e1"))
    ax.text(52 + i*9.2 + 4.25, 62, c, fontsize=7.2, fontweight='bold', ha='center', va='center', color=fg)

# Restaurant Cards Grid
cards = [
    ("The Grand Bistro", "Fine Dining • Italian", "⭐ 4.8 (124)", "4 Tables Available Now", "#10b981", "#ecfdf5", "Book Live Table"),
    ("Spice Garden", "Indian & Mughlai", "⭐ 4.6 (98)", "Full • Queue Wait: 12 min", "#f59e0b", "#fffbeb", "Join Virtual Queue"),
    ("Sakura Sushi Bar", "Japanese & Asian", "⭐ 4.9 (210)", "2 Tables Available Now", "#10b981", "#ecfdf5", "Book Live Table"),
]

for idx, (name, tag, rat, stat, sbg, scard, btn) in enumerate(cards):
    cx = 5 + idx * 31
    # Card Body
    ax.add_patch(patches.FancyBboxPatch((cx, 8), 28, 48, boxstyle="round,pad=0.5", fc="#ffffff", ec="#e2e8f0", lw=1.2))
    # Image Placeholder
    ax.add_patch(patches.Rectangle((cx, 32), 28, 24, fc="#e2e8f0"))
    ax.text(cx + 14, 44, f"Photo: {name}", fontsize=8.5, color="#64748b", ha='center', va='center')
    # Details
    ax.text(cx + 2, 28, name, fontsize=9.5, fontweight='bold', color="#0f172a")
    ax.text(cx + 2, 24.5, tag, fontsize=7.5, color="#64748b")
    ax.text(cx + 2, 21, rat, fontsize=7.5, fontweight='bold', color="#d97706")
    # Live Status Badge
    ax.add_patch(patches.FancyBboxPatch((cx + 2, 14), 24, 5, boxstyle="round,pad=0.2", fc=scard, ec=sbg, lw=1))
    ax.text(cx + 14, 16.5, stat, fontsize=7.2, fontweight='bold', color=sbg, ha='center', va='center')
    # Action Button
    ax.add_patch(patches.FancyBboxPatch((cx + 2, 9), 24, 4.2, boxstyle="round,pad=0.2", fc="#065f46", ec="none"))
    ax.text(cx + 14, 11.1, btn, fontsize=7.5, fontweight='bold', color="#ffffff", ha='center', va='center')

plt.tight_layout()
fig.savefig(os.path.join(output_dir, 'screenshot_discovery.png'), bbox_inches='tight', dpi=300)
plt.close(fig)

# 2. SCREENSHOT 2: Live Floor Plan & Booking Modal
fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Browser Bar
ax.add_patch(patches.Rectangle((0, 93), 100, 7, fc="#1e293b"))
ax.add_patch(patches.Circle((3, 96.5), 1.2, fc="#ef4444"))
ax.add_patch(patches.Circle((6, 96.5), 1.2, fc="#f59e0b"))
ax.add_patch(patches.Circle((9, 96.5), 1.2, fc="#10b981"))
ax.text(50, 96.5, "https://smarthrms.dining.local/restaurant/grand-bistro/reserve", color="#cbd5e1", fontsize=8, ha='center', va='center')

# Left Side: Interactive Floor Plan
ax.add_patch(patches.FancyBboxPatch((4, 6), 56, 84, boxstyle="round,pad=0.5", fc="#ffffff", ec="#cbd5e1", lw=1.2))
ax.text(7, 86, "Interactive Dining Floor Plan - The Grand Bistro", fontsize=10, fontweight='bold', color="#0f172a")
ax.text(7, 82.5, "Live Updates Active • Select an available table to reserve", fontsize=7.5, color="#059669")

# Floor Layout Boundary
ax.add_patch(patches.Rectangle((7, 18), 50, 61, fc="#f8fafc", ec="#94a3b8", lw=1.5, linestyle='--'))
ax.text(32, 75, "[ DINING HALL MAIN ENTRANCE ]", fontsize=7.5, fontweight='bold', ha='center', color="#64748b")

# Tables Grid on Floor Plan
tbls = [
    ("T-01 (4p)", 12, 56, "#10b981", "#ecfdf5", "AVAILABLE"),
    ("T-02 (2p)", 24, 56, "#ef4444", "#fef2f2", "OCCUPIED"),
    ("T-03 (4p)", 36, 56, "#10b981", "#ecfdf5", "AVAILABLE"),
    ("T-04 (6p)", 12, 38, "#8b5cf6", "#f5f3ff", "RESERVED"),
    ("T-05 (4p)", 24, 38, "#f59e0b", "#fffbeb", "HELD (15m)"),
    ("T-06 (2p)", 36, 38, "#10b981", "#ecfdf5", "AVAILABLE"),
    ("T-07 (8p VIP)", 14, 22, "#10b981", "#ecfdf5", "SELECTED"),
    ("T-08 (4p)", 34, 22, "#ef4444", "#fef2f2", "OCCUPIED"),
]

for name, tx, ty, col, bg, st in tbls:
    w, h = 9, 10
    ecol = "#047857" if st == "SELECTED" else col
    elw = 2.5 if st == "SELECTED" else 1.2
    ax.add_patch(patches.FancyBboxPatch((tx, ty), w, h, boxstyle="round,pad=0.3", fc=bg, ec=ecol, lw=elw))
    ax.text(tx + w/2, ty + h*0.65, name, fontsize=7.2, fontweight='bold', ha='center', color="#0f172a")
    ax.text(tx + w/2, ty + h*0.25, st, fontsize=6.2, fontweight='bold', ha='center', color=col)

# Legend
ax.text(7, 11, "Legend:  🟢 Available   🔴 Occupied   🟣 Reserved   🟡 Held (Waitlist)   ⭐ Selected", fontsize=7.5, color="#334155")

# Right Side: Reservation Modal
ax.add_patch(patches.FancyBboxPatch((63, 6), 33, 84, boxstyle="round,pad=0.5", fc="#ffffff", ec="#059669", lw=1.8))
ax.text(66, 86, "Confirm Reservation", fontsize=11, fontweight='bold', color="#065f46")
ax.text(66, 82.5, "Table T-07 • VIP Banquet Table", fontsize=8, color="#64748b")

form_fields = [
    ("Date of Dining", "Today, 15 Oct 2026"),
    ("Time Slot (2-Hour Window)", "19:00 - 21:00 (Dinner Peak)"),
    ("Number of Guests", "6 Guests (Capacity: 8)"),
    ("Customer Name", "Sneha.A"),
    ("Contact Phone", "+91 98765 43210"),
    ("Special Requests", "Window view preferred"),
]

for i, (lbl, val) in enumerate(form_fields):
    fy = 72 - i * 10
    ax.text(66, fy+4, lbl, fontsize=7.5, fontweight='bold', color="#334155")
    ax.add_patch(patches.FancyBboxPatch((66, fy-1), 27, 4.5, boxstyle="round,pad=0.2", fc="#f8fafc", ec="#cbd5e1"))
    ax.text(68, fy+1.2, val, fontsize=7.2, color="#0f172a")

# Button
ax.add_patch(patches.FancyBboxPatch((66, 12), 27, 6, boxstyle="round,pad=0.3", fc="#059669", ec="none"))
ax.text(79.5, 15, "Confirm Booking (Free Hold)", fontsize=8.5, fontweight='bold', color="#ffffff", ha='center', va='center')

plt.tight_layout()
fig.savefig(os.path.join(output_dir, 'screenshot_floorplan.png'), bbox_inches='tight', dpi=300)
plt.close(fig)

# 3. SCREENSHOT 3: Virtual Queue & Live In-App Notifications
fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Browser Bar
ax.add_patch(patches.Rectangle((0, 93), 100, 7, fc="#1e293b"))
ax.add_patch(patches.Circle((3, 96.5), 1.2, fc="#ef4444"))
ax.add_patch(patches.Circle((6, 96.5), 1.2, fc="#f59e0b"))
ax.add_patch(patches.Circle((9, 96.5), 1.2, fc="#10b981"))
ax.text(50, 96.5, "https://smarthrms.dining.local/queue/live-tracker", color="#cbd5e1", fontsize=8, ha='center', va='center')

# Left Card: Virtual Queue Live Pass
ax.add_patch(patches.FancyBboxPatch((5, 10), 45, 78, boxstyle="round,pad=0.6", fc="#ffffff", ec="#e2e8f0", lw=1.5))
ax.add_patch(patches.Rectangle((5, 75), 45, 13, fc="#065f46"))
ax.text(27.5, 82, "VIRTUAL QUEUE PASS", fontsize=11, fontweight='bold', color="#ffffff", ha='center')
ax.text(27.5, 77.5, "Spice Garden Restaurant", fontsize=8, color="#a7f3d0", ha='center')

# Circular Position Indicator
circle_q = plt.Circle((27.5, 56), 12, fc="#ecfdf5", ec="#10b981", lw=3)
ax.add_patch(circle_q)
ax.text(27.5, 59, "QUEUE POSITION", fontsize=7.2, fontweight='bold', color="#065f46", ha='center')
ax.text(27.5, 53, "#02", fontsize=22, fontweight='bold', color="#047857", ha='center')

# Metrics
ax.text(12, 38, "Party Size: 4 Diners", fontsize=8, fontweight='bold', color="#1e293b")
ax.text(12, 34, "Joined At: 19:15 PM", fontsize=8, color="#64748b")
ax.text(12, 30, "Estimated Wait: ~10 - 15 Mins", fontsize=8.5, fontweight='bold', color="#d97706")
ax.text(12, 26, "Algorithm: Dynamic Dining Turnover FIFO", fontsize=7.5, color="#64748b")

# Status Alert
ax.add_patch(patches.FancyBboxPatch((8, 17), 39, 6.5, boxstyle="round,pad=0.2", fc="#eff6ff", ec="#3b82f6"))
ax.text(27.5, 20.2, "ℹ️ You are 2nd in line. You will be alerted via push notification.", fontsize=7.2, color="#1e40af", ha='center')

# Right Card: Real-Time Notification Center
ax.add_patch(patches.FancyBboxPatch((54, 10), 42, 78, boxstyle="round,pad=0.6", fc="#ffffff", ec="#e2e8f0", lw=1.5))
ax.text(57, 82, "Notification Center", fontsize=11, fontweight='bold', color="#0f172a")
ax.text(88, 82, "Mark All Read", fontsize=7.5, color="#059669", fontweight='bold')

notifs = [
    ("🟢 Table Ready Alert!", "Table T-03 (4 seats) at Spice Garden is now ready for your party. Please report to hostess within 10 mins.", "Just now", "#ecfdf5", "#059669"),
    ("🎉 Reservation Confirmed", "Booking #BK-78901 confirmed for The Grand Bistro today at 19:00 PM for Table T-07.", "15m ago", "#f8fafc", "#64748b"),
    ("⏳ Queue Position Advanced", "You moved from position #3 to #2. Estimated wait reduced to 12 minutes.", "28m ago", "#f8fafc", "#64748b"),
    ("📢 Table Status Broadcast", "Table T-01 released by prior party and is currently being sanitized.", "1h ago", "#f8fafc", "#64748b"),
]

for i, (title, desc, tm, bg, bc) in enumerate(notifs):
    ny = 63 - i * 14.5
    ax.add_patch(patches.FancyBboxPatch((57, ny), 36, 12.5, boxstyle="round,pad=0.3", fc=bg, ec="#e2e8f0", lw=1))
    ax.text(59, ny + 9.5, title, fontsize=8, fontweight='bold', color=bc)
    ax.text(90, ny + 9.5, tm, fontsize=6.8, color="#94a3b8", ha='right')
    ax.text(59, ny + 5.5, desc[:52] + "...", fontsize=6.8, color="#475569")
    ax.text(59, ny + 2, desc[52:105], fontsize=6.8, color="#475569")

plt.tight_layout()
fig.savefig(os.path.join(output_dir, 'screenshot_queue.png'), bbox_inches='tight', dpi=300)
plt.close(fig)

# 4. SCREENSHOT 4: Admin Dashboard & Live Management
fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Browser Bar
ax.add_patch(patches.Rectangle((0, 93), 100, 7, fc="#1e293b"))
ax.add_patch(patches.Circle((3, 96.5), 1.2, fc="#ef4444"))
ax.add_patch(patches.Circle((6, 96.5), 1.2, fc="#f59e0b"))
ax.add_patch(patches.Circle((9, 96.5), 1.2, fc="#10b981"))
ax.text(50, 96.5, "https://smarthrms.dining.local/admin/dashboard", color="#cbd5e1", fontsize=8, ha='center', va='center')

# Admin Sidebar
ax.add_patch(patches.Rectangle((0, 0), 18, 93, fc="#0f172a"))
ax.text(9, 87, "SmartHRMS", fontsize=10, fontweight='bold', color="#ffffff", ha='center')
ax.text(9, 83, "Admin Portal", fontsize=7.5, color="#10b981", ha='center')

menu_items = ["📊 Live Dashboard", "🪑 Floor & Tables", "📅 Bookings (18)", "👥 Virtual Queue (4)", "📈 Analytics Reports", "⚙️ Restaurant Config"]
for i, m in enumerate(menu_items):
    ax.text(4, 73 - i*8, m, fontsize=7.5, color="#f8fafc" if i==0 else "#94a3b8", fontweight='bold' if i==0 else 'normal')

# Header KPI Metrics
kpis = [
    ("Total Tables", "8 Tables", "#3b82f6", "#eff6ff"),
    ("Available Now", "3 Tables (38%)", "#10b981", "#ecfdf5"),
    ("Occupied", "4 Tables (50%)", "#ef4444", "#fef2f2"),
    ("In Virtual Queue", "4 Parties (16 Diners)", "#f59e0b", "#fffbeb"),
]

for idx, (title, val, bc, bg) in enumerate(kpis):
    kx = 21 + idx * 19.2
    ax.add_patch(patches.FancyBboxPatch((kx, 73), 18, 15, boxstyle="round,pad=0.3", fc=bg, ec=bc, lw=1.2))
    ax.text(kx + 2, 83.5, title, fontsize=7.2, color="#64748b", fontweight='bold')
    ax.text(kx + 2, 77.5, val, fontsize=8.5, fontweight='bold', color=bc)

# Live Table Management Grid
ax.add_patch(patches.FancyBboxPatch((21, 8), 44, 60, boxstyle="round,pad=0.5", fc="#ffffff", ec="#e2e8f0", lw=1.2))
ax.text(23, 63, "Real-Time Table State Controller (Socket.IO Connected)", fontsize=8.5, fontweight='bold', color="#0f172a")

admin_tables = [
    ("T-01", "4 Seats", "AVAILABLE", "#10b981", "Mark Occupied"),
    ("T-02", "2 Seats", "OCCUPIED", "#ef4444", "Release / Free"),
    ("T-03", "4 Seats", "AVAILABLE", "#10b981", "Mark Occupied"),
    ("T-04", "6 Seats", "RESERVED", "#8b5cf6", "Seat Guest"),
    ("T-05", "4 Seats", "HELD (Queue)", "#f59e0b", "Seat From Queue"),
    ("T-06", "2 Seats", "AVAILABLE", "#10b981", "Mark Occupied"),
]

for i, (tname, cap, st, col, act) in enumerate(admin_tables):
    ty = 53 - i * 7.5
    ax.add_patch(patches.Rectangle((23, ty), 40, 6.2, fc="#f8fafc", ec="#cbd5e1"))
    ax.text(25, ty + 3.1, f"{tname} ({cap})", fontsize=7.5, fontweight='bold', color="#0f172a", va='center')
    ax.text(42, ty + 3.1, st, fontsize=7, fontweight='bold', color=col, va='center')
    ax.add_patch(patches.FancyBboxPatch((50, ty + 1.2), 12, 3.8, boxstyle="round,pad=0.1", fc="#0f172a", ec="none"))
    ax.text(56, ty + 3.1, act, fontsize=6.2, color="#ffffff", ha='center', va='center')

# Right Side: Occupancy Trends & Queue Stream
ax.add_patch(patches.FancyBboxPatch((68, 8), 28, 60, boxstyle="round,pad=0.5", fc="#ffffff", ec="#e2e8f0", lw=1.2))
ax.text(70, 63, "Hourly Dining Occupancy", fontsize=8.5, fontweight='bold', color="#0f172a")

# Mini Bar Chart
hours = ["12p", "2p", "4p", "6p", "8p", "10p"]
vals = [40, 75, 30, 85, 100, 60]
for idx, (h, v) in enumerate(zip(hours, vals)):
    bx = 71 + idx * 4.1
    bh = (v / 100) * 18
    ax.add_patch(patches.Rectangle((bx, 38), 3.2, bh, fc="#059669" if v >= 80 else "#3b82f6"))
    ax.text(bx + 1.6, 35, h, fontsize=6.5, ha='center', color="#64748b")

ax.text(70, 30, "Active Queue Waitlist:", fontsize=7.5, fontweight='bold', color="#0f172a")
ax.text(70, 25, "1. John Doe (2p) - Waited 8m", fontsize=7, color="#334155")
ax.text(70, 20.5, "2. Sneha.A (4p) - Waited 4m", fontsize=7, fontweight='bold', color="#047857")
ax.text(70, 16, "3. Priya K (3p) - Waited 2m", fontsize=7, color="#334155")
ax.text(70, 11.5, "4. Vikram S (6p) - Just Joined", fontsize=7, color="#334155")

plt.tight_layout()
fig.savefig(os.path.join(output_dir, 'screenshot_admin.png'), bbox_inches='tight', dpi=300)
plt.close(fig)

print("All 4 UI Screenshots generated successfully in report_assets directory!")
