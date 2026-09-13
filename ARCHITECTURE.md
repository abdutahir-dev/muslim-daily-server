# Muslim Daily Architecture & Technical Design

Muslim Daily is a production-grade Islamic backend service engineered in Node.js, Express, TypeScript, WebAssembly SQLite, and Google Cloud Firestore. It powers prayer calculations, Holy Quran recitation and translations, authentic Hadith collections, authentic Duas, multi-calendar transformations, and the certified **Fusha Qamus Quranic Lexicon**.

---

## 1. High-Level System Architecture

Muslim Daily follows a clean, modular layered architecture combining high-speed local WebAssembly SQLite domain storage with scalable Cloud Firestore synchronization for user-authored state.

```text
+---------------------------------------------------------------------------------------+
|                                    CLIENT LAYER                                       |
|  +---------------------+  +----------------------+  +-------------------------------+ |
|  |  React UI Tester    |  |  Swagger UI Console  |  |  Interactive Developer Docs   | |
|  |       (/ui)         |  |      (/swagger)      |  |            (/docs)            | |
|  +---------------------+  +----------------------+  +-------------------------------+ |
|  |  External iOS/Android Mobile Apps             |  |  Web Frontend Clients         | |
+---------------------------------------------------------------------------------------+
                                           |
                                    HTTP / REST (JSON)
                                           v
+---------------------------------------------------------------------------------------+
|                             GATEWAY & MIDDLEWARE LAYER                                |
|  +-----------------+  +-----------------+  +------------------+  +------------------+ |
|  | Helmet Headers  |  | CORS Whitelist  |  |  Morgan Logging  |  | Rate Limiting    | |
|  +-----------------+  +-----------------+  +------------------+  +------------------+ |
|  | JWT Bearer Auth Verification         |  | Firebase ID Token Verification (Admin) | |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                              ROUTING & CONTROLLER LAYER                               |
|  +------------------+  +--------------------+  +--------------------+  +------------+ |
|  | /api/quran       |  | /qamus, /api/qamus |  | /api/prayers       |  | /api/hadith| |
|  +------------------+  +--------------------+  +--------------------+  +------------+ |
|  | /api/dua         |  | /api/calendar      |  | /api/fasting       |  | /api/quote | |
|  +------------------+  +--------------------+  +--------------------+  +------------+ |
|  | /api/firebase    |  | /api/analytics     |  | /api/search        |  | /api/admin | |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                                BUSINESS SERVICE LAYER                                 |
|  +----------------------+  +-----------------------+  +-----------------------------+ |
|  | qamusService         |  | hadithService         |  | analyticsService            | |
|  | - Arabic normalizer  |  | - Canonical books     |  | - Prayer streaks            | |
|  | - Root morphology    |  | - Daily selection     |  | - Completion metrics        | |
|  | - Ayah transclusion  |  | - Topic classifier    |  | - Group challenges          | |
|  | - Grammar ontology   |  |                       |  |                             | |
|  +----------------------+  +-----------------------+  +-----------------------------+ |
|  | calendarUtils        |  | prayerCalculator      |  | firebaseService             | |
|  | - Julian Day Number  |  | - Solar coordinates   |  | - Cloud Firestore sync      | |
|  | - Hijri / Gregorian  |  | - 7 Calculation rules |  | - User profile resolution   | |
|  | - Ethiopian solar    |  | - Asr juristic ratios |  | - Activity logging          | |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                                DATA & PERSISTENCE LAYER                               |
|  +---------------------------------------------------------------------------------+  |
|  |                  Domain-Partitioned SQLite Databases (sql.js WASM)              |  |
|  |  [quran.sqlite]   [qamus.sqlite]   [prayers.sqlite]  [hadith.sqlite]             |  |
|  |  [dua.sqlite]     [quotes.sqlite]  [deenbot.sqlite]                              |  |
|  +---------------------------------------------------------------------------------+  |
|  |                            Google Cloud Firestore                               |  |
|  |  users/  |  prayer_logs/  |  fasting_logs/  |  journal_entries/  |  streaks/      |  |
+---------------------------------------------------------------------------------------+
```

---

## 2. Layer Responsibilities

### 2.1 Gateway & Security Middleware
- **Security Headers**: Managed by `helmet`, securing framing, script sources, and headers.
- **CORS Management**: Configured dynamically via `CORS_ORIGINS` environment variable.
- **Dual Authentication Model**:
  - **Local JWT Bearer**: Standard HMAC-SHA256 tokens for local testing and internal session management.
  - **Firebase Authentication**: Client sends Bearer token acquired from Firebase Auth. Verified server-side via `firebase-admin/auth` (`verifyIdToken`).
- **Rate Limiting**: Express-rate-limit safeguards sensitive authentication and public conversion endpoints against brute force.

### 2.2 Domain-Partitioned SQLite Storage (`sql.js`)
Rather than maintaining a single monolithic database, Muslim Daily isolates distinct domains into 7 WebAssembly SQLite databases. This guarantees complete zero-native compilation portability (avoiding `node-gyp` and `glibc` incompatibilities across environments) while keeping each domain self-contained:

| Database | Description | Indexed Entities & Records |
| :--- | :--- | :--- |
| **`quran.sqlite`** | Quranic text & audio metadata | 114 Surahs, 6,236 Ayahs, Uthmani calligraphy, Sahih International translation, classical Tafsir exegesis. |
| **`qamus.sqlite`** | Fusha Quranic Arabic Lexicon | 2,092 certified entries, 1,091 distinct roots, 3 grammatical sections (verbs, nouns, particles), 55 semantic categories, 7,700 Ayah occurrence transclusions, and 39+ Quranic Grammar part-of-speech classes. |
| **`prayers.sqlite`** | Astronomical prayer engine | Cached coordinates for world cities, calculation rules (MWL, ISNA, Umm Al-Qura, Egypt, Karachi, Tehran, Jafari), and juristic Asr methods. |
| **`hadith.sqlite`** | Canonical Hadith collections | Sahih al-Bukhari, Sahih Muslim, Sunan an-Nasa'i, book sections, Arabic and English narrations, daily selection logic. |
| **`dua.sqlite`** | Supplications & Azkar | Morning/evening dhikr, Salah prayers, repentance, emotional state classifications with transliteration and references. |
| **`quotes.sqlite`** | Islamic wisdom & reflections | Classical sayings of righteous predecessors categorized by spiritual topics (Patience, Tawakkul, Sincerity). |
| **`deenbot.sqlite`** | Local user data & state | Local user accounts, hashed credentials (bcryptjs), prayer completion records, streaks, and community groups. |

### 2.3 Cloud Persistence (Google Cloud Firestore)
For cross-device synchronization and durable storage of user-authored data:
- `users/{userId}`: User profile, settings, notification preferences, calculation method.
- `prayer_logs/{id}`: Timestamped prayer completions with on-time status and congregation indicators.
- `fasting_logs/{id}`: Fasting tracker records (Ramadan, voluntary Mondays/Thursdays, Ayyam al-Beed).
- `journal_entries/{id}`: Personal reflections, Quranic Ayah reflections, and gratitude notes.
- `streaks/{userId}`: Real-time streak tracking and milestone counters.

---

## 3. Subsystem Deep Dive: Fusha Qamus Quranic Lexicon

The **Qamus Quranic Lexicon** integrates the linguistic data from `https://github.com/abdutahir-dev/fusha`. It provides deep morphological (*sarf*), syntactic (*nahw*), and sentence analysis (*tarkeeb*) anchored directly to the Noble Quran.

### 3.1 Data Pipeline & Ingestion
```text
data/qamus/
├── entries.jsonl           --> 2,092 certified lexicon records with morphology & definitions
├── entry-manifest.json     --> Dataset version, checksums, and verified metrics
├── quran_usage_spine.json  --> 7,700 token-level Ayah occurrence mappings across all 114 Surahs
└── qg-ontology.json        --> 39+ Quranic Grammar syntactic part-of-speech color classes
```

During initialization in `src/db/connection.js`:
1. `initDatabases()` initializes the WebAssembly SQLite instance for `qamus.sqlite`.
2. The schema creates the `qamus_entries` table with B-tree indices on:
   - `id` (primary key)
   - `headword_ar` & `headword_clean` (normalized Arabic)
   - `root_ar` & `normalized_root` (stripped spaces and diacritics)
   - `section` (`verb`, `noun`, `particle`)
   - `category` (semantic category)
3. If the table is empty or needs seeding, records are loaded and committed transactionally.

### 3.2 Diacritic-Tolerant Search Engine
Arabic search strings vary widely depending on whether tashkeel (diacritics) are provided and how Alif/Hamza variants are keyed. The `normalizeArabic` algorithm standardizes text:
- Strips all Harakat / Tashkeel (`[\u064B-\u065F\u0670]`).
- Normalizes Hamza and Alif variants (`[إأآٱ]` $\rightarrow$ `ا`).
- Unifies Alif Maqsura (`ى` $\rightarrow$ `ي`) and Ta Marbuta (`ة` $\rightarrow$ `ه`).
- Removes inter-letter whitespace for roots (e.g., `ر ح م` and `رحم` match identically).

### 3.3 Ayah Vocabulary Transclusion Engine
When a client requests `/qamus/ayah/:ref` (e.g., `1:1`, `9:69`):
1. The service looks up the Surah and Ayah coordinates in `quran_usage_spine.json`.
2. Resolves token positions, matching lemma IDs against `qamus.sqlite`.
3. Returns the complete contextual entry detail (morphology, transliteration, definitions, senses) for every word in that verse.

### 3.4 Syntactic Color Ontology (Quranic Grammar POS)
`qg-ontology.json` defines 39+ grammatical classes conforming to classical Arabic grammar:
- Verbs (*Fi'l*): Past, Imperfect, Imperative, Passive, Intransitive, Transitive.
- Nouns (*Ism*): Proper noun, Pronoun, Demonstrative, Relative, Verbal noun (*Masdar*), Active/Passive participle, Adverb of time/place.
- Particles (*Harf*): Preposition, Conjunction, Vocative, Interrogative, Negative, Accusative (*Inna* and sisters).
Each class provides a distinctive color code (e.g., `#10b981`, `#3b82f6`, `#f59e0b`) enabling clients to render rich syntactic color-coded Quranic text.

---

## 4. API Endpoints Directory

### 4.1 Qamus Quranic Lexicon (`/qamus` & `/api/qamus`)
- `GET /qamus` — Summary statistics, certified counts, and version metadata.
- `GET /qamus/entries` — Paginated catalog with filters (`page`, `limit`, `section`, `category`, `root`, `search`).
- `GET /qamus/entries/:id` — Single lexical entry by ID or Arabic headword with morphology.
- `GET /qamus/search?q={query}` — Diacritic-tolerant search across Arabic, transliteration, and English meanings.
- `GET /qamus/roots` — Directory of all 1,091 distinct Quranic roots with lemma counts.
- `GET /qamus/roots/:root` — All vocabulary words derived from a specific root.
- `GET /qamus/sections` — Breakdown across verbs (947), nouns (1,045), and particles (100).
- `GET /qamus/categories` — List of 55 semantic categories with word counts.
- `GET /qamus/categories/:category` — Entries belonging to a specific semantic category.
- `GET /qamus/ayah/:ref` — All vocabulary entries and spine tokens occurring in an Ayah (e.g. `1:1`).
- `GET /qamus/daily` — Deterministic word of the day with root and context.
- `GET /qamus/random` — Random entry discovery, optionally filtered by section.
- `GET /qamus/grammar-classes` — Complete 39+ Quranic Grammar syntax ontology and color matrix.
- `GET /qamus/manifest` — Raw dataset verification manifest.

### 4.2 Quran & Audio (`/api/quran`)
- `GET /api/quran/surahs` — List of 114 Surahs with revelation metadata.
- `GET /api/quran/surahs/:id` — Surah detail with Ayahs and translation.
- `GET /api/quran/ayah/:surah/:ayah` — Specific Ayah text, translation, and Tafsir.
- `GET /api/audio/:surah/:ayah` — Audio streaming endpoint for verse recitations.

### 4.3 Prayer Times & Analytics (`/api/prayers`)
- `GET /api/prayers/times` — Astronomical prayer calculation for city or coordinates.
- `GET /api/prayers/methods` — List of supported global calculation conventions.
- `POST /api/prayers/log` — Record prayer completion status.

### 4.4 Hadith Collections (`/api/hadith`)
- `GET /api/hadith/books` — Canonical Hadith collections.
- `GET /api/hadith/books/:book/hadiths` — Paginated narrations with Arabic and English text.
- `GET /api/hadith/daily` — Scheduled Hadith of the day.

### 4.5 Calendar Conversions (`/api/calendar`)
- `POST /api/calendar/convert` — Exact Julian Day Number conversions between Gregorian, Islamic Hijri, and Ethiopian systems.

### 4.6 Firebase Cloud Sync (`/api/firebase`)
- `GET /api/firebase/config` — Public Firebase project ID and configuration check.
- `GET /api/firebase/prayer-logs` — Fetch user's synchronized cloud prayer logs.
- `POST /api/firebase/prayer-logs` — Persist prayer completion to Cloud Firestore.
- `GET /api/firebase/journal` — Retrieve cloud spiritual journal entries.
- `POST /api/firebase/journal` — Save spiritual reflection to Cloud Firestore.

---

## 5. Developer Portals & Documentation Strategy

Every API capability is mirrored across three synchronized documentation and testing interfaces:
1. **Interactive UI Workbench (`/ui` & `ui/index.html`)**: Built with React and Ant Design, providing 1-click test benches, live parameter inputs, JSON inspection, and Firebase Auth simulation.
2. **Interactive Developer Docs (`/docs` & `docs/index.html`)**: Rich HTML documentation featuring code snippets (cURL, JavaScript, Python), endpoint breakdown, parameter tables, and embedded live test runners.
3. **Swagger UI Console (`/swagger` & `swagger/index.html`)**: OpenAPI 3.0.3 compliant interactive documentation playground backed by `src/docs/openapiSpec.js`.

### Static Asset Generation Pipeline
Running `npm run build` triggers `scripts/build_static_docs.js`, synchronizing:
- `api/openapi.json` & `swagger.json`
- `swagger/index.html` & `swagger.html`
- `docs/index.html` & `docs.html`
- `ui/bundle.js` & `ui.html`
- Root portal landing at `index.html` and SPA fallback at `404.html`

This architecture allows the documentation and UI to function identically on the live server and as static GitHub Pages deployments.

---

## 6. Testing & Quality Assurance

Automated testing is maintained in `__tests__/` and executed via Jest with ECMAScript VM Modules enabled (`npm test`):
- `__tests__/qamus.test.js`: Validates Qamus service metrics, root lookups, diacritic-tolerant search, Ayah transclusions, and HTTP routes.
- `__tests__/firebaseIntegration.test.js`: Tests Firebase ID token verification, Firestore error handler mapping, and protected route access.
- `__tests__/hadithService.test.js`: Verifies Hadith book retrieval, daily selection determinism, and pagination.
- `__tests__/calendarUtils.test.js`: Verifies mathematical bidirectional transformations between Gregorian, Hijri, and Ethiopian dates.
- `__tests__/analyticsService.test.js`: Validates streak calculations, habit analytics, and leaderboard metrics.
