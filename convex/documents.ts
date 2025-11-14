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

    // Returns a document ID
    return await ctx.db.insert("documents", {
      title: args.title ?? "Untitled Document",
      ownerId: user.subject,
      initialContent: args.initialContent,
    });
  },
});

// Get Document Method
export const getDocuments = query({
  // Add pagination
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db.query("documents").paginate(args.paginationOpts);
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
