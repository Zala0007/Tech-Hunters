import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Seed the database with sample data
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingAssets = await ctx.db.query("hydrogenAssets").collect();
    if (existingAssets.length > 0) {
      return "Database already has data";
    }

    const now = Date.now();

    // Add sample hydrogen assets
    await ctx.db.insert("hydrogenAssets", {
      name: "Gujarat Green Hydrogen Hub",
      type: "plant",
      location: {
        lat: 23.0225,
        lng: 72.5714,
        address: "Kutch District, Gujarat",
        state: "Gujarat",
        district: "Kutch",
      },
      capacity: 1000,
      status: "planned",
      operator: "Adani Green Energy",
      renewableScore: 85,
      transportScore: 75,
      environmentalRisk: 25,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("hydrogenAssets", {
      name: "Rajasthan Solar H2 Plant",
      type: "plant",
      location: {
        lat: 27.0238,
        lng: 74.2179,
        address: "Jaisalmer, Rajasthan",
        state: "Rajasthan",
        district: "Jaisalmer",
      },
      capacity: 500,
      status: "under_construction",
      operator: "NTPC Limited",
      renewableScore: 90,
      transportScore: 60,
      environmentalRisk: 20,
      createdAt: now,
      updatedAt: now,
    });

    // Add sample demand clusters
    await ctx.db.insert("demandClusters", {
      name: "Mumbai Industrial Complex",
      type: "industrial",
      location: {
        lat: 19.0760,
        lng: 72.8777,
        address: "Mumbai, Maharashtra",
        state: "Maharashtra",
        district: "Mumbai",
      },
      currentDemand: 50000,
      projectedDemand2030: 150000,
      projectedDemand2050: 400000,
      industries: ["Steel", "Petrochemicals", "Refining"],
      transportConnectivity: 90,
      priority: "high",
      createdAt: now,
      updatedAt: now,
    });

    // Add sample renewable potential
    await ctx.db.insert("renewablePotential", {
      location: {
        lat: 27.0238,
        lng: 74.2179,
        state: "Rajasthan",
        district: "Jaisalmer",
      },
      solarIrradiance: 6.2,
      windSpeed: 8.5,
      solarPotential: 5000,
      windPotential: 3000,
      landAvailability: 100,
      gridConnectivity: 75,
      waterAvailability: 60,
      overallScore: 85,
      createdAt: now,
      updatedAt: now,
    });

    // Add sample transport infrastructure
    await ctx.db.insert("transportInfra", {
      name: "Mumbai Port",
      type: "port",
      geometry: {
        type: "Point",
        coordinates: [72.8777, 19.0760],
      },
      location: {
        state: "Maharashtra",
        district: "Mumbai",
      },
      connectivity: 95,
      strategicImportance: 90,
      capacity: 50000000,
      createdAt: now,
      updatedAt: now,
    });

    // Add sample policy data
    await ctx.db.insert("policyData", {
      state: "Gujarat",
      policies: [
        {
          name: "Gujarat Hydrogen Policy 2023",
          type: "subsidy",
          description: "25% capital subsidy for green hydrogen projects",
          value: "25%",
          effectiveDate: "2023-01-01",
          expiryDate: "2030-12-31",
        },
      ],
      incentiveScore: 85,
      regulatoryClarity: 80,
      targetAmbition: 90,
      overallScore: 85,
      jobCreationPotential: 60,
      sdgAlignment: {
        sdg7: 90,
        sdg9: 80,
        sdg13: 85,
      },
      createdAt: now,
      updatedAt: now,
    });

    return "Sample data seeded successfully";
  },
});
