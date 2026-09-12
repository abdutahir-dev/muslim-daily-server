import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const collection = {
    info: {
        name: "Muslim Daily API v2",
        description: "Postman collection for Muslim Daily Server v2",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: [
        { key: "baseUrl", value: "http://localhost:5003", type: "string" },
        { key: "token", value: "YOUR_JWT_TOKEN_HERE", type: "string" },
        { key: "username", value: "testuser", type: "string" }
    ],
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
                    name: "Get Me",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/auth/me", host: ["{{baseUrl}}"], path: ["api", "auth", "me"] }
                    }
                }
            ]
        },
        {
            name: "Prayers",
            item: [
                {
                    name: "Get Prayer Times",
                    request: {
                        method: "GET",
                        url: {
                            raw: "{{baseUrl}}/api/prayers/times?city=Addis Ababa&country=Ethiopia&method=2&date=2023-10-01",
                            host: ["{{baseUrl}}"],
                            path: ["api", "prayers", "times"],
                            query: [
                                { key: "city", value: "Addis Ababa" },
                                { key: "country", value: "Ethiopia" },
                                { key: "method", value: "2" },
                                { key: "date", value: "2023-10-01" }
                            ]
                        }
                    }
                },
                {
                    name: "Get Prayer Status",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: {
                            raw: "{{baseUrl}}/api/prayers/status/{{username}}/2023-10-01",
                            host: ["{{baseUrl}}"],
                            path: ["api", "prayers", "status", "{{username}}", "2023-10-01"]
                        }
                    }
                },
                {
                    name: "Log Activity",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ username: "{{username}}", date: "2023-10-01", prayer_name: "Fajr", status: 1 }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/prayers/log-activity", host: ["{{baseUrl}}"], path: ["api", "prayers", "log-activity"] }
                    }
                },
                {
                    name: "Update Prayer Log",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ username: "{{username}}", date: "2023-10-01", prayer_name: "Fajr", prayer_type: "fard", status: 1, prayed_as: "on_time" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/prayers/update", host: ["{{baseUrl}}"], path: ["api", "prayers", "update"] }
                    }
                },
                {
                    name: "Weekly Stats",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/prayers/weekly/{{username}}", host: ["{{baseUrl}}"], path: ["api", "prayers", "weekly", "{{username}}"] }
                    }
                },
                {
                    name: "Monthly Stats",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/prayers/monthly/{{username}}/2023-10", host: ["{{baseUrl}}"], path: ["api", "prayers", "monthly", "{{username}}", "2023-10"] }
                    }
                },
                {
                    name: "Advanced Analysis",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/prayers/analysis/{{username}}", host: ["{{baseUrl}}"], path: ["api", "prayers", "analysis", "{{username}}"] }
                    }
                },
                {
                    name: "Qada Stats",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/prayers/qada/{{username}}", host: ["{{baseUrl}}"], path: ["api", "prayers", "qada", "{{username}}"] }
                    }
                }
            ]
        },
        {
            name: "Users",
            item: [
                {
                    name: "Get Settings",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/user/settings/{{username}}", host: ["{{baseUrl}}"], path: ["api", "user", "settings", "{{username}}"] }
                    }
                },
                {
                    name: "Update Settings",
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
                            raw: JSON.stringify({ username: "{{username}}", city: "Cairo", country: "Egypt" }, null, 2)
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
                    name: "Delete Bookmark",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ username: "{{username}}", type: "ayah", id: "1:1" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/user/bookmarks/delete", host: ["{{baseUrl}}"], path: ["api", "user", "bookmarks", "delete"] }
                    }
                },
                {
                    name: "Get Favorites",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/user/favorites/{{username}}", host: ["{{baseUrl}}"], path: ["api", "user", "favorites", "{{username}}"] }
                    }
                },
                {
                    name: "Toggle Favorite",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ username: "{{username}}", type: "quran", id: "2:2" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/user/favorites/toggle", host: ["{{baseUrl}}"], path: ["api", "user", "favorites", "toggle"] }
                    }
                },
                {
                    name: "Delete Favorite",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ username: "{{username}}", type: "quran", id: "2:2" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/user/favorites/delete", host: ["{{baseUrl}}"], path: ["api", "user", "favorites", "delete"] }
                    }
                }
            ]
        },
        {
            name: "Social",
            item: [
                { name: "Create Group", request: { method: "POST", header: [{ key: "Authorization", value: "Bearer {{token}}" }, { key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ name: "Study Circle", description: "Learn together" }, null, 2) }, url: { raw: "{{baseUrl}}/api/social/groups", host: ["{{baseUrl}}"], path: ["api", "social", "groups"] } } },
                { name: "List Groups", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{token}}" }], url: { raw: "{{baseUrl}}/api/social/groups", host: ["{{baseUrl}}"], path: ["api", "social", "groups"] } } },
                { name: "Join Group", request: { method: "POST", header: [{ key: "Authorization", value: "Bearer {{token}}" }, { key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ groupId: 1 }, null, 2) }, url: { raw: "{{baseUrl}}/api/social/groups/join", host: ["{{baseUrl}}"], path: ["api", "social", "groups", "join"] } } },
                { name: "Group Activity", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{token}}" }], url: { raw: "{{baseUrl}}/api/social/groups/1/activity", host: ["{{baseUrl}}"], path: ["api", "social", "groups", "1", "activity"] } } },
                { name: "Create Challenge", request: { method: "POST", header: [{ key: "Authorization", value: "Bearer {{token}}" }, { key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ title: "Quran Reading", target: 30 }, null, 2) }, url: { raw: "{{baseUrl}}/api/social/challenges", host: ["{{baseUrl}}"], path: ["api", "social", "challenges"] } } },
                { name: "Community Challenges", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{token}}" }], url: { raw: "{{baseUrl}}/api/social/challenges", host: ["{{baseUrl}}"], path: ["api", "social", "challenges"] } } },
                { name: "Update Challenge Progress", request: { method: "POST", header: [{ key: "Authorization", value: "Bearer {{token}}" }, { key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ challengeId: 1, progress: 5 }, null, 2) }, url: { raw: "{{baseUrl}}/api/social/challenges/progress", host: ["{{baseUrl}}"], path: ["api", "social", "challenges", "progress"] } } },
                { name: "Challenge Leaderboard", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{token}}" }], url: { raw: "{{baseUrl}}/api/social/challenges/1/leaderboard", host: ["{{baseUrl}}"], path: ["api", "social", "challenges", "1", "leaderboard"] } } }
            ]
        },
        {
            name: "Analytics",
            item: [
                {
                    name: "Log Activity",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ username: "{{username}}", action: "prayer_logged", details: { prayer: "Fajr" } }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/analytics/log", host: ["{{baseUrl}}"], path: ["api", "analytics", "log"] }
                    }
                },
                {
                    name: "Get Activity History",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/analytics/history/{{username}}", host: ["{{baseUrl}}"], path: ["api", "analytics", "history", "{{username}}"] }
                    }
                },
                {
                    name: "Get Stats",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/analytics/stats/{{username}}", host: ["{{baseUrl}}"], path: ["api", "analytics", "stats", "{{username}}"] }
                    }
                },
                {
                    name: "Get Summary",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/analytics/summary/{{username}}", host: ["{{baseUrl}}"], path: ["api", "analytics", "summary", "{{username}}"] }
                    }
                },
                {
                    name: "Get Streak",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/analytics/streak/{{username}}", host: ["{{baseUrl}}"], path: ["api", "analytics", "streak", "{{username}}"] }
                    }
                },
                {
                    name: "Get Top Categories",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/analytics/categories/{{username}}", host: ["{{baseUrl}}"], path: ["api", "analytics", "categories", "{{username}}"] }
                    }
                }
            ]
        },
        {
            name: "Search",
            item: [
                { name: "Global Search", request: { method: "GET", url: { raw: "{{baseUrl}}/api/search/global?q=pray", host: ["{{baseUrl}}"], path: ["api", "search", "global"], query: [{ key: "q", value: "pray" }] } } }
            ]
        },
        {
            name: "Audio",
            item: [
                {
                    name: "Stream Ayah Audio",
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
            name: "Quran",
            item: [
                {
                    name: "Get All Surahs",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/quran/surahs", host: ["{{baseUrl}}"], path: ["api", "quran", "surahs"] }
                    }
                },
                {
                    name: "Get Single Surah",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/quran/surahs/1", host: ["{{baseUrl}}"], path: ["api", "quran", "surahs", "1"] }
                    }
                },
                {
                    name: "Get Surah Ayahs",
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
                    name: "Random Ayahs",
                    request: {
                        method: "GET",
                        url: {
                            raw: "{{baseUrl}}/api/quran/ayahs/random?count=5",
                            host: ["{{baseUrl}}"],
                            path: ["api", "quran", "ayahs", "random"],
                            query: [{ key: "count", value: "5" }]
                        }
                    }
                },
                {
                    name: "Single Random Ayah",
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
                    name: "Get Ayah Tafsir",
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
                },
                {
                    name: "Translations Meta",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/quran/resources/translations", host: ["{{baseUrl}}"], path: ["api", "quran", "resources", "translations"] }
                    }
                },
                {
                    name: "Tafsirs Meta",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/quran/resources/tafsirs", host: ["{{baseUrl}}"], path: ["api", "quran", "resources", "tafsirs"] }
                    }
                },

                {
                    name: "Resources",
                    item: [
                        {
                            name: "Random Quote",
                            request: {
                                method: "GET",
                                url: { raw: "{{baseUrl}}/api/quotes/random", host: ["{{baseUrl}}"], path: ["api", "quotes", "random"] }
                            }
                        }
                    ]
                },
                {
                    name: "Admin",
                    item: [
                        {
                            name: "Seed Data",
                            request: {
                                method: "POST",
                                header: [
                                    { key: "Authorization", value: "Bearer {{token}}" },
                                    { key: "Content-Type", value: "application/json" }
                                ],
                                body: {
                                    mode: "raw",
                                    raw: JSON.stringify({ types: ["quran"], force: false }, null, 2)
                                },
                                url: { raw: "{{baseUrl}}/api/admin/seed", host: ["{{baseUrl}}"], path: ["api", "admin", "seed"] }
                            }
                        },
                        {
                            name: "Get Stats",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/stats", host: ["{{baseUrl}}"], path: ["api", "admin", "stats"] }
                            }
                        },
                        {
                            name: "Get Users List",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/users_list", host: ["{{baseUrl}}"], path: ["api", "admin", "users_list"] }
                            }
                        },
                        {
                            name: "Delete User",
                            request: {
                                method: "DELETE",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/users/1", host: ["{{baseUrl}}"], path: ["api", "admin", "users", "1"] }
                            }
                        },
                        {
                            name: "Get Dua Category Counts",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/dua_category_counts", host: ["{{baseUrl}}"], path: ["api", "admin", "dua_category_counts"] }
                            }
                        },
                        {
                            name: "Resource Lists (e.g. Surahs)",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/surahs", host: ["{{baseUrl}}"], path: ["api", "admin", "surahs"] }
                            }
                        },
                        {
                            name: "List Ayahs",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/ayahs", host: ["{{baseUrl}}"], path: ["api", "admin", "ayahs"] }
                            }
                        },
                        {
                            name: "List Translations",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/translations", host: ["{{baseUrl}}"], path: ["api", "admin", "translations"] }
                            }
                        },
                        {
                            name: "List Tafsirs",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/tafsirs", host: ["{{baseUrl}}"], path: ["api", "admin", "tafsirs"] }
                            }
                        },
                        {
                            name: "List Prayer Timings",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/prayer_timings", host: ["{{baseUrl}}"], path: ["api", "admin", "prayer_timings"] }
                            }
                        },
                        {
                            name: "List Prayer Logs",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/prayer_logs", host: ["{{baseUrl}}"], path: ["api", "admin", "prayer_logs"] }
                            }
                        },
                        {
                            name: "List Hadiths",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/hadiths", host: ["{{baseUrl}}"], path: ["api", "admin", "hadiths"] }
                            }
                        },
                        {
                            name: "List Categories",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/categories", host: ["{{baseUrl}}"], path: ["api", "admin", "categories"] }
                            }
                        },
                        {
                            name: "List Duas",
                            request: {
                                method: "GET",
                                header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                                url: { raw: "{{baseUrl}}/api/admin/duas", host: ["{{baseUrl}}"], path: ["api", "admin", "duas"] }
                            }
                        }
                    ]
                }
            ]
        },
        {
            name: "Calendar",
            item: [
                {
                    name: "Convert Date",
                    request: {
                        method: "POST",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ from: "gregorian", to: "hijri", date: "2023-10-01" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/convert", host: ["{{baseUrl}}"], path: ["api", "calendar", "convert"] }
                    }
                },
                {
                    name: "Bulk Convert Dates",
                    request: {
                        method: "POST",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ dates: ["2023-10-01", "2023-10-02"] }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/convert/bulk", host: ["{{baseUrl}}"], path: ["api", "calendar", "convert", "bulk"] }
                    }
                },
                {
                    name: "List Holidays",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/calendar/holidays", host: ["{{baseUrl}}"], path: ["api", "calendar", "holidays"] }
                    }
                },
                {
                    name: "Add Holiday",
                    request: {
                        method: "POST",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ name: "Eid al-Fitr", date: "2023-10-01", type: "islamic" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/holidays", host: ["{{baseUrl}}"], path: ["api", "calendar", "holidays"] }
                    }
                },
                {
                    name: "Update Holiday",
                    request: {
                        method: "PUT",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ name: "Updated Holiday", date: "2023-10-02" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/holidays/1", host: ["{{baseUrl}}"], path: ["api", "calendar", "holidays", "1"] }
                    }
                },
                {
                    name: "Delete Holiday",
                    request: {
                        method: "DELETE",
                        url: { raw: "{{baseUrl}}/api/calendar/holidays/1", host: ["{{baseUrl}}"], path: ["api", "calendar", "holidays", "1"] }
                    }
                },
                {
                    name: "List Calendars",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/calendar/calendars", host: ["{{baseUrl}}"], path: ["api", "calendar", "calendars"] }
                    }
                },
                {
                    name: "Add Calendar",
                    request: {
                        method: "POST",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ name: "My Calendar", type: "personal" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/calendars", host: ["{{baseUrl}}"], path: ["api", "calendar", "calendars"] }
                    }
                },
                {
                    name: "Update Calendar",
                    request: {
                        method: "PUT",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ name: "Updated Calendar" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/calendars/1", host: ["{{baseUrl}}"], path: ["api", "calendar", "calendars", "1"] }
                    }
                },
                {
                    name: "Delete Calendar",
                    request: {
                        method: "DELETE",
                        url: { raw: "{{baseUrl}}/api/calendar/calendars/1", host: ["{{baseUrl}}"], path: ["api", "calendar", "calendars", "1"] }
                    }
                },
                {
                    name: "List Events",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/calendar/events", host: ["{{baseUrl}}"], path: ["api", "calendar", "events"] }
                    }
                },
                {
                    name: "Add Event",
                    request: {
                        method: "POST",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ title: "Prayer Time", date: "2023-10-01", type: "prayer" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/events", host: ["{{baseUrl}}"], path: ["api", "calendar", "events"] }
                    }
                },
                {
                    name: "Update Event",
                    request: {
                        method: "PUT",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ title: "Updated Event" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/events/1", host: ["{{baseUrl}}"], path: ["api", "calendar", "events", "1"] }
                    }
                },
                {
                    name: "Delete Event",
                    request: {
                        method: "DELETE",
                        url: { raw: "{{baseUrl}}/api/calendar/events/1", host: ["{{baseUrl}}"], path: ["api", "calendar", "events", "1"] }
                    }
                },
                {
                    name: "List Tasks",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/calendar/tasks", host: ["{{baseUrl}}"], path: ["api", "calendar", "tasks"] }
                    }
                },
                {
                    name: "Add Task",
                    request: {
                        method: "POST",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ title: "Read Quran", completed: false }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/tasks", host: ["{{baseUrl}}"], path: ["api", "calendar", "tasks"] }
                    }
                },
                {
                    name: "Update Task",
                    request: {
                        method: "PUT",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ title: "Updated Task", completed: true }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/tasks/1", host: ["{{baseUrl}}"], path: ["api", "calendar", "tasks", "1"] }
                    }
                },
                {
                    name: "Delete Task",
                    request: {
                        method: "DELETE",
                        url: { raw: "{{baseUrl}}/api/calendar/tasks/1", host: ["{{baseUrl}}"], path: ["api", "calendar", "tasks", "1"] }
                    }
                },
                {
                    name: "List Notes",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/calendar/notes", host: ["{{baseUrl}}"], path: ["api", "calendar", "notes"] }
                    }
                },
                {
                    name: "Add Note",
                    request: {
                        method: "POST",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ title: "Daily Reflection", content: "Alhamdulillah" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/notes", host: ["{{baseUrl}}"], path: ["api", "calendar", "notes"] }
                    }
                },
                {
                    name: "Update Note",
                    request: {
                        method: "PUT",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ title: "Updated Note", content: "Updated content" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/notes/1", host: ["{{baseUrl}}"], path: ["api", "calendar", "notes", "1"] }
                    }
                },
                {
                    name: "Delete Note",
                    request: {
                        method: "DELETE",
                        url: { raw: "{{baseUrl}}/api/calendar/notes/1", host: ["{{baseUrl}}"], path: ["api", "calendar", "notes", "1"] }
                    }
                },
                {
                    name: "Push Sync",
                    request: {
                        method: "POST",
                        header: [{ key: "Content-Type", value: "application/json" }],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ changes: [] }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/calendar/sync/push", host: ["{{baseUrl}}"], path: ["api", "calendar", "sync", "push"] }
                    }
                },
                {
                    name: "Pull Sync",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/calendar/sync/pull", host: ["{{baseUrl}}"], path: ["api", "calendar", "sync", "pull"] }
                    }
                }
            ]
        },
        {
            name: "Duas",
            item: [
                {
                    name: "List Duas",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/duas", host: ["{{baseUrl}}"], path: ["api", "duas"] }
                    }
                },
                {
                    name: "List Categories",
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
                },
                {
                    name: "Override Daily Dua",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ duaId: 1 }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/duas/daily/override", host: ["{{baseUrl}}"], path: ["api", "duas", "daily", "override"] }
                    }
                },
                {
                    name: "Get Dua by ID",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/duas/1", host: ["{{baseUrl}}"], path: ["api", "duas", "1"] }
                    }
                },
                {
                    name: "Get Category by ID",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/duas/categories/1", host: ["{{baseUrl}}"], path: ["api", "duas", "categories", "1"] }
                    }
                },
                {
                    name: "Create Dua",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ title_en: "Test Dua", content_ar: "Arabic text", category_id: 1 }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/duas", host: ["{{baseUrl}}"], path: ["api", "duas"] }
                    }
                },
                {
                    name: "Update Dua",
                    request: {
                        method: "PUT",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ title_en: "Updated Dua" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/duas/1", host: ["{{baseUrl}}"], path: ["api", "duas", "1"] }
                    }
                },
                {
                    name: "Delete Dua",
                    request: {
                        method: "DELETE",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/duas/1", host: ["{{baseUrl}}"], path: ["api", "duas", "1"] }
                    }
                }
            ]
        },
        {
            name: "Hadith",
            item: [
                {
                    name: "Get Editions",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/hadith/editions", host: ["{{baseUrl}}"], path: ["api", "hadith", "editions"] }
                    }
                },
                {
                    name: "Get Sections",
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
                    name: "Get Books",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/hadith/books", host: ["{{baseUrl}}"], path: ["api", "hadith", "books"] }
                    }
                },
                {
                    name: "Get Daily Hadith",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/hadith/daily", host: ["{{baseUrl}}"], path: ["api", "hadith", "daily"] }
                    }
                },
                {
                    name: "Override Daily Hadith",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ hadithId: 1 }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/hadith/daily/override", host: ["{{baseUrl}}"], path: ["api", "hadith", "daily", "override"] }
                    }
                },
                {
                    name: "Get Hadith by ID",
                    request: {
                        method: "GET",
                        url: { raw: "{{baseUrl}}/api/hadith/1", host: ["{{baseUrl}}"], path: ["api", "hadith", "1"] }
                    }
                }
            ]
        },
        {
            name: "User Info",
            item: [
                {
                    name: "Create User",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ username: "newuser", email: "new@example.com" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/user-info", host: ["{{baseUrl}}"], path: ["api", "user-info"] }
                    }
                },
                {
                    name: "Get All Users",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/user-info", host: ["{{baseUrl}}"], path: ["api", "user-info"] }
                    }
                },
                {
                    name: "Get User by ID",
                    request: {
                        method: "GET",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/user-info/1", host: ["{{baseUrl}}"], path: ["api", "user-info", "1"] }
                    }
                },
                {
                    name: "Update User",
                    request: {
                        method: "PUT",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ email: "updated@example.com" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/user-info/1", host: ["{{baseUrl}}"], path: ["api", "user-info", "1"] }
                    }
                },
                {
                    name: "Delete User",
                    request: {
                        method: "DELETE",
                        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                        url: { raw: "{{baseUrl}}/api/user-info/1", host: ["{{baseUrl}}"], path: ["api", "user-info", "1"] }
                    }
                },
                {
                    name: "Upsert User",
                    request: {
                        method: "POST",
                        header: [
                            { key: "Authorization", value: "Bearer {{token}}" },
                            { key: "Content-Type", value: "application/json" }
                        ],
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({ username: "upsertuser", email: "upsert@example.com" }, null, 2)
                        },
                        url: { raw: "{{baseUrl}}/api/user-info/upsert", host: ["{{baseUrl}}"], path: ["api", "user-info", "upsert"] }
                    }
                }
            ]
        }
    ]
};

const outputDir = path.join(__dirname, 'postman');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// try writing to a temporary name in case original is locked
const outFile = path.join(outputDir, 'MuslimDaily_API_v2.postman_collection.json');
let finalFile = outFile;
try {
    fs.writeFileSync(finalFile, JSON.stringify(collection, null, 2));
} catch (err) {
    console.warn('Failed to write to primary output, writing to temp file', err.message);
    finalFile = path.join(outputDir, `MuslimDaily_API_v2.postman_collection.${Date.now()}.json`);
    fs.writeFileSync(finalFile, JSON.stringify(collection, null, 2));
}

console.log('Postman collection generated at postman/MuslimDaily_API_v2.postman_collection.json');
