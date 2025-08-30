import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all hydrogen assets with optional filters
export const getAssets = query({
  args: {
    type: v.optional(v.union(v.literal("plant"), v.literal("storage"), v.literal("pipeline"), v.literal("refueling"))),
    state: v.optional(v.string()),
    status: v.optional(v.union(v.literal("operational"), v.literal("planned"), v.literal("under_construction"))),
  },
  handler: async (ctx, args) => {
    let assets = await ctx.db.query("hydrogenAssets").collect();

    // Apply filters
    if (args.type) {
      assets = assets.filter(asset => asset.type === args.type);
    }
    if (args.state) {
      assets = assets.filter(asset => asset.location.state === args.state);
    }
    if (args.status) {
      assets = assets.filter(asset => asset.status === args.status);
    }

    return assets;
  },
});

// Get asset statistics
export const getAssetStats = query({
  args: {},
  handler: async (ctx) => {
    const assets = await ctx.db.query("hydrogenAssets").collect();
    
    const stats = {
      total: assets.length,
      byType: {
        plant: assets.filter(a => a.type === "plant").length,
        storage: assets.filter(a => a.type === "storage").length,
        pipeline: assets.filter(a => a.type === "pipeline").length,
        refueling: assets.filter(a => a.type === "refueling").length,
      },
      byStatus: {
        operational: assets.filter(a => a.status === "operational").length,
        planned: assets.filter(a => a.status === "planned").length,
        under_construction: assets.filter(a => a.status === "under_construction").length,
      },
      totalCapacity: assets.reduce((sum, asset) => sum + asset.capacity, 0),
      averageRenewableScore: assets.length > 0 ? assets.reduce((sum, asset) => sum + asset.renewableScore, 0) / assets.length : 0,
      totalInvestment: assets.reduce((sum, asset) => sum + (asset.capex || 0), 0),
    };

    return stats;
  },
});

// Add new hydrogen asset
export const addAsset = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("plant"), v.literal("storage"), v.literal("pipeline"), v.literal("refueling")),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
      state: v.string(),
      district: v.string(),
    }),
    capacity: v.number(),
    status: v.union(v.literal("operational"), v.literal("planned"), v.literal("under_construction")),
    operator: v.string(),
    renewableScore: v.number(),
    transportScore: v.number(),
    environmentalRisk: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const now = Date.now();
    
    return await ctx.db.insert("hydrogenAssets", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Delete hydrogen asset
export const deleteAsset = mutation({
  args: {
    id: v.id("hydrogenAssets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    await ctx.db.delete(args.id);
  },
});
