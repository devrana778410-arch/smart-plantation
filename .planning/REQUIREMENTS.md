# Requirements

## Scope
The goal is to provide NGO afforestation efforts with an immutable, cryptographically secure digital ledger connecting real-world actions (sapling phenotypes + live survival data) to verifiable visual and location coordinates without complex or bloat-heavy tools holding it back.

## Roles
- **Citizen / Donor:** General internet visitors who scan a physical tag and want to see either a micro-profile of the tree they "adopted" or the macro dashboard of the localized area. Requires a generated PDF footprint.
- **Auditor:** External or internal staff assigned randomly distributed zones to investigate "phantom forest" potential. Must be able to operate entirely offline natively via the browser PWA without logging out on connection drops.
- **Department Official / NGO Admin:** Oversees Stripe SaaS billing, manages internal teams, views localized statistics, and manually exports verifiable PES metrics logs to receive external funding. 
- **Field Ingestor:** Initial offline deployer tracking initial sapling traits. Usually similar UI logic as Auditor, but with the baseline "append" access.

## Core Features
1. **Convex Sub-Systems:** Real-time data synchronization utilizing Hexagonal Grid (H3) text index structures for scalable filtering queries locally at the closest DB edge node.
2. **LocalFirst Append-Only Synchronization:** Field workers do not query the database synchronously to update; they write events to their browser's Indexed DB which are later pushed upstream and interpreted into canon.
3. **Mapbox UI Load Balancing:** Handing raw coordinate structures off the main JavaScript thread via Web Workers into `supercluster`, ensuring 100,000+ entities slide around frame-perfectly.
4. **Non-AI Constriction Layer:** Forcing manual physical parameters forces consistency and eliminates expensive/erroneous LLM interpretation from low-resolution bandwidth-starved photos.
5. **GDPR/DPDP:** Utilizing standardized PostHog boundaries. Stripe payment for SaaS sub-billing.
