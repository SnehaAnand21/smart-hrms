# Smart HRMS - Cloud Deployment Guide
**Project:** Smart Hospitality & Restaurant Management System (HRMS)  
**Student:** Sneha.A [310624205264] — Easwari Engineering College  
**Department:** Information Technology — Full Stack Development (Review 1 & 2)

---

## 🚀 Recommended Deployment: Render.com (100% Free, Unified Full-Stack)

Render is the standard choice for MERN stack projects with **Socket.IO** because it supports persistent WebSocket connections (unlike Vercel serverless) and allows the Express backend to serve the built React Vite frontend from a single URL.

### Step 1: Push Code to Your GitHub Account
Open PowerShell or Git Bash in this project folder (`c:\Users\user\OneDrive\Desktop\FSD`):

1. Create a new repository on [GitHub](https://github.com/new) named `smart-hrms` (set it to Public).
2. Link and push your local commits:
   ```bash
   git remote add origin https://github.com/SnehaAnand21/smart-hrms.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy on Render (Takes ~2 minutes)
1. Go to [Render.com](https://render.com) and click **Get Started for Free** (Sign in with your GitHub account).
2. In the Render Dashboard, click **New +** → **Web Service**.
3. Select your `smart-hrms` repository from GitHub.
4. Fill in the deployment details:
   - **Name:** `smart-hrms-sneha` (or any unique name)
   - **Region:** Singapore / Oregon / Frankfurt
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm run render-build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Instance Type:** `Free`

5. Under **Environment Variables**, click **Add Environment Variable**:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `hrms_academic_secret_key_2026_sneha`
   - `MONGODB_URI` = *(Optional: paste your free MongoDB Atlas connection string here. If left blank, the app will automatically use its pre-seeded embedded database so your demo never fails!)*

6. Click **Deploy Web Service**.
7. Render will build the client and launch the server. Within 2–3 minutes, your live HTTPS link will be active:
   ```
   https://smart-hrms-sneha.onrender.com
   ```

---

## 🗄️ (Optional) Free MongoDB Atlas Database Setup
If your faculty specifically asks for a cloud MongoDB database:
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **Free Shared M0 Cluster** (AWS, Singapore/Mumbai region).
3. Under **Security → Database Access**, create a user (e.g., `sneha_admin` with a password).
4. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** → **Drivers** → Copy the connection string:
   ```
   mongodb+srv://sneha_admin:<password>@cluster0.xxxx.mongodb.net/hrms?retryWrites=true&w=majority
   ```
6. Add this as `MONGODB_URI` in your Render Environment Variables.
7. Run the seeder once by adding a one-off job or calling `/seed`.

---

## 📋 Ready-to-Send Template for Your Faculty

Copy and email this to your faculty:

```
Respected Madam / Sir,

Sub: Submission of Deployed Project Link - Smart HRMS (Review 1 & 2)

I have deployed our Full Stack MERN project "Smart Hospitality & Restaurant Management System (HRMS)" to cloud production. The system features real-time table-level seat visibility, Socket.IO synchronization, and virtual queue waitlist management.

1. Deployed Project Link:
   https://smart-hrms-sneha.onrender.com

2. GitHub Repository:
   https://github.com/SnehaAnand21/smart-hrms

3. Test Credentials for Evaluation:
   - Restaurant Admin Portal:
     Email: admin@hrms.com | Password: admin123
   - Customer / Diner App:
     Email: sneha@hrms.com | Password: customer123
   (Note: The Login page also includes 1-Click Academic Review Buttons for instant access without typing credentials.)

Student Details:
- Name: Sneha.A
- Register Number: 310624205264
- Department: Information Technology
- Institution: Easwari Engineering College

Thank you.
```
