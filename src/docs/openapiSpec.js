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
      url: "https://ais-dev-25nufs2dp3vj2xehirwibv-201444007982.europe-west2.run.app",
      description: "Cloud Run Production API Server (Live)"
    },
    {
      url: "/",
      description: "Current Server Instance (Same-Origin)"
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
    { name: "Qamus Quranic Lexicon", description: "Fusha 2,092-entry Quranic Arabic morphology (Sarf), syntax (Nahw), i'rab transclusions, root lexicon, and grammatical color classes" },
    { name: "Asmaul Husna", description: "The 99 Most Beautiful Names of Allah (أسماء الله الحسنى) with trilingual translations (Arabic, Amharic, English), theological descriptions, and Quranic/Hadith references" },
    { name: "Dictionary", description: "Comprehensive trilingual dictionary (Arabic, Amharic, English) with roots, definitions, part-of-speech tags, synonyms, antonyms, and usage examples" },
    { name: "Translation", description: "Trilingual translation and language detection engine supporting Arabic (العربية), Amharic (አማርኛ), and English" },
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
      DictionaryEntry: {
        type: "object",
        properties: {
          id: { type: "string", example: "dict_001" },
          word_ar: { type: "string", example: "سَلَام" },
          word_ar_clean: { type: "string", example: "سلام" },
          word_am: { type: "string", example: "ሰላም" },
          word_en: { type: "string", example: "Peace / Greeting" },
          transliteration_ar: { type: "string", example: "Salam" },
          transliteration_am: { type: "string", example: "Selam" },
          part_of_speech: { type: "string", example: "noun" },
          category: { type: "string", example: "Faith & Spirituality" },
          root_ar: { type: "string", example: "س ل م" },
          definition_ar: { type: "string", example: "الأمان والطمأنينة والسكينة وخلو النفس والمجتمع من النزاع." },
          definition_am: { type: "string", example: "መረጋጋት፣ ጸጥታና ፀብ አልባነት፤ እንዲሁም የደህንነት ሰላምታ።" },
          definition_en: { type: "string", example: "A state of harmony, safety, tranquility, and freedom from strife." },
          synonyms: {
            type: "object",
            properties: {
              ar: { type: "array", items: { type: "string" } },
              am: { type: "array", items: { type: "string" } },
              en: { type: "array", items: { type: "string" } }
            }
          },
          antonyms: {
            type: "object",
            properties: {
              ar: { type: "array", items: { type: "string" } },
              am: { type: "array", items: { type: "string" } },
              en: { type: "array", items: { type: "string" } }
            }
          },
          examples: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ar: { type: "string" },
                am: { type: "string" },
                en: { type: "string" }
              }
            }
          }
        }
      },
      TranslationRequest: {
        type: "object",
        required: ["text"],
        properties: {
          text: { type: "string", example: "السلام عليكم ورحمة الله" },
          sourceLang: { type: "string", enum: ["auto", "ar", "am", "en"], example: "ar" },
          targetLang: { type: "string", enum: ["ar", "am", "en"], example: "en" },
          mode: { type: "string", enum: ["auto", "lexicon", "ai"], example: "auto" }
        }
      },
      TranslationResponse: {
        type: "object",
        properties: {
          originalText: { type: "string", example: "السلام عليكم ورحمة الله" },
          translatedText: { type: "string", example: "May the peace and mercy of God be upon you" },
          sourceLanguage: { type: "string", example: "ar" },
          targetLanguage: { type: "string", example: "en" },
          engine: { type: "string", example: "trilingual-lexicon" },
          timestamp: { type: "string", example: "2026-09-18T17:40:00.000Z" }
        }
      },
      DetectionResponse: {
        type: "object",
        properties: {
          language: { type: "string", example: "ar" },
          languageName: { type: "string", example: "Arabic (العربية)" },
          script: { type: "string", example: "Arabic" },
          confidence: { type: "number", example: 1.0 }
        }
      },
      AsmaulHusnaItem: {
        type: "object",
        properties: {
          number: { type: "integer", example: 1 },
          name_ar: { type: "string", example: "الرَّحْمَٰنُ" },
          name_ar_clean: { type: "string", example: "الرحمن" },
          transliteration: { type: "string", example: "Ar-Rahman" },
          translation: {
            oneOf: [
              { type: "string", example: "The Entirely Merciful" },
              {
                type: "object",
                properties: {
                  en: { type: "string", example: "The Entirely Merciful" },
                  am: { type: "string", example: "እጅግ በጣም ሩኅሩህ" },
                  ar: { type: "string", example: "ذو الرحمة الشاملة لجميع الخلائق" }
                }
              }
            ]
          },
          description: {
            oneOf: [
              { type: "string", example: "The One whose vast mercy encompasses all of creation in this world." },
              {
                type: "object",
                properties: {
                  en: { type: "string", example: "The One whose vast mercy encompasses all of creation in this world." },
                  am: { type: "string", example: "በዚህ ዓለም ላሉ ፍጥረታት ሁሉ ምህረቱና እዝነቱ እጅግ ሰፊና ሁሉን አቀፍ የሆነው ጌታ።" },
                  ar: { type: "string", example: "الذي وسعت رحمته كل شيء في الدنيا وعمت جميع الخلائق." }
                }
              }
            ]
          },
          reference: {
            type: "object",
            properties: {
              quran: { type: "string", example: "Surah Al-Fatihah 1:3" },
              surah_number: { type: "integer", example: 1 },
              ayah_number: { type: "integer", example: 3 },
              ayah_ar: { type: "string", example: "الرَّحْمَٰنِ الرَّحِيمِ" },
              hadith: { type: "string", example: "Sahih al-Bukhari 2736" }
            }
          }
        }
      },
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
          name_amharic: { type: "string", example: "አል-ፋቲሓ (ከፋች)" },
          meaning_english: { type: "string", example: "The Opening" },
          meaning_amharic: { type: "string", example: "መክፈቻ" },
          verses_count: { type: "integer", example: 7 },
          rukus_count: { type: "integer", example: 1 },
          revelation_place: { type: "string", example: "makkah" },
          revelation_place_arabic: { type: "string", example: "مكية" },
          revelation_place_amharic: { type: "string", example: "መካዊ" },
          revelation_order: { type: "integer", example: 5 },
          time_of_revelation: { type: "string", example: "Early Meccan period (circa 612 CE)" },
          time_of_revelation_arabic: { type: "string", example: "الفترة المكية المبكرة" },
          time_of_revelation_amharic: { type: "string", example: "የመጀመሪያው የመካ ዘመን" },
          cause_of_revelation: { type: "string", example: "Revealed as the supreme opening prayer of the Quran..." },
          cause_of_revelation_arabic: { type: "string", example: "نزلت أم الكتاب مناجاة بين العبد وربه..." },
          cause_of_revelation_amharic: { type: "string", example: "በአላህና በባሪያው መካከል ያለውን የጸሎት ግንኙነት ለማስተማር ወረደች..." },
          themes: { type: "array", items: { type: "string" } },
          virtues: { type: "string", example: "The greatest Surah in the Quran (Surah of Praise)." }
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
        summary: "Get Random Ayahs Collection with Revelation Context",
        description: "Returns random Ayahs (7 by default) enriched with Amharic & English translations, Tafsir exegesis, and full Surah revelation metadata (cause of revelation, time, place, themes, and virtues in Arabic, Amharic, and English).",
        parameters: [
          { name: "count", in: "query", schema: { type: "integer", default: 7 }, description: "Number of random ayahs to fetch (1-50)" },
          { name: "surah", in: "query", schema: { type: "integer" }, description: "Optional surah filter (1-114)" },
          { name: "format", in: "query", schema: { type: "string" }, description: "Set 'wrapped' to return { count, ayahs }" }
        ],
        responses: {
          200: { description: "Random Ayahs collection with translations, tafsirs, and revelation context" }
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
    },
    "/qamus": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "Qamus Lexicon Overview & Statistics",
        description: "Returns metadata, dataset version, statistics (2,092 entries, 947 verbs, 1,045 nouns, 100 particles, 1,091 roots), and available endpoints.",
        responses: { 200: { description: "Qamus service overview and summary stats" } }
      }
    },
    "/qamus/entries": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "List Quranic Lexicon Entries (Paginated)",
        description: "Fetch paginated lexicon entries with optional filters for section (verb, noun, particle), semantic category, root, or search keyword.",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 }, description: "Items per page (max 100)" },
          { name: "section", in: "query", schema: { type: "string", enum: ["verb", "noun", "particle"] }, description: "Filter by part-of-speech category" },
          { name: "category", in: "query", schema: { type: "string" }, description: "Filter by semantic category" },
          { name: "root", in: "query", schema: { type: "string" }, description: "Filter by Arabic triliteral/quadrilateral root (e.g. 'ك ت ب')" },
          { name: "search", in: "query", schema: { type: "string" }, description: "Search keyword in headword, transliteration, root, or meaning" }
        ],
        responses: { 200: { description: "Paginated list of lexicon entries with senses and Quranic references" } }
      }
    },
    "/qamus/entries/{id}": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "Get Lexicon Entry by ID or Headword",
        description: "Returns full lexical details including Arabic headword, transliteration, root morphology, definition, senses, and exact Quranic usage examples with English translations.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Entry ID (e.g. 00107b99a50e) or Arabic headword" }
        ],
        responses: {
          200: { description: "Full lexicon entry record" },
          404: { description: "Entry not found" }
        }
      }
    },
    "/qamus/search": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "Search Quranic Lexicon",
        description: "Search across Arabic headwords, roots, English definitions, transliterations, and meanings with diacritic normalization.",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search query string (Arabic or English)" },
          { name: "section", in: "query", schema: { type: "string", enum: ["verb", "noun", "particle"] }, description: "Optional filter by section" },
          { name: "limit", in: "query", schema: { type: "integer", default: 25 }, description: "Maximum results (max 100)" }
        ],
        responses: { 200: { description: "Search results with relevance sorting" } }
      }
    },
    "/qamus/roots": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "List Distinct Quranic Roots",
        description: "Retrieves all 1,091 distinct Quranic Arabic roots with entry counts and sample vocabulary words.",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
          { name: "search", in: "query", schema: { type: "string" }, description: "Filter roots by Arabic characters or transliteration" }
        ],
        responses: { 200: { description: "Paginated list of Arabic roots" } }
      }
    },
    "/qamus/roots/{root}": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "Get All Vocabulary Derived from a Root",
        description: "Returns all verbal forms, derived nouns, and occurrences stemming from the specified Arabic root (e.g., 'ك ت ب' or 'كتب').",
        parameters: [
          { name: "root", in: "path", required: true, schema: { type: "string" }, description: "Arabic root (e.g. 'ر ح م' or 'رحم')" }
        ],
        responses: { 200: { description: "Entries and forms belonging to this root" } }
      }
    },
    "/qamus/sections": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "Get Section Breakdowns (Verbs, Nouns, Particles)",
        description: "Returns entry counts and total occurrences across the 3 primary grammatical sections.",
        responses: { 200: { description: "Section breakdown with linguistic descriptions" } }
      }
    },
    "/qamus/categories": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "List All 55 Semantic Categories",
        description: "Returns all thematic categories in the lexicon with entry counts.",
        responses: { 200: { description: "List of semantic categories" } }
      }
    },
    "/qamus/ayah/{ref}": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "Lookup Vocabulary Transclusion for a Quranic Ayah",
        description: "Returns all certified vocabulary entries, senses, and word tokens occurring in a specific Ayah (e.g. '1:1' or '9:69').",
        parameters: [
          { name: "ref", in: "path", required: true, schema: { type: "string" }, description: "Surah:Ayah reference (e.g. '1:1' or '9:69')" }
        ],
        responses: { 200: { description: "Vocabulary entries and usage spine tokens for the Ayah" } }
      }
    },
    "/qamus/daily": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "Get Daily Featured Quranic Word",
        description: "Returns a deterministic word of the day with root morphology, sense breakdown, and example Ayah transclusion.",
        parameters: [
          { name: "date", in: "query", schema: { type: "string" }, description: "Optional date in YYYY-MM-DD format" }
        ],
        responses: { 200: { description: "Daily word of the day" } }
      }
    },
    "/qamus/random": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "Get Random Quranic Word",
        description: "Returns a randomly selected word from the 2,092 lexicon entries.",
        parameters: [
          { name: "section", in: "query", schema: { type: "string", enum: ["verb", "noun", "particle"] }, description: "Optional section filter" }
        ],
        responses: { 200: { description: "Random lexicon entry" } }
      }
    },
    "/qamus/grammar-classes": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "Quranic Grammar (QG) Color & Syntax Ontology",
        description: "Returns the 39+ Quranic Grammar syntax classes, tokens, dark/light RGB color codes, and semantic role specifications from the Fusha qamus.dawah.wiki engine.",
        responses: { 200: { description: "Ontology and grammatical color matrix" } }
      }
    },
    "/qamus/manifest": {
      get: {
        tags: ["Qamus Quranic Lexicon"],
        summary: "Raw Dataset Manifest & Schema Metadata",
        description: "Returns the certified dataset manifest, entry counts, distinct lemmas, distinct roots, and schema version.",
        responses: { 200: { description: "Qamus entry manifest" } }
      }
    },
    "/asmaul-husna": {
      get: {
        tags: ["Asmaul Husna"],
        summary: "List the 99 Names of Allah",
        description: "Returns the 99 Beautiful Names of Allah with transliteration, Arabic script, English/Amharic/Arabic translations, deep theological descriptions, and Quranic/Hadith citations. Supports localization via `lang` and search/pagination.",
        parameters: [
          {
            name: "lang",
            in: "query",
            schema: { type: "string", enum: ["all", "en", "am", "ar"], default: "all" },
            description: "Language localization: 'all' (complete multilingual bundle), 'en' (English), 'am' (Amharic / አማርኛ), or 'ar' (Arabic / العربية)"
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Search filter across Arabic script, clean transliteration, English, and Amharic text"
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Page number for pagination"
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" },
            description: "Items per page (1-100). If omitted, all 99 names are returned."
          }
        ],
        responses: {
          200: {
            description: "Array of Asmaul Husna items",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer", example: 99 },
                    count: { type: "integer", example: 99 },
                    language: { type: "string", example: "all" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AsmaulHusnaItem" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/asmaul-husna/{identifier}": {
      get: {
        tags: ["Asmaul Husna"],
        summary: "Get Name of Allah by Number, Arabic Name, or Transliteration",
        description: "Retrieves a specific Name of Allah using its canonical number (1 to 99), Arabic script (e.g. 'الرحمن' or 'الرَّحْمَٰنُ'), or transliteration (e.g. 'Ar-Rahman', 'Al-Malik').",
        parameters: [
          {
            name: "identifier",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Number (1-99), Arabic name (e.g. 'الرحمن'), or transliteration (e.g. 'Ar-Rahman')"
          },
          {
            name: "lang",
            in: "query",
            schema: { type: "string", enum: ["all", "en", "am", "ar"], default: "all" },
            description: "Language localization: 'all', 'en', 'am', or 'ar'"
          }
        ],
        responses: {
          200: {
            description: "Asmaul Husna record",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AsmaulHusnaItem" }
              }
            }
          },
          404: { description: "Name not found" }
        }
      }
    },
    "/asmaul-husna/random": {
      get: {
        tags: ["Asmaul Husna"],
        summary: "Get a Random Name of Allah",
        description: "Returns a randomly selected Name of Allah with complete theological explanation, reference, and multilingual translations.",
        parameters: [
          {
            name: "lang",
            in: "query",
            schema: { type: "string", enum: ["all", "en", "am", "ar"], default: "all" },
            description: "Language localization"
          }
        ],
        responses: {
          200: {
            description: "Random Name of Allah",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AsmaulHusnaItem" }
              }
            }
          }
        }
      }
    },
    "/asmaul-husna/daily": {
      get: {
        tags: ["Asmaul Husna"],
        summary: "Get Daily Name of Allah (Name of the Day)",
        description: "Returns a deterministic Name of the Day based on the calendar date, perfect for daily contemplation and digital widgets.",
        parameters: [
          {
            name: "date",
            in: "query",
            schema: { type: "string" },
            description: "Optional ISO date (YYYY-MM-DD). Defaults to current day."
          },
          {
            name: "lang",
            in: "query",
            schema: { type: "string", enum: ["all", "en", "am", "ar"], default: "all" },
            description: "Language localization"
          }
        ],
        responses: {
          200: {
            description: "Daily Name of Allah",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    date: { type: "string", example: "2026-09-13" },
                    name: { $ref: "#/components/schemas/AsmaulHusnaItem" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/asmaul-husna/search": {
      get: {
        tags: ["Asmaul Husna"],
        summary: "Multi-Field Search Across Arabic, Amharic, and English",
        description: "Executes an instant diacritic-tolerant search across all 99 names in Arabic script, Amharic Ge'ez script, transliterations, theological descriptions, and references.",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Search keyword in Arabic (e.g. 'رحيم'), Amharic (e.g. 'ሩኅሩህ' or 'ንጉሥ'), or English (e.g. 'Merciful')"
          },
          {
            name: "lang",
            in: "query",
            schema: { type: "string", enum: ["all", "en", "am", "ar"], default: "all" },
            description: "Response language"
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" },
            description: "Maximum number of results"
          }
        ],
        responses: {
          200: {
            description: "Matching names",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    query: { type: "string" },
                    total: { type: "integer" },
                    language: { type: "string" },
                    results: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AsmaulHusnaItem" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/asmaul-husna/stats": {
      get: {
        tags: ["Asmaul Husna"],
        summary: "Dataset Statistics & Language Capabilities",
        description: "Returns metadata including the total name count (99), supported languages (ar, am, en), 100% reference coverage, and verified Hadith sources.",
        responses: {
          200: {
            description: "Dataset statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer", example: 99 },
                    supportedLanguages: { type: "array", items: { type: "string" } },
                    referenceCoverage: { type: "string", example: "100%" },
                    quranicVersesCited: { type: "integer", example: 99 }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/asmaul-husna/overview": {
      get: {
        tags: ["Asmaul Husna"],
        summary: "Asmaul Husna Service Overview",
        description: "Returns an introduction to the Asmaul Husna service, documentation references, available endpoints, and language mappings.",
        responses: {
          200: { description: "Service overview" }
        }
      }
    },
    "/dictionary": {
      get: {
        tags: ["Dictionary"],
        summary: "List or Search Trilingual Dictionary Entries",
        description: "Returns paginated dictionary entries with optional search query across Arabic, Amharic, and English, plus filters for category, part of speech, and target language view.",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Search query across Arabic (with/without tashkeel), Amharic (Ge'ez script), English, transliteration, or root" },
          { name: "lang", in: "query", schema: { type: "string", enum: ["all", "ar", "am", "en"], default: "all" }, description: "Focus language formatting" },
          { name: "category", in: "query", schema: { type: "string" }, description: "Filter by thematic category (e.g. Faith & Spirituality, Worship & Law)" },
          { name: "pos", in: "query", schema: { type: "string" }, description: "Filter by part of speech (noun, verb, adjective)" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 }, description: "Page size" }
        ],
        responses: {
          200: {
            description: "List of dictionary records",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                    totalPages: { type: "integer" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/DictionaryEntry" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dictionary/lookup/{word}": {
      get: {
        tags: ["Dictionary"],
        summary: "Direct Trilingual Word Lookup",
        description: "Directly resolves a headword in Arabic, Amharic, or English, returning full morpho-syntactic details, definitions, and examples.",
        parameters: [
          { name: "word", in: "path", required: true, schema: { type: "string" }, description: "Word to look up" },
          { name: "lang", in: "query", schema: { type: "string", enum: ["all", "ar", "am", "en"] }, description: "Output language focus" }
        ],
        responses: {
          200: {
            description: "Matched dictionary entry",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DictionaryEntry" }
              }
            }
          },
          404: { description: "Word not found in dictionary" }
        }
      }
    },
    "/dictionary/entry/{id}": {
      get: {
        tags: ["Dictionary"],
        summary: "Fetch Dictionary Entry by ID",
        description: "Retrieves a single entry by its unique identifier (e.g., dict_001).",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Entry ID" }
        ],
        responses: {
          200: {
            description: "Dictionary entry",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DictionaryEntry" }
              }
            }
          },
          404: { description: "Entry not found" }
        }
      }
    },
    "/dictionary/daily": {
      get: {
        tags: ["Dictionary"],
        summary: "Word of the Day",
        description: "Returns a deterministic word of the day for spiritual vocabulary enrichment and language learning.",
        parameters: [
          { name: "date", in: "query", schema: { type: "string" }, description: "Target date (YYYY-MM-DD)" }
        ],
        responses: {
          200: {
            description: "Daily word",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    date: { type: "string" },
                    word: { $ref: "#/components/schemas/DictionaryEntry" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dictionary/random": {
      get: {
        tags: ["Dictionary"],
        summary: "Random Vocabulary Discovery",
        description: "Fetches a randomly chosen vocabulary record, optionally filtered by category.",
        parameters: [
          { name: "category", in: "query", schema: { type: "string" }, description: "Optional category filter" }
        ],
        responses: {
          200: {
            description: "Random word",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DictionaryEntry" }
              }
            }
          }
        }
      }
    },
    "/dictionary/autocomplete": {
      get: {
        tags: ["Dictionary"],
        summary: "Typeahead Autocomplete Suggestions",
        description: "Quick prefix and substring suggestions for search-as-you-type interfaces across all three scripts.",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Prefix text" },
          { name: "limit", in: "query", schema: { type: "integer", default: 8 }, description: "Max suggestions" }
        ],
        responses: {
          200: {
            description: "List of autocomplete matches",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      label: { type: "string" },
                      sub: { type: "string" },
                      word_ar: { type: "string" },
                      word_am: { type: "string" },
                      word_en: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dictionary/categories": {
      get: {
        tags: ["Dictionary"],
        summary: "Available Thematic Categories",
        description: "Returns all dictionary categories alongside their entry counts.",
        responses: {
          200: {
            description: "List of categories",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      count: { type: "integer" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dictionary/parts-of-speech": {
      get: {
        tags: ["Dictionary"],
        summary: "Parts of Speech Distribution",
        description: "Returns the distribution of parts of speech (nouns, verbs, adjectives, particles).",
        responses: {
          200: {
            description: "List of parts of speech",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      part_of_speech: { type: "string" },
                      count: { type: "integer" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dictionary/stats": {
      get: {
        tags: ["Dictionary"],
        summary: "Trilingual Dictionary Statistics",
        description: "Returns dataset size, language matrix, storage backend, and coverage metrics.",
        responses: {
          200: { description: "Dictionary statistics" }
        }
      }
    },
    "/translation/translate": {
      post: {
        tags: ["Translation"],
        summary: "Translate Text Between Arabic, Amharic, and English",
        description: "Translates words, phrases, and sentences between Arabic, Amharic, and English using lexical dictionary alignment with seamless Gemini AI neural translation fallback.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TranslationRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Translation result",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TranslationResponse" }
              }
            }
          },
          400: { description: "Invalid translation request" }
        }
      }
    },
    "/translation/detect": {
      post: {
        tags: ["Translation"],
        summary: "Detect Script and Language",
        description: "Detects whether input text is written in Arabic, Amharic (Ethiopic script), or English (Latin script) with confidence scores.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["text"],
                properties: {
                  text: { type: "string", example: "ሰላም ለሁላችሁ ይሁን" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Language detection result",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DetectionResponse" }
              }
            }
          }
        }
      }
    },
    "/translation/pairs": {
      get: {
        tags: ["Translation"],
        summary: "Supported Translation Language Pairs",
        description: "Returns the 6 bidirectional language pairs supported by the translation engine.",
        responses: {
          200: { description: "List of translation pairs" }
        }
      }
    }
  }
};
