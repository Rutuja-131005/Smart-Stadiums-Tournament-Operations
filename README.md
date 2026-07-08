# Smart Stadiums & Tournament Operations
## FIFA World Cup 2026 — AI-Driven Stadium Operations Platform

A production-ready full-stack web application that improves stadium operations and enhances the tournament experience for fans, organizers, volunteers, venue staff, and security teams.

![Tech Stack](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb)
![AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=flat&logo=google)

## Features

| Module | Capabilities |
|--------|-------------|
| **AI Fan Assistant** | Natural-language chat, voice input, multilingual translation |
| **Indoor Navigation** | Interactive Leaflet maps, accessible route guidance |
| **Crowd Management** | Real-time density visualization, congestion prediction, AI routing |
| **Transport Planner** | Parking, shuttle, metro integration with AI recommendations |
| **Volunteer Dashboard** | Task management, announcements, AI knowledge base |
| **Organizer Command Center** | Live KPIs, AI summaries, incident tracking, analytics charts |
| **Security Dashboard** | AI alerts, evacuation planning, emergency workflows |
| **Sustainability** | Energy, water, waste, carbon metrics with AI optimization |
| **Notifications** | Real-time alerts and role-based recommendations |
| **Reports** | AI-generated match-day and operational reports |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│  Tailwind CSS · Framer Motion · Chart.js · Leaflet · Socket │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API + WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                  Node.js / Express Backend                   │
│  JWT Auth · Socket.IO · Gemini AI · Rate Limiting · Helmet  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     MongoDB (Mongoose)                       │
│              Geospatial indexes · Role-based data            │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 7+ (local or Docker)
- Google Gemini API key (optional — fallback responses work without it)

### 1. Clone & Install

```bash
cd "Smart Stadiums & Tournament Operations"
npm run install:all
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/smart-stadiums
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key   # optional
```

### 3. Start MongoDB

```bash
npm run docker:up
# OR use a local MongoDB instance
```

### 4. Seed Database

```bash
npm run seed
```

### 5. Run Development Servers

```bash
npm run dev
```

- **Client Frontend:** http://localhost:5173
- **Server API:** http://localhost:5000/api
- **API Health:** http://localhost:5000/api/health
- **Liveness Probe:** http://localhost:5000/health/liveness
- **Readiness Probe:** http://localhost:5000/health/readiness

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fifa2026.com | admin123 |
| Organizer | organizer@fifa2026.com | staff123 |
| Security | security@fifa2026.com | security123 |
| Volunteer | volunteer@fifa2026.com | volunteer123 |
| Fan | fan@fifa2026.com | fan123 |

## Project Structure

```
├── server/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose schemas (10 models)
│   │   ├── routes/         # REST API route handlers
│   │   ├── services/       # Business logic & Gemini AI
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── sockets/        # Socket.IO real-time events
│   │   ├── scripts/        # Database seed script
│   │   └── server.js       # Application entry point
│   └── tests/              # Jest integration tests
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # Auth, Theme, Socket providers
│   │   ├── pages/          # Route pages / dashboards
│   │   ├── services/       # API client
│   │   └── test/           # Vitest unit tests
│   └── public/
├── docs/
│   ├── API.md              # REST API documentation
│   └── DATABASE_SCHEMA.md  # MongoDB schema reference
├── Dockerfile              # Production multi-stage build
├── docker-compose.yml      # MongoDB + dev/prod services
└── cloudbuild.yaml         # Google Cloud Run deployment
```

## Testing

```bash
# Run all tests
npm test

# Server only
npm test --prefix server

# Client only
npm test --prefix client
```

## Docker Deployment

### Development (with hot reload)
```bash
docker-compose --profile dev up
```

### Production
```bash
docker build -t smart-stadiums .
docker run -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/smart-stadiums \
  -e JWT_SECRET=production-secret \
  -e GEMINI_API_KEY=your-key \
  smart-stadiums
```

## Google Cloud Run Deployment

### Prerequisites
- Google Cloud project with Cloud Run and Cloud Build APIs enabled
- MongoDB Atlas cluster (recommended for production)
- Artifact Registry repository

### Deploy

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud builds submit --config cloudbuild.yaml

# Or manual deploy
gcloud run deploy smart-stadiums \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_URI=mongodb+srv://...,JWT_SECRET=...,GEMINI_API_KEY=..."
```

See `cloudbuild.yaml` for CI/CD pipeline configuration.

## API Documentation

Full REST API reference: [docs/API.md](docs/API.md)  
Database schema: [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)

## Role-Based Access

| Route | fan | volunteer | staff | security | admin |
|-------|-----|-----------|-------|----------|-------|
| Fan Hub | ✅ | ✅ | ✅ | ✅ | ✅ |
| Navigation | ✅ | ✅ | ✅ | ✅ | ✅ |
| Transport | ✅ | ✅ | ✅ | ✅ | ✅ |
| Volunteer Dashboard | ❌ | ✅ | ✅ | ✅ |
| Command Center | ❌ | ❌ | ✅ | ❌ | ✅ |
| Security Dashboard | ❌ | ❌ | ❌ | ✅ | ✅ |
| Sustainability | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reports | ❌ | ❌ | ✅ | ❌ | ✅ |

## Accessibility (WCAG)

- Skip-to-content link
- ARIA labels on interactive elements
- High-contrast mode toggle
- Screen reader optimized layouts
- Keyboard navigable forms
- Voice guidance for navigation routes
- Wheelchair-accessible route planning

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| MONGODB_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | JWT signing secret |
| GEMINI_API_KEY | No | Google Gemini API key (fallback AI without it) |
| PORT | No | Server port (default: 5000) |
| CORS_ORIGIN | No | Allowed frontend origin |
| LOG_LEVEL | No | Winston log level (default: info) |

## License

MIT — Built for FIFA World Cup 2026 Smart Stadium Operations demonstration.
