import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

/** Ensures state is derived procedurally preventing overlapping external offline mutations corrupting the core registry. */
export const reconcileTreeState = internalMutation({
  handler: async (ctx) => {
    // Collect tree profiles iterating append-only event changes checking for missing sequence consolidations 
    const trees = await ctx.db.query("trees").collect();
    
    for (const tree of trees) {
      const events = await ctx.db
        .query("inspection_events")
        .withIndex("by_tree_id_and_ts", (q) =>
          q.eq("tree_id", tree.tree_id).gt("ts", tree.last_event_ts)
        )
        .order("asc") // Older timestamps to newer timestamps
        .collect();

      if (events.length > 0) {
        // Enforced strict canonical status merging dynamically ensuring timestamps retain dominance matching event logging arrays
        const recent = events[events.length - 1]; 
        
        await ctx.db.patch(tree._id, {
          is_alive: recent.is_alive,
          last_event_ts: recent.ts,
        });
      }
    }
  },
});

crons.interval(
  "reconcile_all_trees",
  { minutes: 5 }, // Triggers state reduction continuously mapping downstream resolutions
  internal.crons.reconcileTreeState,
);

export default crons;
