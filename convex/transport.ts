import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Get transport infrastructure
export const getTransportInfra = query({
  args: {
    type: v.optional(v.union(v.literal("highway"), v.literal("railway"), v.literal("port"), v.literal("airport"), v.literal("pipeline"))),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let infrastructure = await ctx.db.query("transportInfra").collect();

    // Apply filters
    if (args.type) {
      infrastructure = infrastructure.filter(infra => infra.type === args.type);
    }
    if (args.state) {
      infrastructure = infrastructure.filter(infra => infra.location.state === args.state);
    }

    return infrastructure;
  },
});

// Get transport statistics
export const getTransportStats = query({
  args: {
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let infrastructure = await ctx.db.query("transportInfra").collect();
    
    if (args.state) {
      infrastructure = infrastructure.filter(infra => infra.location.state === args.state);
    }
    
    const stats = {
      total: infrastructure.length,
      byType: {
        highway: infrastructure.filter(i => i.type === "highway").length,
        railway: infrastructure.filter(i => i.type === "railway").length,
        port: infrastructure.filter(i => i.type === "port").length,
        airport: infrastructure.filter(i => i.type === "airport").length,
        pipeline: infrastructure.filter(i => i.type === "pipeline").length,
      },
      averageConnectivity: infrastructure.length > 0 ? infrastructure.reduce((sum, infra) => sum + infra.connectivity, 0) / infrastructure.length : 0,
      strategicAssets: infrastructure.filter(i => i.strategicImportance >= 80).length,
      totalCapacity: infrastructure.reduce((sum, infra) => sum + (infra.capacity || 0), 0),
      connectivityDistribution: {
        high: infrastructure.filter(i => i.connectivity >= 80).length,
        medium: infrastructure.filter(i => i.connectivity >= 60 && i.connectivity < 80).length,
        low: infrastructure.filter(i => i.connectivity < 60).length,
      },
    };

    return stats;
  },
});

// Get transport connectivity score for a location
export const getTransportConnectivity = internalQuery({
  args: {
    lat: v.number(),
    lng: v.number(),
    radius: v.optional(v.number()), // km, default 50
  },
  handler: async (ctx, args) => {
    const radius = args.radius || 50;
    const infrastructure = await ctx.db.query("transportInfra").collect();
    
    let connectivityScore = 0;
    const summary = {
      highways: 0,
      railways: 0,
      ports: 0,
      airports: 0,
      pipelines: 0,
    };

    for (const infra of infrastructure) {
      const distance = calculateDistanceToInfra(args.lat, args.lng, infra);
      
      if (distance <= radius) {
        const proximityScore = Math.max(0, 100 - (distance / radius) * 100);
        connectivityScore += proximityScore * infra.connectivity / 100 * 0.2;
        
        if (infra.type === "highway") summary.highways++;
        else if (infra.type === "railway") summary.railways++;
        else if (infra.type === "port") summary.ports++;
        else if (infra.type === "airport") summary.airports++;
        else if (infra.type === "pipeline") summary.pipelines++;
      }
    }

    return {
      overallScore: Math.min(connectivityScore, 100),
      summary,
    };
  },
});

// Get strategic transport corridors
export const getStrategicCorridors = query({
  args: {
    minImportance: v.optional(v.number()),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let infrastructure = await ctx.db.query("transportInfra").collect();
    
    if (args.state) {
      infrastructure = infrastructure.filter(infra => infra.location.state === args.state);
    }

    // Filter by strategic importance
    const minImportance = args.minImportance || 70;
    infrastructure = infrastructure.filter(infra => infra.strategicImportance >= minImportance);

    // Group by type and sort by importance
    const corridors = {
      highways: infrastructure.filter(i => i.type === "highway").sort((a, b) => b.strategicImportance - a.strategicImportance),
      railways: infrastructure.filter(i => i.type === "railway").sort((a, b) => b.strategicImportance - a.strategicImportance),
      ports: infrastructure.filter(i => i.type === "port").sort((a, b) => b.strategicImportance - a.strategicImportance),
      pipelines: infrastructure.filter(i => i.type === "pipeline").sort((a, b) => b.strategicImportance - a.strategicImportance),
    };

    return corridors;
  },
});

// Get multimodal connectivity analysis
export const getMultimodalConnectivity = query({
  args: {
    lat: v.number(),
    lng: v.number(),
    radius: v.number(),
  },
  handler: async (ctx, args): Promise<any> => {
    const connectivity: any = await ctx.runQuery(internal.transport.getTransportConnectivity, {
      lat: args.lat,
      lng: args.lng,
      radius: args.radius,
    });

    const availableModes = Object.entries(connectivity.summary)
      .filter(([_, count]) => (count as number) > 0)
      .map(([mode, _]) => mode);
    
    const multimodalScore = (availableModes.length / 5) * 100; // 5 total modes
    const redundancyScore = Object.values(connectivity.summary).reduce((sum, count) => (sum as number) + Math.min((count as number) / 2, 1) * 20, 0);

    return {
      ...connectivity,
      multimodalScore,
      redundancyScore,
      availableModes,
      recommendations: generateConnectivityRecommendations(connectivity),
    };
  },
});

// Add transport infrastructure
export const addTransportInfra = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("highway"), v.literal("railway"), v.literal("port"), v.literal("airport"), v.literal("pipeline")),
    geometry: v.object({
      type: v.union(v.literal("Point"), v.literal("LineString")),
      coordinates: v.array(v.union(v.number(), v.array(v.number()))),
    }),
    location: v.object({
      state: v.string(),
      district: v.optional(v.string()),
    }),
    capacity: v.optional(v.number()),
    connectivity: v.number(),
    strategicImportance: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const now = Date.now();
    
    return await ctx.db.insert("transportInfra", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Helper functions
function calculateDistanceToInfra(lat: number, lng: number, infra: any): number {
  if (infra.geometry.type === "Point") {
    return calculateDistance(lat, lng, infra.geometry.coordinates[1], infra.geometry.coordinates[0]);
  } else if (infra.geometry.type === "LineString") {
    // Calculate distance to nearest point on line (simplified)
    let minDistance = Infinity;
    for (let i = 0; i < infra.geometry.coordinates.length; i++) {
      const distance = calculateDistance(lat, lng, infra.geometry.coordinates[i][1], infra.geometry.coordinates[i][0]);
      minDistance = Math.min(minDistance, distance);
    }
    return minDistance;
  }
  return Infinity;
}

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

function generateConnectivityRecommendations(connectivity: any): string[] {
  const recommendations = [];
  
  if (connectivity.summary.ports === 0) {
    recommendations.push("Consider proximity to ports for export opportunities");
  }
  
  if (connectivity.summary.pipelines === 0) {
    recommendations.push("Pipeline connectivity would reduce transport costs");
  }
  
  if (connectivity.overallScore < 60) {
    recommendations.push("Transport connectivity is below optimal - consider alternative locations");
  }
  
  if (connectivity.summary.highways > 2) {
    recommendations.push("Excellent highway connectivity for truck transport");
  }
  
  return recommendations;
}
