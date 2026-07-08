# Smart Stadiums API Documentation

Base URL: `http://localhost:5000/api` (development) | `https://your-service.run.app/api` (production)

All authenticated endpoints require header: `Authorization: Bearer <JWT_TOKEN>`

---

## Authentication

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "fan",
  "preferredLanguage": "en"
}
```

**Response:** `201` — `{ success, data: { user, token } }`

### POST /auth/login
**Body:** `{ "email", "password" }`  
**Response:** `200` — `{ success, data: { user, token } }`

### GET /auth/me 🔒
Get current user profile.

### PATCH /auth/me/accessibility 🔒
**Body:** `{ "wheelchairAccess": true, "voiceGuidance": true, ... }`

### PATCH /auth/me/language 🔒
**Body:** `{ "language": "es" }`

---

## Stadiums

### GET /stadiums
List all stadiums.

### GET /stadiums/:id
Get stadium by ID with zones.

### GET /stadiums/:id/zones
Get stadium zones for navigation.

### GET /stadiums/nearby/:lng/:lat?radius=50000
Find stadiums near coordinates (meters).

---

## Matches

### GET /matches?stadium=&status=
List matches with optional filters.

### GET /matches/live
Get currently live matches.

### GET /matches/:id
Get match details.

### PATCH /matches/:id/score 🔒 (staff, admin)
**Body:** `{ "homeScore", "awayScore", "status" }`

---

## Crowd Management

### GET /crowd/stadium/:stadiumId
Get crowd zones and congestion alerts.

### GET /crowd/stadium/:stadiumId/heatmap
Get heatmap data for visualization.

### POST /crowd/stadium/:stadiumId/simulate 🔒 (staff, admin)
Trigger crowd density simulation update.

### POST /crowd/route-recommendation 🔒
**Body:** `{ "from", "to", "stadiumId", "accessibility" }`

---

## AI Services

### POST /ai/chat 🔒
**Body:** `{ "message", "stadiumId?", "matchId?" }`  
Returns AI assistant response.

### POST /ai/translate 🔒
**Body:** `{ "text", "targetLanguage" }`  
Supported: en, es, fr, de, pt, ar, zh, ja, ko, it, nl

### POST /ai/navigate 🔒
**Body:** `{ "from", "to", "stadiumId", "accessibility?" }`

---

## Transport

### GET /transport/stadium/:stadiumId
List transport routes for a stadium.

### GET /transport/stadium/:stadiumId/plan 🔒
**Query:** `origin`, `preferences`  
Returns AI transport plan.

### GET /transport/:id
Get route details.

---

## Volunteer

### GET /volunteer/tasks 🔒 (volunteer, staff, admin)
**Query:** `stadium`, `status`

### PATCH /volunteer/tasks/:id 🔒
**Body:** `{ "status": "completed" }`

### POST /volunteer/knowledge 🔒
**Body:** `{ "question" }` — AI knowledge base query.

### GET /volunteer/announcements 🔒
Get volunteer announcements.

---

## Organizer Command Center

### GET /organizer/kpis/:stadiumId 🔒 (staff, security, admin)
Live operational KPIs.

### GET /organizer/summary/:stadiumId 🔒 (staff, admin)
AI-generated operational summary.

### GET /organizer/incidents 🔒
**Query:** `stadium`, `status`

### POST /organizer/incidents 🔒
**Body:** Incident object with optional `aiAnalysis: false` to skip AI.

### PATCH /organizer/incidents/:id 🔒
Update incident status/details.

---

## Security

### GET /security/alerts/:stadiumId 🔒 (security, admin)
Active security and crowd alerts.

### POST /security/evacuation-plan 🔒
**Body:** `{ "stadiumId", "zone", "reason" }`

### GET /security/workflows 🔒
Emergency response workflow templates.

---

## Sustainability

### GET /sustainability/stadium/:stadiumId
Historical sustainability metrics.

### GET /sustainability/stadium/:stadiumId/latest
Latest metrics snapshot.

### POST /sustainability/stadium/:stadiumId/suggestions 🔒 (staff, admin)
Generate AI optimization suggestions.

---

## Notifications & Reports

### GET /notifications 🔒
User/role-based notifications.

### PATCH /notifications/:id/read 🔒
Mark notification as read.

### PATCH /notifications/read-all 🔒
Mark all as read.

### GET /notifications/reports 🔒 (staff, admin)
List generated reports.

### POST /notifications/reports/generate 🔒 (staff, admin)
**Body:** `{ "matchId?", "stadiumId", "type" }`

---

## WebSocket Events (Socket.IO)

**Client → Server:**
- `join:stadium` — `(stadiumId)` Join stadium room
- `join:role` — `(role)` Join role-based room
- `leave:stadium` — `(stadiumId)`

**Server → Client:**
- `crowd:update` — `{ stadiumId, zones[], timestamp }` (every 15s)
- `alert:crowd` — Critical crowd alerts to security/staff roles

---

## Error Responses

```json
{
  "success": false,
  "message": "Error description"
}
```

| Code | Meaning |
|------|---------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden (insufficient role) |
| 404 | Not found |
| 409 | Conflict (duplicate email) |
| 500 | Internal server error |

---

## Health Check

### GET /api/health
**Response:** `{ success: true, message, timestamp }`
