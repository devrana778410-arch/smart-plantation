# Pitfalls Research

**Domain:** Forestry Management & Offline Fleet Ops GIS
**Researched:** 2026-04-18
**Confidence:** HIGH

### 1. The Offline Overwrite Collision
- **Warning Sign:** Two auditors inspect the same tree offline and sync at different times. 
- **Prevention Strategy:** Event-sourced appending. Never update the tree row directly from the client. Insert an `inspection_event` into Convex; let the backend cron/reactor process the latest valid event to compute the canonical `is_alive` state.
- **Phase Mapping:** Phase 2 (Offline PWA Core).

### 2. Mapbox Thread Locking
- **Warning Sign:** Dashboard freezes when panning out over a 50,000+ sapling zone.
- **Prevention Strategy:** Supercluster initialization inside a Web Worker so the main UI thread continues. Pass ArrayBuffers instead of massive JSON trees.
- **Phase Mapping:** Phase 3 (GIS Dashboard).

### 3. Infinite Photo Upload Stalling in Low Bandwidth
- **Warning Sign:** PWA tries to sync 50 high-res photos at once, timing out the connection.
- **Prevention Strategy:** Resize/compress photos via HTML5 Canvas *before* indexing them to `idb`. Sync photos in sequentially batched chunks using Convex storage signed urls.
- **Phase Mapping:** Phase 2 (Offline PWA Core).

### 4. "Phantom Forest" Audit Loopholes
- **Warning Sign:** Workers spoof GPS coordinates or use stock photos.
- **Prevention Strategy:** HTML5 `navigator.geolocation` enforcement (ignoring manually input coordinates) and forcing live camera capture via `<input type="file" capture="environment">`.
- **Phase Mapping:** Phase 1 (Data Models).
