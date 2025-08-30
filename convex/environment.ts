import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get environmental constraints
export const getEnvironmentalConstraints = query({
  args: {
    type: v.optional(v.union(v.literal("protected_area"), v.literal("wetland"), v.literal("forest"), v.literal("wildlife_corridor"))),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let constraints = await ctx.db.query("environmentalConstraints").collect();

    // Apply filters
    if (args.type) {
      constraints = constraints.filter(constraint => constraint.type === args.type);
    }
    if (args.state) {
      constraints = constraints.filter(constraint => constraint.location.state === args.state);
    }

    return constraints;
  },
});

// Get environmental statistics
export const getEnvironmentalStats = query({
  args: {
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let constraints = await ctx.db.query("environmentalConstraints").collect();
    
    if (args.state) {
      constraints = constraints.filter(constraint => constraint.location.state === args.state);
    }
    
    const stats = {
      total: constraints.length,
      byType: {
        protected_area: constraints.filter(c => c.type === "protected_area").length,
        wetland: constraints.filter(c => c.type === "wetland").length,
        forest: constraints.filter(c => c.type === "forest").length,
        wildlife_corridor: constraints.filter(c => c.type === "wildlife_corridor").length,
      },
      byProtection: {
        high: constraints.filter(c => c.protectionLevel === "high").length,
        medium: constraints.filter(c => c.protectionLevel === "medium").length,
        low: constraints.filter(c => c.protectionLevel === "low").length,
      },
      averageBufferZone: constraints.length > 0 ? constraints.reduce((sum, c) => sum + c.bufferZone, 0) / constraints.length : 0,
      totalProtectedArea: constraints.length * 100, // Simplified calculation
    };

    return stats;
  },
});

// Get environmental risk assessment for a location
export const getEnvironmentalRisk = query({
  args: {
    lat: v.number(),
    lng: v.number(),
    radius: v.number(), // km
  },
  handler: async (ctx, args) => {
    const constraints = await ctx.db.query("environmentalConstraints").collect();
    
    let riskScore = 0;
    const nearbyConstraints = [];
    
    for (const constraint of constraints) {
      const distance = calculateDistanceToConstraint(args.lat, args.lng, constraint);
      
      if (distance <= constraint.bufferZone) {
        let risk = 0;
        if (constraint.protectionLevel === "high") risk = 80;
        else if (constraint.protectionLevel === "medium") risk = 50;
        else risk = 20;
        
        // Reduce risk based on distance within buffer zone
        risk *= (1 - distance / constraint.bufferZone);
        riskScore += risk;
        
        nearbyConstraints.push({
          ...constraint,
          distance,
          riskContribution: risk,
        });
      }
    }
    
    return {
      overallRisk: Math.min(riskScore, 100),
      environmentalScore: Math.max(100 - riskScore, 0),
      nearbyConstraints,
      recommendations: generateEnvironmentalRecommendations(riskScore, nearbyConstraints),
    };
  },
});

// Helper functions
function calculateDistanceToConstraint(lat: number, lng: number, constraint: any): number {
  // Simplified point-in-polygon and distance calculation
  const centerLat = constraint.geometry.coordinates[0][0][1];
  const centerLng = constraint.geometry.coordinates[0][0][0];
  
  const R = 6371;
  const dLat = (centerLat - lat) * Math.PI / 180;
  const dLng = (centerLng - lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat * Math.PI / 180) * Math.cos(centerLat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function generateEnvironmentalRecommendations(riskScore: number, constraints: any[]): string[] {
  const recommendations = [];
  
  if (riskScore > 70) {
    recommendations.push("High environmental risk - consider alternative locations");
  } else if (riskScore > 40) {
    recommendations.push("Moderate environmental risk - conduct detailed EIA");
  } else {
    recommendations.push("Low environmental risk - suitable for development");
  }
  
  if (constraints.some(c => c.type === "wetland")) {
    recommendations.push("Wetland proximity requires special water management measures");
  }
  
  if (constraints.some(c => c.type === "wildlife_corridor")) {
    recommendations.push("Wildlife corridor nearby - minimize habitat disruption");
  }
  
  return recommendations;
}
