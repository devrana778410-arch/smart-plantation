import { query } from "../_generated/server";
import { v } from "convex/values";

/** Distributes operational workload assignments returning populated queue payloads for specific regional assignments. */
export const getAuditQueue = query({
  args: {
    auditor_id: v.string(),
  },
  handler: async (ctx, args) => {
    // Utilize unified index scanning fetching pending and active statuses concurrently
    const pending = await ctx.db
      .query("audit_assignments")
      .withIndex("by_auditor_and_status", (q) =>
        q.eq("auditor_id", args.auditor_id).eq("status", "pending")
      )
      .collect();

    const active = await ctx.db
      .query("audit_assignments")
      .withIndex("by_auditor_and_status", (q) =>
        q.eq("auditor_id", args.auditor_id).eq("status", "in_progress")
      )
      .collect();

    const items = [...pending, ...active];

    return await Promise.all(
      items.map(async (acc) => {
        const trees = [];
        for (const t of acc.tree_ids) {
          const tr = await ctx.db
            .query("trees")
            .filter((q) => q.eq(q.field("tree_id"), t))
            .first();
          if (tr) {
            trees.push({
              tree_id: tr.tree_id,
              lat: tr.lat,
              lng: tr.lng,
              is_alive: tr.is_alive,
              species: tr.species,
            });
          }
        }
        return { ...acc, trees };
      })
    );
  },
});
