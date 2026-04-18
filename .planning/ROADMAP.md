# Roadmap

**Project:** Smart Plantation QR Monitoring System
**Status:** Planning

## Phase 1: Foundation & Data Layer
**Goal:** Establish backend models, indexing workarounds, and base authentication structures.

- [ ] Initialize Next.js App Router and Tailwind/shadcn UI skeleton.
- [ ] Set up Convex backend and schema for `trees`, `inspection_events`, `users`, and `ngos`.
- [ ] Implement H3 grid string algorithms on backend queries for spatial bounding boxes.
- [ ] Configure PostHog for telemetry and DPDP/GDPR cookie tracking blocks.
- [ ] Set up base Stripe B2B recurring billing skeleton for NGOs.

## Phase 2: Offline-First Field PWA
**Goal:** Guarantee robust remote hardware edge-case ingestion against "phantom forests."

- [ ] Egress PWA service workers and create basecamp Long-Lived JWT caching logic for offline RBAC.
- [ ] Build offline `<input capture>` routines to securely bind GPS coordinates and timestamps to real-time mobile camera shots.
- [ ] Implement local `idb` Event Queueing logic for mutation syncing without overwrite conflicts.

## Phase 3: High-Performance GIS Dashboard
**Goal:** Render global scaling map layers utilizing GPU acceleration to prevent UI thread locks.

- [ ] Integrate Mapbox GL JS with interactive canopy filters styling.
- [ ] Move client-side `supercluster` algorithms inside Web Workers.
- [ ] Build Department Official aggregates vs granular Auditor list layouts.

## Phase 4: Dynamic QR & Automated PDFs
**Goal:** Close the feedback loop for donors traversing physical tags back into digital audits.

- [ ] Construct the dynamic frontend routes `/[ngo_slug]/scan/[tree_id]`.
- [ ] Interface Next.js with PDF generative API limits upon donor attribution webhook logic from external domains.
- [ ] Add dual Auditing workspaces (Algorithmic Stratified Random Assignment queues + Ad Hoc Verification modes).
