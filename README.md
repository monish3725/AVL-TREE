# Apex Clinical DBMS — Hospital Management System (Next-Gen)

An enterprise Hospital Database Management System built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**. 

This project elevates the classical C++ console hospital management system (`hospms.cpp`) into a modern, full-stack Clinical Operating System with Electronic Health Records (EHR), smart appointment scheduling, dynamic inpatient billing, ward/bed matrix management, an interactive SQL query workbench, and an embedded C++ CLI simulator.

---

## 🚀 Key Modules & Features

1. **Patients & Clinical EHR:**
   - Patient registration with auto-incrementing ID tracking.
   - Demographics, blood type, and clinical vitals (BP, Heart Rate, SpO2, Temperature).
   - Triage categorization (Routine, Urgent, Emergency) and admission tracking.
   - Full search, filter, update, and safe deletion.

2. **Smart Appointment & Specialist Roster:**
   - Specialist physician directory (Cardiology, Neurology, Pediatrics, Orthopedics, Internal Medicine).
   - Real-time slot reservation and conflict avoidance.
   - Rescheduling engine with historical audit logging.

3. **Dynamic Inpatient Billing & Itemized Ledger:**
   - Multi-tier daily room tariffs (ICU, Post-Op, Semi-Private, General Ward).
   - Specialist consultation and procedure fees.
   - Diagnostic and laboratory charges (12-Lead ECG, Blood Panels, Digital X-Rays, IV Therapies).
   - Insurance co-pay deduction and printable invoice statement generator.

4. **Ward & Bed Occupancy Matrix:**
   - Live visual bed allocation across ICU, Post-Op, Pediatrics, and General Wards.
   - Instant intake admission and discharge with billing synchronization.

5. **Relational SQL Query Studio:**
   - In-browser SQL query workbench supporting `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, and column projections.
   - Entity-relationship schema viewer.

6. **Embedded C++ CLI Simulator:**
   - Runs an authentic interactive simulation of the original `hospms.cpp` console menu (options 1 to 9).
   - Bi-directionally synchronized with the web database.

---

## 💻 How to Run This Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your computer.

### Step 1: Clone or Download the Files
If you have cloned the project or downloaded the zip file, open your terminal (Command Prompt, PowerShell, or macOS Terminal) and navigate into the folder:
```bash
cd Hospital-Database-Management-System
```

### Step 2: Install Dependencies
Run the following command to install all necessary packages:
```bash
npm install
```

### Step 3: Start the Development Server
Run:
```bash
npm run dev
```

### Step 4: Open in Your Browser
Open your browser and navigate to:
```
http://localhost:3000
```
(or whichever port Vite displays in your terminal).

---

## 🛠️ How to Publish This to GitHub

You can publish this directly to your GitHub repository ([`monish3725/Hospital-Database-Management-System`](https://github.com/monish3725/Hospital-Database-Management-System)):

### Option A: Push to a New Branch or Main in Your Existing Repo

1. In your local project directory, initialize Git (if not already done):
   ```bash
   git init
   ```

2. Add all files to staging:
   ```bash
   git add .
   ```

3. Commit your changes:
   ```bash
   git commit -m "Elevate Hospital DBMS to modern React & TypeScript web application with EHR, billing, and SQL studio"
   ```

4. Set your repository remote (replace with your GitHub repo URL):
   ```bash
   git remote add origin https://github.com/monish3725/Hospital-Database-Management-System.git
   ```
   *(If `origin` already exists, run `git remote set-url origin https://github.com/monish3725/Hospital-Database-Management-System.git`)*

5. Push to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```
   *(If your GitHub repo already has your C++ code and you want to keep both, you can either push to a branch like `git checkout -b web-app` and `git push -u origin web-app`, or keep your C++ files alongside the React files in a `/cpp-cli` subfolder).*

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
```
The compiled static assets will be output to the `dist/` folder, which can be deployed to **Vercel**, **Netlify**, **GitHub Pages**, or **Firebase Hosting** for free with a single click.

---

## 📄 License
Apache-2.0 / MIT
