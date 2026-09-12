import { Router } from 'express';
import { openApiSpec } from './openapiSpec.js';

const router = Router();

// 1. Raw OpenAPI 3.0 / Swagger JSON specifications
router.get(['/api/openapi.json', '/swagger.json'], (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(openApiSpec);
});

// 2. Swagger UI interactive explorer (/swagger and /swager)
const renderSwaggerHtml = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Muslim Daily API — Interactive Swagger UI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    :root {
      --primary: #047857;
      --bg: #f8fafc;
    }
    body {
      margin: 0;
      padding: 0;
      background: #fafbfc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .top-nav {
      background: #0f172a;
      color: #fff;
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .top-nav .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #fff;
      font-weight: 600;
      font-size: 1.1rem;
    }
    .top-nav .badge {
      background: #10b981;
      color: #064e3b;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .nav-links a {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.9rem;
      padding: 6px 14px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .nav-links a:hover {
      color: #fff;
      background: rgba(255,255,255,0.1);
    }
    .nav-links a.active {
      background: #10b981;
      color: #064e3b;
      font-weight: 600;
    }
    #swagger-ui {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }
    .swagger-ui .topbar {
      display: none !important;
    }
    .swagger-ui .info {
      margin: 20px 0 30px 0;
    }
  </style>
</head>
<body>
  <header class="top-nav">
    <a href="/docs" class="brand">
      <span>🌙 Muslim Daily API</span>
      <span class="badge">OpenAPI 3.0</span>
    </a>
    <nav class="nav-links">
      <a href="/docs">📖 Developer Docs</a>
      <a href="/swagger" class="active">⚡ Swagger Playground</a>
      <a href="/api/openapi.json" target="_blank">📄 OpenAPI Spec</a>
      <a href="/health" target="_blank">🩺 Health</a>
    </nav>
  </header>

  <div id="swagger-ui"></div>

  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1,
        docExpansion: "list",
        filter: true,
        showRequestHeaders: true
      });
    };
  </script>
</body>
</html>`);
};

router.get(['/swagger', '/swager', '/swagger/', '/swager/'], renderSwaggerHtml);

// 3. Developer Documentation Page (/docs and /docs/)
router.get(['/docs', '/docs/'], (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Muslim Daily Developer Documentation & API Guide</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Comprehensive developer documentation and REST API reference for Muslim Daily services.">
  <style>
    :root {
      --bg-page: #f8fafc;
      --bg-surface: #ffffff;
      --border-color: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-subtle: #94a3b8;
      --emerald-600: #059669;
      --emerald-50: #ecfdf5;
      --emerald-700: #047857;
      --indigo-600: #4f46e5;
      --code-bg: #0f172a;
      --code-text: #e2e8f0;
      --accent: #10b981;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg-page);
      color: var(--text-main);
      line-height: 1.6;
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
    }

    /* Top Navigation */
    .header-bar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 28px;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-icon {
      font-size: 1.5rem;
    }

    .brand-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }

    .brand-version {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 8px;
      background: var(--emerald-50);
      color: var(--emerald-700);
      border-radius: 9999px;
      border: 1px solid rgba(5, 150, 105, 0.2);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .btn-primary {
      background: var(--emerald-600);
      color: #fff;
    }
    .btn-primary:hover {
      background: var(--emerald-700);
    }

    .btn-outline {
      background: #fff;
      color: var(--text-main);
      border-color: var(--border-color);
    }
    .btn-outline:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    /* Layout */
    .docs-container {
      display: flex;
      max-width: 1440px;
      margin: 0 auto;
      min-height: calc(100vh - 61px);
    }

    /* Sidebar Navigation */
    .sidebar {
      width: 290px;
      flex-shrink: 0;
      position: sticky;
      top: 61px;
      height: calc(100vh - 61px);
      overflow-y: auto;
      padding: 24px 16px 40px 24px;
      border-right: 1px solid var(--border-color);
      background: #fcfdfd;
    }

    .search-box {
      width: 100%;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      font-size: 0.88rem;
      margin-bottom: 20px;
      background: #fff;
    }

    .nav-section-title {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin: 18px 0 8px 10px;
    }

    .nav-menu {
      list-style: none;
    }

    .nav-item a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-radius: 6px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: all 0.15s;
    }

    .nav-item a:hover {
      color: var(--text-main);
      background: #f1f5f9;
    }

    .nav-item a.active {
      color: var(--emerald-700);
      background: var(--emerald-50);
      font-weight: 600;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      padding: 40px 48px 80px 48px;
      max-width: 1080px;
      overflow-x: hidden;
    }

    .hero-panel {
      background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
      color: #fff;
      border-radius: 16px;
      padding: 32px 36px;
      margin-bottom: 40px;
      box-shadow: 0 10px 25px -5px rgba(6, 78, 59, 0.25);
    }

    .hero-panel h1 {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    .hero-panel p {
      font-size: 1.05rem;
      color: #d1fae5;
      max-width: 720px;
      margin-bottom: 20px;
    }

    .hero-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .hero-pill {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #fff;
    }

    .section-title {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text-main);
      margin: 48px 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-lead {
      color: var(--text-muted);
      font-size: 1rem;
      margin-bottom: 24px;
    }

    /* Cards */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 18px;
      margin: 20px 0 32px 0;
    }

    .feature-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .feature-card h3 {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 6px;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .feature-card p {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Method Badges */
    .method-badge {
      display: inline-block;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .method-get { background: #dcfce7; color: #15803d; }
    .method-post { background: #e0e7ff; color: #4338ca; }
    .method-put { background: #fef3c7; color: #b45309; }
    .method-delete { background: #fee2e2; color: #b91c1c; }

    /* Endpoint Blocks */
    .endpoint-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      margin-bottom: 20px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.02);
    }

    .endpoint-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      background: #fafbfc;
      border-bottom: 1px solid var(--border-color);
      flex-wrap: wrap;
      gap: 12px;
    }

    .endpoint-path {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .endpoint-url {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 600;
      font-size: 0.92rem;
      color: var(--text-main);
    }

    .endpoint-summary {
      font-size: 0.88rem;
      color: var(--text-muted);
    }

    .endpoint-body {
      padding: 20px;
    }

    .endpoint-desc {
      font-size: 0.92rem;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    /* Code Blocks */
    .code-box {
      background: var(--code-bg);
      color: var(--code-text);
      border-radius: 10px;
      padding: 16px 20px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.84rem;
      overflow-x: auto;
      line-height: 1.5;
      position: relative;
      margin: 12px 0 18px 0;
    }

    .copy-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.15);
      color: #e2e8f0;
      border: none;
      padding: 4px 10px;
      font-size: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
    .copy-btn:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    /* Interactive Request Runner */
    .runner-box {
      background: #f1f5f9;
      border-radius: 10px;
      padding: 16px 20px;
      margin-top: 14px;
      border: 1px solid #cbd5e1;
    }

    .runner-bar {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .runner-input {
      flex: 1;
      min-width: 240px;
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-family: monospace;
      font-size: 0.85rem;
      background: #fff;
    }

    .runner-btn {
      padding: 8px 18px;
      background: var(--emerald-600);
      color: #fff;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .runner-btn:hover { background: var(--emerald-700); }

    .runner-response {
      margin-top: 12px;
      background: #0f172a;
      color: #38bdf8;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.8rem;
      max-height: 240px;
      overflow-y: auto;
      display: none;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Table styles */
    .param-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 0.88rem;
    }

    .param-table th, .param-table td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border-color);
      text-align: left;
    }

    .param-table th {
      background: #f8fafc;
      font-weight: 600;
      color: var(--text-muted);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .param-name {
      font-family: monospace;
      font-weight: 600;
      color: #0f172a;
    }

    .param-type {
      font-family: monospace;
      font-size: 0.8rem;
      color: var(--emerald-700);
    }

    /* Responsive */
    @media (max-width: 900px) {
      .docs-container { flex-direction: column; }
      .sidebar { width: 100%; height: auto; position: static; border-right: none; border-bottom: 1px solid var(--border-color); }
      .main-content { padding: 24px 16px; }
    }
  </style>
</head>
<body>

  <!-- Top Bar -->
  <header class="header-bar">
    <div class="brand-group">
      <span class="brand-icon">🌙</span>
      <span class="brand-title">Muslim Daily API</span>
      <span class="brand-version">v2.0 Developer Edition</span>
    </div>
    <div class="header-actions">
      <a href="/swagger" class="btn btn-primary" id="top-swagger-btn">⚡ Interactive Swagger UI</a>
      <a href="/api/openapi.json" target="_blank" class="btn btn-outline">📄 OpenAPI JSON</a>
      <a href="/health" target="_blank" class="btn btn-outline">🩺 Health Check</a>
    </div>
  </header>

  <div class="docs-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <input type="text" id="sidebar-search" class="search-box" placeholder="🔍 Search endpoints & topics..." onkeyup="filterDocs()">
      
      <div class="nav-section-title">Overview</div>
      <ul class="nav-menu">
        <li class="nav-item"><a href="#intro" class="active">👋 Introduction</a></li>
        <li class="nav-item"><a href="#architecture">🏛️ Architecture & DBs</a></li>
        <li class="nav-item"><a href="#auth">🔐 Authentication & JWT</a></li>
        <li class="nav-item"><a href="#quickstart">⚡ Quickstart Guide</a></li>
      </ul>

      <div class="nav-section-title">Core Services</div>
      <ul class="nav-menu">
        <li class="nav-item"><a href="#quran">📖 Quran & Audio</a></li>
        <li class="nav-item"><a href="#prayers">🕌 Prayer Times & Tracking</a></li>
        <li class="nav-item"><a href="#hadith">📜 Hadith Collections</a></li>
        <li class="nav-item"><a href="#duas">🤲 Duas & Azkar</a></li>
        <li class="nav-item"><a href="#calendar">📅 Multi-Calendar (Hijri/Gregorian)</a></li>
        <li class="nav-item"><a href="#fasting">🌙 Fasting & Journal</a></li>
        <li class="nav-item"><a href="#quotes">💬 Quotes & Wisdom</a></li>
        <li class="nav-item"><a href="#social">👥 Social & Community</a></li>
        <li class="nav-item"><a href="#analytics">📊 Analytics & Streaks</a></li>
        <li class="nav-item"><a href="#search">🔎 Global Search</a></li>
        <li class="nav-item"><a href="#admin">🛠️ Admin & Seeding</a></li>
      </ul>

      <div class="nav-section-title">API Playground</div>
      <ul class="nav-menu">
        <li class="nav-item"><a href="/swagger" style="color: var(--emerald-700); font-weight: 700;">🚀 Open Swagger UI</a></li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">

      <!-- Hero -->
      <div class="hero-panel" id="intro">
        <h1>Muslim Daily REST API</h1>
        <p>A production-ready Islamic backend service powering prayer notifications, Quran recitations, authenticated Hadith search, authentic Duas, and calendar transformations across mobile and web clients.</p>
        <div class="hero-tags">
          <span class="hero-pill">✓ Express + Node 22</span>
          <span class="hero-pill">✓ Pure WASM SQLite Engine</span>
          <span class="hero-pill">✓ 6 Isolated Domain Databases</span>
          <span class="hero-pill">✓ OpenAPI 3.0 Standard</span>
          <span class="hero-pill">✓ JWT Bearer Auth</span>
        </div>
      </div>

      <!-- Architecture -->
      <section id="architecture">
        <h2 class="section-title">🏛️ Architecture & Database Layer</h2>
        <p class="section-lead">Muslim Daily uses domain-partitioned databases powered by a persistent WebAssembly SQLite layer (<code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">sql.js</code>) ensuring fast queries without native compilation dependencies.</p>
        
        <div class="card-grid">
          <div class="feature-card">
            <h3>📖 quran.sqlite</h3>
            <p>114 Surahs, 6,236 Ayahs, Uthmani calligraphy script, multi-language translations (Sahih International, etc.), and classical Tafsirs.</p>
          </div>
          <div class="feature-card">
            <h3>🕌 prayers.sqlite</h3>
            <p>Accurate astronomical prayer calculations, geographic coordinates caching, and multiple global calculation methods (MWL, ISNA, Umm Al-Qura, Egypt).</p>
          </div>
          <div class="feature-card">
            <h3>📜 hadith.sqlite</h3>
            <p>Canonical Hadith books (Sahih al-Bukhari, Sahih Muslim, Sunan an-Nasa'i), book sections, Arabic and English narrations, and daily Hadith scheduling.</p>
          </div>
          <div class="feature-card">
            <h3>🤲 dua.sqlite</h3>
            <p>Classified Dua & Dhikr catalog (Morning, Evening, Sleep, Salah, Forgiveness) with transliteration, Arabic text, and source references.</p>
          </div>
          <div class="feature-card">
            <h3>💬 quotes.sqlite</h3>
            <p>Classical Islamic wisdom, sayings of the righteous predecessors, categorized by topics (Patience, Sincerity, Wisdom).</p>
          </div>
          <div class="feature-card">
            <h3>👤 deenbot.sqlite</h3>
            <p>User accounts, prayer logs, habit streaks, fasting logs, personal reflections, bookmarks, social study groups, and calendar tasks.</p>
          </div>
        </div>
      </section>

      <!-- Authentication -->
      <section id="auth">
        <h2 class="section-title">🔐 Authentication & Headers</h2>
        <p class="section-lead">Protected endpoints require a JSON Web Token (JWT) passed in the standard <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">Authorization</code> HTTP header.</p>

        <div class="code-box">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
Authorization: Bearer &lt;YOUR_JWT_TOKEN&gt;
Content-Type: application/json
        </div>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-post">POST</span>
              <span class="endpoint-url">/api/auth/register</span>
            </div>
            <span class="endpoint-summary">Register a new user</span>
          </div>
          <div class="endpoint-body">
            <p class="endpoint-desc">Creates a user account and hashes the password securely using bcryptjs.</p>
            <div class="code-box">
              <button class="copy-btn" onclick="copyCode(this)">Copy</button>
{
  "username": "salman_dev",
  "email": "salman@example.com",
  "password": "StrongPassword123!"
}
            </div>
          </div>
        </div>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-post">POST</span>
              <span class="endpoint-url">/api/auth/login</span>
            </div>
            <span class="endpoint-summary">Authenticate user & issue JWT</span>
          </div>
          <div class="endpoint-body">
            <p class="endpoint-desc">Validates credentials and returns a signed Bearer token along with user profile information.</p>
            <div class="code-box">
              <button class="copy-btn" onclick="copyCode(this)">Copy</button>
{
  "username": "salman_dev",
  "password": "StrongPassword123!"
}
            </div>
          </div>
        </div>
      </section>

      <!-- Quickstart -->
      <section id="quickstart">
        <h2 class="section-title">⚡ Quickstart & Code Examples</h2>
        <p class="section-lead">Integrate with Muslim Daily in your preferred language or environment.</p>

        <h3 style="margin-top: 20px;">cURL</h3>
        <div class="code-box">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
# 1. Fetch Surah Al-Fatihah
curl -s "http://localhost:3000/api/quran/surahs/1"

# 2. Get prayer times for Mecca
curl -s "http://localhost:3000/api/prayers/times?city=Mecca&country=Saudi%20Arabia"

# 3. Retrieve daily Hadith
curl -s "http://localhost:3000/api/hadith/daily"
        </div>

        <h3 style="margin-top: 20px;">JavaScript (Fetch / Node.js)</h3>
        <div class="code-box">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
const BASE_URL = 'http://localhost:3000';

async function loadTodayPrayerTimes(city, country) {
  const res = await fetch(\`\${BASE_URL}/api/prayers/times?city=\${encodeURIComponent(city)}&country=\${encodeURIComponent(country)}\`);
  const timings = await res.json();
  console.log('Prayer timings:', timings);
  return timings;
}

loadTodayPrayerTimes('Addis Ababa', 'Ethiopia');
        </div>

        <h3 style="margin-top: 20px;">Python (Requests)</h3>
        <div class="code-box">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
import requests

BASE_URL = "http://localhost:3000"

# Convert Gregorian to Hijri calendar
response = requests.post(f"{BASE_URL}/api/calendar/convert", json={
    "from": "gregorian",
    "to": "hijri",
    "date": "2026-09-12"
})
print("Hijri date:", response.json())
        </div>
      </section>

      <!-- Quran & Audio -->
      <section id="quran">
        <h2 class="section-title">📖 Quran & Audio Recitations</h2>
        <p class="section-lead">Explore Quranic texts, translations, word-by-word Ayahs, and high quality audio streaming.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/quran/surahs</span>
            </div>
            <span class="endpoint-summary">List all 114 Surahs</span>
          </div>
          <div class="endpoint-body">
            <p class="endpoint-desc">Retrieves complete list of Surahs with Arabic titles, English simple names, verse counts, and revelation classifications.</p>
            <div class="runner-box">
              <div class="runner-bar">
                <input type="text" class="runner-input" value="/api/quran/surahs" readonly>
                <button class="runner-btn" onclick="runRequest(this, '/api/quran/surahs')">Test Live Request</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/quran/surahs/{id}/ayahs</span>
            </div>
            <span class="endpoint-summary">Ayahs with Uthmani script & translations</span>
          </div>
          <div class="endpoint-body">
            <p class="endpoint-desc">Returns Ayahs for a Surah with full Uthmani Arabic script, English translation, and verse keys.</p>
            <div class="runner-box">
              <div class="runner-bar">
                <input type="text" class="runner-input" value="/api/quran/surahs/1/ayahs" readonly>
                <button class="runner-btn" onclick="runRequest(this, '/api/quran/surahs/1/ayahs')">Test Live Request</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/audio/{surahId}/{ayahId}</span>
            </div>
            <span class="endpoint-summary">Stream Ayah recitation audio</span>
          </div>
          <div class="endpoint-body">
            <p class="endpoint-desc">Streams recitation MP3 files directly to browser or mobile audio player. Default reciter: Mishari Rashid Al-Afasy.</p>
            <p>Example: <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">/api/audio/1/1</code> streams Bismillah.</p>
          </div>
        </div>
      </section>

      <!-- Prayers -->
      <section id="prayers">
        <h2 class="section-title">🕌 Prayer Times & Tracking</h2>
        <p class="section-lead">Calculate prayer timings anywhere in the world and track user daily completion habits.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/prayers/times</span>
            </div>
            <span class="endpoint-summary">Get prayer timings for city</span>
          </div>
          <div class="endpoint-body">
            <table class="param-table">
              <thead>
                <tr><th>Query Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td class="param-name">city</td><td class="param-type">string</td><td>Mecca</td><td>City name</td></tr>
                <tr><td class="param-name">country</td><td class="param-type">string</td><td>Saudi Arabia</td><td>Country name</td></tr>
                <tr><td class="param-name">date</td><td class="param-type">string (YYYY-MM-DD)</td><td>Today</td><td>Calculation date</td></tr>
                <tr><td class="param-name">method</td><td class="param-type">integer</td><td>4</td><td>Convention method ID (1-5)</td></tr>
              </tbody>
            </table>
            <div class="runner-box">
              <div class="runner-bar">
                <input type="text" class="runner-input" value="/api/prayers/times?city=Mecca&country=Saudi%20Arabia" readonly>
                <button class="runner-btn" onclick="runRequest(this, '/api/prayers/times?city=Mecca&country=Saudi%20Arabia')">Test Live Request</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Hadith -->
      <section id="hadith">
        <h2 class="section-title">📜 Hadith Collections</h2>
        <p class="section-lead">Access authentic Prophetic traditions with English translations, Arabic text, narrators, and grades.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/hadith/books</span>
            </div>
            <span class="endpoint-summary">List canonical Hadith books</span>
          </div>
          <div class="endpoint-body">
            <div class="runner-box">
              <div class="runner-bar">
                <input type="text" class="runner-input" value="/api/hadith/books" readonly>
                <button class="runner-btn" onclick="runRequest(this, '/api/hadith/books')">Test Live Request</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/hadith/daily</span>
            </div>
            <span class="endpoint-summary">Daily featured Hadith</span>
          </div>
          <div class="endpoint-body">
            <div class="runner-box">
              <div class="runner-bar">
                <input type="text" class="runner-input" value="/api/hadith/daily" readonly>
                <button class="runner-btn" onclick="runRequest(this, '/api/hadith/daily')">Test Live Request</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Duas -->
      <section id="duas">
        <h2 class="section-title">🤲 Duas & Azkar</h2>
        <p class="section-lead">Authentic supplications from Quran and Sunnah, categorized for every daily circumstance.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/duas/categories</span>
            </div>
            <span class="endpoint-summary">List Dua categories</span>
          </div>
          <div class="endpoint-body">
            <div class="runner-box">
              <div class="runner-bar">
                <input type="text" class="runner-input" value="/api/duas/categories" readonly>
                <button class="runner-btn" onclick="runRequest(this, '/api/duas/categories')">Test Live Request</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/duas/random</span>
            </div>
            <span class="endpoint-summary">Fetch random Dua</span>
          </div>
          <div class="endpoint-body">
            <div class="runner-box">
              <div class="runner-bar">
                <input type="text" class="runner-input" value="/api/duas/random" readonly>
                <button class="runner-btn" onclick="runRequest(this, '/api/duas/random')">Test Live Request</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Calendar -->
      <section id="calendar">
        <h2 class="section-title">📅 Multi-Calendar (Hijri / Gregorian / Ethiopian)</h2>
        <p class="section-lead">High precision tabular Islamic calendar algorithms and conversions between Gregorian, Hijri, and Ethiopian calendar eras.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-post">POST</span>
              <span class="endpoint-url">/api/calendar/convert</span>
            </div>
            <span class="endpoint-summary">Convert single date between calendar systems</span>
          </div>
          <div class="endpoint-body">
            <div class="code-box">
              <button class="copy-btn" onclick="copyCode(this)">Copy</button>
// Request payload
{
  "from": "gregorian",
  "to": "hijri",
  "date": "2026-09-12"
}
            </div>
            <div class="runner-box">
              <div class="runner-bar">
                <button class="runner-btn" onclick="runPostConvert(this)">Test Live Gregorian &rarr; Hijri</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Quotes -->
      <section id="quotes">
        <h2 class="section-title">💬 Quotes & Wisdom</h2>
        <p class="section-lead">Classical Arabic aphorisms and sayings with English translations.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/quotes/random</span>
            </div>
            <span class="endpoint-summary">Get random wisdom quote</span>
          </div>
          <div class="endpoint-body">
            <div class="runner-box">
              <div class="runner-bar">
                <input type="text" class="runner-input" value="/api/quotes/random" readonly>
                <button class="runner-btn" onclick="runRequest(this, '/api/quotes/random')">Test Live Request</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Fasting & Journal -->
      <section id="fasting">
        <h2 class="section-title">🌙 Fasting & Journaling</h2>
        <p class="section-lead">Track voluntary and Ramadan fasts, plus daily spiritual reflections and mood logs.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/fasting/status/{username}/{date}</span>
            </div>
            <span class="endpoint-summary">Fetch fasting status</span>
          </div>
          <div class="endpoint-body">
            <p class="endpoint-desc">Returns whether the user was fasting on the given date and the fasting type (Ramadan, voluntary, expiation).</p>
          </div>
        </div>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-post">POST</span>
              <span class="endpoint-url">/api/fasting/update</span>
            </div>
            <span class="endpoint-summary">Update fasting status</span>
          </div>
          <div class="endpoint-body">
            <div class="code-box">
              <button class="copy-btn" onclick="copyCode(this)">Copy</button>
{
  "username": "salman_dev",
  "date": "2026-09-12",
  "fasting_type": "voluntary",
  "is_fasting": 1
}
            </div>
          </div>
        </div>
      </section>

      <!-- Social & Community -->
      <section id="social">
        <h2 class="section-title">👥 Social & Community</h2>
        <p class="section-lead">Engage Muslim communities through study circles, group challenges, and healthy spiritual habit competitions.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/social/challenges</span>
            </div>
            <span class="endpoint-summary">List community challenges</span>
          </div>
          <div class="endpoint-body">
            <p class="endpoint-desc">Requires JWT Bearer authentication. Returns challenges with start dates, goals, and participant counts.</p>
          </div>
        </div>
      </section>

      <!-- Analytics -->
      <section id="analytics">
        <h2 class="section-title">📊 Analytics & Streaks</h2>
        <p class="section-lead">Monitor habit consistency, continuous streaks, and prayer performance summaries.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/analytics/streak/{username}</span>
            </div>
            <span class="endpoint-summary">Get habit streaks</span>
          </div>
          <div class="endpoint-body">
            <p class="endpoint-desc">Requires JWT authentication. Returns current active streak and longest streak in days.</p>
          </div>
        </div>
      </section>

      <!-- Global Search -->
      <section id="search">
        <h2 class="section-title">🔎 Global Search</h2>
        <p class="section-lead">Unified multi-source search across Quran ayahs, Hadith texts, Dua titles, and wisdom quotes.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/search/global</span>
            </div>
            <span class="endpoint-summary">Global keyword search</span>
          </div>
          <div class="endpoint-body">
            <div class="runner-box">
              <div class="runner-bar">
                <input type="text" class="runner-input" value="/api/search/global?q=patience" readonly>
                <button class="runner-btn" onclick="runRequest(this, '/api/search/global?q=patience')">Test Live Request</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Admin & Seeding -->
      <section id="admin">
        <h2 class="section-title">🛠️ Admin & Seeding</h2>
        <p class="section-lead">Inspect table statistics and manage initial baseline datasets.</p>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <div class="endpoint-path">
              <span class="method-badge method-get">GET</span>
              <span class="endpoint-url">/api/admin/stats</span>
            </div>
            <span class="endpoint-summary">Get database statistics</span>
          </div>
          <div class="endpoint-body">
            <div class="runner-box">
              <div class="runner-bar">
                <input type="text" class="runner-input" value="/api/admin/stats" readonly>
                <button class="runner-btn" onclick="runRequest(this, '/api/admin/stats')">Test Live Request</button>
              </div>
              <pre class="runner-response"></pre>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>

  <script>
    // Copy code snippet helper
    function copyCode(btn) {
      const parent = btn.parentElement;
      const text = parent.innerText.replace('Copy', '').trim();
      navigator.clipboard.writeText(text).then(() => {
        btn.innerText = 'Copied!';
        setTimeout(() => { btn.innerText = 'Copy'; }, 2000);
      });
    }

    // Live test request runner
    async function runRequest(btn, endpoint) {
      const runnerBox = btn.closest('.runner-box');
      const resPre = runnerBox.querySelector('.runner-response');
      resPre.style.display = 'block';
      resPre.innerText = 'Sending request to ' + endpoint + '...';
      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        resPre.innerText = JSON.stringify(data, null, 2);
      } catch (err) {
        resPre.innerText = 'Request error: ' + err.message;
      }
    }

    // Live test POST calendar convert
    async function runPostConvert(btn) {
      const runnerBox = btn.closest('.runner-box');
      const resPre = runnerBox.querySelector('.runner-response');
      resPre.style.display = 'block';
      resPre.innerText = 'Posting calendar conversion request...';
      try {
        const res = await fetch('/api/calendar/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: 'gregorian', to: 'hijri', date: '2026-09-12' })
        });
        const data = await res.json();
        resPre.innerText = JSON.stringify(data, null, 2);
      } catch (err) {
        resPre.innerText = 'Request error: ' + err.message;
      }
    }

    // Sidebar search filter
    function filterDocs() {
      const query = document.getElementById('sidebar-search').value.toLowerCase();
      const items = document.querySelectorAll('.nav-menu .nav-item');
      items.forEach(item => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
      });
    }
  </script>

</body>
</html>`);
});

export default router;
