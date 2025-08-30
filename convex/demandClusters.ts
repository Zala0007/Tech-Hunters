import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all demand clusters with optional filters
export const getDemandClusters = query({
  args: {
    type: v.optional(v.union(v.literal("industrial"), v.literal("transport"), v.literal("residential"), v.literal("export"))),
    state: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("high"), v.literal("medium"), v.literal("low"))),
  },
  handler: async (ctx, args) => {
    let clusters = await ctx.db.query("demandClusters").collect();

    // Apply filters
    if (args.type) {
      clusters = clusters.filter(cluster => cluster.type === args.type);
    }
    if (args.state) {
      clusters = clusters.filter(cluster => cluster.location.state === args.state);
    }
    if (args.priority) {
      clusters = clusters.filter(cluster => cluster.priority === args.priority);
    }

    return clusters;
  },
});

// Get demand statistics
export const getDemandStats = query({
  args: {},
  handler: async (ctx) => {
    const clusters = await ctx.db.query("demandClusters").collect();
    
    const stats = {
      total: clusters.length,
      byType: {
        industrial: clusters.filter(c => c.type === "industrial").length,
        transport: clusters.filter(c => c.type === "transport").length,
        residential: clusters.filter(c => c.type === "residential").length,
        export: clusters.filter(c => c.type === "export").length,
      },
      byPriority: {
        high: clusters.filter(c => c.priority === "high").length,
        medium: clusters.filter(c => c.priority === "medium").length,
        low: clusters.filter(c => c.priority === "low").length,
      },
      totalDemand: {
        current: clusters.reduce((sum, cluster) => sum + cluster.currentDemand, 0),
        projected2030: clusters.reduce((sum, cluster) => sum + cluster.projectedDemand2030, 0),
        projected2050: clusters.reduce((sum, cluster) => sum + cluster.projectedDemand2050, 0),
      },
    };

    return stats;
  },
});

// Add new demand cluster
export const addDemandCluster = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("industrial"), v.literal("transport"), v.literal("residential"), v.literal("export")),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
      state: v.string(),
      district: v.string(),
    }),
    currentDemand: v.number(),
    projectedDemand2030: v.number(),
    projectedDemand2050: v.number(),
    industries: v.array(v.string()),
    transportConnectivity: v.number(),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const now = Date.now();
    
    return await ctx.db.insert("demandClusters", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get demand clusters near a location
export const getNearbyDemandClusters = query({
  args: {
    lat: v.number(),
    lng: v.number(),
    radius: v.number(), // km
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const clusters = await ctx.db.query("demandClusters").collect();
    
    const nearbyClusters = clusters
      .map(cluster => ({
        ...cluster,
        distance: calculateDistance(args.lat, args.lng, cluster.location.lat, cluster.location.lng)
      }))
      .filter(cluster => cluster.distance <= args.radius)
      .sort((a, b) => a.distance - b.distance);

    return args.limit ? nearbyClusters.slice(0, args.limit) : nearbyClusters;
  },
});

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
