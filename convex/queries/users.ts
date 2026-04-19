import { query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    
    // Auth automatically manages the auth.users table
    // Fetch from our app_users table instead
    const appUser = await ctx.db
      .query("app_users")
      .filter((q) => q.eq(q.field("user_id"), userId))
      .first();

    // Also get their email from the internal users table
    const authRecord = await ctx.db.get(userId);

    return appUser || { 
      user_id: userId, 
      role: "citizen", 
      name: "New Guest",
      email: authRecord?.email || ""
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    ngo_id: v.optional(v.string()),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not logged in");

    const authRecord = await ctx.db.get(userId);

    const existing = await ctx.db
      .query("app_users")
      .filter((q) => q.eq(q.field("user_id"), userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        role: args.role as any,
        ngo_id: args.ngo_id || existing.ngo_id || "none",
      });
    } else {
      await ctx.db.insert("app_users", {
        user_id: userId,
        name: args.name,
        email: authRecord?.email as string || "",
        role: args.role as any,
        ngo_id: args.ngo_id || "none",
        jwt_issued_at: Date.now(),
      });
    }
  }
});
