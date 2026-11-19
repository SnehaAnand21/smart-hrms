import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def update_ppt():
    pptx_path = "Combined_Review_HRMS.pptx"
    prs = pptx.Presentation(pptx_path)
    print(f"Loaded {pptx_path} with {len(prs.slides)} slides.")

    # Brand Colors
    TEAL_DARK = RGBColor(0, 77, 64)       # #004D40
    TEAL_PRIMARY = RGBColor(0, 168, 150)  # #00A896
    TEXT_MUTED = RGBColor(80, 90, 100)
    TEXT_DARK = RGBColor(30, 41, 59)

    # =========================================================================
    # 1. UPDATE SLIDE 8 (UI DESIGN / WIREFRAMES)
    # =========================================================================
    slide8 = prs.slides[7]
    print("\n--- Updating Slide 8 (UI Design / Wireframes) ---")
    
    # Remove old placeholder text box (Text 6)
    for shape in list(slide8.shapes):
        if shape.has_text_frame and "Insert wireframes" in shape.text_frame.text:
            sp = shape._element
            sp.getparent().remove(sp)
            print("  Removed placeholder text box 'Insert wireframes...' from Slide 8")
            break

    # Insert wireframe image into container Shape 5
    wireframe_img = os.path.abspath("report_assets/screenshot_floorplan.png")
    if os.path.exists(wireframe_img):
        # Position matching Slide 4 & 5 picture placements
        pic8 = slide8.shapes.add_picture(
            wireframe_img,
            left=1143000,
            top=1783080,
            width=5943600,
            height=4023360
        )
        print(f"  Inserted wireframe mockup: {wireframe_img}")

    # Update Text 9 (notes on right container)
    for shape in slide8.shapes:
        if shape.has_text_frame and "Show key screen wireframes" in shape.text_frame.text:
            tf = shape.text_frame
            tf.clear()
            
            bullets = [
                ("Interactive Floor Plan:", " Real-time seat states (Available, Occupied, Reserved, Held 15m)"),
                ("Direct Booking Panel:", " Table capacity matching, 2-hr dining slots & customer hold confirmation"),
                ("Responsive Breakpoints:", " Optimized for Desktop (1400px), Tablet (768px), and Mobile devices"),
                ("Component Hierarchy:", " Top bar status feed, zone-based seating grid, and reservation modal"),
                ("Design System:", " Tailwind CSS tokens with Emerald & Teal primary accents, mobile-first UX")
            ]
            for i, (b_title, b_desc) in enumerate(bullets):
                p = tf.add_paragraph() if i > 0 else tf.paragraphs[0]
                p.space_after = Pt(8)
                run_title = p.add_run()
                run_title.text = "• " + b_title
                run_title.font.bold = True
                run_title.font.size = Pt(11)
                run_title.font.name = "Calibri"
                run_title.font.color.rgb = TEAL_DARK

                run_desc = p.add_run()
                run_desc.text = b_desc
                run_desc.font.size = Pt(10.5)
                run_desc.font.name = "Calibri"
                run_desc.font.color.rgb = TEXT_DARK
            print("  Updated Slide 8 right panel notes with real wireframe details.")
            break

    # =========================================================================
    # 2. UPDATE SLIDE 14 (SCREENSHOTS)
    # =========================================================================
    slide14 = prs.slides[13]
    print("\n--- Updating Slide 14 (Screenshots) ---")

    # The 4 cards definitions
    cards_config = [
        {
            "shape_idx": 5,
            "text_idx": 6,
            "title": "1. Authentication & Role Selection",
            "url": "http://localhost:5173/login",
            "img": os.path.abspath("report_assets/live_login.png"),
            "bullets": [
                "1-Click Demo Login (Admin Sneha.A / Diner)",
                "JWT Bearer auth with bcrypt password hash",
                "Protected client routes & session restore",
                "Full validation with responsive form layout"
            ],
            "col": 0,
            "row": 0
        },
        {
            "shape_idx": 7,
            "text_idx": 8,
            "title": "2. Restaurant Discovery Dashboard",
            "url": "http://localhost:5173/restaurants",
            "img": os.path.abspath("report_assets/live_discovery.png"),
            "bullets": [
                "Real-time seat visibility counters per venue",
                "Multi-criteria filter (Cuisine, Rating, Size)",
                "Live table availability status feed",
                "Curated Chennai dining venues discovery"
            ],
            "col": 1,
            "row": 0
        },
        {
            "shape_idx": 9,
            "text_idx": 10,
            "title": "3. Live Table Floor Plan (Seat Map)",
            "url": "http://localhost:5173/restaurants/6ad042c54486104814ba93b7",
            "img": os.path.abspath("report_assets/live_floorplan.png"),
            "bullets": [
                "Table-level seat map (Available / Held / Taken)",
                "Instant table reservation with hold lock",
                "AI-estimated virtual waitlist queue fallback",
                "Real-time Socket.io seat state broadcast"
            ],
            "col": 0,
            "row": 1
        },
        {
            "shape_idx": 11,
            "text_idx": 12,
            "title": "4. Restaurant Staff Admin Portal",
            "url": "http://localhost:5173/admin_autologin.html",
            "img": os.path.abspath("report_assets/live_admin_dashboard.png"),
            "bullets": [
                "Live floor occupancy KPIs & turnover stats",
                "1-tap table status toggle (Instant WebSocket push)",
                "7-day throughput & peak dining hours chart",
                "Active queue management & table assignment"
            ],
            "col": 1,
            "row": 1
        }
    ]

    # Remove the 4 placeholder text boxes
    placeholder_text_targets = [
        "[ Login / Signup Page screenshot ]",
        "[ Dashboard screenshot ]",
        "[ Core Feature Screen screenshot ]",
        "[ Admin Panel screenshot ]"
    ]
    for shape in list(slide14.shapes):
        if shape.has_text_frame:
            txt = shape.text_frame.text.strip()
            if any(target in txt for target in placeholder_text_targets):
                sp = shape._element
                sp.getparent().remove(sp)
                print(f"  Removed placeholder text box: '{txt}'")

    # Dimensions for the 2x2 grid
    card_w = 4846320
    card_h = 2250000
    col_lefts = [1097280, 6217920]
    row_tops = [1600000, 4000000]

    # Find and reposition the 4 card shapes
    round_rects = []
    for s in slide14.shapes:
        if s.shape_type == MSO_SHAPE.ROUNDED_RECTANGLE or s.name in ['Shape 5', 'Shape 7', 'Shape 9', 'Shape 11']:
            round_rects.append(s)

    # Sort round_rects by top then left to match row0-col0, row0-col1, row1-col0, row1-col1
    round_rects.sort(key=lambda s: (s.top, s.left))

    for idx, card in enumerate(cards_config):
        c_left = col_lefts[card["col"]]
        c_top = row_tops[card["row"]]

        # Reposition card background shape if found
        if idx < len(round_rects):
            r_shape = round_rects[idx]
            r_shape.left = c_left
            r_shape.top = c_top
            r_shape.width = card_w
            r_shape.height = card_h

        # Add Card Title & Route Text Box
        title_box = slide14.shapes.add_textbox(
            c_left + 120000,
            c_top + 80000,
            card_w - 240000,
            280000
        )
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        
        p_t = tf_title.paragraphs[0]
        r1 = p_t.add_run()
        r1.text = card["title"]
        r1.font.bold = True
        r1.font.size = Pt(12)
        r1.font.name = "Calibri"
        r1.font.color.rgb = TEAL_DARK

        r_sep = p_t.add_run()
        r_sep.text = "  |  "
        r_sep.font.size = Pt(10)
        r_sep.font.color.rgb = TEAL_PRIMARY

        r_url = p_t.add_run()
        r_url.text = card["url"].replace("http://localhost:5173", ":5173")
        r_url.font.size = Pt(9.5)
        r_url.font.name = "Calibri"
        r_url.font.color.rgb = TEXT_MUTED

        # Insert Live Screenshot (1400x900 aspect ratio)
        img_w = 2800000
        img_h = int(img_w * 900 / 1400) # 1,800,000 EMU
        img_left = c_left + 120000
        img_top = c_top + 370000

        if os.path.exists(card["img"]):
            slide14.shapes.add_picture(
                card["img"],
                left=img_left,
                top=img_top,
                width=img_w,
                height=img_h
            )
            print(f"  Inserted {os.path.basename(card['img'])} into card {idx+1}")
        else:
            print(f"  WARNING: Image not found: {card['img']}")

        # Add Feature Highlights beside the screenshot
        bullets_left = c_left + img_w + 200000
        bullets_top = c_top + 370000
        bullets_w = card_w - (img_w + 300000)
        bullets_h = img_h

        desc_box = slide14.shapes.add_textbox(bullets_left, bullets_top, bullets_w, bullets_h)
        tf_desc = desc_box.text_frame
        tf_desc.word_wrap = True
        tf_desc.margin_left = tf_desc.margin_top = tf_desc.margin_right = tf_desc.margin_bottom = 0

        for b_idx, bullet in enumerate(card["bullets"]):
            p_b = tf_desc.add_paragraph() if b_idx > 0 else tf_desc.paragraphs[0]
            p_b.space_after = Pt(4)
            r_b = p_b.add_run()
            r_b.text = "• " + bullet
            r_b.font.size = Pt(9.5)
            r_b.font.name = "Calibri"
            r_b.font.color.rgb = TEXT_DARK

    prs.save(pptx_path)
    print(f"\nSuccessfully saved updated presentation to {pptx_path}!")

if __name__ == "__main__":
    update_ppt()
