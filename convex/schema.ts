import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Hydrogen Assets (plants, storage, pipelines, refueling stations)
  hydrogenAssets: defineTable({
    name: v.string(),
    type: v.union(v.literal("plant"), v.literal("storage"), v.literal("pipeline"), v.literal("refueling")),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
      state: v.string(),
      district: v.string(),
    }),
    capacity: v.number(), // MW for plants, kg for storage, km for pipelines
    status: v.union(v.literal("operational"), v.literal("planned"), v.literal("under_construction")),
    operator: v.string(),
    renewableScore: v.number(), // 0-100
    transportScore: v.number(), // 0-100
    environmentalRisk: v.number(), // 0-100
    capex: v.optional(v.number()), // Million USD
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_state", ["location.state"]),

  // Demand Clusters (industrial, transport, residential, export)
  demandClusters: defineTable({
    name: v.string(),
    type: v.union(v.literal("industrial"), v.literal("transport"), v.literal("residential"), v.literal("export")),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
      state: v.string(),
      district: v.string(),
    }),
    currentDemand: v.number(), // tonnes H2/year
    projectedDemand2030: v.number(),
    projectedDemand2050: v.number(),
    industries: v.array(v.string()),
    transportConnectivity: v.number(), // 0-100
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_priority", ["priority"])
    .index("by_state", ["location.state"]),

  // Renewable Energy Potential Sites
  renewablePotential: defineTable({
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      state: v.string(),
      district: v.string(),
    }),
    solarIrradiance: v.number(), // kWh/m²/day
    windSpeed: v.number(), // m/s
    solarPotential: v.number(), // MW
    windPotential: v.number(), // MW
    landAvailability: v.number(), // km²
    gridConnectivity: v.number(), // 0-100
    waterAvailability: v.number(), // 0-100
    overallScore: v.number(), // 0-100
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_state", ["location.state"])
    .index("by_score", ["overallScore"]),

  // Transport Infrastructure
  transportInfra: defineTable({
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
    connectivity: v.number(), // 0-100
    strategicImportance: v.number(), // 0-100
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_state", ["location.state"]),

  // Environmental Constraints
  environmentalConstraints: defineTable({
    name: v.string(),
    type: v.union(v.literal("protected_area"), v.literal("wetland"), v.literal("forest"), v.literal("wildlife_corridor")),
    geometry: v.object({
      type: v.literal("Polygon"),
      coordinates: v.array(v.array(v.array(v.number()))),
    }),
    location: v.object({
      state: v.string(),
      district: v.optional(v.string()),
    }),
    protectionLevel: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    bufferZone: v.number(), // km
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_state", ["location.state"]),

  // Policy Data by State
  policyData: defineTable({
    state: v.string(),
    policies: v.array(v.object({
      name: v.string(),
      type: v.union(v.literal("subsidy"), v.literal("tax_incentive"), v.literal("regulatory"), v.literal("target")),
      description: v.string(),
      value: v.optional(v.string()),
      effectiveDate: v.string(),
      expiryDate: v.optional(v.string()),
    })),
    incentiveScore: v.number(), // 0-100
    regulatoryClarity: v.number(), // 0-100
    targetAmbition: v.number(), // 0-100
    overallScore: v.number(), // 0-100
    jobCreationPotential: v.number(), // jobs per million USD investment
    sdgAlignment: v.object({
      sdg7: v.number(), // Affordable and Clean Energy
      sdg9: v.number(), // Industry, Innovation and Infrastructure
      sdg13: v.number(), // Climate Action
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_state", ["state"])
    .index("by_score", ["overallScore"]),

  // Site Recommendations
  siteRecommendations: defineTable({
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
    landArea: v.number(), // km²
    estimatedCapacity: v.number(), // MW
    lcoh: v.number(), // ₹/kg
    capex: v.number(), // Million USD
    transportCost: v.number(), // ₹/kg
    co2Avoided: v.number(), // tonnes/year
    nearbyAssets: v.array(v.id("hydrogenAssets")),
    nearbyDemand: v.array(v.id("demandClusters")),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["createdBy"])
    .index("by_score", ["scores.overall"]),

  // Scenario Planning
  scenarios: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    parameters: v.object({
      demandGrowth: v.number(), // % per year
      subsidyLevel: v.number(), // % of CAPEX
      carbonPrice: v.number(), // $/tonne CO2
      renewableMix: v.object({
        solar: v.number(),
        wind: v.number(),
        other: v.number(),
      }),
      technologyCost: v.object({
        electrolyzer: v.number(), // $/kW
        storage: v.number(), // $/kg
        transport: v.number(), // $/km
      }),
    }),
    results: v.object({
      totalCapacity: v.number(), // MW
      totalInvestment: v.number(), // Million USD
      averageLcoh: v.number(), // ₹/kg
      co2Reduction: v.number(), // Million tonnes/year
      jobsCreated: v.number(),
      energySecurity: v.number(), // 0-100
    }),
    createdBy: v.id("users"),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["createdBy"])
    .index("by_public", ["isPublic"])
    .searchIndex("search_scenarios", {
      searchField: "name",
      filterFields: ["isPublic"],
    }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
