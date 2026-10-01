## 2024-03-24 - [Hardcoded JWT Secret Fallback]
**Vulnerability:** A hardcoded default string ("your_super_secret_key_change_this_in_production") was used as a fallback for the JWT secret in `src/controllers/authController.js` and `src/middleware/authMiddleware.js`.
**Learning:** Developers sometimes use `process.env.VARIABLE || "default"` locally and accidentally leave it in code, which bypasses production missing-secret checks when deployed, allowing an attacker to generate valid JWTs.
**Prevention:** Instead of using fallback values at the consumption site, centralize configuration loading (e.g., in `src/config/env.js`) where you can enforce required values for production environments and fail fast if they are missing.
