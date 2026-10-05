# CleanSight – AI Garbage Detector & Collector

> **Tagline:** *"Report Waste. Earn Rewards. Keep Your City Clean."*

CleanSight is a modern, responsive full-stack civic technology web platform designed for smart city cleanliness management. It empowers citizens to photograph public garbage, verify it with AI computer vision, dispatch sanitation squads, inspect Before/After photographic evidence, and reward proactive citizens with redeemable civic points. CleanSight also includes a responsible verification-based penalty tracking system to hold habitual commercial and contractor dumpers accountable without penalizing random citizens.

---

## 🌟 Key Highlights & Innovations

- **Multi-Role Civic Platform:** Built for 3 user types: **Citizens**, **Cleaning Staff / Collectors**, and **Municipal Authorities / Admins**.
- **Instant AI Garbage Detection:** Scans uploaded waste photos, tags materials (Plastic, Food, Construction, E-Waste, Medical, etc.), grades severity (`Low`, `Medium`, `High`, `Critical`), and estimates refuse mass.
- **Pluggable Computer Vision Architecture:** Operates out-of-the-box with an internal computer vision engine and is pre-wired for Google Gemini 1.5/2.0 Vision and YOLO models without exposing API keys to the frontend.
- **Anti-Fraud Shield:** Prevents duplicate submissions and spam via perceptual image MD5 hashing, proximity geo-radius clustering (25m check), and user submission velocity thresholds.
- **Interactive Leaflet Geo-Mapping:** Color-coded status markers (🔴 Red = New Report, 🟠 Orange = Assigned, 🔵 Blue = Cleaning in Progress, 🟢 Green = Cleaned & Verified).
- **8-Stage Live Incident Progress Tracker:** Visual timeline tracking every report from submission to reward crediting.
- **Before / After Photographic Verification:** Side-by-side split comparison of reported waste vs cleaned, disinfected ground before report closure.
- **Incentivized Rewards & Redemption Exchange:** Citizens earn points (`+10` to `+100` pts + `+20` Before/After bonus) redeemable for digital badges, Metro passes, and partner organic grocery vouchers.
- **Responsible Penalty System:** Strict due-process flow for repeat commercial and contractor dumpers (`Warning` → `Low Penalty` → `Medium Penalty` → `High Penalty`) subject to authorized municipal sign-off.
- **1-Click Demo Account Switcher:** Effortlessly switch between Citizen (*Rahul Sharma*), Collector (*Suresh Kumar*), and Municipal Admin (*Rajesh Deshmukh*) with one click in the top bar.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Leaflet, Canvas-Confetti |
| **Backend** | Node.js (v24), Express.js, TypeScript (tsx), Multer, JWT, BcryptJS, CORS |
| **Database** | SQLite via Node's native `DatabaseSync` (Zero-config, persistent relational store) |
| **Authentication** | Firebase Authentication (Email/Password, Google 1-Click Sign-In, Password Reset) + JWT |
| **AI / Computer Vision** | CleanSight CV Engine + Google Gemini Vision API Integration |
| **Maps** | OpenStreetMap + Leaflet with custom div icons |

---

## 🔥 Firebase Authentication Integration

CleanSight is integrated with **Firebase Authentication**:
- **Google 1-Click Sign-In:** Citizens can authenticate using their Google accounts via Firebase `signInWithPopup`.
- **Firebase Email & Password Auth:** Full registration and sign-in backed by Firebase.
- **Self-Service Password Reset:** Integrated `sendPasswordResetEmail` with an in-app password recovery modal.
- **Civic Profile Synchronization:** Any user signing up via Firebase is automatically provisioned in the CleanSight civic database with **+50 Welcome Points** and the **Green Starter** rank.
- **Preserved Demo Roles:** The 1-click evaluation bar remains active to effortlessly evaluate as Collector *Suresh Kumar* or Municipal Admin *Rajesh Deshmukh*.


## 👥 User Roles & Capabilities

### 1. Citizen Custodian
- Snap waste directly using device camera or upload image files.
- Real-time AI detection preview: Confidence %, Category, Severity, and mass estimate.
- Use GPS (*"Use My Location"*) or pin exact coordinates on the interactive map.
- Track 8-stage resolution timeline on personal dashboard.
- Earn reward points for verified cleanups.
- Redeem points for digital badges, Metro discounts, and grocery vouchers.
- Compete on the citywide **Clean City Heroes** leaderboard.

### 2. Cleaning Staff / Collector
- View assigned tasks filtered by status (*Assigned*, *Active*, *Completed*).
- Navigation map with distance and location coordinates.
- Update task lifecycle: **[Accept Task]** → **[Start Cleaning]** → **[Upload After Photo]** → **[Mark Completed]**.
- **Mandatory After-Photo Enforcement:** Collectors must upload photographic evidence of the clean area to complete a task.
- Log collected waste weight in kilograms.

### 3. Municipal Authority / Admin
- Master executive dashboard with 8 KPI summary cards.
- Interactive citywide reports map with live status markers.
- Approve or reject citizen reports.
- Dispatch available collectors to verified sites.
- Review Before/After cleaning evidence and approve final closure.
- Identify repeat garbage hotspots (unresolved counts & cleanliness scores 0–100).
- Issue responsible violation notices and enforce multi-tier penalty fines on repeat commercial dumpers.
- Customize reward point bonuses and penalty amounts in real-time.

---

## 🔄 Complete End-to-End User Flow (Demonstration Guide)

You can demonstrate the entire civic lifecycle in under 2 minutes:

```
[Citizen] Snap Garbage Photo
     ↓
[AI Vision] Detects Category (e.g. Plastic Waste) & Severity (94% confidence)
     ↓
[Map] Capture GPS Location & Submit Report
     ↓
[Admin] Verify Report & Assign Sanitation Staff (e.g. Suresh Kumar)
     ↓
[Collector] Accept Task → Arrive on Site → Commence Cleaning
     ↓
[Collector] Upload "After Cleaning" Photo & Mark Completed
     ↓
[Admin] Review Before / After Split Proof & Approve Closure
     ↓
[Citizen] Reward Points Credited (+70 pts) & Cleanliness Score Updated!
```

---

## ⚡ Quick Start & Local Execution

### 1. Prerequisites
- **Node.js** (v20+ or v24+ recommended)
- **npm** (comes with Node.js)

### 2. Installation
From the root directory:

```bash
# Install root orchestration dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 3. Environment & Security Configuration

CleanSight protects all API keys and environment variables by strictly excluding `.env` files from version control (`.gitignore`).

#### Backend Setup (`backend/`):
Copy `backend/.env.example` to `backend/.env`:

```ini
PORT=5000
JWT_SECRET=your_jwt_secret_key_here

# Optional: Google Gemini Vision API Key
# CleanSight's built-in computer vision heuristic engine works out-of-the-box without keys.
GEMINI_API_KEY=
```

#### Frontend Setup (`frontend/`):
Copy `frontend/.env.example` to `frontend/.env`:

```ini
VITE_API_BASE=/api

# Firebase Authentication Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_web_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 📁 Repository Structure

```text
garbage-detector-and-collector/
├── backend/                     # Node.js + Express + SQLite Backend API
│   ├── src/
│   │   ├── controllers/         # Auth, reports, tasks, admin, hotspots controllers
│   │   ├── models/              # SQLite database schema, seeds & migrations
│   │   ├── routes/              # Modular Express REST endpoints
│   │   ├── services/            # Computer vision AI & anti-fraud algorithms
│   │   └── server.ts            # Application bootstrap & middleware
│   ├── uploads/                 # Storage for report & evidence images (.gitkept)
│   ├── .env.example             # Template for backend configuration
│   ├── .gitignore               # Strict exclusions for .env, node_modules & db
│   ├── package.json
│   └── tsconfig.json
├── frontend/                    # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── public/                  # Static assets including CleanSight mascot logo.png
│   ├── src/
│   │   ├── components/          # Reusable UI (Navbar, Footer, Maps, Camera, Timeline)
│   │   ├── config/              # Secure Firebase SDK initialized from Vite env
│   │   ├── context/             # Authentication & notification state providers
│   │   ├── pages/               # Landing, Report, Dashboards, Legal (Privacy/Terms), etc.
│   │   ├── services/            # Typed HTTP API client abstraction
│   │   ├── types/               # TypeScript data models
│   │   ├── App.tsx              # Dynamic router & application shell
│   │   └── main.tsx
│   ├── .env.example             # Template for frontend Firebase keys
│   ├── .gitignore               # Strict exclusions for .env & build artifacts
│   ├── package.json
│   ├── index.html
│   └── vite.config.ts
├── .gitignore                   # Root security exclusion protecting all secrets & db
├── package.json                 # Monorepo orchestration scripts
└── README.md                    # Project documentation & demonstration guide
```

---

### 4. Running the Application

You can run both backend and frontend concurrently from the root directory:

```bash
# Starts Backend (port 5000) and Frontend (port 3000)
npm run dev
```

Or run them individually in separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000` and automatically initializes `cleansight.db` with 20 demo reports, 10 users, 5 hotspots, penalties, and rewards.*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Demo User Accounts

CleanSight features a **1-Click Demo Role Switcher** at the top of the navbar so you can switch roles instantly without logging out!

| Role | Name | Email | Password | Details |
|---|---|---|---|---|
| **Citizen** | Rahul Sharma | `citizen@cleansight.org` | `citizen123` | Top Hero, 1,850 pts, 42 reports |
| **Citizen** | Priya Patel | `priya@cleansight.org` | `citizen123` | Eco Warrior, 1,500 pts |
| **Citizen** | Amit Verma | `amit@cleansight.org` | `citizen123` | Waste Watcher, 1,200 pts |
| **Collector** | Suresh Kumar | `collector@cleansight.org` | `collector123` | Sanitation Staff, Pune Central |
| **Collector** | Anita Shinde | `anita@cleansight.org` | `collector123` | Sanitation Staff, Kothrud Ward |
| **Municipal Admin** | Rajesh Deshmukh | `admin@cleansight.org` | `admin123` | Municipal Commissioner |

---

## 🗄️ Database Architecture

CleanSight uses SQLite tables with foreign key constraints:

- `users` (id, name, email, password, role, avatar, phone, city, points, rank, created_at)
- `reports` (id, user_id, user_name, category, description, image_url, latitude, longitude, address, area, city, status, ai_detected, ai_confidence, ai_severity, ai_labels, assigned_collector_id, reward_points, fraud_flag, created_at)
- `cleaning_evidence` (id, report_id, collector_id, collector_name, before_image_url, after_image_url, cleaning_notes, waste_weight_kg, cleaned_at, verified_by_admin)
- `rewards` (id, title, description, points_cost, type, icon, partner_name, code)
- `reward_transactions` (id, user_id, report_id, amount, type, reason, badge_unlocked, created_at)
- `hotspots` (id, area_name, city, latitude, longitude, total_reports, unresolved_reports, severity, cleanliness_score)
- `violations` (id, report_id, area, responsible_entity, entity_type, violation_type, description, evidence_url, status)
- `penalties` (id, violation_id, area, responsible_entity, verified_violations_count, warnings_count, amount, severity_tier, status, approved_by)
- `notifications` (id, user_id, title, message, type, is_read, report_id, created_at)
- `area_statistics` (id, area_name, cleanliness_score, total_reports, cleaned_count, avg_resolution_hours, trend)
- `system_settings` (key, value)

---

## 🛡️ Anti-Fraud & Responsible Penalty Policy

1. **Duplicate Image Detection:** MD5 checksum comparison detects re-uploaded identical photographs.
2. **Proximity Spam Clustering:** Flags reports filed within 25 meters of an active report within 4 hours.
3. **Velocity Throttling:** Detects rapid automated submissions (>5 reports in 10 minutes).
4. **Due Process Penalties:** Citizens are never fined for uploading reports. Penalties target habitual corporate/commercial dumpers and contractors after photographic audit and municipal sign-off.

---

## 📱 Mobile & Responsive Experience

- Responsive hamburger navigation menu on smartphones and tablets.
- Full mobile camera capture support (`capture="environment"`).
- Touch-friendly map pins and responsive table scrolls.

---

## 🚀 Cloud Deployment Guide

CleanSight is pre-configured with blueprints for zero-friction cloud deployment.

### 1. Deploy Backend on Render (Web Service)

1. Log in to [Render](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository: `garbage-detector-and-collector`.
3. Configure settings:
   - **Name:** `cleansight-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. In **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `JWT_SECRET` = *(Generate a secure random string)*
   - `MONGODB_URI` = `mongodb+srv://nileshnandan25_db_user:IZ7LC9HDUXkbDFcH@cluster0.ah2ztwo.mongodb.net/cleansight?retryWrites=true&w=majority&appName=Cluster0`
   - *(Optional)* `GEMINI_API_KEY` = *(Your Google Gemini Vision API key)*
5. Click **Create Web Service**.  
   *Your backend API will be live at `https://cleansight-backend.onrender.com`.*

---

### 2. Deploy Frontend on Netlify (Static Site)

1. Log in to [Netlify](https://app.netlify.com/) and click **Add new site** → **Import an existing project**.
2. Connect your GitHub repository: `garbage-detector-and-collector`.
3. Netlify will automatically detect [`netlify.toml`](file:///d:/garbage%20dectector%20and%20collector/netlify.toml):
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. In **Environment Variables** (Site settings → Environment variables), add:
   - `VITE_API_BASE` = `https://<your-render-backend-url>/api` *(Replace with your Render URL)*
   - `VITE_FIREBASE_API_KEY` = *(Your Firebase API key)*
   - `VITE_FIREBASE_AUTH_DOMAIN` = `series-942f9.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID` = `series-942f9`
   - `VITE_FIREBASE_STORAGE_BUCKET` = `series-942f9.firebasestorage.app`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = `459831912379`
   - `VITE_FIREBASE_APP_ID` = `1:459831912379:web:13a11ec7d8ff8a6bf0869e`
   - `VITE_FIREBASE_MEASUREMENT_ID` = `G-YTVT2G7XZQ`
5. Click **Deploy Site**.  
   *Your clean civic platform is live on Netlify with automated continuous deployment!*

---

## 📄 License
This project is open-source under the MIT License for Smart India Hackathon and civic innovation initiatives.
