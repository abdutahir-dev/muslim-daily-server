## 2026-10-01 - Hardcoded JWT Secret Fallback Removed
**Vulnerability:** A hardcoded, easily guessable fallback string ('your_super_secret_key_change_this_in_production') was used as the JWT secret if the `JWT_SECRET` environment variable wasn't present.
**Learning:** Hardcoded secrets in production code present a significant risk because an attacker can easily forge JWT tokens and impersonate users if the environment configuration is missed or fails to load.
**Prevention:** Rely on centralized configuration (e.g., `appConfig.jwtSecret`) that strictly errors out in production if required environment variables are absent, preventing accidental deployment with weak defaults.
