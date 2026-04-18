# Project Research Summary

**Project:** Smart Plantation QR Monitoring System
**Domain:** Forestry Management & Offline Fleet Ops GIS
**Researched:** 2026-04-18
**Confidence:** HIGH

## Executive Summary
This tracking system acts as a cryptographic ledger linking physical afforestation constraints to digital auditability. By avoiding AI bloat and bloated PostGIS configurations, the architecture optimally utilizes Convex (with H3 Grid strings) alongside Mapbox WebGL to provide a massive-scale spatial clustering experience without compromising real-time reactivity. A central finding is that standard destructive DB mutations will catastrophically fail in remote fields; the system demands an Append-Only Event Queue pushed locally from `idb` to Convex.

## Implications for Roadmap

### Phase 1: Foundation & Data Layer
**Rationale:** Database indexing structures explicitly dictate all downstream UI fetching layers.
**Delivers:** Convex schema with event-sourcing structures, H3 string prefix rules, and Stripe SaaS backend stubs. Auth layer established. 
**Avoids:** Re-architecting data later when offline conflicts arise.

### Phase 2: Offline-First Field PWA
**Rationale:** The ingestion point is the most structurally critical path for hardware edge-cases.
**Delivers:** PWA manifest, `<input capture>` forced constraints, local IndexedDB event queues, and background sync routines.
**Avoids:** Photo upload stalling; "Phantom forest" loopholes.

### Phase 3: High-Performance GIS Dashboard
**Rationale:** Dashboard relies purely on the ingestion schema.
**Delivers:** Mapbox GL JS integrations, supercluster Web Workers, role-based visual layouts.
**Avoids:** Thread locking the browser via mass DOM rendering.

### Phase 4: Dynamic QR & Automated Pdfs
**Rationale:** Edges of the application wrapping the core components.
**Delivers:** Next.js SSR parameters mapping QR codes to citizen portal interfaces, and donor certificate generators.
