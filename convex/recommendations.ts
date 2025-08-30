// Delete a site recommendation
export const deleteRecommendation = mutation({
  args: {
    id: v.id("siteRecommendations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Generate AI site recommendations
export const generateRecommendations = action({
  args: {
    weights: v.object({
      renewable: v.number(),
      demand: v.number(),
      transport: v.number(),
      environmental: v.number(),
    }),
    minLandArea: v.number(),
    maxResults: v.optional(v.number()),
    targetState: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Generate sample recommendations for demonstration
    const sampleRecommendations = [
      {
        location: {
          lat: 23.0225,
          lng: 72.5714,
          state: "Gujarat",
          district: "Kutch",
          address: "Kutch District, Gujarat",
        },
        scores: {
          renewable: 85,
          demand: 75,
          transport: 80,
          environmental: 70,
          overall: 77.5,
        },
        weights: args.weights,
        landArea: 500,
        estimatedCapacity: 1000,
        lcoh: 280,
        capex: 2000,
        transportCost: 50,
        co2Avoided: 180000,
        nearbyAssets: [],
        nearbyDemand: [],
        createdBy: userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        location: {
          lat: 27.0238,
          lng: 74.2179,
          state: "Rajasthan",
          district: "Jaisalmer",
          address: "Jaisalmer, Rajasthan",
        },
        scores: {
          renewable: 90,
          demand: 60,
          transport: 65,
          environmental: 80,
          overall: 73.75,
        },
        weights: args.weights,
        landArea: 800,
        estimatedCapacity: 1500,
        lcoh: 260,
        capex: 3000,
        transportCost: 80,
        co2Avoided: 270000,
        nearbyAssets: [],
        nearbyDemand: [],
        createdBy: userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    // Save recommendations to database
    const savedRecommendations = [];
    for (const rec of sampleRecommendations) {
      const id: string = await ctx.runMutation(internal.recommendations.saveRecommendation, rec);
      savedRecommendations.push({ ...rec, _id: id });
    }

    return savedRecommendations;
  },
});

// Save recommendation to database (internal)
export const saveRecommendation = internalMutation({
  args: {
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      state: v.string(),
      district: v.string(),
      address: v.string(),
    }),
    scores: v.object({
      renewable: v.number(),
      demand: v.number(),
      transport: v.number(),
      environmental: v.number(),
      overall: v.number(),
    }),
    weights: v.object({
      renewable: v.number(),
      demand: v.number(),
      transport: v.number(),
      environmental: v.number(),
    }),
    landArea: v.number(),
    estimatedCapacity: v.number(),
    lcoh: v.number(),
    capex: v.number(),
    transportCost: v.number(),
    co2Avoided: v.number(),
    nearbyAssets: v.array(v.id("hydrogenAssets")),
    nearbyDemand: v.array(v.id("demandClusters")),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("siteRecommendations", args);
  },
});

// Get user's recommendations
export const getUserRecommendations = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const recommendations = await ctx.db.query("siteRecommendations").collect();
    const userRecs = recommendations.filter(rec => rec.createdBy === userId);
    
    userRecs.sort((a, b) => b.createdAt - a.createdAt);
    
    return args.limit ? userRecs.slice(0, args.limit) : userRecs;
  },
});

// Get top recommendations globally
export const getTopRecommendations = query({
  args: {
    limit: v.optional(v.number()),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let recommendations = await ctx.db.query("siteRecommendations").collect();

    // Apply filters
    if (args.state) {
      recommendations = recommendations.filter(rec => rec.location.state === args.state);
    }

    // Sort by overall score
    recommendations.sort((a, b) => b.scores.overall - a.scores.overall);

    return recommendations.slice(0, args.limit || 20);
  },
});

// Compare multiple recommendations
export const compareRecommendations = query({
  args: {
    recommendationIds: v.array(v.id("siteRecommendations")),
  },
  handler: async (ctx, args) => {
    const recommendations = [];
    
    for (const id of args.recommendationIds) {
      const rec = await ctx.db.get(id);
      if (rec) {
        recommendations.push(rec);
      }
    }

    if (recommendations.length === 0) {
      return null;
    }

    // Calculate comparison metrics
    const comparison = {
      recommendations,
      averages: {
        renewable: recommendations.reduce((sum, r) => sum + r.scores.renewable, 0) / recommendations.length,
        demand: recommendations.reduce((sum, r) => sum + r.scores.demand, 0) / recommendations.length,
        transport: recommendations.reduce((sum, r) => sum + r.scores.transport, 0) / recommendations.length,
        environmental: recommendations.reduce((sum, r) => sum + r.scores.environmental, 0) / recommendations.length,
        overall: recommendations.reduce((sum, r) => sum + r.scores.overall, 0) / recommendations.length,
        lcoh: recommendations.reduce((sum, r) => sum + r.lcoh, 0) / recommendations.length,
        capex: recommendations.reduce((sum, r) => sum + r.capex, 0) / recommendations.length,
      },
      bestPerformers: {
        renewable: recommendations.reduce((best, r) => r.scores.renewable > best.scores.renewable ? r : best),
        demand: recommendations.reduce((best, r) => r.scores.demand > best.scores.demand ? r : best),
        transport: recommendations.reduce((best, r) => r.scores.transport > best.scores.transport ? r : best),
        environmental: recommendations.reduce((best, r) => r.scores.environmental > best.scores.environmental ? r : best),
        overall: recommendations.reduce((best, r) => r.scores.overall > best.scores.overall ? r : best),
        lcoh: recommendations.reduce((best, r) => r.lcoh < best.lcoh ? r : best),
      },
    };

    return comparison;
  },
});
