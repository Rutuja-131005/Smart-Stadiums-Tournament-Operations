# 🏟️ Smart Stadiums & Tournament Operations

### **GenAI-Powered Smart Stadium Operations Platform for FIFA World Cup 2026**

An enterprise-grade, AI-powered platform designed to enhance stadium operations and elevate the tournament experience for **fans, organizers, volunteers, security personnel, and venue staff**. The application combines **Generative AI, real-time analytics, geospatial intelligence, and operational dashboards** to support intelligent decision-making during large-scale sporting events.

**Live Deployed Platform:** [https://smart-stadiums-6p7vbn2sca-uc.a.run.app/](https://smart-stadiums-6p7vbn2sca-uc.a.run.app/)

---

## 🚀 Project Overview

Smart Stadiums & Tournament Operations is a production-ready full-stack application that leverages **Google Gemini AI** to provide intelligent recommendations, operational summaries, multilingual assistance, crowd management insights, transportation guidance, sustainability analytics, and real-time stadium intelligence.

The platform demonstrates how modern AI can improve the management of high-capacity sporting venues while delivering a seamless digital experience for spectators and operational teams.

---

## ✨ Key Highlights

* 🤖 AI-Powered Fan & Operations Assistant
* 🗺️ Interactive Indoor Stadium Navigation
* 👥 Live Crowd Monitoring & Congestion Prediction
* 🌍 Multilingual AI Translation
* 🚍 Smart Transportation & Parking Guidance
* 📊 Organizer Command Center
* 🛡 Security Operations Dashboard
* 🌱 Sustainability Analytics & AI Recommendations
* 📡 Real-Time Notifications using Socket.IO
* 📈 AI-Generated Operational & Match Reports
* 🔐 Secure Role-Based Authentication
* ☁️ Google Cloud Run Ready
* 📱 Fully Responsive Design
* 🌙 Dark / Light Theme Support

---

## 🏗️ System Architecture

```text
                          Users
     ┌───────────────────────────────────────────┐
     │ Fans │ Volunteers │ Staff │ Security │ Admin │
     └───────────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────┐
│                React Frontend (Vite)                       │
│ Tailwind CSS • Framer Motion • Leaflet • Chart.js          │
│ React Router • Socket.IO Client                            │
└───────────────────────┬────────────────────────────────────┘
                        │
          REST API + WebSockets + JWT
                        │
┌───────────────────────▼────────────────────────────────────┐
│                Node.js + Express Backend                   │
│ JWT Authentication • Gemini AI • Socket.IO                │
└───────────────────────┬────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────┐
│                    MongoDB Database                        │
│ Mongoose • Geospatial Indexes • Role-Based Data           │
└────────────────────────────────────────────────────────────┘
```

---

# 🎯 Core Modules

| Module                      | Description                                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| 🤖 AI Fan Assistant         | Natural language conversations, voice interaction, multilingual support |
| 🗺 Indoor Navigation        | Interactive maps with accessible route guidance                         |
| 👥 Crowd Intelligence       | Live crowd density visualization and congestion prediction              |
| 🚍 Smart Transport          | AI-assisted parking, shuttle, metro and traffic recommendations         |
| 🙋 Volunteer Dashboard      | Task management, announcements and AI knowledge assistant               |
| 📊 Organizer Command Center | Live KPIs, analytics, AI operational summaries and incident management  |
| 🛡 Security Dashboard       | Emergency response, AI alerts and evacuation planning                   |
| 🌱 Sustainability Center    | Carbon footprint, waste, energy and water monitoring                    |
| 🔔 Notification Center      | Real-time alerts, announcements and operational updates                 |
| 📄 AI Reports               | Match reports, executive summaries and operational analytics            |

---

# 🧠 AI Capabilities

Google Gemini powers intelligent features across the platform:

* Operational summaries
* Incident summarization
* Crowd risk analysis
* Transportation recommendations
* Multilingual translation
* Accessibility assistance
* Volunteer task guidance
* Security recommendations
* Sustainability insights
* Executive dashboards
* Match-day reports
* AI-powered decision support

---

# 🛠️ Technology Stack

### Frontend

* React (Vite)
* JavaScript
* Tailwind CSS
* Framer Motion
* React Router
* Chart.js
* Leaflet
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT Authentication
* Helmet
* Express Validator

### Database

* MongoDB
* Mongoose

### Artificial Intelligence

* Google Gemini API

### DevOps

* Docker
* Docker Compose
* Google Cloud Run
* Cloud Build

---

# ⚡ Quick Start

## Prerequisites

* Node.js 20+
* MongoDB 7+
* Docker (Optional)
* Google Gemini API Key (Optional)

---

## Clone Repository

```bash
git clone <repository-url>
cd "Smart Stadiums & Tournament Operations"
```

---

## Install Dependencies

```bash
npm run install:all
```

---

## Configure Environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Example:

```env
MONGODB_URI=mongodb://localhost:27017/smart-stadiums
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

---

## Start MongoDB

```bash
npm run docker:up
```

or use an existing MongoDB instance.

---

## Seed Database

```bash
npm run seed
```

---

## Run Application

```bash
npm run dev
```

---

# 📁 Project Structure

```text
client/
 ├── src/
 │   ├── components/      # Reusable UI components
 │   ├── contexts/        # React Context providers (Auth, Theme)
 │   ├── hooks/           # Custom hooks (useDebounce, useAIChat, useCrowdData)
 │   ├── pages/           # Route-level page components (lazy-loaded)
 │   ├── services/        # API client wrappers
 │   ├── test/            # Vitest unit tests
 │   ├── utils/           # Sanitization, helpers
 │   └── validators/      # Zod validation schemas

server/
 ├── src/
 │   ├── config/          # Database connection, seed data, credentials
 │   ├── middleware/       # Auth, error handling, rate limiting
 │   ├── models/          # Mongoose schemas (Stadium, Match, CrowdZone, etc.)
 │   ├── routes/          # Express route handlers
 │   ├── services/        # Business logic (auth, crowd, match, gemini AI)
 │   ├── sockets/         # Socket.IO real-time event handlers
 │   ├── utils/           # Logger, AppError, in-memory cache
 │   └── validators/      # Zod request validation schemas
 ├── tests/               # Jest + Supertest integration tests

docs/                     # API & Database schema documentation
.github/workflows/        # CI/CD GitHub Actions (test.yml, ci.yml)
```

---

# 🧪 Testing

The platform includes a comprehensive automated test suite covering backend logic, API integration, and frontend components.

### Backend (Jest + Supertest)

| Test Suite | Coverage Area |
| --- | --- |
| `validators.test.js` | Zod schema validation (auth, chat, navigation) |
| `api.test.js` | Auth routes: register, login, duplicate rejection, protected endpoints |
| `stadiumOperations.test.js` | Stadium CRUD, match scheduling, crowd density, queue alerts, edge cases |
| `authDefaults.test.js` | Credential configuration and seeding verification |

### Frontend (Vitest + React Testing Library)

| Test Suite | Coverage Area |
| --- | --- |
| `auth.test.js` | Login/register Zod schema validation |
| `useLocalStorage.test.js` | LocalStorage persistence hook |
| `useAIChat.test.js` | AI chat state management |
| `app.test.js` | Root component rendering |
| `sanitize.test.js` | Input sanitization utilities |

### Running Tests

```bash
# Run all tests (backend + frontend)
npm test

# Backend only (with coverage report)
npm test --prefix server

# Frontend only
npm test --prefix client
```

### CI/CD

GitHub Actions workflows automatically run:
- Full test suites on Node.js 18 and 20
- ESLint code quality checks
- Build verification

See `.github/workflows/test.yml` for the pipeline configuration.

---

# ⚡ Performance Optimizations

| Optimization | Implementation |
| --- | --- |
| **In-Memory API Cache** | TTL-based cache (`server/src/utils/cache.js`) on stadium and match endpoints reduces database query load |
| **Route-Based Code Splitting** | `React.lazy()` + `Suspense` in `App.jsx` minimizes initial bundle size |
| **Debounced User Input** | Custom `useDebounce` hook throttles search/filter API calls |
| **Database Indexing** | Geospatial `2dsphere` index on stadiums, compound indexes on crowd zones |
| **Selective Field Fetching** | Mongoose `.select()` projections to avoid loading full documents |
| **WebSocket Efficiency** | Socket.IO for real-time crowd updates instead of HTTP polling |

---

# 🧠 AI Prompt Engineering Methodology

The platform uses **Google Gemini 1.5 Flash** with carefully crafted system prompts for each operational domain:

### Prompt Design Principles

1. **Role Assignment**: Each prompt assigns Gemini a specific expert persona (e.g., "You are a FIFA World Cup 2026 stadium operations AI assistant").
2. **Contextual Grounding**: Live stadium data, crowd density metrics, and match schedules are injected into prompts as structured context.
3. **Output Format Control**: Prompts specify expected response formats (JSON, markdown, bullet points) for consistent frontend rendering.
4. **Safety Boundaries**: System prompts include guardrails to keep responses relevant to stadium operations and prevent hallucinations.
5. **Multilingual Support**: Translation prompts use explicit source/target language specifications for accurate i18n support.

### AI Feature Integration Points

| Feature | AI Integration |
| --- | --- |
| Fan Assistant Chat | Context-aware Q&A about venues, matches, and navigation |
| Crowd Density Prediction | AI analysis of zone trends with evacuation recommendations |
| Route Recommendation | Gemini generates optimal paths based on real-time crowd data |
| Match Reports | Automated post-match summaries from live score data |
| Operational Summaries | AI-generated executive dashboards for organizers |
| Security Alerts | Intelligent threat assessment and response recommendations |
| Sustainability Insights | AI recommendations for carbon footprint reduction |

---

# 🎯 Problem Statement Alignment

This platform directly addresses all core domains of **Smart Stadiums & Tournament Operations**:

| Domain | Implementation |
| --- | --- |
| **Smart Ticketing & Seat Layout** | Real-time seat availability dashboard with zone-based capacity tracking across 16 FIFA venues |
| **Crowd & Queue Management** | Live density heatmaps, congestion alerts, predictive 15-min forecasts, and AI-powered evacuation routing |
| **Tournament Management** | Dynamic match scheduling, live score tracking, automated standings, and group-stage management |
| **AI Feature Integration** | Google Gemini powers fan assistance, crowd prediction, route optimization, report generation, and multilingual translation |
| **Security Operations** | Real-time incident management, AI threat assessment, and emergency response coordination |
| **Sustainability** | Carbon footprint tracking, waste management analytics, and AI sustainability recommendations |

---

# 🚀 Deployment

Supports deployment to:

* **Vercel** (Frontend Client)
* Google Cloud Run (Backend API)
* Docker & Docker Compose
* MongoDB Atlas

### ⚡ Vercel Deployment (Frontend)
The website is fully configured for deployment on **Vercel**:

1. **Option A (Recommended)**: Set Vercel's **Root Directory** to `client/` in the Vercel dashboard. It will automatically build and route using the configuration in [client/vercel.json](client/vercel.json).
2. **Option B (Root-Level)**: Deploy the repository root directly to Vercel. It will use the root [vercel.json](vercel.json) and execute the custom root `build` script to install client dependencies and build the React app.

Make sure to set the `VITE_API_URL` and `VITE_SOCKET_URL` environment variables in your Vercel project settings to point to your backend API.

### 🐳 Docker & Google Cloud Run (Full Monorepo / Backend)
Build container:
```bash
docker build -t smart-stadiums .
```

Deploy to Google Cloud Run:
```bash
gcloud builds submit --config cloudbuild.yaml
```

**Live Deployed Platform:** [https://smart-stadiums-6p7vbn2sca-uc.a.run.app/](https://smart-stadiums-6p7vbn2sca-uc.a.run.app/)

---

# 📚 Documentation

| Document           | Description                  |
| ------------------ | ---------------------------- |
| API.md             | [REST API Reference](docs/API.md) |
| DATABASE_SCHEMA.md | [MongoDB Schema Documentation](docs/DATABASE_SCHEMA.md) |
| README.md          | Project Overview & Setup     |

---

# 🛣️ Roadmap

* Indoor AR Navigation
* Predictive Crowd Analytics
* IoT Sensor Integration
* Smart Parking Optimization
* AI Voice Announcements
* Advanced Sustainability Insights
* Emergency Response Automation
* Progressive Web App (PWA)
* Offline Support

---

# 🤝 Contributing

Contributions are welcome. Please open an issue before submitting major changes.

---

# 📄 License

Licensed under the **MIT License**.

---

## ⭐ Built With

**React • Node.js • Express • MongoDB • Google Gemini AI • Socket.IO • Leaflet • Chart.js • Tailwind CSS • Docker • Google Cloud Run**

> *Building the future of AI-powered stadium operations for global sporting events.*

