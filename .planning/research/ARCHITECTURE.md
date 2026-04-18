# Architecture Research

**Domain:** Forestry Management & Offline Fleet Ops GIS
**Researched:** 2026-04-18
**Confidence:** HIGH

## Major Components

1. **Client-Side Event Queue (PWA layer)**
   - Uses `idb` to append local "Inspection Events".
   - Attempts synchronization queue pushes to Convex when network navigator signals online status. 

2. **Convex Indexing & Mutation Engine (Backend)**
   - Stores tree records augmented with an `h3_index` (Resolution 10).
   - Validates incoming events from the client queue and updates the canonical state tree based on timestamp rules.

3. **Mapbox Clustering Pipeline (Web Layer)**
   - Issues prefix-queries to Convex for H3 indices inside the bounding box.
   - Pushes raw coordinates to `supercluster` WebWorker for frame-perfect UI clustering.

4. **Dynamic Routing Intercept (Edge)**
   - Next.js acts as the dynamic QR recipient. Intercepts endpoints like `/[ngo_slug]/scan/[tree_id]`, increments PostHog telemetry, and routes to respective auditor or citizen view based on JWT role.
