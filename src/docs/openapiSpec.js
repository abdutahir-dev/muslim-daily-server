export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Muslim Daily API Server",
    version: "2.0.0",
    description: "Production-grade RESTful API providing comprehensive Islamic digital services: Holy Quran with audio recitations & translations, accurate prayer timings & trackers, authenticated Hadith collections, authentic Duas & Azkar, multi-system calendar conversions (Gregorian, Hijri, Ethiopian), fasting & journal logs, community challenges, and developer utilities.",
    contact: {
      name: "Muslim Daily Engineering Team",
      email: "abdutahir.dev@gmail.com"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers: [
    {
      url: "/",
      description: "Current Server Instance"
    },
    {
      url: "http://localhost:3000",
      description: "Local Development Server"
    }
  ],
  tags: [
    { name: "System & Health", description: "Health check, server status, and service discovery" },
    { name: "Authentication", description: "User registration, authentication, JWT issuing, and profile fetching" },
    { name: "Quran", description: "Surahs, Ayahs, Uthmani scripts, Qiraat styles, translations, and Tafsirs" },
    { name: "Audio", description: "Ayah-by-ayah audio streaming with multiple reciters" },
    { name: "Prayers", description: "Prayer timings computation, daily prayer logging, streaks, and analytics" },
    { name: "Hadith", description: "Authentic Hadith collections (Bukhari, Muslim, etc.), sections, editions, and daily Hadith" },
    { name: "Duas & Azkar", description: "Categorized Duas, morning/evening dhikr, search, and daily Duas" },
    { name: "Calendar", description: "Gregorian, Hijri, and Ethiopian calendar conversions, holidays, tasks, notes, and cloud sync" },
    { name: "Quotes & Wisdom", description: "Islamic quotes and wisdom from scholars and classical sources" },
    { name: "Fasting", description: "Fasting tracker and daily status logging" },
    { name: "Journal", description: "Daily reflections, notes, and mood tracking" },
    { name: "User & Preferences", description: "User settings, location preferences, bookmarks, and favorites" },
    { name: "User Information", description: "User directory CRUD operations" },
    { name: "Social & Community", description: "Study circles, community groups, challenges, and leaderboards" },
    { name: "Analytics", description: "User activity logging, streaks, summaries, and usage trends" },
    { name: "Search", description: "Global unified search across Quran, Hadith, Duas, and quotes" },
    { name: "Firebase & Cloud Firestore", description: "Firebase Authentication and Cloud Firestore persistent document storage" },
    { name: "Admin", description: "Database administration, content management, and data seeding" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token obtained from `/api/auth/login` or `/api/auth/register`."
      }
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Unauthorized or Invalid Request" }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", example: "testuser" },
          email: { type: "string", format: "email", example: "testuser@example.com" },
          password: { type: "string", minLength: 6, example: "Secret123!" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", example: "testuser" },
          password: { type: "string", example: "Secret123!" }
        }
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          user: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              username: { type: "string", example: "testuser" },
              email: { type: "string", example: "testuser@example.com" },
              role: { type: "string", example: "user" }
            }
          }
        }
      },
      Surah: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name_simple: { type: "string", example: "Al-Fatihah" },
          name_arabic: { type: "string", example: "الفاتحة" },
          verses_count: { type: "integer", example: 7 },
          revelation_place: { type: "string", example: "makkah" }
        }
      },
      Ayah: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          surah_number: { type: "integer", example: 1 },
          verse_number: { type: "integer", example: 1 },
          text_uthmani: { type: "string", example: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
          verse_key: { type: "string", example: "1:1" }
        }
      },
      PrayerTimes: {
        type: "object",
        properties: {
          date: { type: "string", example: "2026-09-12" },
          city: { type: "string", example: "Mecca" },
          country: { type: "string", example: "Saudi Arabia" },
          fajr: { type: "string", example: "05:05" },
          sunrise: { type: "string", example: "06:24" },
          dhuhr: { type: "string", example: "12:28" },
          asr: { type: "string", example: "15:51" },
          maghrib: { type: "string", example: "18:31" },
          isha: { type: "string", example: "20:01" }
        }
      },
      Dua: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          category_id: { type: "integer", example: 1 },
          title_en: { type: "string", example: "Morning Dhikr" },
          title_ar: { type: "string", example: "أذكار الصباح" },
          content_ar: { type: "string", example: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ..." },
          content_en: { type: "string", example: "We have reached the morning and unto Allah belongs sovereignty..." },
          transliteration: { type: "string", example: "Asbahna wa asbahal-mulku lillah..." },
          reference: { type: "string", example: "Sahih Muslim" }
        }
      },
      Hadith: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          book_id: { type: "integer", example: 1 },
          hadith_number: { type: "string", example: "1" },
          text_ar: { type: "string", example: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ" },
          text_en: { type: "string", example: "Actions are but by intention..." },
          grade: { type: "string", example: "Sahih" },
          source: { type: "string", example: "Sahih Bukhari 1" }
        }
      }
    }
  },
  paths: {
    "/": {
      get: {
        tags: ["System & Health"],
        summary: "Service Discovery",
        description: "Returns API metadata, version status, and index of available endpoints.",
        responses: {
          200: {
            description: "Server is online and routing",
            content: { "application/json": { schema: { type: "object" } } }
          }
        }
      }
    },
    "/health": {
      get: {
        tags: ["System & Health"],
        summary: "System Health Status",
        description: "Checks whether the server and its subsystems are running normally.",
        responses: {
          200: {
            description: "Health status OK",
            content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", example: "ok" }, timestamp: { type: "string" } } } } }
          }
        }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register New User",
        description: "Registers a new user account with hashed password storage.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } }
        },
        responses: {
          201: { description: "User created successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          400: { description: "Validation error or username/email already taken" }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Authenticate User",
        description: "Validates user credentials and issues a signed Bearer JWT token.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } }
        },
        responses: {
          200: { description: "Login successful", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          401: { description: "Invalid username or password" }
        }
      }
    },
    "/api/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Current Authenticated User Profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Profile data", content: { "application/json": { schema: { type: "object" } } } },
          401: { description: "Unauthorized" }
        }
      }
    },
    "/api/quran/surahs": {
      get: {
        tags: ["Quran"],
        summary: "List All Surahs",
        description: "Retrieves metadata for all 114 Surahs of the Holy Quran.",
        responses: {
          200: {
            description: "Array of Surah metadata",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Surah" } } } }
          }
        }
      }
    },
    "/api/quran/surahs/{id}": {
      get: {
        tags: ["Quran"],
        summary: "Get Single Surah Details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" }, description: "Surah number (1-114)" }],
        responses: {
          200: { description: "Surah details", content: { "application/json": { schema: { $ref: "#/components/schemas/Surah" } } } },
          404: { description: "Surah not found" }
        }
      }
    },
    "/api/quran/surahs/{id}/ayahs": {
      get: {
        tags: ["Quran"],
        summary: "Get Ayahs of a Surah",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "Surah number" },
          { name: "translation", in: "query", schema: { type: "integer", default: 1 }, description: "Translation ID" }
        ],
        responses: {
          200: { description: "Array of Ayahs with Uthmani script and translations" }
        }
      }
    },
    "/api/quran/ayahs/random": {
      get: {
        tags: ["Quran"],
        summary: "Get Random Ayahs Collection",
        parameters: [{ name: "count", in: "query", schema: { type: "integer", default: 5 } }],
        responses: {
          200: { description: "Random Ayahs" }
        }
      }
    },
    "/api/quran/ayahs/single": {
      get: {
        tags: ["Quran"],
        summary: "Get a Single Random Ayah",
        responses: {
          200: { description: "Single random Ayah with translation" }
        }
      }
    },
    "/api/quran/ayahs/tafsir": {
      get: {
        tags: ["Quran"],
        summary: "Get Ayah Tafsir Exegesis",
        parameters: [
          { name: "verse_key", in: "query", schema: { type: "string", example: "1:1" } },
          { name: "tafsir_id", in: "query", schema: { type: "integer", default: 1 } }
        ],
        responses: {
          200: { description: "Tafsir text" }
        }
      }
    },
    "/api/quran/resources/translations": {
      get: {
        tags: ["Quran"],
        summary: "List Available Translations",
        responses: { 200: { description: "List of translation resources" } }
      }
    },
    "/api/quran/resources/tafsirs": {
      get: {
        tags: ["Quran"],
        summary: "List Available Tafsirs",
        responses: { 200: { description: "List of Tafsir resources" } }
      }
    },
    "/api/audio/{surahId}/{ayahId}": {
      get: {
        tags: ["Audio"],
        summary: "Stream Ayah Recitation Audio",
        description: "Streams high quality MP3 recitation for the specified Surah and Ayah.",
        parameters: [
          { name: "surahId", in: "path", required: true, schema: { type: "integer", example: 1 } },
          { name: "ayahId", in: "path", required: true, schema: { type: "integer", example: 1 } },
          { name: "reciter", in: "query", schema: { type: "string", default: "Mishari_Rashid_Alafasy_24kbps" } }
        ],
        responses: {
          200: { description: "Audio stream (audio/mpeg)" },
          302: { description: "Redirect to audio CDN" }
        }
      }
    },
    "/api/prayers/times": {
      get: {
        tags: ["Prayers"],
        summary: "Get Prayer Timings",
        description: "Retrieves calculated prayer timings for any city and country.",
        parameters: [
          { name: "city", in: "query", schema: { type: "string", default: "Mecca" } },
          { name: "country", in: "query", schema: { type: "string", default: "Saudi Arabia" } },
          { name: "date", in: "query", schema: { type: "string", example: "2026-09-12" } },
          { name: "method", in: "query", schema: { type: "integer", default: 4 } }
        ],
        responses: {
          200: { description: "Prayer times", content: { "application/json": { schema: { $ref: "#/components/schemas/PrayerTimes" } } } }
        }
      }
    },
    "/api/prayers/status/{username}/{date}": {
      get: {
        tags: ["Prayers"],
        summary: "Get User Daily Prayer Completion Status",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "username", in: "path", required: true, schema: { type: "string" } },
          { name: "date", in: "path", required: true, schema: { type: "string", example: "2026-09-12" } }
        ],
        responses: { 200: { description: "Prayer completion statuses for Fajr, Dhuhr, Asr, Maghrib, Isha" } }
      }
    },
    "/api/prayers/log-activity": {
      post: {
        tags: ["Prayers"],
        summary: "Log Completed Prayer",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "date", "prayer_name", "status"],
                properties: {
                  username: { type: "string", example: "testuser" },
                  date: { type: "string", example: "2026-09-12" },
                  prayer_name: { type: "string", enum: ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"], example: "Fajr" },
                  status: { type: "integer", enum: [0, 1], example: 1 }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Prayer log updated" } }
      }
    },
    "/api/prayers/weekly/{username}": {
      get: {
        tags: ["Prayers"],
        summary: "Get Weekly Prayer Statistics",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "username", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Weekly prayer metrics" } }
      }
    },
    "/api/hadith/books": {
      get: {
        tags: ["Hadith"],
        summary: "List Hadith Books",
        description: "Returns canonical Hadith collections like Sahih Bukhari, Sahih Muslim, etc.",
        responses: { 200: { description: "List of Hadith books" } }
      }
    },
    "/api/hadith/daily": {
      get: {
        tags: ["Hadith"],
        summary: "Get Daily Hadith",
        description: "Retrieves the curated or algorithmic Hadith of the day.",
        responses: { 200: { description: "Daily Hadith", content: { "application/json": { schema: { $ref: "#/components/schemas/Hadith" } } } } }
      }
    },
    "/api/hadith/search": {
      get: {
        tags: ["Hadith"],
        summary: "Search Hadiths",
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Matching Hadiths" } }
      }
    },
    "/api/hadith/editions": {
      get: {
        tags: ["Hadith"],
        summary: "List Hadith Editions",
        responses: { 200: { description: "List of editions" } }
      }
    },
    "/api/hadith/sections/{sectionId}/hadiths": {
      get: {
        tags: ["Hadith"],
        summary: "Get Hadiths by Section ID",
        parameters: [{ name: "sectionId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "List of Hadiths in section" } }
      }
    },
    "/api/duas": {
      get: {
        tags: ["Duas & Azkar"],
        summary: "List Duas",
        parameters: [
          { name: "categoryId", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } }
        ],
        responses: { 200: { description: "Array of Duas", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Dua" } } } } } }
      }
    },
    "/api/duas/categories": {
      get: {
        tags: ["Duas & Azkar"],
        summary: "List Dua Categories",
        description: "Retrieves all Dua and Azkar categories (e.g., Morning & Evening, Sleep, Forgiveness).",
        responses: { 200: { description: "List of categories" } }
      }
    },
    "/api/duas/daily": {
      get: {
        tags: ["Duas & Azkar"],
        summary: "Get Daily Dua",
        responses: { 200: { description: "Daily Dua", content: { "application/json": { schema: { $ref: "#/components/schemas/Dua" } } } } }
      }
    },
    "/api/duas/random": {
      get: {
        tags: ["Duas & Azkar"],
        summary: "Get Random Dua",
        responses: { 200: { description: "Random Dua", content: { "application/json": { schema: { $ref: "#/components/schemas/Dua" } } } } }
      }
    },
    "/api/duas/{id}": {
      get: {
        tags: ["Duas & Azkar"],
        summary: "Get Dua by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Dua details" }, 404: { description: "Dua not found" } }
      }
    },
    "/api/calendar/convert": {
      post: {
        tags: ["Calendar"],
        summary: "Convert Date Across Systems",
        description: "Converts a date between Gregorian, Hijri (Islamic), and Ethiopian calendar systems.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["from", "to", "date"],
                properties: {
                  from: { type: "string", enum: ["gregorian", "hijri", "ethiopian"], example: "gregorian" },
                  to: { type: "string", enum: ["gregorian", "hijri", "ethiopian"], example: "hijri" },
                  date: { type: "string", example: "2026-09-12" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Conversion result with year, month, day, and formatted date" } }
      }
    },
    "/api/calendar/holidays": {
      get: {
        tags: ["Calendar"],
        summary: "List Islamic & National Holidays",
        parameters: [{ name: "country", in: "query", schema: { type: "string", default: "SA" } }],
        responses: { 200: { description: "List of holidays" } }
      }
    },
    "/api/calendar/events": {
      get: {
        tags: ["Calendar"],
        summary: "List Calendar Events",
        parameters: [{ name: "calendarId", in: "query", schema: { type: "integer" } }],
        responses: { 200: { description: "Events list" } }
      },
      post: {
        tags: ["Calendar"],
        summary: "Create Calendar Event",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["calendarId", "title", "start_ts", "end_ts"],
                properties: {
                  calendarId: { type: "integer", example: 1 },
                  title: { type: "string", example: "Friday Jummah Prayer" },
                  start_ts: { type: "string", example: "2026-09-18T12:00:00Z" },
                  end_ts: { type: "string", example: "2026-09-18T13:00:00Z" }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Event created" } }
      }
    },
    "/api/quotes/random": {
      get: {
        tags: ["Quotes & Wisdom"],
        summary: "Get Random Islamic Quote",
        responses: {
          200: {
            description: "Wisdom quote with Arabic text, English translation, source, and topic"
          }
        }
      }
    },
    "/api/fasting/status/{username}/{date}": {
      get: {
        tags: ["Fasting"],
        summary: "Get Fasting Status for Date",
        parameters: [
          { name: "username", in: "path", required: true, schema: { type: "string" } },
          { name: "date", in: "path", required: true, schema: { type: "string", example: "2026-09-12" } }
        ],
        responses: { 200: { description: "Fasting log for the date" } }
      }
    },
    "/api/fasting/update": {
      post: {
        tags: ["Fasting"],
        summary: "Update Fasting Status",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "date", "is_fasting"],
                properties: {
                  username: { type: "string", example: "testuser" },
                  date: { type: "string", example: "2026-09-12" },
                  fasting_type: { type: "string", example: "voluntary" },
                  is_fasting: { type: "integer", enum: [0, 1], example: 1 }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Fasting status updated" } }
      }
    },
    "/api/journal/{username}/{date}": {
      get: {
        tags: ["Journal"],
        summary: "Get Journal Entry",
        parameters: [
          { name: "username", in: "path", required: true, schema: { type: "string" } },
          { name: "date", in: "path", required: true, schema: { type: "string", example: "2026-09-12" } }
        ],
        responses: { 200: { description: "Journal entry" } }
      }
    },
    "/api/journal/update": {
      post: {
        tags: ["Journal"],
        summary: "Save or Update Journal Entry",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "date"],
                properties: {
                  username: { type: "string", example: "testuser" },
                  date: { type: "string", example: "2026-09-12" },
                  notes: { type: "string", example: "Reflecting on Surah Al-Fatihah today." },
                  mood: { type: "string", example: "peaceful" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Journal saved" } }
      }
    },
    "/api/user/settings/{username}": {
      get: {
        tags: ["User & Preferences"],
        summary: "Get User Settings",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "username", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "User settings object" } }
      }
    },
    "/api/user/bookmarks/{username}": {
      get: {
        tags: ["User & Preferences"],
        summary: "Get User Bookmarks",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "username", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "List of bookmarks" } }
      }
    },
    "/api/user/favorites/{username}": {
      get: {
        tags: ["User & Preferences"],
        summary: "Get User Favorites",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "username", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "List of favorites" } }
      }
    },
    "/api/social/groups": {
      get: {
        tags: ["Social & Community"],
        summary: "List Community Groups",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "List of study groups" } }
      },
      post: {
        tags: ["Social & Community"],
        summary: "Create Community Group",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "description"],
                properties: {
                  name: { type: "string", example: "Daily Quran Reciters" },
                  description: { type: "string", example: "Reading 1 Juz together daily" }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Group created" } }
      }
    },
    "/api/social/challenges": {
      get: {
        tags: ["Social & Community"],
        summary: "List Community Challenges",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "List of challenges" } }
      },
      post: {
        tags: ["Social & Community"],
        summary: "Create Community Challenge",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "target"],
                properties: {
                  title: { type: "string", example: "30-Day Tahajjud Challenge" },
                  target: { type: "integer", example: 30 }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Challenge created" } }
      }
    },
    "/api/social/challenges/{challengeId}/leaderboard": {
      get: {
        tags: ["Social & Community"],
        summary: "Get Challenge Leaderboard",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "challengeId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Leaderboard rankings" } }
      }
    },
    "/api/analytics/summary/{username}": {
      get: {
        tags: ["Analytics"],
        summary: "Get User Activity Summary",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "username", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Summary metrics" } }
      }
    },
    "/api/analytics/streak/{username}": {
      get: {
        tags: ["Analytics"],
        summary: "Get User Habit Streak",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "username", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Current and longest streak count" } }
      }
    },
    "/api/search/global": {
      get: {
        tags: ["Search"],
        summary: "Global Unified Search",
        description: "Searches across Quran, Hadith, Duas, and Islamic Wisdom quotes simultaneously.",
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string", example: "patience" } }],
        responses: { 200: { description: "Aggregated search results" } }
      }
    },
    "/api/admin/stats": {
      get: {
        tags: ["Admin"],
        summary: "Database Record Statistics",
        responses: { 200: { description: "Total count of records across all database tables" } }
      }
    },
    "/api/firebase/config": {
      get: {
        tags: ["Firebase & Cloud Firestore"],
        summary: "Get Public Firebase Client Configuration",
        responses: { 200: { description: "Client configuration parameters for Firebase SDK initialization" } }
      }
    },
    "/api/firebase/health": {
      get: {
        tags: ["Firebase & Cloud Firestore"],
        summary: "Test Firestore Database Connectivity",
        responses: { 200: { description: "Firestore connection health status" } }
      }
    },
    "/api/firebase/sync-user": {
      post: {
        tags: ["Firebase & Cloud Firestore"],
        summary: "Sync User Profile to Firestore",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  displayName: { type: "string", example: "Abdullah" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Profile document updated in Firestore" } }
      }
    },
    "/api/firebase/prayer-logs": {
      get: {
        tags: ["Firebase & Cloud Firestore"],
        summary: "Fetch User Prayer Logs from Firestore",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "List of prayer logs stored in Firestore" } }
      },
      post: {
        tags: ["Firebase & Cloud Firestore"],
        summary: "Save Prayer Log to Firestore",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["date", "prayerName", "status"],
                properties: {
                  date: { type: "string", example: "2026-09-12" },
                  prayerName: { type: "string", enum: ["fajr", "dhuhr", "asr", "maghrib", "isha"] },
                  status: { type: "boolean", example: true },
                  prayedAs: { type: "string", example: "jamaah" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Saved prayer record in Firestore" } }
      }
    }
  }
};
