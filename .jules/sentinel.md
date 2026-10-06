## 2026-10-06 - Hardcoded JWT Secret

**Vulnerability:** A hardcoded fallback string was used as the JWT secret in `src/middleware/authMiddleware.js`.
**Learning:** Hardcoding secrets makes them visible in source code and easier for attackers to guess or find. This happened because of a dev-focused fallback instead of enforcing environment variables in production.
**Prevention:** Use a centralized configuration module (like `src/config/env.js`) that safely manages environment variables, ensures required secrets exist, and does not expose default fallback strings in production logic.
