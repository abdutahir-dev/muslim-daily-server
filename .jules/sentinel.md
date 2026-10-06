## 2026-10-06 - Overly Permissive CORS Policy
**Vulnerability:** A CORS policy allowed any origin ending with `.github.io` (`origin.endsWith('.github.io')`), which allows an attacker to host malicious scripts on their own GitHub Pages site and bypass the CORS check.
**Learning:** Checking the end of an origin string or wildcarding subdomains is a common security pitfall. CORS rules must be exact or sufficiently constrained.
**Prevention:** Always use strict equality (exact domain match) for CORS origins unless wildcarding is specifically required and strictly controlled. Include the scheme (`https://`) to match the `Origin` header correctly.
