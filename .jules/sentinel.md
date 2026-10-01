## 2024-10-01 - Missing Authentication and IDOR on sensitive user routes
**Vulnerability:** User journals and fasting logs endpoints were missing authentication entirely, allowing unauthenticated reads/writes, and lacked authorization checks to prevent IDOR.
**Learning:** Routes intended for specific users did not explicitly include `authenticateToken` middleware and omitted authorization checks on the data owner.
**Prevention:** Always verify that routes handling user data implement `authenticateToken` and explicitly check that the authenticated user (`req.user.username`) matches the target user, or has administrative privileges.
