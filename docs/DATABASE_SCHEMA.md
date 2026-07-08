# Database Schema

Smart Stadiums uses **MongoDB** with Mongoose ODM. Geospatial queries use `2dsphere` indexes on stadium locations.

## Entity Relationship Overview

```
User ──────────► Stadium (assignedStadium)
  │
  ├──► Incident (reportedBy, assignedTo)
  ├──► VolunteerTask (assignedTo)
  ├──► Notification (user)
  └──► Report (author)

Stadium ──────► Match
  │
  ├──► CrowdZone
  ├──► Incident
  ├──► VolunteerTask
  ├──► Notification
  ├──► SustainabilityMetric
  └──► TransportRoute
```

## Collections

### User
| Field | Type | Description |
|-------|------|-------------|
| name | String | Full name |
| email | String | Unique, lowercase |
| password | String | Bcrypt hashed (select: false) |
| role | Enum | fan, volunteer, staff, security, admin |
| preferredLanguage | String | ISO language code (default: en) |
| accessibility | Object | highContrast, screenReader, voiceGuidance, wheelchairAccess |
| assignedStadium | ObjectId | Ref: Stadium |
| isActive | Boolean | Account status |

### Stadium
| Field | Type | Description |
|-------|------|-------------|
| name | String | Stadium name |
| city, country | String | Location |
| capacity | Number | Max seating |
| location | GeoJSON Point | `[lng, lat]` with 2dsphere index |
| zones | Array | Indoor zones with coordinates, floor, accessibility |
| amenities | Array[String] | Available amenities |
| status | Enum | operational, maintenance, evacuation |

### Match
| Field | Type | Description |
|-------|------|-------------|
| stadium | ObjectId | Ref: Stadium |
| homeTeam, awayTeam | String | Team names |
| stage | Enum | group, round16, quarter, semi, third, final |
| scheduledAt | Date | Kickoff time |
| status | Enum | scheduled, live, halftime, completed, postponed |
| homeScore, awayScore | Number | Current score |
| attendance | Number | Current attendance |
| weather | Object | condition, temperature, humidity |

### CrowdZone
| Field | Type | Description |
|-------|------|-------------|
| stadium | ObjectId | Ref: Stadium |
| zoneId, zoneName | String | Zone identifier |
| density | Number | 0-100 percentage |
| capacity, currentCount | Number | Occupancy data |
| trend | Enum | increasing, stable, decreasing |
| predictedDensity15min | Number | AI prediction |
| status | Enum | normal, moderate, congested, critical |

### Incident
| Field | Type | Description |
|-------|------|-------------|
| stadium, match | ObjectId | References |
| title, description | String | Incident details |
| type | Enum | medical, security, crowd, technical, weather, fire, evacuation, other |
| severity | Enum | low, medium, high, critical |
| status | Enum | open, investigating, resolved, closed |
| location | Object | zone, coordinates, floor |
| aiSummary | String | AI-generated summary |
| aiRecommendations | Array[String] | AI action items |

### VolunteerTask
| Field | Type | Description |
|-------|------|-------------|
| stadium, match | ObjectId | References |
| title, description | String | Task details |
| assignedTo | ObjectId | Ref: User |
| priority | Enum | low, medium, high, urgent |
| status | Enum | pending, in_progress, completed, cancelled |
| category | Enum | guest_services, wayfinding, medical_support, operations, security_support, other |

### Notification
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Target user (optional) |
| role | Enum | Target role or "all" |
| title, message | String | Notification content |
| type | Enum | info, alert, warning, emergency, recommendation |
| isRead | Boolean | Read status |

### SustainabilityMetric
| Field | Type | Description |
|-------|------|-------------|
| stadium, match | ObjectId | References |
| energy | Object | consumptionKwh, renewablePercent, peakDemandMw |
| water | Object | usageLiters, recycledPercent |
| waste | Object | totalKg, recycledKg, compostKg, landfillKg |
| carbon | Object | footprintKgCo2, offsetKgCo2, transportEmissionsKg |
| aiSuggestions | Array[String] | Optimization tips |

### TransportRoute
| Field | Type | Description |
|-------|------|-------------|
| stadium | ObjectId | Ref: Stadium |
| name, type | String | Route name and type (shuttle, metro, bus, parking, etc.) |
| origin, destination | Object | name, coordinates |
| durationMinutes, distanceKm | Number | Travel metrics |
| capacity, currentLoad | Number | Availability |
| status | Enum | available, busy, full, delayed, closed |
| accessibility | Object | wheelchairAccessible, elevatorAvailable |

### Report
| Field | Type | Description |
|-------|------|-------------|
| stadium, match | ObjectId | References |
| type | Enum | match_day, incident, operational, executive, security |
| title, content | String | Report content |
| generatedBy | Enum | ai, user |
| metrics | Mixed | Associated KPIs |

## Indexes

- `Stadium.location` — 2dsphere (geospatial queries)
- `CrowdZone.stadium + zoneId` — compound
- `User.email` — unique
