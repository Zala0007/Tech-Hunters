import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Add comprehensive sample data for the hydrogen infrastructure platform
export const addSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingAssets = await ctx.db.query("hydrogenAssets").collect();
    if (existingAssets.length > 0) {
      return "Sample data already exists";
    }

    const now = Date.now();

    // Add sample hydrogen assets
    const assets = [
      {
        name: "Gujarat Green Hydrogen Hub",
        type: "plant" as const,
        location: {
          lat: 23.0225,
          lng: 72.5714,
          address: "Kutch District, Gujarat",
          state: "Gujarat",
          district: "Kutch",
        },
        capacity: 1000,
        status: "planned" as const,
        operator: "Adani Green Energy",
        renewableScore: 85,
        transportScore: 75,
        environmentalRisk: 25,
        capex: 2000,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Rajasthan Solar H2 Plant",
        type: "plant" as const,
        location: {
          lat: 27.0238,
          lng: 74.2179,
          address: "Jaisalmer, Rajasthan",
          state: "Rajasthan",
          district: "Jaisalmer",
        },
        capacity: 500,
        status: "under_construction" as const,
        operator: "NTPC Limited",
        renewableScore: 90,
        transportScore: 60,
        environmentalRisk: 20,
        capex: 1000,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Mumbai Port H2 Storage",
        type: "storage" as const,
        location: {
          lat: 19.0760,
          lng: 72.8777,
          address: "Mumbai Port, Maharashtra",
          state: "Maharashtra",
          district: "Mumbai",
        },
        capacity: 10000,
        status: "operational" as const,
        operator: "Indian Oil Corporation",
        renewableScore: 60,
        transportScore: 95,
        environmentalRisk: 40,
        capex: 500,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const asset of assets) {
      await ctx.db.insert("hydrogenAssets", asset);
    }

    // Add sample demand clusters
    const demandClusters = [
      {
        name: "Mumbai Industrial Complex",
        type: "industrial" as const,
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
        priority: "high" as const,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Delhi Transport Hub",
        type: "transport" as const,
        location: {
          lat: 28.7041,
          lng: 77.1025,
          address: "New Delhi, Delhi",
          state: "Delhi",
          district: "New Delhi",
        },
        currentDemand: 25000,
        projectedDemand2030: 100000,
        projectedDemand2050: 300000,
        industries: ["Public Transport", "Logistics"],
        transportConnectivity: 95,
        priority: "high" as const,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const cluster of demandClusters) {
      await ctx.db.insert("demandClusters", cluster);
    }

    // Add sample renewable potential sites
    const renewableSites = [
      {
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
      },
      {
        location: {
          lat: 23.0225,
          lng: 72.5714,
          state: "Gujarat",
          district: "Kutch",
        },
        solarIrradiance: 5.8,
        windSpeed: 7.2,
        solarPotential: 4000,
        windPotential: 2500,
        landAvailability: 80,
        gridConnectivity: 80,
        waterAvailability: 70,
        overallScore: 82,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const site of renewableSites) {
      await ctx.db.insert("renewablePotential", site);
    }

    // Add sample transport infrastructure
    const transportInfra = [
      {
        name: "Mumbai Port",
        type: "port" as const,
        geometry: {
          type: "Point" as const,
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
      },
      {
        name: "Golden Quadrilateral Highway",
        type: "highway" as const,
        geometry: {
          type: "LineString" as const,
          coordinates: [[77.1025, 28.7041], [72.8777, 19.0760]],
        },
        location: {
          state: "Multi-State",
        },
        connectivity: 85,
        strategicImportance: 95,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const infra of transportInfra) {
      await ctx.db.insert("transportInfra", infra);
    }

    // Add sample policy data
    const policyData = [
      {
        state: "Gujarat",
        policies: [
          {
            name: "Gujarat Hydrogen Policy 2023",
            type: "subsidy" as const,
            description: "25% capital subsidy for green hydrogen projects",
            value: "25%",
            effectiveDate: "2023-01-01",
            expiryDate: "2030-12-31",
          },
          {
            name: "Green Hydrogen Tax Incentive",
            type: "tax_incentive" as const,
            description: "10-year tax holiday for hydrogen projects",
            value: "100%",
            effectiveDate: "2023-01-01",
            expiryDate: "2033-12-31",
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
      },
      {
        state: "Rajasthan",
        policies: [
          {
            name: "Rajasthan Renewable Energy Policy",
            type: "regulatory" as const,
            description: "Framework for renewable energy development",
            effectiveDate: "2022-01-01",
          },
        ],
        incentiveScore: 70,
        regulatoryClarity: 75,
        targetAmbition: 80,
        overallScore: 75,
        jobCreationPotential: 45,
        sdgAlignment: {
          sdg7: 85,
          sdg9: 70,
          sdg13: 80,
        },
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const policy of policyData) {
      await ctx.db.insert("policyData", policy);
    }

    return "Sample data added successfully";
  },
});
