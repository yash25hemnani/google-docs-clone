import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

// Create Doument Method
export const createDocument = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated or not
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized Actions");
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    // Returns a document ID
    return await ctx.db.insert("documents", {
      title: args.title ?? "Untitled Document",
      ownerId: user.subject,
      organizationId,
      initialContent: args.initialContent,
    });
  },
});

// Get Document Method
export const getDocuments = query({
  // Add pagination
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized Action");
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    // Searching through the organization documents
    if (args.searchQuery && organizationId) {
      const searchQuery = args.searchQuery;

      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", searchQuery).eq("organizationId", organizationId)
        )
        .paginate(args.paginationOpts);
    }

    // Searching through personal documents
    if (args.searchQuery) {
      const searchQuery = args.searchQuery;
      // TS now knows this is a string.
      // TypeScript does not narrow the type inside the callback because the callback runs inside a different function scope, and TS can’t guarantee that args.searchQuery is still a string.

      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", searchQuery).eq("ownerId", user.subject)
        )
        .paginate(args.paginationOpts);
    }

    // Getting organization documents
    if (organizationId) {
      return await ctx.db
      .query("documents")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
      .paginate(args.paginationOpts);
    }

    // Getting personal documents
    return await ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .paginate(args.paginationOpts);
  },
});

// Remove Document by Id Method
export const removeById = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    // Check user
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized Action");
    }

    // Check if document exists
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new ConvexError("Document Not Found");
    }
    // Check if user is the owner
    const isOwner = document.ownerId === user.subject;
    if (!isOwner) {
      throw new ConvexError("Unauthorized Action");
    }
    // Delete document
    return await ctx.db.delete(args.id);
  },
});

// Update Document by Id Method
export const updateById = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    // Check user
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized Action");
    }
    // Check if document exists
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new ConvexError("Document Not Found");
    }
    // Check if user is the owner
    const isOwner = document.ownerId === user.subject;
    if (!isOwner) {
      throw new ConvexError("Unauthorized Action");
    }
    // Delete document
    return await ctx.db.patch(args.id, { title: args.title });
  },
});
