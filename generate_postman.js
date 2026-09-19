import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commonVariables = [
    { key: "baseUrl", value: "https://ais-dev-25nufs2dp3vj2xehirwibv-201444007982.europe-west2.run.app", type: "string" },
    { key: "token", value: "YOUR_JWT_TOKEN_HERE", type: "string" },
    { key: "username", value: "testuser", type: "string" }
];

// Service Postman Collection Definitions
const serviceModules = [
    {
        id: "auth",
        name: "Auth & User Management Service",
        fileName: "auth.postman_collection.json",
        description: "Postman collection for Authentication, User Profiles, Settings, Bookmarks, and Favorites.",
        item: [
            {
                name: "Auth",
                item: [
                    {
                        name: "Register",
                        request: {
                            method: "POST",
                            header: [{ key: "Content-Type", value: "application/json" }],
                            body: {
                                mode: "raw",
                                raw: JSON.stringify({ username: "testuser", email: "test@example.com", password: "password123" }, null, 2)
                            },
                            url: { raw: "{{baseUrl}}/api/auth/register", host: ["{{baseUrl}}"], path: ["api", "auth", "register"] }
                        }
                    },
                    {
                        name: "Login",
                        request: {
                            method: "POST",
                            header: [{ key: "Content-Type", value: "application/json" }],
                            body: {
                                mode: "raw",
                                raw: JSON.stringify({ username: "testuser", password: "password123" }, null, 2)
                            },
                            url: { raw: "{{baseUrl}}/api/auth/login", host: ["{{baseUrl}}"], path: ["api", "auth", "login"] }
                        }
                    },
                    {
                        name: "Get Current User Profile",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/auth/me", host: ["{{baseUrl}}"], path: ["api", "auth", "me"] }
                        }
                    }
                ]
            },
            {
                name: "Users & Settings",
                item: [
                    {
                        name: "Get User Settings",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/user/settings/{{username}}", host: ["{{baseUrl}}"], path: ["api", "user", "settings", "{{username}}"] }
                        }
                    },
                    {
                        name: "Update User Settings",
                        request: {
                            method: "POST",
                            header: [
                                { key: "Authorization", value: "Bearer {{token}}" },
                                { key: "Content-Type", value: "application/json" }
                            ],
                            body: {
                                mode: "raw",
                                raw: JSON.stringify({ username: "{{username}}", settings: { isDarkMode: true } }, null, 2)
                            },
                            url: { raw: "{{baseUrl}}/api/user/settings", host: ["{{baseUrl}}"], path: ["api", "user", "settings"] }
                        }
                    },
                    {
                        name: "Update Location",
                        request: {
                            method: "POST",
                            header: [
                                { key: "Authorization", value: "Bearer {{token}}" },
                                { key: "Content-Type", value: "application/json" }
                            ],
                            body: {
                                mode: "raw",
                                raw: JSON.stringify({ username: "{{username}}", city: "Addis Ababa", country: "Ethiopia" }, null, 2)
                            },
                            url: { raw: "{{baseUrl}}/api/user/location", host: ["{{baseUrl}}"], path: ["api", "user", "location"] }
                        }
                    },
                    {
                        name: "Get Bookmarks",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/user/bookmarks/{{username}}", host: ["{{baseUrl}}"], path: ["api", "user", "bookmarks", "{{username}}"] }
                        }
                    },
                    {
                        name: "Toggle Bookmark",
                        request: {
                            method: "POST",
                            header: [
                                { key: "Authorization", value: "Bearer {{token}}" },
                                { key: "Content-Type", value: "application/json" }
                            ],
                            body: {
                                mode: "raw",
                                raw: JSON.stringify({ username: "{{username}}", type: "ayah", id: "1:1", text: "In the name of Allah..." }, null, 2)
                            },
                            url: { raw: "{{baseUrl}}/api/user/bookmarks/toggle", host: ["{{baseUrl}}"], path: ["api", "user", "bookmarks", "toggle"] }
                        }
                    },
                    {
                        name: "Get Favorites",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/user/favorites/{{username}}", host: ["{{baseUrl}}"], path: ["api", "user", "favorites", "{{username}}"] }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "quran",
        name: "Quran, Tafsir & Audio Service",
        fileName: "quran.postman_collection.json",
        description: "Postman collection for Holy Quran, Amharic & English Translations, Classical Tafsirs, and Verse Recitation Audio.",
        item: [
            {
                name: "Surahs & Ayahs",
                item: [
                    {
                        name: "Get All 114 Surahs",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/quran/surahs", host: ["{{baseUrl}}"], path: ["api", "quran", "surahs"] }
                        }
                    },
                    {
                        name: "Get Single Surah Detail",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/quran/surahs/1", host: ["{{baseUrl}}"], path: ["api", "quran", "surahs", "1"] }
                        }
                    },
                    {
                        name: "Get Surah Ayahs with Translations",
                        request: {
                            method: "GET",
                            url: {
                                raw: "{{baseUrl}}/api/quran/surahs/1/ayahs?translationId=131&tafsirId=1",
                                host: ["{{baseUrl}}"],
                                path: ["api", "quran", "surahs", "1", "ayahs"],
                                query: [
                                    { key: "translationId", value: "131" },
                                    { key: "tafsirId", value: "1" }
                                ]
                            }
                        }
                    },
                    {
                        name: "Get Random Ayahs (7 Default with Context)",
                        request: {
                            method: "GET",
                            url: {
                                raw: "{{baseUrl}}/api/quran/ayahs/random?count=7",
                                host: ["{{baseUrl}}"],
                                path: ["api", "quran", "ayahs", "random"],
                                query: [{ key: "count", value: "7" }]
                            }
                        }
                    },
                    {
                        name: "Get Single Random Ayah",
                        request: {
                            method: "GET",
                            url: {
                                raw: "{{baseUrl}}/api/quran/ayahs/single?translationId=131",
                                host: ["{{baseUrl}}"],
                                path: ["api", "quran", "ayahs", "single"],
                                query: [{ key: "translationId", value: "131" }]
                            }
                        }
                    },
                    {
                        name: "Get Specific Ayah Tafsir",
                        request: {
                            method: "GET",
                            url: {
                                raw: "{{baseUrl}}/api/quran/ayahs/tafsir?surah=1&ayah=1&tafsirId=1",
                                host: ["{{baseUrl}}"],
                                path: ["api", "quran", "ayahs", "tafsir"],
                                query: [
                                    { key: "surah", value: "1" },
                                    { key: "ayah", value: "1" },
                                    { key: "tafsirId", value: "1" }
                                ]
                            }
                        }
                    }
                ]
            },
            {
                name: "Audio Recitations",
                item: [
                    {
                        name: "Stream Ayah Audio MP3",
                        request: {
                            method: "GET",
                            url: {
                                raw: "{{baseUrl}}/api/audio/1/1?reciter=Mishari_Rashid_Alafasy_24kbps",
                                host: ["{{baseUrl}}"],
                                path: ["api", "audio", "1", "1"],
                                query: [{ key: "reciter", value: "Mishari_Rashid_Alafasy_24kbps" }]
                            }
                        }
                    }
                ]
            },
            {
                name: "Resources Metadata",
                item: [
                    {
                        name: "List Available Translations",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/quran/resources/translations", host: ["{{baseUrl}}"], path: ["api", "quran", "resources", "translations"] }
                        }
                    },
                    {
                        name: "List Available Tafsirs",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/quran/resources/tafsirs", host: ["{{baseUrl}}"], path: ["api", "quran", "resources", "tafsirs"] }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "prayers",
        name: "Prayer Times & Tracking Service",
        fileName: "prayers.postman_collection.json",
        description: "Postman collection for Astronomical Prayer Calculations, Habit Tracking, Fasting Logs, and Analytics.",
        item: [
            {
                name: "Prayer Calculations",
                item: [
                    {
                        name: "Get Astronomical Prayer Times",
                        request: {
                            method: "GET",
                            url: {
                                raw: "{{baseUrl}}/api/prayers/times?city=Addis Ababa&country=Ethiopia&method=2",
                                host: ["{{baseUrl}}"],
                                path: ["api", "prayers", "times"],
                                query: [
                                    { key: "city", value: "Addis Ababa" },
                                    { key: "country", value: "Ethiopia" },
                                    { key: "method", value: "2" }
                                ]
                            }
                        }
                    }
                ]
            },
            {
                name: "Prayer Habit Tracking",
                item: [
                    {
                        name: "Get Prayer Status",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: {
                                raw: "{{baseUrl}}/api/prayers/status/{{username}}/2026-09-18",
                                host: ["{{baseUrl}}"],
                                path: ["api", "prayers", "status", "{{username}}", "2026-09-18"]
                            }
                        }
                    },
                    {
                        name: "Log Prayer Activity",
                        request: {
                            method: "POST",
                            header: [
                                { key: "Authorization", value: "Bearer {{token}}" },
                                { key: "Content-Type", value: "application/json" }
                            ],
                            body: {
                                mode: "raw",
                                raw: JSON.stringify({ username: "{{username}}", date: "2026-09-18", prayer_name: "Fajr", status: 1 }, null, 2)
                            },
                            url: { raw: "{{baseUrl}}/api/prayers/log-activity", host: ["{{baseUrl}}"], path: ["api", "prayers", "log-activity"] }
                        }
                    },
                    {
                        name: "Weekly Prayer Stats",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/prayers/weekly/{{username}}", host: ["{{baseUrl}}"], path: ["api", "prayers", "weekly", "{{username}}"] }
                        }
                    },
                    {
                        name: "Prayer Streak & Analytics",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/prayers/analysis/{{username}}", host: ["{{baseUrl}}"], path: ["api", "prayers", "analysis", "{{username}}"] }
                        }
                    }
                ]
            },
            {
                name: "Fasting Tracker",
                item: [
                    {
                        name: "Get Fasting Logs",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/fasting/logs/{{username}}", host: ["{{baseUrl}}"], path: ["api", "fasting", "logs", "{{username}}"] }
                        }
                    },
                    {
                        name: "Log Fasting Day",
                        request: {
                            method: "POST",
                            header: [
                                { key: "Authorization", value: "Bearer {{token}}" },
                                { key: "Content-Type", value: "application/json" }
                            ],
                            body: {
                                mode: "raw",
                                raw: JSON.stringify({ username: "{{username}}", date: "2026-09-18", type: "voluntary", status: "completed" }, null, 2)
                            },
                            url: { raw: "{{baseUrl}}/api/fasting/log", host: ["{{baseUrl}}"], path: ["api", "fasting", "log"] }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "asmaul_husna",
        name: "Asmaul Husna (99 Names of Allah) Service",
        fileName: "asmaul_husna.postman_collection.json",
        description: "Postman collection for The 99 Beautiful Names of Allah with Trilingual Translations, Theological Descriptions, and Quranic Citations.",
        item: [
            {
                name: "Names of Allah",
                item: [
                    {
                        name: "Get All 99 Names",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/asmaul-husna", host: ["{{baseUrl}}"], path: ["asmaul-husna"] }
                        }
                    },
                    {
                        name: "Get Single Name by ID (e.g. Ar-Rahman)",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/asmaul-husna/1", host: ["{{baseUrl}}"], path: ["asmaul-husna", "1"] }
                        }
                    },
                    {
                        name: "Search Names by Keyword",
                        request: {
                            method: "GET",
                            url: {
                                raw: "{{baseUrl}}/asmaul-husna?q=Merciful",
                                host: ["{{baseUrl}}"],
                                path: ["asmaul-husna"],
                                query: [{ key: "q", value: "Merciful" }]
                            }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "qamus",
        name: "Fusha Qamus Lexicon & Translation Service",
        fileName: "qamus.postman_collection.json",
        description: "Postman collection for Certified Fusha Quranic Dictionary (Qamus), Roots Analysis, Trilingual Dictionary, and Real-time Script Detection.",
        item: [
            {
                name: "Quranic Lexicon (Qamus)",
                item: [
                    {
                        name: "List Lexicon Words",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/qamus/words", host: ["{{baseUrl}}"], path: ["qamus", "words"] }
                        }
                    },
                    {
                        name: "Search Lexicon by Root",
                        request: {
                            method: "GET",
                            url: {
                                raw: "{{baseUrl}}/qamus/words?root=كتب",
                                host: ["{{baseUrl}}"],
                                path: ["qamus", "words"],
                                query: [{ key: "root", value: "كتب" }]
                            }
                        }
                    },
                    {
                        name: "Get Lexicon Word Details",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/qamus/words/1", host: ["{{baseUrl}}"], path: ["qamus", "words", "1"] }
                        }
                    }
                ]
            },
            {
                name: "Trilingual Dictionary & Detection",
                item: [
                    {
                        name: "Lookup Dictionary Term",
                        request: {
                            method: "GET",
                            url: {
                                raw: "{{baseUrl}}/dictionary/lookup?q=peace",
                                host: ["{{baseUrl}}"],
                                path: ["dictionary", "lookup"],
                                query: [{ key: "q", value: "peace" }]
                            }
                        }
                    },
                    {
                        name: "Detect Language / Script",
                        request: {
                            method: "POST",
                            header: [{ key: "Content-Type", value: "application/json" }],
                            body: {
                                mode: "raw",
                                raw: JSON.stringify({ text: "አልሐምዱ ሊልላህ" }, null, 2)
                            },
                            url: { raw: "{{baseUrl}}/translation/detect", host: ["{{baseUrl}}"], path: ["translation", "detect"] }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "hadith",
        name: "Hadith Collections Service",
        fileName: "hadith.postman_collection.json",
        description: "Postman collection for Authenticated Hadith Books, Sections, Narrations, and Daily Hadith Schedule.",
        item: [
            {
                name: "Hadith Books & Narrations",
                item: [
                    {
                        name: "Get Available Editions",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/hadith/editions", host: ["{{baseUrl}}"], path: ["api", "hadith", "editions"] }
                        }
                    },
                    {
                        name: "Get Book Sections",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/hadith/editions/1/sections", host: ["{{baseUrl}}"], path: ["api", "hadith", "editions", "1", "sections"] }
                        }
                    },
                    {
                        name: "Get Hadiths by Section",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/hadith/sections/1/hadiths", host: ["{{baseUrl}}"], path: ["api", "hadith", "sections", "1", "hadiths"] }
                        }
                    },
                    {
                        name: "Get Daily Hadith",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/hadith/daily", host: ["{{baseUrl}}"], path: ["api", "hadith", "daily"] }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "duas",
        name: "Authentic Duas & Azkar Service",
        fileName: "duas.postman_collection.json",
        description: "Postman collection for Supplications, Morning/Evening Azkar, Categories, Transliterations, and Daily Dua.",
        item: [
            {
                name: "Duas & Azkar",
                item: [
                    {
                        name: "List All Duas",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/duas", host: ["{{baseUrl}}"], path: ["api", "duas"] }
                        }
                    },
                    {
                        name: "List Dua Categories",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/duas/categories", host: ["{{baseUrl}}"], path: ["api", "duas", "categories"] }
                        }
                    },
                    {
                        name: "Get Daily Dua",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/duas/daily", host: ["{{baseUrl}}"], path: ["api", "duas", "daily"] }
                        }
                    },
                    {
                        name: "Get Random Dua",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/duas/random", host: ["{{baseUrl}}"], path: ["api", "duas", "random"] }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "calendar",
        name: "Multi-Calendar Conversion Service",
        fileName: "calendar.postman_collection.json",
        description: "Postman collection for High-precision Gregorian, Islamic Hijri, and Ethiopian Calendar Conversions, Holidays, and Events.",
        item: [
            {
                name: "Date Conversion & Holidays",
                item: [
                    {
                        name: "Convert Gregorian to Hijri & Ethiopian",
                        request: {
                            method: "POST",
                            header: [{ key: "Content-Type", value: "application/json" }],
                            body: {
                                mode: "raw",
                                raw: JSON.stringify({ from: "gregorian", to: "hijri", date: "2026-09-18" }, null, 2)
                            },
                            url: { raw: "{{baseUrl}}/api/calendar/convert", host: ["{{baseUrl}}"], path: ["api", "calendar", "convert"] }
                        }
                    },
                    {
                        name: "List Islamic & National Holidays",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/calendar/holidays", host: ["{{baseUrl}}"], path: ["api", "calendar", "holidays"] }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "reflections",
        name: "Spiritual Journal & Social Service",
        fileName: "reflections.postman_collection.json",
        description: "Postman collection for Spiritual Reflection Journaling, Community Challenges, Social Groups, and DeenBot AI.",
        item: [
            {
                name: "Spiritual Journaling",
                item: [
                    {
                        name: "Get Journal Entries",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/journal/entries/{{username}}", host: ["{{baseUrl}}"], path: ["api", "journal", "entries", "{{username}}"] }
                        }
                    },
                    {
                        name: "Create Journal Entry",
                        request: {
                            method: "POST",
                            header: [
                                { key: "Authorization", value: "Bearer {{token}}" },
                                { key: "Content-Type", value: "application/json" }
                            ],
                            body: {
                                mode: "raw",
                                raw: JSON.stringify({ username: "{{username}}", title: "Friday Reflection", content: "Alhamdulillah for Friday blessings." }, null, 2)
                            },
                            url: { raw: "{{baseUrl}}/api/journal/entries", host: ["{{baseUrl}}"], path: ["api", "journal", "entries"] }
                        }
                    }
                ]
            },
            {
                name: "Social & Community",
                item: [
                    {
                        name: "List Community Groups",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/social/groups", host: ["{{baseUrl}}"], path: ["api", "social", "groups"] }
                        }
                    },
                    {
                        name: "List Active Challenges",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/social/challenges", host: ["{{baseUrl}}"], path: ["api", "social", "challenges"] }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "resources",
        name: "Quotes, Search & System Admin Service",
        fileName: "resources.postman_collection.json",
        description: "Postman collection for Wisdom Quotes, Global Multi-Entity Search, System Diagnostics, and Administrative Data Seeding.",
        item: [
            {
                name: "Quotes & Wisdom",
                item: [
                    {
                        name: "Get Random Wisdom Quote",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/api/quotes/random", host: ["{{baseUrl}}"], path: ["api", "quotes", "random"] }
                        }
                    }
                ]
            },
            {
                name: "Global Search & Diagnostics",
                item: [
                    {
                        name: "Global Multi-Entity Search",
                        request: {
                            method: "GET",
                            url: {
                                raw: "{{baseUrl}}/api/search/global?q=prayer",
                                host: ["{{baseUrl}}"],
                                path: ["api", "search", "global"],
                                query: [{ key: "q", value: "prayer" }]
                            }
                        }
                    },
                    {
                        name: "Server Health Check",
                        request: {
                            method: "GET",
                            url: { raw: "{{baseUrl}}/health", host: ["{{baseUrl}}"], path: ["health"] }
                        }
                    }
                ]
            },
            {
                name: "Admin Operations",
                item: [
                    {
                        name: "Get System Stats",
                        request: {
                            method: "GET",
                            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                            url: { raw: "{{baseUrl}}/api/admin/stats", host: ["{{baseUrl}}"], path: ["api", "admin", "stats"] }
                        }
                    }
                ]
            }
        ]
    }
];

// Ensure output directories exist
const outputDirs = [
    path.join(__dirname, 'postman'),
    path.join(__dirname, 'public', 'postman'),
    path.join(__dirname, 'api', 'postman')
];

for (const dir of outputDirs) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// 1. Generate Individual Service Collections
const generatedServices = [];

for (const mod of serviceModules) {
    const serviceCollection = {
        info: {
            name: `Muslim Daily API - ${mod.name}`,
            description: mod.description,
            schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        variable: commonVariables,
        item: mod.item
    };

    const jsonStr = JSON.stringify(serviceCollection, null, 2);
    for (const dir of outputDirs) {
        fs.writeFileSync(path.join(dir, mod.fileName), jsonStr, 'utf8');
    }
    
    generatedServices.push({
        id: mod.id,
        name: mod.name,
        fileName: mod.fileName,
        description: mod.description,
        endpointCount: mod.item.reduce((acc, cat) => acc + (cat.item ? cat.item.length : 1), 0)
    });
}

// 2. Generate Master Combined Collection (All Services)
const masterCollection = {
    info: {
        name: "Muslim Daily API v2 - Full Master Collection",
        description: "Complete Postman collection containing all digital Islamic services provided by Muslim Daily Server v2.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: commonVariables,
    item: serviceModules.map(mod => ({
        name: mod.name,
        item: mod.item
    }))
};

const masterJsonStr = JSON.stringify(masterCollection, null, 2);
const masterFileNames = ['MuslimDaily_API_v2.postman_collection.json', 'master.postman_collection.json'];

for (const dir of outputDirs) {
    for (const mName of masterFileNames) {
        fs.writeFileSync(path.join(dir, mName), masterJsonStr, 'utf8');
    }
}

// Save service collection index manifest
const indexManifest = {
    generatedAt: new Date().toISOString(),
    masterCollectionUrl: "postman/MuslimDaily_API_v2.postman_collection.json",
    services: generatedServices
};

for (const dir of outputDirs) {
    fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(indexManifest, null, 2), 'utf8');
}

console.log(`✅ Postman collections successfully generated!`);
console.log(`- Master Collection: ${masterFileNames[0]}`);
console.log(`- Service Collections (${generatedServices.length} modules): ${generatedServices.map(s => s.fileName).join(', ')}`);
