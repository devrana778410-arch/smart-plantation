import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { latLngToCell } from "h3-js";
import { emitAnalyticsEvent } from "../analytics";

// Helper for GPS distance in meters. Real implementation would use Haversine.
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(dp/2) * Math.sin(dp/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
}

/** Processes a primary tree registration protecting strict variables from upstream patches. */
export const upsertTree = mutation({
  args: {
    tree_id: v.string(),
    ngo_id: v.string(),
    planted_at: v.number(),
    lat: v.number(),
    lng: v.number(),
    species: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("trees")
      .filter((q) => q.eq(q.field("tree_id"), args.tree_id))
      .first();

    if (existing) {
      // Intentionally omitting is_alive, h3_index, and last_event_ts — never mutated directly by clients
      await ctx.db.patch(existing._id, {
        species: args.species,
        planted_at: args.planted_at,
      });
      return existing._id;
    }

    const h3_index = latLngToCell(args.lat, args.lng, 10);

    const newTreeId = await ctx.db.insert("trees", {
      ...args,
      h3_index,
      is_alive: true, // Initial assumption at registration
      last_event_ts: 0,
    });

    return newTreeId;
  },
});

/** Registers unified structural telemetry validations against GPS distancing metrics mapping tree viability timelines. */
export const submitInspectionEvent = mutation({
  args: {
    tree_id: v.string(),
    inspector_id: v.string(),
    role: v.union(v.literal("field_ingestor"), v.literal("auditor")),
    ts: v.number(),
    is_alive: v.boolean(),
    height_cm: v.number(),
    canopy_cm: v.number(),
    stem_diameter_mm: v.number(),
    photo_storage_id: v.string(),
    gps_lat: v.number(),
    gps_lng: v.number(),
  },
  handler: async (ctx, args) => {
    const tree = await ctx.db
      .query("trees")
      .filter((q) => q.eq(q.field("tree_id"), args.tree_id))
      .first();

    if (!tree) throw new Error("Tree not found mapping to this tag.");

    const distance = getDistanceMeters(tree.lat, tree.lng, args.gps_lat, args.gps_lng);
    if (distance > 50) {
      throw new Error(`GPS bounds issue. Verified coordinates are ${distance.toFixed(1)}m away; must be ≤ 50m.`);
    }

    // Insert to offline queue ledger 
    const synced_at = Date.now();
    await ctx.db.insert("inspection_events", {
      ...args,
      synced_at,
    });

    // Fire & forget emission
    await emitAnalyticsEvent("inspection_submitted", {
      role: args.role,
      ngo_id: tree.ngo_id,
    });

    return synced_at;
  },
});
