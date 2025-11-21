/* middleware/rateLimit.js
   Lightweight in-memory rate limiter to reduce abuse in dev/demo.
   Not production-hardened (single-process memory store).
*/
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000); // 1 minute
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX || 3000); // higher default for dev

const hits = new Map(); // key -> { count, expiresAt }

function rateLimit(req, res, next) {
  if (process.env.DISABLE_RATE_LIMIT === 'true') return next();

  const now = Date.now();
  const key = req.ip;
  const entry = hits.get(key) || { count: 0, expiresAt: now + WINDOW_MS };

  if (entry.expiresAt < now) {
    entry.count = 0;
    entry.expiresAt = now + WINDOW_MS;
  }

  entry.count += 1;
  hits.set(key, entry);

  if (entry.count > MAX_REQUESTS) {
    return res
      .status(429)
      .json({
        error:
          'Too many requests. Please slow down and try again. (Set DISABLE_RATE_LIMIT=true in dev if needed.)',
      });
  }

  next();
}

module.exports = { rateLimit };
