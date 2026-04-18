import { mutation } from "../_generated/server";
import { v } from "convex/values";

/** Triggers automated zone assignment protocols deploying stratified randomly allocated workloads mapping to specified H3 prefixes. */
export const createAuditAssignment = mutation({
  args: {
    ngo_id: v.string(),
    auditor_id: v.string(),
    zone_h3: v.string(),
  },
  handler: async (ctx, args) => {
    // Utilize index fetch followed by partial prefix filtering
    const allTrees = await ctx.db
      .query("trees")
      .withIndex("by_ngo_id", (q) => q.eq("ngo_id", args.ngo_id))
      .collect();

    // In a production scaling structure we might utilize pure substring queries on the H3 index instead
    const zoneTrees = allTrees.filter((t) => t.h3_index.startsWith(args.zone_h3));

    // Target randomly selecting 15% minimum 5 limit
    const sampleSize = Math.max(5, Math.ceil(zoneTrees.length * 0.15));
    const shuffled = zoneTrees.sort(() => 0.5 - Math.random());
    const tree_ids = shuffled.slice(0, sampleSize).map((t) => t.tree_id);

    // Provide simplified id assignment to bypass restricted Node implementations depending on convex context
    const assignment_id = `asgn_${Math.random().toString(36).substring(2, 9)}`;

    await ctx.db.insert("audit_assignments", {
      assignment_id,
      auditor_id: args.auditor_id,
      tree_ids,
      ngo_id: args.ngo_id,
      zone_h3: args.zone_h3,
      status: "pending",
      created_at: Date.now(),
    });

    return assignment_id;
  },
});
