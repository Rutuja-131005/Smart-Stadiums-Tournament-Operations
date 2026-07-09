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

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fifa2026.com | admin123 |
| Organizer | organizer@fifa2026.com | staff123 |
| Security | security@fifa2026.com | security123 |
| Volunteer | volunteer@fifa2026.com | volunteer123 |
| Fan | fan@fifa2026.com | fan123 |

---

# 📁 Project Structure

```text
client/
 ├── src/
 │   ├── app/
 │   ├── components/
 │   ├── contexts/
 │   ├── features/
 │   ├── hooks/
 │   ├── layouts/
 │   ├── pages/
 │   ├── routes/
 │   ├── services/
 │   ├── styles/
 │   └── utils/

server/
 ├── src/
 │   ├── ai/
 │   ├── config/
 │   ├── controllers/
 │   ├── middleware/
 │   ├── models/
 │   ├── repositories/
 │   ├── routes/
 │   ├── scripts/
 │   ├── services/
 │   ├── sockets/
 │   ├── utils/
 │   └── validators/

docs/
docker/
.github/
```

---

# 🚀 Deployment

Supports deployment to:

* Google Cloud Run
* Docker
* Docker Compose
* MongoDB Atlas

Build:

```bash
docker build -t smart-stadiums .
```

Deploy:

```bash
gcloud builds submit --config cloudbuild.yaml
```

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
