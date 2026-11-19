import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs(r'C:\Users\user\OneDrive\Desktop\FSD\report_assets', exist_ok=True)
output_dir = r'C:\Users\user\OneDrive\Desktop\FSD\report_assets'

# Set font family
plt.rcParams['font.family'] = 'DejaVu Sans'

# 1. SYSTEM ARCHITECTURE DIAGRAM
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Title
ax.text(50, 96, "Smart Hospitality Management System - 3-Tier Architecture", 
        fontsize=14, fontweight='bold', ha='center', va='center', color='#1e293b')

# Tier 1: Presentation Layer
rect1 = patches.FancyBboxPatch((5, 68), 90, 22, boxstyle="round,pad=1", ec="#059669", fc="#ecfdf5", lw=2)
ax.add_patch(rect1)
ax.text(8, 86, "PRESENTATION TIER (CLIENT - REACT / VITE)", fontsize=11, fontweight='bold', color="#065f46")

# Components in Presentation
c1 = patches.FancyBboxPatch((8, 70), 25, 13, boxstyle="round,pad=0.5", ec="#10b981", fc="#ffffff", lw=1.5)
ax.add_patch(c1)
ax.text(20.5, 78, "Customer Web App", fontsize=9.5, fontweight='bold', ha='center', color="#1e293b")
ax.text(20.5, 73, "Discovery • Floor Plan • Booking\nVirtual Queue • Notifications", fontsize=7.5, ha='center', color="#475569")

c2 = patches.FancyBboxPatch((37.5, 70), 25, 13, boxstyle="round,pad=0.5", ec="#10b981", fc="#ffffff", lw=1.5)
ax.add_patch(c2)
ax.text(50, 78, "Admin Portal", fontsize=9.5, fontweight='bold', ha='center', color="#1e293b")
ax.text(50, 73, "Live Table Control • Queue Ops\nOccupancy Analytics • Audit", fontsize=7.5, ha='center', color="#475569")

c3 = patches.FancyBboxPatch((67, 70), 25, 13, boxstyle="round,pad=0.5", ec="#10b981", fc="#ffffff", lw=1.5)
ax.add_patch(c3)
ax.text(79.5, 78, "State & Socket Client", fontsize=9.5, fontweight='bold', ha='center', color="#1e293b")
ax.text(79.5, 73, "AuthContext • Socket.io Client\nAxios HTTP Interceptors", fontsize=7.5, ha='center', color="#475569")

# Communication Arrows 1 <-> 2
ax.annotate("", xy=(30, 48), xytext=(30, 68), arrowprops=dict(arrowstyle="<->", color="#0284c7", lw=2))
ax.text(32, 58, "REST API (JSON over HTTPS)", fontsize=8, color="#0284c7", fontweight='bold')

ax.annotate("", xy=(70, 48), xytext=(70, 68), arrowprops=dict(arrowstyle="<->", color="#d97706", lw=2))
ax.text(72, 58, "WebSockets (Socket.IO bi-directional)", fontsize=8, color="#d97706", fontweight='bold')

# Tier 2: Application / Business Logic Layer
rect2 = patches.FancyBboxPatch((5, 27), 90, 22, boxstyle="round,pad=1", ec="#2563eb", fc="#eff6ff", lw=2)
ax.add_patch(rect2)
ax.text(8, 45, "APPLICATION TIER (SERVER - NODE.JS & EXPRESS)", fontsize=11, fontweight='bold', color="#1e40af")

b1 = patches.FancyBboxPatch((8, 29), 20, 13, boxstyle="round,pad=0.5", ec="#3b82f6", fc="#ffffff", lw=1.5)
ax.add_patch(b1)
ax.text(18, 37, "API Controllers", fontsize=9, fontweight='bold', ha='center', color="#1e293b")
ax.text(18, 32, "Auth • Table • Booking\nQueue • Notifications", fontsize=7.5, ha='center', color="#475569")

b2 = patches.FancyBboxPatch((31, 29), 20, 13, boxstyle="round,pad=0.5", ec="#3b82f6", fc="#ffffff", lw=1.5)
ax.add_patch(b2)
ax.text(41, 37, "Booking Engine", fontsize=9, fontweight='bold', ha='center', color="#1e293b")
ax.text(41, 32, "Atomic Collision Check\n2-Hr Slot Window Logic", fontsize=7.5, ha='center', color="#475569")

b3 = patches.FancyBboxPatch((54, 29), 20, 13, boxstyle="round,pad=0.5", ec="#3b82f6", fc="#ffffff", lw=1.5)
ax.add_patch(b3)
ax.text(64, 37, "Queue & Wait Engine", fontsize=9, fontweight='bold', ha='center', color="#1e293b")
ax.text(64, 32, "FIFO Party Allocation\nWait Time Estimator", fontsize=7.5, ha='center', color="#475569")

b4 = patches.FancyBboxPatch((77, 29), 16, 13, boxstyle="round,pad=0.5", ec="#3b82f6", fc="#ffffff", lw=1.5)
ax.add_patch(b4)
ax.text(85, 37, "Socket Broker", fontsize=9, fontweight='bold', ha='center', color="#1e293b")
ax.text(85, 32, "Real-Time Floor\nBroadcaster", fontsize=7.5, ha='center', color="#475569")

# Communication Arrows 2 <-> 3
ax.annotate("", xy=(50, 17), xytext=(50, 27), arrowprops=dict(arrowstyle="<->", color="#059669", lw=2))
ax.text(52, 22, "Mongoose ODM / TCP Wire Protocol", fontsize=8.5, color="#059669", fontweight='bold')

# Tier 3: Data Tier
rect3 = patches.FancyBboxPatch((5, 3), 90, 14, boxstyle="round,pad=1", ec="#7c3aed", fc="#f5f3ff", lw=2)
ax.add_patch(rect3)
ax.text(8, 14, "DATA PERSISTENCE TIER (MONGODB ATLAS DATABASE)", fontsize=11, fontweight='bold', color="#5b21b6")

dbs = ["Users Collection", "Restaurants", "Tables (Live Status)", "Bookings (Slots)", "Virtual Queues", "Notifications"]
for i, db in enumerate(dbs):
    bx = patches.FancyBboxPatch((8 + i*14.5, 4.5), 13.5, 7.5, boxstyle="round,pad=0.3", ec="#8b5cf6", fc="#ffffff", lw=1.2)
    ax.add_patch(bx)
    ax.text(8 + i*14.5 + 6.75, 8.2, db, fontsize=7.5, fontweight='bold', ha='center', va='center', color="#2e1065")

plt.tight_layout()
fig.savefig(os.path.join(output_dir, 'diagram_architecture.png'), bbox_inches='tight', dpi=300)
plt.close(fig)

# 2. USE CASE DIAGRAM
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(50, 96, "Smart Hospitality Management System - Use Case Diagram", 
        fontsize=14, fontweight='bold', ha='center', va='center', color='#1e293b')

# Actor 1: Customer
ax.plot([12, 12], [65, 75], color='#0f172a', lw=2) # body
ax.plot([7, 17], [70, 70], color='#0f172a', lw=2) # arms
ax.plot([12, 7], [65, 57], color='#0f172a', lw=2) # left leg
ax.plot([12, 17], [65, 57], color='#0f172a', lw=2) # right leg
circle1 = plt.Circle((12, 78), 3, color='#0f172a', fill=False, lw=2)
ax.add_patch(circle1)
ax.text(12, 52, "Customer / Diner", fontsize=10, fontweight='bold', ha='center', color='#0f172a')

# Actor 2: Restaurant Admin / Staff
ax.plot([88, 88], [65, 75], color='#0f172a', lw=2) # body
ax.plot([83, 93], [70, 70], color='#0f172a', lw=2) # arms
ax.plot([88, 83], [65, 57], color='#0f172a', lw=2) # left leg
ax.plot([88, 93], [65, 57], color='#0f172a', lw=2) # right leg
circle2 = plt.Circle((88, 78), 3, color='#0f172a', fill=False, lw=2)
ax.add_patch(circle2)
ax.text(88, 52, "Restaurant Admin", fontsize=10, fontweight='bold', ha='center', color='#0f172a')

# Boundary Box (System Boundary)
boundary = patches.FancyBboxPatch((24, 5), 52, 86, boxstyle="round,pad=1", ec="#94a3b8", fc="#f8fafc", lw=2, linestyle='--')
ax.add_patch(boundary)
ax.text(50, 88, "HRMS System Boundary", fontsize=11, fontweight='bold', ha='center', color='#334155')

# Customer Use Cases (Ellipses)
uc_customer = [
    ("Register & Sign In (JWT)", 78),
    ("Search & Filter Restaurants", 68),
    ("View Live Interactive Floor Map", 58),
    ("Reserve Available Table (2-Hr Slot)", 48),
    ("Join Virtual Queue (If Full)", 38),
    ("Track Live Queue & Wait Time", 28),
    ("Receive Seat Notifications", 18),
    ("Cancel / Manage Reservations", 8),
]

for label, y in uc_customer:
    ell = patches.Ellipse((39, y+2), 24, 6.5, ec="#0284c7", fc="#e0f2fe", lw=1.5)
    ax.add_patch(ell)
    ax.text(39, y+2, label, fontsize=8, ha='center', va='center', fontweight='bold', color="#0369a1")
    # Line from Customer
    ax.plot([14, 27], [68, y+2], color='#0284c7', lw=1, linestyle=':')

# Admin Use Cases
uc_admin = [
    ("Admin Sign In & Auth", 78),
    ("View Real-Time Occupancy Floor", 68),
    ("Update Table Status (Available/Occupied)", 58),
    ("Add / Edit / Remove Tables", 48),
    ("Manage Reservation Allocations", 38),
    ("Manage Virtual Queue & Seat Diners", 28),
    ("View Occupancy Analytics Charts", 18),
    ("Broadcast Live Table Updates", 8),
]

for label, y in uc_admin:
    ell = patches.Ellipse((61, y+2), 24, 6.5, ec="#16a34a", fc="#dcfce7", lw=1.5)
    ax.add_patch(ell)
    ax.text(61, y+2, label, fontsize=8, ha='center', va='center', fontweight='bold', color="#15803d")
    # Line from Admin
    ax.plot([86, 73], [68, y+2], color='#16a34a', lw=1, linestyle=':')

plt.tight_layout()
fig.savefig(os.path.join(output_dir, 'diagram_usecase.png'), bbox_inches='tight', dpi=300)
plt.close(fig)

# 3. CLASS / ER DIAGRAM
fig, ax = plt.subplots(figsize=(10, 7), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(50, 96, "Smart Hospitality Management System - Database Entity Schema (ER/Class)", 
        fontsize=13, fontweight='bold', ha='center', va='center', color='#1e293b')

def draw_entity(x, y, w, h, title, fields):
    # Header
    hdr = patches.Rectangle((x, y + h - 5), w, 5, ec="#334155", fc="#1e293b", lw=1.2)
    ax.add_patch(hdr)
    ax.text(x + w/2, y + h - 2.5, title, fontsize=8.5, fontweight='bold', ha='center', va='center', color="#ffffff")
    # Body
    bdy = patches.Rectangle((x, y), w, h - 5, ec="#334155", fc="#f8fafc", lw=1.2)
    ax.add_patch(bdy)
    for idx, f in enumerate(fields):
        ax.text(x + 1.5, y + h - 8 - idx*3.5, f, fontsize=7.2, va='center', color="#1e293b")

draw_entity(5, 52, 26, 38, "User", [
    "+ _id: ObjectId [PK]",
    "+ name: String",
    "+ email: String (Unique)",
    "+ password: Hash (bcrypt)",
    "+ phone: String",
    "+ role: 'customer' | 'admin'",
    "+ createdAt: Date",
    "+ updatedAt: Date"
])

draw_entity(37, 52, 26, 38, "Restaurant", [
    "+ _id: ObjectId [PK]",
    "+ name: String",
    "+ cuisine: [String]",
    "+ address: String",
    "+ openingTime: String",
    "+ closingTime: String",
    "+ averageRating: Number",
    "+ totalTables: Number",
    "+ images: [String]"
])

draw_entity(69, 52, 26, 38, "Table", [
    "+ _id: ObjectId [PK]",
    "+ restaurantId: ObjectId [FK]",
    "+ tableNumber: String",
    "+ capacity: Number (2,4,6,8)",
    "+ status: 'available'|'occupied'|...",
    "+ shape: 'square' | 'round'",
    "+ position: {x: Num, y: Num}",
    "+ currentPartySize: Number"
])

draw_entity(5, 6, 26, 38, "Booking", [
    "+ _id: ObjectId [PK]",
    "+ bookingReference: String",
    "+ user: ObjectId [FK]",
    "+ restaurant: ObjectId [FK]",
    "+ table: ObjectId [FK]",
    "+ bookingDate: Date",
    "+ startTime: String (HH:mm)",
    "+ endTime: String (HH:mm)",
    "+ partySize: Number",
    "+ status: 'confirmed'|'cancelled'"
])

draw_entity(37, 6, 26, 38, "Queue", [
    "+ _id: ObjectId [PK]",
    "+ queueNumber: Number",
    "+ user: ObjectId [FK]",
    "+ restaurant: ObjectId [FK]",
    "+ partySize: Number",
    "+ status: 'waiting'|'notified'|...",
    "+ estimatedWaitMinutes: Number",
    "+ joinedAt: Date"
])

draw_entity(69, 6, 26, 38, "Notification", [
    "+ _id: ObjectId [PK]",
    "+ user: ObjectId [FK]",
    "+ title: String",
    "+ message: String",
    "+ type: 'booking'|'queue'|'seat'",
    "+ isRead: Boolean",
    "+ createdAt: Date"
])

# Relationship lines
# User -> Booking
ax.annotate("", xy=(18, 44), xytext=(18, 52), arrowprops=dict(arrowstyle="->", color="#0284c7", lw=1.5))
ax.text(19.5, 47, "1 : N", fontsize=7.5, color="#0284c7", fontweight='bold')

# Restaurant -> Table
ax.annotate("", xy=(69, 71), xytext=(63, 71), arrowprops=dict(arrowstyle="->", color="#0284c7", lw=1.5))
ax.text(64.5, 72.5, "1 : N", fontsize=7.5, color="#0284c7", fontweight='bold')

# Table -> Booking
ax.annotate("", xy=(31, 25), xytext=(69, 55), arrowprops=dict(arrowstyle="->", color="#0284c7", lw=1.2, linestyle='--'))
ax.text(48, 42, "1 : N (Slots)", fontsize=7.5, color="#0284c7", fontweight='bold')

# Restaurant -> Queue
ax.annotate("", xy=(50, 44), xytext=(50, 52), arrowprops=dict(arrowstyle="->", color="#0284c7", lw=1.5))
ax.text(51.5, 47, "1 : N", fontsize=7.5, color="#0284c7", fontweight='bold')

# User -> Notification
ax.annotate("", xy=(69, 25), xytext=(31, 60), arrowprops=dict(arrowstyle="->", color="#0284c7", lw=1.2, linestyle='--'))
ax.text(45, 53, "1 : N", fontsize=7.5, color="#0284c7", fontweight='bold')

plt.tight_layout()
fig.savefig(os.path.join(output_dir, 'diagram_er.png'), bbox_inches='tight', dpi=300)
plt.close(fig)

# 4. SEQUENCE DIAGRAM
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(50, 96, "Smart Hospitality Management System - Sequence Diagram (Real-Time Booking)", 
        fontsize=13, fontweight='bold', ha='center', va='center', color='#1e293b')

actors = [
    ("Customer / Diner", 12),
    ("React Client", 32),
    ("Express / API", 52),
    ("MongoDB Atlas", 72),
    ("Socket.IO Hub", 88)
]

for name, x in actors:
    # Actor Box
    box = patches.FancyBboxPatch((x-9, 87), 18, 6, boxstyle="round,pad=0.3", ec="#334155", fc="#e2e8f0", lw=1.2)
    ax.add_patch(box)
    ax.text(x, 90, name, fontsize=8, fontweight='bold', ha='center', va='center', color="#0f172a")
    # Lifeline
    ax.plot([x, x], [8, 87], color='#94a3b8', lw=1, linestyle='--')

messages = [
    (12, 32, 80, "1. Select Table & Slot on Live Floor Map", True),
    (32, 52, 73, "2. POST /api/bookings (JWT + TableId + Time)", True),
    (52, 72, 66, "3. Query Existing Bookings for Table", True),
    (72, 52, 59, "4. Return Confirmed Overlaps (if any)", False),
    (52, 52, 52, "5. Execute hasTimeOverlap() Atomic Logic", True),
    (52, 72, 45, "6. Insert Booking Document & Lock Table", True),
    (72, 52, 38, "7. Acknowledge Saved Reservation", False),
    (52, 88, 31, "8. Emit 'table:status-updated' Event", True),
    (88, 32, 24, "9. Broadcast Live Seat Status to All Clients", False),
    (52, 32, 17, "10. HTTP 201 Created with Booking Details", False),
    (32, 12, 10, "11. Display Booking Confirmation Modal", False),
]

for x1, x2, y, msg, solid in messages:
    ls = '-' if solid else '--'
    col = '#0284c7' if solid else '#16a34a'
    if x1 == x2: # Self-call
        ax.annotate("", xy=(x1, y-2), xytext=(x1+6, y), arrowprops=dict(arrowstyle="->", color="#d97706", lw=1.2))
        ax.plot([x1, x1+6], [y+2, y+2], color='#d97706', lw=1.2)
        ax.plot([x1+6, x1+6], [y-2, y+2], color='#d97706', lw=1.2)
        ax.plot([x1, x1+6], [y-2, y-2], color='#d97706', lw=1.2)
        ax.text(x1+7, y, msg, fontsize=7.2, va='center', color="#b45309", fontweight='bold')
    else:
        ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color=col, lw=1.2, linestyle=ls))
        mid = (x1 + x2) / 2
        ax.text(mid, y + 1.8, msg, fontsize=7, ha='center', va='bottom', color="#1e293b", fontweight='bold')

plt.tight_layout()
fig.savefig(os.path.join(output_dir, 'diagram_sequence.png'), bbox_inches='tight', dpi=300)
plt.close(fig)

print("All 4 diagrams generated successfully in report_assets directory!")
