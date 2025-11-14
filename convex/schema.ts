import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    roomId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  })
  // .index() is for fast lookups (exact matches).
  .index("by_owner_id", ["ownerId"])
  .index("by_organization_id", ["organizationId"])
  // .searchIndex() is for full-text search (fuzzy or partial matches).
  .searchIndex("search_title", {
    searchField: "title",
    filterFields: ["ownerId", "organizationId"]
  })
});
