# Intervista AI - AI-Powered Technical Interview Platform

An intelligent, end-to-end AI mock interview preparation and evaluation platform featuring live media evaluation, rubric scoring, dynamic metrics, and instant PDF report generation.

---

## 🚀 Quick Setup & Installation Guide

If you just cloned or pulled the repository (`git pull origin main`), follow the steps below to install all dependencies.

### 1. Install All Dependencies (Frontend + Root)

Run the following command from the project root:

```bash
# Installs root packages & frontend packages (including jspdf, jspdf-autotable, recharts, etc.)
npm run install:all
```

*Or install specifically inside the frontend folder:*

```bash
cd frontend
npm install
cd ..
```

---

### 2. Backend Setup (FastAPI + Python)

```bash
cd Backend

# Create and activate virtual environment (if not already created)
# Windows:
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux:
# python3 -m venv venv
# source venv/bin/activate

# Install all backend requirements (FastAPI, ReportLab, Requests, etc.)
pip install -r requirements.txt
cd ..
```

---

### 3. Running the Project

#### Option A: Run Both Backend & Frontend Simultaneously (Recommended)
```bash
npm run dev:all
```

#### Option B: Run Individually
- **Frontend only:**
  ```bash
  npm run dev
  # Application will be accessible at http://localhost:5173
  ```
- **Backend only:**
  ```bash
  npm run backend
  # API docs will be accessible at http://localhost:8000/docs
  ```

---

## 🛠 Troubleshooting Common Issues

### ❌ `jspdf` or `jspdf-autotable` Module Not Found / Not Accessible
- **Reason:** Dependencies were installed at the root instead of the `frontend/` directory after pulling.
- **Fix:** Run:
  ```bash
  cd frontend
  npm install
  ```
  or run from root:
  ```bash
  npm run install:all
  ```

### ❌ `reportlab` or `requests` Module Not Found on Backend
- **Fix:** Activate your python virtual environment and run:
  ```bash
  cd Backend
  pip install -r requirements.txt
  ```

