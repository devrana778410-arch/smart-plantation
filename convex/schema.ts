import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  trees: defineTable({
    tree_id: v.string(), // Matches physical QR tag
    ngo_id: v.string(),
    planted_at: v.number(), // Unix timestamp
    lat: v.number(),
    lng: v.number(),
    h3_index: v.string(), // H3 Resolution 10 
    species: v.string(),
    is_alive: v.boolean(), // Derived strictly from inspection events
    last_event_ts: v.number(),
  })
    .index("by_h3_index", ["h3_index"])
    .index("by_ngo_id", ["ngo_id"]),

  inspection_events: defineTable({
    tree_id: v.string(),
    inspector_id: v.string(),
    role: v.union(v.literal("field_ingestor"), v.literal("auditor")),
    ts: v.number(), // Client-side Unix timestamp
    is_alive: v.boolean(),
    height_cm: v.number(),
    canopy_cm: v.number(),
    stem_diameter_mm: v.number(),
    photo_storage_id: v.string(), // Convex Storage signed URL reference
    gps_lat: v.number(),
    gps_lng: v.number(),
    synced_at: v.number(), // Server-side receipt timestamp
  })
    .index("by_tree_id_and_ts", ["tree_id", "ts"]),

  app_users: defineTable({
    user_id: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("citizen"),
      v.literal("field_ingestor"),
      v.literal("auditor"),
      v.literal("dept_official")
    ),
    ngo_id: v.string(),
    jwt_issued_at: v.number(),
  }),

  ngos: defineTable({
    ngo_id: v.string(),
    name: v.string(),
    slug: v.string(), // Unique routing /[ngo_slug]/scan/[tree_id]
    stripe_customer_id: v.string(),
    stripe_subscription_status: v.union(
      v.literal("active"),
      v.literal("trialing"),
      v.literal("past_due"),
      v.literal("canceled")
    ),
    plan_tier: v.union(v.literal("starter"), v.literal("growth"), v.literal("enterprise")),
  }),

  audit_assignments: defineTable({
    assignment_id: v.string(),
    auditor_id: v.string(),
    tree_ids: v.array(v.string()), // Stratified random sample
    ngo_id: v.string(),
    zone_h3: v.string(), // H3 parent cell at Resolution 6
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("complete")),
    created_at: v.number(),
  })
    .index("by_auditor_and_status", ["auditor_id", "status"]),
});
