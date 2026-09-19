import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { openApiSpec } from '../src/docs/openapiSpec.js';
import { getSwaggerHtml, getDocsHtml } from '../src/docs/docsRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyRecursive(srcDir, destDir) {
  ensureDir(destDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('🚀 Starting static docs & GitHub Pages asset build...');

// 0. Execute generate_postman.js to generate all service postman collections
try {
  console.log('📦 Generating per-service Postman collections...');
  execSync(`node "${path.join(rootDir, 'generate_postman.js')}"`, { stdio: 'inherit' });
} catch (err) {
  console.error('⚠️ Warning: Failed to execute generate_postman.js:', err.message);
}

// Ensure postman dirs are copied across static output trees
const postmanSrc = path.join(rootDir, 'postman');
if (fs.existsSync(postmanSrc)) {
  copyRecursive(postmanSrc, path.join(rootDir, 'public', 'postman'));
  copyRecursive(postmanSrc, path.join(rootDir, 'api', 'postman'));
  console.log('✅ Synchronized Postman collection JSON files to public/postman and api/postman');
}

// 1. Generate OpenAPI spec JSON files (/api/openapi.json and /swagger.json)
ensureDir(path.join(rootDir, 'api'));
const openApiJsonContent = JSON.stringify(openApiSpec, null, 2);
fs.writeFileSync(path.join(rootDir, 'api/openapi.json'), openApiJsonContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'swagger.json'), openApiJsonContent, 'utf8');
console.log('✅ Generated api/openapi.json and swagger.json');

// 2. Generate Swagger UI pages (/swagger/index.html and /swagger.html)
ensureDir(path.join(rootDir, 'swagger'));
const swaggerHtml = getSwaggerHtml();
fs.writeFileSync(path.join(rootDir, 'swagger/index.html'), swaggerHtml, 'utf8');
fs.writeFileSync(path.join(rootDir, 'swagger.html'), swaggerHtml, 'utf8');
console.log('✅ Generated swagger/index.html and swagger.html');

// 3. Generate Developer Docs pages (/docs/index.html and /docs.html)
ensureDir(path.join(rootDir, 'docs'));
const docsHtml = getDocsHtml();
fs.writeFileSync(path.join(rootDir, 'docs/index.html'), docsHtml, 'utf8');
fs.writeFileSync(path.join(rootDir, 'docs.html'), docsHtml, 'utf8');
console.log('✅ Generated docs/index.html and docs.html');

// 4. Copy UI assets from public/ui to ui/ for direct static hosting
ensureDir(path.join(rootDir, 'ui'));
const publicUiDir = path.join(rootDir, 'public/ui');
if (fs.existsSync(publicUiDir)) {
  const uiFiles = fs.readdirSync(publicUiDir);
  for (const file of uiFiles) {
    const src = path.join(publicUiDir, file);
    const dest = path.join(rootDir, 'ui', file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
  // Also create ui.html
  if (fs.existsSync(path.join(publicUiDir, 'index.html'))) {
    fs.copyFileSync(path.join(publicUiDir, 'index.html'), path.join(rootDir, 'ui.html'));
  }
  console.log('✅ Synchronized public/ui to ui/ and ui.html');
}

// Load Postman Index Manifest for dynamic rendering
let postmanServices = [
  { id: 'auth', name: 'Auth & User Management', fileName: 'auth.postman_collection.json', description: 'Authentication, User Profiles, Settings, Bookmarks, and Favorites.' },
  { id: 'quran', name: 'Quran, Tafsir & Audio', fileName: 'quran.postman_collection.json', description: 'Holy Quran, Amharic & English Translations, Classical Tafsirs, and Verse Recitation Audio.' },
  { id: 'prayers', name: 'Prayer Times & Tracking', fileName: 'prayers.postman_collection.json', description: 'Astronomical Prayer Calculations, Habit Tracking, Fasting Logs, and Analytics.' },
  { id: 'asmaul_husna', name: 'Asmaul Husna (99 Names)', fileName: 'asmaul_husna.postman_collection.json', description: 'The 99 Beautiful Names of Allah with Trilingual Translations & Quranic Citations.' },
  { id: 'qamus', name: 'Fusha Qamus & Translation', fileName: 'qamus.postman_collection.json', description: 'Certified Fusha Quranic Dictionary, Root Morphologies, and Language Detection.' },
  { id: 'hadith', name: 'Hadith Collections', fileName: 'hadith.postman_collection.json', description: 'Canonical Hadith Books, Narrations, Sections, and Daily Hadith Schedule.' },
  { id: 'duas', name: 'Authentic Duas & Azkar', fileName: 'duas.postman_collection.json', description: 'Supplications, Morning/Evening Azkar, Categories, and Daily Dua.' },
  { id: 'calendar', name: 'Multi-Calendar System', fileName: 'calendar.postman_collection.json', description: 'Gregorian, Islamic Hijri, and Ethiopian Calendar Conversions & Holidays.' },
  { id: 'reflections', name: 'Spiritual Journal & Social', fileName: 'reflections.postman_collection.json', description: 'Spiritual Reflections Journaling, Community Challenges, and Social Groups.' },
  { id: 'resources', name: 'Quotes, Search & Admin', fileName: 'resources.postman_collection.json', description: 'Wisdom Quotes, Global Multi-Entity Search, System Diagnostics, and Admin Tools.' }
];

try {
  const indexJsonPath = path.join(rootDir, 'postman', 'index.json');
  if (fs.existsSync(indexJsonPath)) {
    const manifest = JSON.parse(fs.readFileSync(indexJsonPath, 'utf8'));
    if (manifest && manifest.services) {
      postmanServices = manifest.services;
    }
  }
} catch (e) {
  console.log('Using fallback Postman service definitions');
}

// 5. Generate Root Portal Landing index.html
const rootPortalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Muslim Daily API — Developer Portal & Service Hub</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --primary: #059669;
      --primary-dark: #047857;
      --primary-light: #ecfdf5;
      --accent: #2563eb;
      --text: #0f172a;
      --text-muted: #64748b;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    header {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--primary-dark);
      text-decoration: none;
    }
    .brand .badge {
      font-size: 0.75rem;
      background: var(--primary-light);
      color: var(--primary);
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      border: 1px solid rgba(5, 150, 105, 0.2);
    }
    .header-nav {
      display: flex;
      gap: 1.25rem;
      align-items: center;
    }
    .header-nav a {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: color 0.15s;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .header-nav a:hover {
      color: var(--primary);
    }
    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }
    .hero {
      text-align: center;
      margin-bottom: 3rem;
    }
    .hero h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.025em;
      margin-bottom: 0.75rem;
    }
    .hero p {
      font-size: 1.15rem;
      color: var(--text-muted);
      max-width: 760px;
      margin: 0 auto 1.5rem;
    }
    .portal-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3.5rem;
    }
    .portal-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: var(--shadow);
      transition: all 0.2s ease-in-out;
      text-decoration: none;
      color: inherit;
    }
    .portal-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.08);
      border-color: rgba(5, 150, 105, 0.4);
    }
    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .card-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-desc {
      color: var(--text-muted);
      font-size: 0.92rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .card-btn {
      margin-top: auto;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    /* Postman Section Styles */
    .section-header {
      border-bottom: 2px solid var(--border);
      padding-bottom: 0.75rem;
      margin-bottom: 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .section-title-group h2 {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .section-title-group p {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }

    .master-postman-banner {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: #ffffff;
      border-radius: 1rem;
      padding: 1.75rem 2rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.25);
    }
    .master-banner-text h3 {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .master-banner-text p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
      max-width: 650px;
    }
    .btn-download-master {
      background: #ffffff;
      color: #047857;
      padding: 0.8rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }
    .btn-download-master:hover {
      background: #f0fdf4;
      transform: translateY(-2px);
    }

    .postman-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
      margin-bottom: 3.5rem;
    }
    .postman-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 0.85rem;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.15s ease;
    }
    .postman-card:hover {
      border-color: rgba(37, 99, 235, 0.4);
      box-shadow: var(--shadow);
    }
    .postman-card-title {
      font-weight: 700;
      font-size: 1.05rem;
      margin-bottom: 0.4rem;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .postman-card-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
      line-height: 1.45;
    }
    .btn-download-service {
      background: #f1f5f9;
      color: #334155;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      border: 1px solid #cbd5e1;
      transition: all 0.15s;
    }
    .btn-download-service:hover {
      background: #e2e8f0;
      color: #0f172a;
      border-color: #94a3b8;
    }

    .info-section {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: var(--shadow);
    }
    .info-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .features-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    .features-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.95rem;
      color: var(--text-muted);
    }
    .features-list i {
      color: var(--primary);
      margin-top: 0.2rem;
    }
    footer {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
      font-size: 0.9rem;
      border-top: 1px solid var(--border);
      background: #ffffff;
      margin-top: 4rem;
    }
  </style>
</head>
<body>
  <header>
    <a href="./" class="brand">
      <span>🌙 Muslim Daily API</span>
      <span class="badge">v2.0.0</span>
    </a>
    <nav class="header-nav">
      <a href="ui/">📱 UI Tester</a>
      <a href="docs/">📖 Developer Docs</a>
      <a href="swagger/">⚡ Swagger UI</a>
      <a href="#postman-collections">📦 Postman</a>
      <a href="api/openapi.json" target="_blank">📄 OpenAPI Spec</a>
    </nav>
  </header>

  <main>
    <div class="hero">
      <h1>Muslim Daily REST API & Developer Hub</h1>
      <p>Explore comprehensive Islamic digital services including Quranic audio & translations, astronomical prayer calculations, authenticated Hadith, and Cloud Firestore integration.</p>
    </div>

    <div class="portal-grid">
      <!-- Card 1: Interactive UI -->
      <a href="ui/" class="portal-card" id="card-ui">
        <div>
          <div class="card-icon" style="background: #ecfdf5; color: #059669;">
            <i class="fa-solid fa-mobile-screen"></i>
          </div>
          <div class="card-title">
            Interactive UI Tester
            <i class="fa-solid fa-arrow-right" style="font-size: 0.9rem; color: #94a3b8;"></i>
          </div>
          <div class="card-desc">Modern iOS-inspired testing playground with 1-click test benches, live JSON inspector, parameter configuration, and Firestore auth.</div>
        </div>
        <div class="card-btn">Open Playground &rarr;</div>
      </a>

      <!-- Card 2: Developer Docs -->
      <a href="docs/" class="portal-card" id="card-docs">
        <div>
          <div class="card-icon" style="background: #eff6ff; color: #2563eb;">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <div class="card-title">
            Developer Docs
            <i class="fa-solid fa-arrow-right" style="font-size: 0.9rem; color: #94a3b8;"></i>
          </div>
          <div class="card-desc">Detailed REST API reference with endpoint descriptions, request parameters, response schemas, and interactive test runners.</div>
        </div>
        <div class="card-btn">Read Documentation &rarr;</div>
      </a>

      <!-- Card 3: Swagger UI -->
      <a href="swagger/" class="portal-card" id="card-swagger">
        <div>
          <div class="card-icon" style="background: #fef3c7; color: #d97706;">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <div class="card-title">
            Swagger Explorer
            <i class="fa-solid fa-arrow-right" style="font-size: 0.9rem; color: #94a3b8;"></i>
          </div>
          <div class="card-desc">Standard OpenAPI 3.0 interactive Swagger UI with live schema visualizer, model breakdown, and direct execution console.</div>
        </div>
        <div class="card-btn">Launch Swagger UI &rarr;</div>
      </a>

      <!-- Card 4: OpenAPI Spec -->
      <a href="api/openapi.json" target="_blank" class="portal-card" id="card-openapi">
        <div>
          <div class="card-icon" style="background: #f3e8ff; color: #7c3aed;">
            <i class="fa-solid fa-file-code"></i>
          </div>
          <div class="card-title">
            OpenAPI Spec
            <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.85rem; color: #94a3b8;"></i>
          </div>
          <div class="card-desc">Machine-readable OpenAPI 3.0 specification in raw JSON format for Postman, Insomnia, code generation, or CI/CD pipelines.</div>
        </div>
        <div class="card-btn">Download JSON &rarr;</div>
      </a>
    </div>

    <!-- Postman Collections Section -->
    <div id="postman-collections" style="scroll-margin-top: 100px;">
      <div class="section-header">
        <div class="section-title-group">
          <h2><i class="fa-solid fa-box-archive" style="color: #059669;"></i> Downloadable Postman Collections</h2>
          <p>Import ready-to-test API collections directly into Postman, Insomnia, or Bruno for instant execution.</p>
        </div>
      </div>

      <!-- Master Collection Download Banner -->
      <div class="master-postman-banner">
        <div class="master-banner-text">
          <h3><i class="fa-solid fa-layer-group"></i> Full Master Postman Collection (v2.0)</h3>
          <p>Contains complete test suites and request bodies for all 10 digital Islamic service modules in a single file.</p>
        </div>
        <a href="postman/MuslimDaily_API_v2.postman_collection.json" download="MuslimDaily_API_v2.postman_collection.json" class="btn-download-master">
          <i class="fa-solid fa-download"></i> Download Master Collection (.json)
        </a>
      </div>

      <!-- Individual Service Postman Collections Grid -->
      <div class="postman-grid">
        ${postmanServices.map(s => `
        <div class="postman-card">
          <div>
            <div class="postman-card-title">
              <i class="fa-solid fa-folder-open" style="color: #2563eb;"></i>
              ${s.name}
            </div>
            <div class="postman-card-desc">${s.description}</div>
          </div>
          <a href="postman/${s.fileName}" download="${s.fileName}" class="btn-download-service">
            <i class="fa-solid fa-file-arrow-down"></i> Download ${s.fileName}
          </a>
        </div>
        `).join('')}
      </div>
    </div>

    <div class="info-section">
      <div class="info-title">
        <i class="fa-solid fa-cubes" style="color: var(--primary);"></i>
        Supported Digital Islamic Services
      </div>
      <ul class="features-list">
        <li><i class="fa-solid fa-check"></i> <div><strong>Asmaul Husna (99 Names):</strong> Complete 99 Names of Allah with Arabic, Amharic, English, theological descriptions & references</div></li>
        <li><i class="fa-solid fa-check"></i> <div><strong>Quran & Tafsir:</strong> 114 Surahs, Random Ayahs (7 default), Uthmani scripts, Tafsirs & English/Amharic translations</div></li>
        <li><i class="fa-solid fa-check"></i> <div><strong>Quranic Lexicon (Qamus):</strong> 2,092 certified entries, 1,091 roots, morphology & Ayah transclusion</div></li>
        <li><i class="fa-solid fa-check"></i> <div><strong>Prayer Calculations:</strong> Astronomical timings with 7 international methods (MWL, ISNA, etc.)</div></li>
        <li><i class="fa-solid fa-check"></i> <div><strong>Hadith Collections:</strong> Canonical books (Bukhari, Muslim, Abu Dawood) & daily wisdom</div></li>
        <li><i class="fa-solid fa-check"></i> <div><strong>Calendar Conversion:</strong> Gregorian &harr; Islamic Hijri &harr; Ethiopian systems</div></li>
        <li><i class="fa-solid fa-check"></i> <div><strong>Cloud Firestore:</strong> Persistent prayer logs, spiritual journal & habit sync</div></li>
        <li><i class="fa-solid fa-check"></i> <div><strong>PWA & Mobile UI:</strong> Fast, installable testing client with offline service worker</div></li>
      </ul>
    </div>
  </main>

  <footer>
    &copy; 2026 Muslim Daily Engineering. Built with Node.js, Express, TypeScript & Cloud Firestore.
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(rootDir, 'index.html'), rootPortalHtml, 'utf8');
console.log('✅ Generated root index.html portal landing');

// 6. Generate 404.html with GitHub Pages SPA redirect router and API route fallback
const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Redirect & 404 Router — Muslim Daily</title>
  <script>
    (function() {
      var path = window.location.pathname;
      var search = window.location.search;
      var hash = window.location.hash;
      var cloudRunHost = 'https://ais-dev-25nufs2dp3vj2xehirwibv-201444007982.europe-west2.run.app';
      
      // If client attempts to hit an API endpoint directly on GitHub Pages static host, redirect to Cloud Run
      if (path.startsWith('/api/') || path.startsWith('/asmaul-husna') || path.startsWith('/qamus') || path.startsWith('/dictionary') || path.startsWith('/translation')) {
        var cloudRunUrl = cloudRunHost + path + search + hash;
        window.location.replace(cloudRunUrl);
        return;
      }
      
      if (path.endsWith('/docs') || path === '/docs') {
        window.location.replace('/docs/');
        return;
      }
      if (path.endsWith('/swagger') || path === '/swagger') {
        window.location.replace('/swagger/');
        return;
      }
      if (path.endsWith('/ui') || path === '/ui') {
        window.location.replace('/ui/');
        return;
      }
      
      if (path !== '/' && !path.endsWith('/index.html')) {
        if (path.includes('/docs')) {
          window.location.replace('/docs/');
          return;
        }
        if (path.includes('/swagger')) {
          window.location.replace('/swagger/');
          return;
        }
        if (path.includes('/ui')) {
          window.location.replace('/ui/');
          return;
        }
      }
    })();
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 60px 20px; background: #0f172a; color: #f8fafc; }
    .card { max-width: 550px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    h1 { font-size: 24px; margin-bottom: 12px; color: #38bdf8; }
    p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
    .btn { display: inline-block; margin-top: 16px; padding: 10px 20px; background: #059669; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: bold; }
    .btn:hover { background: #047857; }
    code { background: #0f172a; padding: 3px 8px; border-radius: 6px; color: #34d399; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 Redirecting to Live API Server...</h1>
    <p>GitHub Pages hosts static documentation and testing workbenches. Dynamic backend API requests are served live on our Cloud Run production instance.</p>
    <p>Target Cloud Run Server:<br><code>https://ais-dev-25nufs2dp3vj2xehirwibv-201444007982.europe-west2.run.app</code></p>
    <p><a href="/" class="btn">&larr; Return to API Hub Portal</a></p>
    <p style="margin-top: 20px; font-size: 13px; color: #64748b;">
      Quick Links: <a href="/ui/" style="color: #38bdf8;">Interactive UI</a> | <a href="/docs/" style="color: #38bdf8;">Developer Docs</a> | <a href="/swagger/" style="color: #38bdf8;">Swagger UI</a>
    </p>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(rootDir, '404.html'), notFoundHtml, 'utf8');
console.log('✅ Generated 404.html for GitHub Pages SPA routing');

console.log('🎉 Static build complete!');
