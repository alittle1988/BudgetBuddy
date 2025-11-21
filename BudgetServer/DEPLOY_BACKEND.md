# Backend deploy checklist (personal use, multi-device)

1) Environment
- Copy `.env.example` to `.env` and fill: real `MONGODB_URI`, strong `JWT_SECRET`, set `ALLOWED_ORIGINS` to your domain(s)/dev ports, keep `DISABLE_RATE_LIMIT=false` in prod. Set `PORT` if not 4000.

2) Install dependencies
- `npm install`

3) Process manager
- `pm2 start deploy/pm2/ecosystem.config.cjs --env production` (or use the systemd unit in `deploy/systemd/budget-backend.service`, updating paths/User).

4) Reverse proxy (Nginx example)
- Use `deploy/nginx/budget.conf` as a template. Point `server_name` to your domain, proxy `/api` to `127.0.0.1:4000`. If hosting the frontend on the same box, set `root` to your built `dist/` and enable the `try_files` block. Add HTTPS with certbot.

5) Mongo
- Use Atlas or a secured local Mongo instance. Keep it private (do not expose 0.0.0.0 without a firewall). Set a DB user/password in the URI.

6) Seed (optional demo data)
- Once `MONGODB_URI` is reachable, run `node seed.js` once. Do not rerun in prod unless you intend to wipe/replace demo data.

7) Logs/monitoring (optional)
- Add request logging (e.g., morgan) and keep Node/Nginx logs accessible. Consider error monitoring if you host long-term.
