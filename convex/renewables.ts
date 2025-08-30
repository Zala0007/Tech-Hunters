import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get renewable potential data
export const getRenewablePotential = query({
  args: {
    state: v.optional(v.string()),
    minScore: v.optional(v.number()),
    minLandArea: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let sites = await ctx.db.query("renewablePotential").collect();

    // Apply filters
    if (args.state) {
      sites = sites.filter(site => site.location.state === args.state);
    }
    if (args.minScore !== undefined) {
      sites = sites.filter(site => site.overallScore >= args.minScore!);
    }
    if (args.minLandArea !== undefined) {
      sites = sites.filter(site => site.landAvailability >= args.minLandArea!);
    }

    // Sort by overall score
    sites.sort((a, b) => b.overallScore - a.overallScore);

    return args.limit ? sites.slice(0, args.limit) : sites;
  },
});

// Get renewable statistics
export const getRenewableStats = query({
  args: {
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let sites = await ctx.db.query("renewablePotential").collect();
    
    if (args.state) {
      sites = sites.filter(site => site.location.state === args.state);
    }
    
    const stats = {
      totalSites: sites.length,
      totalSolarPotential: sites.reduce((sum, site) => sum + site.solarPotential, 0),
      totalWindPotential: sites.reduce((sum, site) => sum + site.windPotential, 0),
      totalLandAvailable: sites.reduce((sum, site) => sum + site.landAvailability, 0),
      averageScores: {
        solar: sites.length > 0 ? sites.reduce((sum, site) => sum + (site.solarIrradiance / 6.5 * 100), 0) / sites.length : 0,
        wind: sites.length > 0 ? sites.reduce((sum, site) => sum + (site.windSpeed / 12 * 100), 0) / sites.length : 0,
        overall: sites.length > 0 ? sites.reduce((sum, site) => sum + site.overallScore, 0) / sites.length : 0,
        grid: sites.length > 0 ? sites.reduce((sum, site) => sum + site.gridConnectivity, 0) / sites.length : 0,
        water: sites.length > 0 ? sites.reduce((sum, site) => sum + site.waterAvailability, 0) / sites.length : 0,
      },
      distribution: {
        highPotential: sites.filter(s => s.overallScore >= 80).length,
        mediumPotential: sites.filter(s => s.overallScore >= 60 && s.overallScore < 80).length,
        lowPotential: sites.filter(s => s.overallScore < 60).length,
      },
    };

    return stats;
  },
});

// Get renewable potential for a specific location
export const getRenewablePotentialAtLocation = query({
  args: {
    lat: v.number(),
    lng: v.number(),
    radius: v.number(), // km
  },
  handler: async (ctx, args) => {
    const sites = await ctx.db.query("renewablePotential").collect();
    
    const nearbySites = sites
      .map(site => ({
        ...site,
        distance: calculateDistance(args.lat, args.lng, site.location.lat, site.location.lng)
      }))
      .filter(site => site.distance <= args.radius)
      .sort((a, b) => a.distance - b.distance);

    return nearbySites;
  },
});

// Get best renewable sites for hydrogen production
export const getBestRenewableSites = query({
  args: {
    limit: v.optional(v.number()),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let sites = await ctx.db.query("renewablePotential").collect();
    
    if (args.state) {
      sites = sites.filter(site => site.location.state === args.state);
    }

    // Sort by overall score
    sites.sort((a, b) => b.overallScore - a.overallScore);
    
    if (args.limit) {
      sites = sites.slice(0, args.limit);
    }

    // Add hydrogen production potential
    const sitesWithH2Potential = sites.map(site => ({
      ...site,
      hydrogenPotential: calculateHydrogenPotential(site),
      lcoh: calculateLCOH(site),
    }));

    return sitesWithH2Potential;
  },
});

// Add renewable potential data
export const addRenewablePotential = mutation({
  args: {
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      state: v.string(),
      district: v.string(),
    }),
    solarIrradiance: v.number(),
    windSpeed: v.number(),
    solarPotential: v.number(),
    windPotential: v.number(),
    landAvailability: v.number(),
    gridConnectivity: v.number(),
    waterAvailability: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Calculate overall score
    const solarScore = Math.min(args.solarIrradiance / 6.5 * 100, 100);
    const windScore = Math.min(args.windSpeed / 12 * 100, 100);
    const renewableScore = solarScore * 0.6 + windScore * 0.4;
    
    const overallScore = (
      renewableScore * 0.4 +
      args.gridConnectivity * 0.25 +
      args.waterAvailability * 0.2 +
      Math.min(args.landAvailability / 10 * 100, 100) * 0.15
    );

    const now = Date.now();
    
    return await ctx.db.insert("renewablePotential", {
      ...args,
      overallScore,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Helper functions
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

function calculateHydrogenPotential(site: any): number {
  // Simplified calculation: assume 40% capacity factor and 20 kg H2/MWh
  const totalCapacity = site.solarPotential + site.windPotential;
  const annualGeneration = totalCapacity * 8760 * 0.4; // MWh/year
  return annualGeneration * 0.02; // tonnes H2/year
}

function calculateLCOH(site: any): number {
  // Simplified LCOH calculation (₹/kg)
  const totalCapacity = site.solarPotential + site.windPotential;
  const capex = totalCapacity * 1000 * 2000 * 83 / 1000000; // Million ₹
  const annualProduction = calculateHydrogenPotential(site);
  const annualCost = capex * 0.15; // 15% of CAPEX annually
  
  return annualProduction > 0 ? (annualCost * 1000000) / annualProduction : 0;
}
