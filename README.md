# Muslim Daily Server

[![CI Pipeline](https://github.com/abdutahir-dev/muslim-daily-server/actions/workflows/ci.yml/badge.svg)](https://github.com/abdutahir-dev/muslim-daily-server/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/abdutahir-dev/muslim-daily-server/actions/workflows/pages.yml/badge.svg)](https://abdutahir-dev.github.io/)
[![Production Deployment](https://github.com/abdutahir-dev/muslim-daily-server/actions/workflows/deploy.yml/badge.svg)](https://github.com/abdutahir-dev/muslim-daily-server/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg)](package.json)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](package.json)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-1677ff.svg)](package.json)
[![Express](https://img.shields.io/badge/Express-4.x-000000.svg)](package.json)
[![OpenAPI 3.0](https://img.shields.io/badge/OpenAPI-3.0.3-green.svg)](api/openapi.json)

**Muslim Daily Server** is a production-grade, multi-database RESTful API engine and developer workbench providing comprehensive digital Islamic services: Holy Quran with audio recitations & trilingual translations (Amharic & English), classical Tafsir exegesis, Asbab al-Nuzul (revelation context), Fusha Quranic Arabic Lexicon (Qamus), Asmaul Husna (The 99 Names of Allah), authentic Hadith collections, Duas & Azkar, astronomical prayer timings with habit tracking, multi-calendar conversions (Gregorian, Hijri, Ethiopian), and interactive developer documentations.

---

## 🌐 Live Portals & Deployments

- **Interactive Developer UI Workbench**: [https://abdutahir-dev.github.io/ui](https://abdutahir-dev.github.io/ui) *(or `/ui` on running server)*
- **Interactive Developer Documentation**: [https://abdutahir-dev.github.io/docs](https://abdutahir-dev.github.io/docs) *(or `/docs` on running server)*
- **Swagger UI Playground**: [https://abdutahir-dev.github.io/swagger](https://abdutahir-dev.github.io/swagger) *(or `/swagger` on running server)*
- **OpenAPI 3.0.3 Specification**: [https://abdutahir-dev.github.io/api/openapi.json](https://abdutahir-dev.github.io/api/openapi.json) *(or `/api/openapi.json` on running server)*

---

## 🌟 Core Features & Subsystems

### 📖 1. Holy Quran, Tafsir & Revelation Context Engine
- **Full Surah Metadata**: All 114 Surahs with trilingual names (Arabic, Amharic `አማርኛ`, English), verse counts, ruku counts, revelation place, time of revelation, themes, and spiritual virtues.
- **Cause of Revelation (*Asbab al-Nuzul*)**: In-depth historical causes and contexts behind Surahs and Ayahs in Arabic, Amharic, and English.
- **Trilingual Translations & Tafsirs**: Uthmani Arabic script paired with Sahih International (English) and Muhammed Sadiq & Muhammed Sani Habib (Amharic) translations, alongside classical Tafsir exegesis (*Al-Muyassar*, *Ibn Kathir*, and Scholarly Committee Amharic Tafsir).
- **Random Ayahs Endpoint (`/api/quran/ayahs/random`)**: Delivers 7 random Ayahs by default (configurable up to 50) enriched with translations, Tafsir exegesis, and full Surah revelation context.
- **Audio Streaming**: Verse-by-verse audio recitation streaming support.

### ✨ 2. Asmaul Husna (The 99 Names of Allah)
- Trilingual presentation in **Arabic (العربية)**, **Amharic (አማርኛ)**, and **English**.
- Detailed theological descriptions, 100% Quranic verse citations with Arabic Ayah texts, authenticated Hadith references, and diacritic-tolerant search.

### 🔍 3. Fusha Qamus Quranic Lexicon
- **2,092 Certified Lexicon Entries** across **1,091 distinct roots**.
- Structural morphological analysis, root breakdowns, **7,700 Ayah occurrence transclusions**, and 39+ syntactic part-of-speech color highlighting.

### 🕌 4. Prayer Times & Habit Tracking
- High-precision astronomical calculation methods (*Muslim World League, ISNA, Umm Al-Qura, Egypt, Karachi*).
- User habit tracking, prayer streak counters, fasting logs, and historical analytics.

### 📜 5. Canonical Hadith Collections
- Authenticated Hadith texts from *Sahih al-Bukhari*, *Sahih Muslim*, and *Sunan an-Nasa'i*.
- Search by book, chapter, or keywords in Arabic and English, plus daily Hadith notification schedules.

### 🤲 6. Authentic Duas, Azkar & Wisdom Quotes
- Categorized supplications for morning, evening, after prayer, travel, and distress.
- Transliterations, audio guides, source references, and curated Islamic quotes.

### 📅 7. Multi-Calendar Transformation
- High-precision mathematical Julian Day Number (JDN) conversions between **Gregorian**, **Islamic Hijri**, and **Ethiopian** calendar systems.

### 🔐 8. Authentication & Persistent Cloud Storage
- **JWT & Firebase Authentication**: Token validation for secured user routes.
- **Firebase Firestore Integration**: Persistent user profiles, prayer tracking logs, fasting entries, and spiritual journal entries.

---

## 📁 Architecture & Directory Structure

> 💡 **For detailed architectural diagrams, subsystem deep-dives, and database schemas, see [ARCHITECTURE.md](ARCHITECTURE.md).**

```text
├── .github/
│   └── workflows/
│       ├── ci.yml                 # PR & push automated lint, typecheck, tests
│       └── deploy.yml             # Production deployment pipeline & health verification
├── data/
│   ├── qamus/                     # Certified lexicon entries, manifest, spine & ontology
│   ├── quran_surahs.json          # Curated Surah revelation metadata (causes, time, place)
│   └── quran_ayahs.json           # Selected Ayahs with Amharic translations & Tafsirs
├── server/
│   └── app.ts                     # Express server startup wrapper
├── src/
│   ├── app.js                     # Primary Express router and middleware configuration
│   ├── controllers/               # Request handlers (quran, qamus, hadith, prayers, etc.)
│   ├── db/
│   │   └── connection.js          # Multi-database manager using WASM sql.js (9 databases)
│   ├── docs/
│   │   ├── docsRouter.js          # Static & interactive documentation router (/docs, /swagger)
│   │   └── openapiSpec.js         # OpenAPI 3.0.3 specification object
│   ├── middleware/                # JWT auth, Firebase auth, CORS, security headers, rate limiters
│   ├── routes/                    # Express REST route definitions (/api/quran, /qamus, etc.)
│   ├── services/                  # Business logic & data calculation services
│   ├── ui/                        # React + Ant Design + TypeScript interactive workbench
│   └── utils/                     # Calendar transformation & astronomical prayer math
├── __tests__/                     # Jest integration and unit test suites
├── db/                            # Persistent SQLite database storage files
├── scripts/
│   └── build_static_docs.js       # Bundles OpenAPI, Swagger, and UI assets for static hosting
├── ARCHITECTURE.md                # Comprehensive architectural specification document
├── metadata.json                  # Application metadata & frame permissions configuration
├── package.json                   # Project dependencies and script declarations
└── index.js                       # Entry point binding HTTP listener to port 3000
```

---

## 🗄️ Multi-Database Architecture

Muslim Daily uses 9 domain-partitioned databases powered by a persistent WebAssembly SQLite engine (`sql.js`), eliminating native C++ build dependencies while delivering fast ACID storage:

| Database File | Storage Domain & Description |
| :--- | :--- |
| `quran.sqlite` | 114 Surahs with revelation causes, times, and places; 6,236 Ayahs, Uthmani script, Amharic/English translations, and Tafsirs |
| `asmaul_husna.sqlite` | 99 Names of Allah with trilingual translations, descriptions, and Quranic/Hadith citations |
| `qamus.sqlite` | Quranic Lexicon containing 2,092 entries, 1,091 roots, and 7,700 Ayah occurrence links |
| `hadith.sqlite` | Canonical Hadith books, chapters, narrations, search indices, and daily schedules |
| `prayers.sqlite` | Astronomical prayer timing calculation caches and location coordinates |
| `dua.sqlite` | Classified supplications, Azkar, Arabic text, transliterations, and references |
| `quotes.sqlite` | Islamic wisdom sayings and spiritual quotes categorized by topics |
| `deenbot.sqlite` | User accounts, local session tokens, prayer streak counters, and habit logs |
| `reflections.sqlite` | Spiritual journaling entries, reflections, and community challenge logs |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 20.0.0` (LTS recommended)
- **npm**: `>= 10.0.0`

### Installation
```bash
git clone https://github.com/abdutahir-dev/muslim-daily-server.git
cd muslim-daily-server
npm install
```

### Environment Setup
Create a `.env` file in the project root (refer to `.env.example`):
```bash
cp .env.example .env
```

| Environment Variable | Description | Default Value |
| :--- | :--- | :--- |
| `PORT` | Listening HTTP port for the Express application | `3000` |
| `NODE_ENV` | Environment stage (`development` / `production`) | `development` |
| `JWT_SECRET` | Secret key used for signing JWT authentication tokens | *Configured per environment* |
| `CORS_ORIGINS` | Allowed origins header for cross-domain requests | `*` |

---

## 🛠️ CLI Commands & Development

```bash
# Start development server with hot re-compilation
npm run dev

# Execute Jest test suites
npm run test

# Run linter and typecheck verification
npm run lint

# Build static documentation and UI web assets
node scripts/build_static_docs.js

# Start production server
npm start
```

---

## 📑 API Endpoint Summary

| Category | Method | Route | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/health` | Server health status and database connectivity check |
| **Quran** | `GET` | `/api/quran/surahs` | List all 114 Surahs with trilingual names, causes, and times of revelation |
| **Quran** | `GET` | `/api/quran/surahs/:id` | Get Surah detail with Ayahs, translations, and Tafsirs |
| **Quran** | `GET` | `/api/quran/ayahs/random` | Get 7 random Ayahs enriched with Amharic/English translations, Tafsirs, and revelation context |
| **Quran** | `GET` | `/api/quran/ayahs/single` | Get a single random Ayah with translations and Tafsir exegesis |
| **Asmaul Husna** | `GET` | `/api/asmaul-husna` | Get all 99 Names of Allah in Arabic, Amharic, and English with citations |
| **Qamus Lexicon** | `GET` | `/qamus/words` | Search and filter 2,092 Quranic dictionary entries by root or category |
| **Prayers** | `GET` | `/api/prayers/times` | Calculate astronomical prayer timings for coordinates or city |
| **Hadith** | `GET` | `/api/hadiths/random` | Fetch a random authenticated Hadith narration |
| **Calendar** | `GET` | `/api/calendar/convert` | Convert date between Gregorian, Hijri, and Ethiopian calendar systems |

---

## 💻 Integration Code Examples

### cURL
```bash
curl -X GET "http://localhost:3000/api/quran/ayahs/random?count=7" \
     -H "Accept: application/json"
```

### JavaScript / Fetch
```javascript
const response = await fetch('http://localhost:3000/api/quran/ayahs/random?count=7');
const ayahs = await response.json();

console.log(`Retrieved ${ayahs.length} random ayahs:`);
ayahs.forEach(a => {
  console.log(`[Surah ${a.surah.name_simple} ${a.verse_key}]`);
  console.log(`Arabic: ${a.text_uthmani}`);
  console.log(`Amharic: ${a.translation_am}`);
  console.log(`English: ${a.translation_en}`);
  console.log(`Cause of Revelation: ${a.surah.cause_of_revelation}`);
});
```

### Python
```python
import requests

url = "http://localhost:3000/api/quran/ayahs/random"
params = {"count": 7}

response = requests.get(url, params=params)
if response.status_code == 200:
    data = response.json()
    for item in data:
        print(f"Surah {item['surah']['name_simple']} ({item['verse_key']}): {item['translation_am']}")
```

---

## 🔄 CI/CD & Deployment

- **Continuous Integration (`.github/workflows/ci.yml`)**: Automated pipeline verifying syntax linting, TypeScript compilation (`tsc --noEmit`), and Jest integration test suites on every pull request and push.
- **Continuous Deployment (`.github/workflows/deploy.yml`)**: Automated release gate deploying containerized application builds to Cloud Run with zero-downtime health verification.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
