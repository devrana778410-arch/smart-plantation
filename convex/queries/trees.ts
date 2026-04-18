import { query } from "../_generated/server";
import { v } from "convex/values";
import { polygonToCells } from "h3-js";

/** Resolves lightweight clustered Mapbox location points dynamically grouping data via H3 cell intersections. */
export const getTreesByBbox = query({
  args: {
    swLat: v.number(),
    swLng: v.number(),
    neLat: v.number(),
    neLng: v.number(),
  },
  handler: async (ctx, args) => {
    // Generate H3 mapped geometric polygon boundary matrix 
    const polygon = [
      [args.swLat, args.swLng],
      [args.neLat, args.swLng],
      [args.neLat, args.neLng],
      [args.swLat, args.neLng],
      [args.swLat, args.swLng],
    ];

    // Compute parental resolution grid constraints mapping standard geospatial parameters
    const res6Cells = polygonToCells(polygon, 6);
    const results = [];

    for (const prefix of res6Cells) {
      // By iterating prefixes matching H3 mapping, perform prefix searches seamlessly over children
      const trees = await ctx.db
        .query("trees")
        .withIndex("by_h3_index", (q) =>
          q.gte("h3_index", prefix).lt("h3_index", prefix + "\uFFFF")
        )
        .collect();

      // Ensure blob and heavy parameters are entirely removed preserving lean performance models
      results.push(
        ...trees.map((t) => ({
          tree_id: t.tree_id,
          lat: t.lat,
          lng: t.lng,
          is_alive: t.is_alive,
          species: t.species,
        }))
      );
    }

    return results;
  },
});

/** Synthesises individual timeline lifecycles presenting the comprehensive canonical state events stream. */
export const getTreeProfile = query({
  args: {
    tree_id: v.string(),
  },
  handler: async (ctx, args) => {
    const tree = await ctx.db
      .query("trees")
      .filter((q) => q.eq(q.field("tree_id"), args.tree_id))
      .first();

    if (!tree) return null;

    const events = await ctx.db
      .query("inspection_events")
      .withIndex("by_tree_id_and_ts", (q) => q.eq("tree_id", args.tree_id))
      .order("desc")
      .collect();

    // Map the attached assignment status validating auditor association
    const assignments = await ctx.db.query("audit_assignments").collect();
    const activeAudit = assignments.find(
      (a) => a.tree_ids.includes(args.tree_id) && ["in_progress", "pending"].includes(a.status)
    );

    let auditorName = null;
    if (activeAudit) {
      const auditor = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("user_id"), activeAudit.auditor_id))
        .first();
      auditorName = auditor?.name || null;
    }

    return {
      tree,
      inspection_events: events,
      auditor_name: auditorName,
    };
  },
});
