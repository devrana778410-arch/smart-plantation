# Smart Plantation QR Monitoring System

## What This Is

A production-ready SaaS application designed to track planted saplings using offline-first data ingestion, cryptographic verifiable geolocation, and dynamic QR Codes. Designed for municipal and NGO-led afforestation projects, the system combats "phantom forests" by maintaining an immutable ledger of survival tracking and serving as the foundational verification structure for Payment for Ecosystem Services (PES).

## Core Value

Cryptographically verifiable, immutable proof of tree survival linking physical ground truth (QR + GPS + Photo) straight to a digital dashboard for unquestionable audit mapping.

## Requirements

### Validated

*(None yet — ship to validate)*

### Active

- [ ] High-performance Mapbox GL JS cluster dashboard for global and localized analytics.
- [ ] Offline-first Progressive Web App (PWA) allowing field ingestion of phenotypic metrics and survival logic (Alive/Dead).
- [ ] Data-sync reconciliation via an Append-Only Event queue rather than simple destructive mutations to protect tracking immutability.
- [ ] H3 Geohash Indexing strings implemented in Convex for spatial filtering queries (replacement for ST_DWithin).
- [ ] Basecamp Long-Lived offline JWT caching strategy to guarantee field team attribution without connectivity.
- [ ] Role-Based Access Control dividing permissions among Citizens, Admins (Dept Officials), and Auditors.
- [ ] Dynamic PVC/Aluminum Tag QR URL routing logic driving browsers straight to web-hosted tree profiles.
- [ ] Dual Auditing Workspaces: System assigned stratified randomized sampling vs ad-hoc field counter-verification.
- [ ] Stripe Payment Gateway integration for NGO B2B SaaS pricing.
- [ ] Donor certificate PDF generator utilizing API inputs upon external "adoption" attributions.

### Out of Scope

- [Advanced AI/ML mobile diagnostics] — All metrics are purely manual to standardize and avoid extremely excessive token costs in massive plantation deployments.
- [Native iOS/Android App Store distribution] — Progressive Web App guarantees field distribution without store constraints.
- [Internal Consumer Donation Gateway] — The tool tracks data and generates the PDFs, but NGOs manage their adoption payment flows externally.

## Context

- **Tech Stack:** Next.js (App Router), shadcn/ui, Tailwind CSS, Convex, Mapbox GL JS, Vercel, PostHog.
- **Problem Space:** "Phantom Forests" happen globally because groups receive funding to plant but not to maintain, leading to total sapling die-off.
- **Hardware Integration:** Standard high-quality Mobile Device GPS tracks coordinates (acceptable 3-10m radius).

## Constraints

- **Compatibility:** System backend relies exclusively on Convex (needs H3 workaround for spatial due to a lack of PostGIS).
- **Compliance:** Tracking endpoints and user analytics must utilize PostHog for GDPR/DPDP cookie compliance management.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **H3 Indexing inside Convex** | Prevents DB query bottlenecking on the client entirely by clustering search locally per node on scalable prefixes. | — Pending |
| **Event-Sourced Append Queue** | Handles massive async upload blocks created from multi-day connectivity drops without write conflicts. | — Pending |

---
*Last updated: 2026-04-18 after project initialization*
