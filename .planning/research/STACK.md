# Stack Research

**Domain:** Forestry Management & Offline Fleet Ops GIS
**Researched:** 2026-04-18
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js (App Router) | 15.x | Web framework | Best-in-class React framework for dynamic GIS routing. |
| Convex | ~1.x | Realtime Backend & DB | Handles optimistic UI updates natively. |
| Mapbox GL JS | 3.x | WebGL Map Rendering | Only map system capable of pushing 100k+ polygons/points to GPU. |
| Tailwind + shadcn/ui | latest | UI Layer | Accessible, modular design system with zero bloat. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| h3-js | 4.x | Hexagonal Grid Indexing | Critical. Used for Convex DB string-prefix querying since PostGIS is absent. |
| supercluster | 8.x | Client-side clustering | Needed to aggregate dense H3 point clusters on zooming. |
| idb (IndexedDB) | 8.x | Local storage | Queueing inspection events fully offline. |
| PostHog | latest | Analytics & Consent | DPDP/GDPR-compliant telemetry out-of-the-box. |
| Stripe | latest | Payments | NGO SaaS routing and verification-based conditional payments. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Postgres with PostGIS | Requires heavy DevOps, breaks the realtime client sync assumption built on Convex. | Convex + H3 String Prefixing |
| Leaflet.js | Cannot handle >10,000 DOM elements without fatal FPS drops. | Mapbox GL JS (WebGL GPU rendering) |
| Standard destructive DB mutations | Offline field workers will overwrite each other's scans in low-service areas. | Event-Sourced Append Queue (Mutations) |
