# Muslim Daily Server

[![CI Pipeline](https://github.com/abdutahir-dev/muslim-daily-server/actions/workflows/ci.yml/badge.svg)](https://github.com/abdutahir-dev/muslim-daily-server/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/abdutahir-dev/muslim-daily-server/actions/workflows/pages.yml/badge.svg)](https://abdutahir-dev.github.io/)
[![Production Deployment](https://github.com/abdutahir-dev/muslim-daily-server/actions/workflows/deploy.yml/badge.svg)](https://github.com/abdutahir-dev/muslim-daily-server/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg)](package.json)
[![OpenAPI 3.0](https://img.shields.io/badge/OpenAPI-3.0.3-green.svg)](api/openapi.json)

Production-grade RESTful API server providing comprehensive Islamic digital services: Holy Quran with audio recitations & translations, accurate astronomical prayer timings & habit tracking, authenticated Hadith collections, authentic Duas & Azkar, multi-system calendar conversions (Gregorian, Hijri, Ethiopian), fasting logs, spiritual journaling, community challenges, and interactive developer documentation.

### 🌐 Live Portals & Deployments

- **Interactive UI Playground**: [https://abdutahir-dev.github.io/ui](https://abdutahir-dev.github.io/ui) (or `/ui` on running server)
- **Developer Documentation**: [https://abdutahir-dev.github.io/docs](https://abdutahir-dev.github.io/docs) (or `/docs` on running server)
- **Swagger UI Playground**: [https://abdutahir-dev.github.io/swagger](https://abdutahir-dev.github.io/swagger) (or `/swagger` on running server)
- **OpenAPI 3.0 Spec**: [https://abdutahir-dev.github.io/api/openapi.json](https://abdutahir-dev.github.io/api/openapi.json)


---

## 🌟 Key Features

- **📖 Holy Quran Engine**: Full 114 Surahs, 6,236 Ayahs, Uthmani script, translations (Sahih International), classical Tafsir exegesis, and Ayah-by-Ayah audio streaming.
- **🔍 Fusha Qamus Quranic Lexicon**: 2,092 certified entries, 1,091 distinct roots, morphology, 7,700 Ayah occurrence transclusions, and 39+ syntactic part-of-speech color classes.
- **🕌 Prayer Times & Tracker**: High-precision astronomical calculation methods (MWL, ISNA, Umm Al-Qura, Egypt) with user habit tracking, streaks, and analytics.
- **📜 Hadith Collections**: Canonical collections (Sahih al-Bukhari, Sahih Muslim, Sunan an-Nasa'i) with Arabic text, English translations, and daily Hadith scheduling.
- **🤲 Duas & Azkar**: Morning/evening dhikr, prayer supplications, transliterations, and references.
- **📅 Multi-Calendar Transformation**: Mathematical Julian Day Number (JDN) conversions between Gregorian, Islamic Hijri, and Ethiopian calendar systems.
- **🔐 Security & Middleware**: Helmet security headers, CORS origin whitelisting via `CORS_ORIGINS`, Morgan HTTP logging, and JWT authentication.
- **🔥 Firebase & Cloud Firestore**: Firebase Authentication token verification and Cloud Firestore cloud persistence for user profiles, prayer tracking logs, fasting logs, and spiritual journaling.
- **⚡ Developer Experience**: Built-in interactive documentation at `/docs`, UI playground at `/ui`, and full Swagger UI at `/swagger`.

---

## 📁 Architecture & Folder Structure

> 💡 **For detailed architectural diagrams, subsystem deep-dives, and database schemas, see [ARCHITECTURE.md](ARCHITECTURE.md).**

```text
├── .github/
│   └── workflows/
│       ├── ci.yml                 # PR & push automated lint, typecheck, tests
│       └── deploy.yml             # Production deployment pipeline & health verification
├── data/
│   └── qamus/                     # Certified lexicon entries, manifest, spine & ontology
├── server/
│   └── app.ts                     # TypeScript entry point (morgan, helmet, cors)
├── src/
│   ├── app.js                     # Express application & route configuration
│   ├── db/
│   │   └── connection.js          # Multi-database manager using WASM sql.js (7 databases)
│   ├── docs/
│   │   ├── docsRouter.js          # Interactive /docs and /swagger UI router
│   │   └── openapiSpec.js         # OpenAPI 3.0.3 specification
│   ├── controllers/               # Express request controllers (qamus, hadith, prayers, etc.)
│   ├── middleware/                # JWT auth, Firebase auth, validation, rate limiting
│   ├── routes/                    # RESTful route definitions (/qamus, /api/quran, etc.)
│   ├── services/                  # Business logic (qamusService, hadithService, etc.)
│   ├── ui/                        # React + Ant Design interactive workbench
│   └── utils/                     # Calendar conversions, astronomical math
├── __tests__/                     # Jest unit and integration test suites
├── db/                            # Domain SQLite database storage files
└── index.js                       # Server startup & port binding (3000)
```

### Database Architecture
Muslim Daily utilizes 7 domain-partitioned databases powered by a persistent WebAssembly SQLite layer (`sql.js`), eliminating native compilation dependencies (`glibc` issues) while ensuring fast ACID storage:
- `quran.sqlite`: Surahs, Ayahs, Uthmani calligraphy, and audio metadata
- `qamus.sqlite`: Fusha Quranic Arabic Lexicon (2,092 entries, 1,091 roots, Ayah transclusions)
- `prayers.sqlite`: Prayer calculation caches and geographical coordinates
- `hadith.sqlite`: Hadith books, sections, narrations, and daily schedules
- `dua.sqlite`: Classified supplications, Arabic text, and transliterations
- `quotes.sqlite`: Islamic wisdom sayings categorized by spiritual topics
- `deenbot.sqlite`: Users, authentication, prayer logs, streaks, and groups

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 20.0.0` (LTS recommended)
- npm `>= 10.0.0`

### Installation
```bash
git clone https://github.com/abdutahir-dev/muslim-daily-server.git
cd muslim-daily-server
npm install
```

### Environment Configuration
Copy `.env.example` to `.env` and configure your settings:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP server listening port | `3000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `JWT_SECRET` | Secret key for signing authentication JWT tokens | *Required in production* |
| `CORS_ORIGINS` | Comma-separated list of allowed CORS origins | `*` |

### Running the Application
```bash
# Development server with auto-reload
npm run dev

# Run test suite
npm test

# Run linter & TypeScript type check
npm run lint

# Production start
npm start
```

---

## 📖 API Documentation & Playground

The server provides built-in interactive developer tools:

- **Developer Documentation**: Navigate to [`/docs`](http://localhost:3000/docs) for the full API guide, architecture overview, cURL/Fetch/Python examples, and live in-browser request runners.
- **Interactive Swagger UI**: Navigate to [`/swagger`](http://localhost:3000/swagger) or [`/swager`](http://localhost:3000/swager) for OpenAPI 3.0 exploration with interactive "Try it out" requests.
- **OpenAPI JSON Spec**: Available at [`/api/openapi.json`](http://localhost:3000/api/openapi.json) and [`/swagger.json`](http://localhost:3000/swagger.json).
- **Health Check**: Available at [`/health`](http://localhost:3000/health) and [`/api/health`](http://localhost:3000/api/health).

---

## 🔄 CI/CD Pipelines

Automated pipelines are implemented via GitHub Actions:

1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Triggers on pull requests and pushes to `main` and `master`.
   - Runs syntax linting, TypeScript type-checking (`tsc --noEmit`), and Jest unit test suites across Node.js `20.x` and `22.x`.
   - Validates production compilation readiness.

2. **Continuous Deployment (`.github/workflows/deploy.yml`)**:
   - Triggers on merges to `main` branch or manual `workflow_dispatch`.
   - Executes pre-deployment validation gate.
   - Deploys containerized application to Google Cloud Run / Docker environments.
   - Executes automated post-deployment health check pinging `/health` to guarantee zero-downtime rollouts.
