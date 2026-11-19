# Smart Hospitality & Restaurant Management System (HRMS) for Real-Time Seat Availability

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render%20Live-brightgreen?style=for-the-badge&logo=render)](https://smart-hrms-sneha.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/SnehaAnand21/smart-hrms)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://reactjs.org/)
[![Socket.IO](https://img.shields.io/badge/Real--Time-Socket.IO-black.svg)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4.svg)](https://tailwindcss.com/)
[![Academic Review](https://img.shields.io/badge/Project-Easwari%20Engineering%20College-blue.svg)](https://srmeaswari.ac.in/)

> 🌐 **Live Deployed Project URL:** [https://smart-hrms-sneha.onrender.com](https://smart-hrms-sneha.onrender.com)  
> 🔑 **Faculty Review Credentials:**  
> • **Restaurant Admin:** `admin@hrms.com` / `admin123`  
> • **Customer Diner:** `sneha@hrms.com` / `customer123`  
> *(1-Click Review Buttons are also available on the live Sign-In page for instant evaluation!)*

A modern, full-stack **MERN (MongoDB, Express.js, React, Node.js)** hospitality platform delivering **genuine table-level seat visibility**, atomic double-booking prevention, an intelligent virtual queue with wait-time estimation, and sub-second real-time floor plan synchronization via **Socket.IO**.

---

## 🎓 Academic Project Information

- **Project Title:** Smart Hospitality & Restaurant Management System (HRMS) for Real-Time Seat Availability
- **Developer / Student:** Sneha.A
- **Register Number:** `310624205264`
- **Department:** Information Technology
- **Course:** Full Stack Development – MERN Stack Project (Review 1 & 2)
- **Project Guide:** Ms Grandhi Sai Lakshmi
- **Institution:** Easwari Engineering College, Ramapuram, Chennai

---

## 🌟 Key Features & Unique Selling Proposition (USP)

Unlike generic platforms (OpenTable, Resy, Zomato Dineout) that offer approximate slot bookings or batch cancellations, **Smart HRMS** tracks **every physical table individually**:

1. **Interactive 2D Visual Floor Map:** Real-time seat availability map organized by dining zones (`Main Dining`, `VIP Bay`, `Outdoor Terrace`) with color-coded states:
   - 🟢 **Available:** Ready for instant reservation.
   - 🟡 **Held:** Temporarily locked during checkout.
   - 🔴 **Occupied:** Diners actively seated.
   - 🟣 **Reserved:** Confirmed future reservation.
2. **Atomic Double-Booking Prevention:** Server-side validation rejecting conflicting active bookings for the same table and time window with HTTP `409 Conflict`.
3. **Deterministic Virtual Queue Engine:** When no compatible table is free, diners join a live virtual queue with wait times calculated deterministically based on queue position, table turnover rate, and party capacity.
4. **Real-Time WebSocket Synchronization:** Instant floor status push to connected clients via Socket.IO without page refreshing.
5. **Staff Floor & Queue Management:** Restaurant administrators can toggle table statuses with one tap, seat parties from the queue, call waiting diners, and manage floor capacity.
6. **In-App Notification Center:** Real-time and persistent alerts stored in MongoDB for booking confirmations, cancellations, seat openings, and queue position changes.

---

## 🏗️ System Architecture

```
+-------------------------------------------------------------------------+
|                               CLIENT TIER                               |
|   React 18 + Vite · Tailwind CSS · React Router · Context API · Axios   |
|                 Socket.IO Client · Recharts Analytics                   |
+-------------------------------------------------------------------------+
                                    ▲ │ HTTP REST &
                                    │ ▼ WebSocket Events
+-------------------------------------------------------------------------+
|                            APPLICATION TIER                             |
|          Node.js + Express.js REST API (MVC Architecture)               |
|      JWT Authentication & Role RBAC · bcryptjs Password Hashing         |
|        Booking Engine · Wait-Time Estimator · Socket.IO Server          |
+-------------------------------------------------------------------------+
                                    ▲ │
                                    │ ▼ Mongoose ODM
+-------------------------------------------------------------------------+
|                                DATA TIER                                |
|        MongoDB / MongoDB Atlas (6 Relational Mongoose Schemas)          |
|    Users · Restaurants · Tables · Bookings · QueueEntries · Notifications|
+-------------------------------------------------------------------------+
```

---

## 🗄️ Database Design (6 Collections)

1. **`User`**: Diners and restaurant staff with hashed passwords and role flags (`customer`, `restaurantAdmin`).
2. **`Restaurant`**: Dining details, 2dsphere GeoJSON location coordinates, opening hours, cuisine tags, and photos.
3. **`Table`**: Physical tables linked to restaurants with capacity, 2D floor coordinates (`x`, `y`, `shape`), zone, and status (`available`, `held`, `occupied`, `reserved`).
4. **`Booking`**: Unique references (`HRMS-YYMMDD-XXXX`), customer ID, table ID, booking date, start & end time, party size, and status.
5. **`QueueEntry`**: Queue position, joined timestamp, deterministic wait minutes, and status (`waiting`, `notified`, `seated`, `cancelled`).
6. **`Notification`**: User alerts with read state, timestamps, and deep links to bookings or queue entries.

---

## 🔑 Pre-Configured Demo Credentials

Use these pre-seeded accounts for immediate testing:

| Role | Email | Password | Assigned Restaurant / Capabilities |
| :--- | :--- | :--- | :--- |
| **Restaurant Administrator** | `admin@hrms.com` | `admin123` | Full control over The Royal Chettinad Palace floor plan, bookings, queue, and analytics |
| **Bistro Administrator** | `bistro@hrms.com` | `admin123` | Full control over Truffles & Basil Bistro |
| **Customer Diner (Sneha)** | `sneha@hrms.com` | `customer123` | Discover restaurants, book tables, join virtual queue, manage reservations |
| **Customer Diner (Vikram)** | `diner@hrms.com` | `customer123` | Sample customer account for concurrent testing |

> 💡 **Tip:** The Login page features **1-Click Review Buttons** to instantly log in as Admin or Customer with one tap!

---

## 🚀 Running the Project in Visual Studio Code

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher) and `npm`
- Any web browser (Chrome, Edge, Firefox)
- *Optional:* Local MongoDB or MongoDB Atlas URI (If not configured, the application **automatically uses an embedded zero-config MongoDB instance** so you can run the demo immediately!)

---

### Step 1: Open the Project in VS Code
Open Visual Studio Code, click **File → Open Folder...**, and select:
```
C:\Users\user\.gemini\antigravity\scratch\hrms
```

---

### Step 2: Configure Environment Files

1. **Backend Environment (`server/.env`):**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/hrms
   JWT_SECRET=hrms_super_secret_academic_jwt_key_2026_sneha
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
   *(If you wish to use MongoDB Atlas, replace `MONGODB_URI` with your cloud connection string).*

2. **Frontend Environment (`client/.env`):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

---

### Step 3: Install Dependencies

Open two terminal tabs in VS Code (or PowerShell):

**Terminal 1 (Backend):**
```powershell
cd server
npm install
```

**Terminal 2 (Frontend):**
```powershell
cd client
npm install
```

---

### Step 4: Seed the Database
Populate the database with 6 restaurants, 60 tables, sample bookings, and demo accounts:

In **Terminal 1**:
```powershell
cd server
npm run seed
```

Output:
```
[Seed] Cleaned existing collections.
[Seed] Seeded 6 restaurants and linked admin accounts.
[Seed] Seeded 60 tables with coordinate mapping.
[Seed] Seeded 3 reservations.
[Seed] Seeded 2 virtual queue entries.
✅ HRMS Database Seeding Complete!
```

---

### Step 5: Start the Backend Server

In **Terminal 1**:
```powershell
cd server
npm run dev
```
Server runs on: **`http://localhost:5000`**

---

### Step 6: Start the Frontend Client

In **Terminal 2**:
```powershell
cd client
npm run dev
```
Client runs on: **`http://localhost:5173`**

Open **`http://localhost:5173`** in your browser!

---

## 🧪 Demonstration & Review Walkthrough

### 1. Dual-Tab Real-Time Sync (USP Demonstration)
1. Open **Tab 1** (`http://localhost:5173`): Click **Sign In → Login as Admin (Sneha A)**. Navigate to **Manage Floor Plan** (`/admin/tables`).
2. Open **Tab 2** (Incognito window or separate browser): Go to `http://localhost:5173/restaurants` and open **The Royal Chettinad Palace** (`/restaurants/...`).
3. In **Tab 1 (Admin)**, click any table status toggle (e.g. switch **T-01** from **Avail** to **Occupied**).
4. **Notice:** In **Tab 2 (Customer)**, the seat map instantly updates to red (Occupied) in **< 1 second** without reloading the page!

### 2. Double-Booking Prevention Verification
1. As a customer, select an available table (e.g., Table T-03) and book for today at 19:30.
2. Confirm the reservation receipt.
3. Attempt to book the exact same table for an overlapping time slot (e.g., 20:00).
4. The server returns a **409 Conflict** error: *"Double-booking prevented: Table T-03 is already reserved between 19:30 and 21:00"*.

### 3. Virtual Queue & Wait-Time Estimation
1. Open a restaurant where tables are full or click **Join Virtual Queue**.
2. Select your party size (e.g., 4 guests).
3. The system calculates the estimated wait time using deterministic turnover logic.
4. From the Admin Queue Management tab, click **Call Diner** or **Seat Party**; the customer receives an instant alert!

### 4. Cancellation & Seat Freeing
1. Open **My Bookings** (`/my-bookings`).
2. Click **Cancel Booking**.
3. The table is freed on the floor map and any waiting diners in the queue are notified immediately!

---

## 🛠️ REST API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register customer or admin | No |
| `POST` | `/api/auth/login` | Authenticate and issue JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Yes |
| `GET` | `/api/restaurants` | List restaurants with live availability | No |
| `GET` | `/api/restaurants/:id` | Get restaurant profile & details | No |
| `GET` | `/api/restaurants/:id/tables` | Get live 2D tables & statuses | No |
| `POST` | `/api/tables` | Add new table to floor | Admin |
| `PUT` | `/api/tables/:id/status` | Quick toggle table status | Admin |
| `DELETE`| `/api/tables/:id` | Delete table (validates bookings) | Admin |
| `POST` | `/api/bookings` | Create reservation (atomic lock) | Customer |
| `GET` | `/api/bookings/my` | View logged-in user reservations | Customer |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking and release table | Customer / Admin |
| `POST` | `/api/queue` | Step into virtual queue | Customer |
| `GET` | `/api/queue/my` | View active queue status | Customer |
| `PUT` | `/api/queue/:id/seat` | Seat customer onto table | Admin |
| `PUT` | `/api/queue/:id/notify` | Send alert when table is ready | Admin |
| `GET` | `/api/notifications` | View in-app notifications | Yes |
| `GET` | `/api/admin/dashboard` | Live occupancy metrics & queue | Admin |
| `GET` | `/api/admin/analytics` | 7-day trends & peak hour charts | Admin |

---

## 🔍 Troubleshooting & FAQs

- **Port 5000 or 5173 already in use?**
  Change `PORT=5001` in `server/.env` and update `VITE_API_URL=http://localhost:5001/api` in `client/.env`.
- **NPM SSL Error (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`) on college/corporate networks?**
  Run: `npm config set strict-ssl false` in your terminal.
- **PowerShell Script Execution Policy disabled?**
  Use `npm.cmd` instead of `npm`, e.g., `npm.cmd run dev`.

---

© 2026 Sneha.A [310624205264] · Easwari Engineering College · Department of Information Technology
