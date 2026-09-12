import fs from 'fs';
import path from 'path';
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

console.log('🚀 Starting static docs & GitHub Pages asset build...');

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

// 5. Generate Root Portal Landing index.html
const rootPortalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Muslim Daily API — Developer Portal & Explorer</title>
  <meta name="description" content="Production-grade RESTful API server for Muslim Daily providing prayer times, Quran, Hadith, Duas, and multi-system calendar conversions.">
  <meta name="theme-color" content="#059669">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --primary: #059669;
      --primary-hover: #047857;
      --primary-light: #ecfdf5;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }
    header {
      background: #0f172a;
      color: #fff;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #fff;
      font-weight: 700;
      font-size: 1.1rem;
      white-space: nowrap;
    }
    .badge {
      background: #10b981;
      color: #064e3b;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .header-nav {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .header-nav a {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: 6px;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .header-nav a:hover {
      color: #fff;
      background: rgba(255,255,255,0.1);
    }
    @media (max-width: 600px) {
      header {
        padding: 10px 12px;
      }
      .brand {
        font-size: 0.95rem;
      }
      .header-nav a {
        font-size: 0.78rem;
        padding: 4px 8px;
      }
    }
    main {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .hero {
      text-align: center;
      margin-bottom: 40px;
    }
    .hero h1 {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 12px;
      letter-spacing: -0.025em;
    }
    .hero p {
      font-size: 1.1rem;
      color: var(--text-muted);
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.6;
    }
    .portal-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .portal-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .portal-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08);
      border-color: #cbd5e1;
    }
    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      margin-bottom: 16px;
    }
    .card-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-desc {
      font-size: 0.92rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .card-btn {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .portal-card:hover .card-btn {
      color: var(--primary-hover);
    }
    .info-section {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px;
    }
    .info-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .features-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      list-style: none;
    }
    .features-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.92rem;
      color: var(--text-muted);
      line-height: 1.4;
    }
    .features-list li i {
      color: var(--primary);
      margin-top: 3px;
    }
    footer {
      text-align: center;
      padding: 24px;
      border-top: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 0.85rem;
      background: #fff;
    }
  </style>
</head>
<body>
  <header>
    <a href="/" class="brand">
      <span>🌙 Muslim Daily API</span>
      <span class="badge">v2.0.0</span>
    </a>
    <nav class="header-nav">
      <a href="ui/">📱 UI Tester</a>
      <a href="docs/">📖 Developer Docs</a>
      <a href="swagger/">⚡ Swagger UI</a>
      <a href="api/openapi.json" target="_blank">📄 OpenAPI JSON</a>
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

    <div class="info-section">
      <div class="info-title">
        <i class="fa-solid fa-cubes" style="color: var(--primary);"></i>
        Supported Digital Islamic Services
      </div>
      <ul class="features-list">
        <li><i class="fa-solid fa-check"></i> <div><strong>Quran & Tafsir:</strong> 114 Surahs, Ayah search, Uthmani scripts & English translations</div></li>
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

// 6. Generate 404.html with GitHub Pages SPA redirect router
const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Redirecting — Muslim Daily</title>
  <script>
    // GitHub Pages SPA Routing / Subpath Handler
    (function() {
      var path = window.location.pathname;
      var repoBase = '';
      
      // Handle project repos like /repo-name/docs
      var segments = path.split('/').filter(Boolean);
      var first = segments[0] || '';
      var target = path;

      // Clean normal routes: /docs, /swagger, /ui, /api/openapi.json
      if (path.endsWith('/docs') || path === '/docs') {
        window.location.replace((repoBase || '') + '/docs/');
        return;
      }
      if (path.endsWith('/swagger') || path === '/swagger' || path.endsWith('/swager')) {
        window.location.replace((repoBase || '') + '/swagger/');
        return;
      }
      if (path.endsWith('/ui') || path === '/ui') {
        window.location.replace((repoBase || '') + '/ui/');
        return;
      }
      
      // Fallback redirect to home if route not found
      if (path !== '/' && !path.endsWith('/index.html')) {
        // Attempt redirecting to the nearest directory or root
        if (segments.includes('docs')) {
          window.location.replace('/docs/');
          return;
        }
        if (segments.includes('swagger') || segments.includes('swager')) {
          window.location.replace('/swagger/');
          return;
        }
        if (segments.includes('ui')) {
          window.location.replace('/ui/');
          return;
        }
      }
    })();
  </script>
  <meta http-equiv="refresh" content="3; url=/">
  <style>
    body { font-family: sans-serif; text-align: center; padding: 50px; background: #f8fafc; color: #0f172a; }
    h1 { font-size: 24px; margin-bottom: 12px; }
    p { color: #64748b; font-size: 16px; }
    a { color: #059669; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Page Not Found (404)</h1>
  <p>The requested page was not found on this static host.</p>
  <p><a href="/">Return to Muslim Daily API Hub &rarr;</a></p>
  <p style="margin-top: 20px; font-size: 14px;">
    Quick links: <a href="/ui/">Interactive UI</a> | <a href="/docs/">Developer Docs</a> | <a href="/swagger/">Swagger UI</a>
  </p>
</body>
</html>`;

fs.writeFileSync(path.join(rootDir, '404.html'), notFoundHtml, 'utf8');
console.log('✅ Generated 404.html for GitHub Pages SPA routing');

console.log('🎉 Static build complete!');
