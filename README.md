# 💎 InvestWise – AI-Powered Personal Investment Recommender

An intelligent web application that helps Gen Z users understand where to invest based on their income, spending habits, and risk profile. Built for hackathons, designed like a real product.

![Tech Stack](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Flask-Backend-000000?logo=flask&logoColor=white)
![Tech Stack](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Recharts-Charts-FF6384?logo=chartdotjs&logoColor=white)
![Tech Stack](https://img.shields.io/badge/TailwindCSS_v4-Styling-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure signup/login with hashed passwords and token-based sessions |
| 📝 **Financial Profile** | Collects income, expenses, savings, goals, time horizon & risk appetite |
| 📊 **Risk Profiling Engine** | Computes a weighted risk score from savings ratio, income stability & tolerance |
| 💼 **Investment Recommendations** | Maps risk level → asset allocation (bonds, equity, mutual funds, high-risk) |
| 📈 **Wealth Projection** | Year-by-year compound growth with monthly SIP, visualized as an area chart |
| 🔮 **What-If Simulator** | Adjust SIP amount & risk level — charts update dynamically |
| 🤖 **AI Insights** | Rule-based personalized tips on savings, emergency funds, SIP & goal alignment |
| 🌙 **Premium Dark UI** | Glassmorphism, gradient accents, micro-animations, fully responsive |

---

## 🏗️ Project Structure

```
Protege_Hack/
├── backend/                    # Flask REST API
│   ├── app.py                  # Application factory & entry point
│   ├── config.py               # Configuration (DB, JWT, secrets)
│   ├── requirements.txt        # Python dependencies
│   ├── models/
│   │   ├── __init__.py         # SQLAlchemy instance
│   │   └── user.py             # User model (auth + financial profile)
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py             # POST /auth/signup, POST /auth/login
│   │   ├── profile.py          # POST /profile, GET /profile
│   │   └── recommendation.py   # GET /recommendation, POST /projection
│   └── services/
│       ├── __init__.py
│       ├── risk_engine.py      # Risk score computation
│       ├── recommendation_engine.py  # Asset allocation logic
│       ├── projection_engine.py      # Compound interest + SIP projections
│       └── insights_engine.py        # Rule-based AI insights
│
├── frontend/                   # React + Vite
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js          # Vite config with API proxy
│   └── src/
│       ├── main.jsx            # Entry point
│       ├── App.jsx             # Router setup
│       ├── index.css           # Tailwind v4 + custom design tokens
│       ├── context/
│       │   └── AuthContext.jsx # Auth state management
│       ├── services/
│       │   └── api.js          # Axios HTTP client with JWT interceptors
│       ├── components/
│       │   ├── Navbar.jsx      # Top navigation bar
│       │   ├── ProtectedRoute.jsx  # Auth route guard
│       │   ├── StatCard.jsx    # Metric display card
│       │   └── InsightCard.jsx # AI insight card
│       └── pages/
│           ├── LoginPage.jsx   # Login / Signup (tabbed)
│           ├── ProfilePage.jsx # Financial profile form
│           └── DashboardPage.jsx # Main dashboard with charts
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Arunima2007/InvestmentTracker.git
cd InvestmentTracker
```

---

### 2️⃣ Backend Setup (Flask)

```bash
# Navigate to backend
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Start the Flask server (runs on port 5001)
python app.py
```

✅ You should see:
```
 * Running on http://127.0.0.1:5001
 * Debug mode: on
```

> **Note:** The backend runs on port **5001** (not 5000) to avoid conflicts with macOS AirPlay Receiver.

---

### 3️⃣ Frontend Setup (React + Vite)

Open a **new terminal** and run:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the dev server (runs on port 5173)
npm run dev
```

✅ You should see:
```
  VITE ready in ~300ms

  ➜  Local:   http://localhost:5173/
```

---

### 4️⃣ Open the App

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

**Flow:**
1. **Sign Up** → Create an account with name, email & password
2. **Profile** → Fill in your financial details (income, expenses, savings, goal, risk level)
3. **Dashboard** → View your personalized investment allocation, wealth projection, and AI insights
4. **What-If** → Adjust SIP amount or risk level and hit "Simulate" to see updated projections

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/signup` | ❌ | Register a new user |
| `POST` | `/auth/login` | ❌ | Login and get JWT token |
| `GET` | `/profile` | ✅ | Get user profile |
| `POST` | `/profile` | ✅ | Save/update financial profile |
| `GET` | `/recommendation` | ✅ | Get investment allocation |
| `POST` | `/projection` | ✅ | Get wealth projection (supports What-If overrides) |
| `GET` | `/health` | ❌ | Health check |

### Sample API Responses

<details>
<summary><b>POST /auth/signup</b></summary>

**Request:**
```json
{
  "name": "Ananya Sharma",
  "email": "ananya@example.com",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Ananya Sharma",
    "email": "ananya@example.com",
    "profile_complete": false,
    "monthly_income": null,
    "computed_risk_level": null
  }
}
```
</details>

<details>
<summary><b>POST /profile</b></summary>

**Request:**
```json
{
  "monthly_income": 50000,
  "monthly_expenses": 30000,
  "current_savings": 200000,
  "financial_goal": "retirement",
  "time_horizon": 15,
  "risk_tolerance": "medium",
  "income_stability": "stable",
  "monthly_sip": 10000
}
```

**Response (200):**
```json
{
  "message": "Profile updated",
  "user": {
    "id": 1,
    "profile_complete": true,
    "computed_risk_score": 0.575,
    "computed_risk_level": "medium"
  }
}
```
</details>

<details>
<summary><b>POST /projection</b></summary>

**Request (What-If override):**
```json
{
  "monthly_sip": 15000,
  "risk_level": "high"
}
```

**Response (200):**
```json
{
  "projection": {
    "final_corpus": 8542310.45,
    "total_invested": 2900000,
    "total_gains": 5642310.45,
    "projections": [
      { "year": 1, "corpus": 398240.00, "total_invested": 380000, "gains": 18240.00 },
      { "year": 2, "corpus": 617890.50, "total_invested": 560000, "gains": 57890.50 }
    ]
  },
  "recommendation": {
    "risk_level": "high",
    "allocation": { "equity": 80, "high_risk_assets": 20 },
    "expected_annual_return": 0.132
  },
  "insights": [
    {
      "type": "success",
      "icon": "🎉",
      "message": "Great job! You're saving 40% of your income."
    },
    {
      "type": "info",
      "icon": "🚀",
      "message": "Bumping your SIP by ₹2,000 to ₹17,000/month could add a meaningful difference."
    }
  ]
}
```
</details>

---

## 🧠 How the Engines Work

### Risk Profiling
```
risk_score = savings_ratio × 0.50
           + income_stability × 0.25
           + risk_tolerance × 0.25

Score >= 0.65 → High
Score >= 0.40 → Medium
Score <  0.40 → Low
```

### Investment Allocation
| Risk Level | Bonds | Equity | Mutual Funds | High-Risk |
|------------|-------|--------|--------------|-----------|
| Low        | 70%   | 30%    | —            | —         |
| Medium     | 30%   | 50%    | 20%          | —         |
| High       | —     | 80%    | —            | 20%       |

### Wealth Projection
Monthly compounding with SIP:
```
For each month:
  corpus = corpus × (1 + annual_return/12) + monthly_sip
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router 7 |
| Styling | Tailwind CSS v4, Custom glassmorphism |
| Charts | Recharts (Pie, Area) |
| Backend | Flask 3, Flask-JWT-Extended |
| Database | SQLite (via SQLAlchemy) |
| HTTP Client | Axios with JWT interceptors |

---

## 📄 License

This project is built for educational and hackathon purposes.

---

<p align="center">
  Built with 💜 by <b>Team InvestWise</b>
</p>