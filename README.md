# Sendify – Shipment Management Frontend

Sendify is a Vue 3 application built with Vite that applies DDD principles to manage shipments, couriers, public tracking, and delivery operations. It consumes a mock API implemented as Vercel serverless functions (or `json-server` locally).

## Tech Stack

- **Vue 3 + Vite** – frontend runtime/build tooling
- **Pinia** – state management by bounded context
- **PrimeVue** – UI component suite (custom Aura preset)
- **Vue Router** – routing per context
- **Vue I18n** – language support (English/Spanish)
- **Axios** – HTTP client
- **Vercel Functions** – fake API (`api/` directory) that reads/writes `db.json`
- **json-server** (local only) – optional development mock

## Project Structure

```
src/
  core/                # shared http client, constants, utilities
  delivery/            # delivery context (domain, application, infrastructure, presentation)
  shipping/            # shipping context; dashboard, create/detail views
  tracking/            # tracking events timeline
  pricing/             # courier pricing services
  public/              # public tracking portal
  user/                # authentication flow
  notification/, reporting/ # stubs for future expansion
  theme/               # PrimeVue preset
  i18n.js              # i18n bootstrap
api/
  _lib/db.js           # db.json loader/saver (via /tmp copy)
  shipments/*          # REST endpoints for shipments
  deliveryPersons/*    # endpoints for couriers (delivery staff)
  trackingEvents/*     # timeline events
  couriers/*           # courier catalog
  users/*              # auth mock
db.json                # mock data source (shipments, couriers, users…)
```

Each bounded context follows `domain / application / infrastructure / presentation` folders to align with DDD.

## Local Development

```bash
# install dependencies
npm install

# run mock API (http://localhost:3000)
npm run mock:server

# in another terminal: start Vite dev server (http://localhost:5173)
npm run dev
```

The frontend reads from `http://localhost:3000` automatically in development.  
Set `VITE_API_URL` if you want to point at a custom endpoint.

## Vercel Deployment

1. Ensure `api/` and `db.json` are committed. The serverless functions emulate `json-server` in production.
2. Install & login to the Vercel CLI:
   ```bash
   npm install -g vercel
   vercel login
   ```
3. Deploy (first time will prompt for settings – accept defaults: build `npm run build`, output `dist`):
   ```bash
   vercel
   # to push to production explicitly:
   vercel --prod
   ```

The frontend automatically switches API base URL to `/api` when running on Vercel, so the deployed site consumes the serverless mock endpoints.

## Environment Variables

- `VITE_API_URL` (optional): override API base path. Not required when using the default local (`http://localhost:3000`) or Vercel (`/api`) setups.

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – build production bundle
- `npm run mock:server` – run `json-server` using `db.json`
- `npm run preview` – preview production build locally

## Notes

- Languages can be switched via the floating selector (bottom-right). All UI strings reside in `src/locales/en.json` and `src/locales/es.json`.
- If you add new contexts or API routes, mirror the folder conventions to keep the DDD structure consistent.
