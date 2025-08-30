import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user's scenarios
export const getUserScenarios = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    return await ctx.db
      .query("scenarios")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .order("desc")
      .take(args.limit || 20);
  },
});

// Get public scenarios
export const getPublicScenarios = query({
  args: {
    limit: v.optional(v.number()),
    searchTerm: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.searchTerm) {
      return await ctx.db
        .query("scenarios")
        .withSearchIndex("search_scenarios", (q) => q.search("name", args.searchTerm!))
        .filter((q) => q.eq(q.field("isPublic"), true))
        .take(args.limit || 20);
    }

    return await ctx.db
      .query("scenarios")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(args.limit || 20);
  },
});

// Create new scenario
export const createScenario = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    parameters: v.object({
      demandGrowth: v.number(),
      subsidyLevel: v.number(),
      carbonPrice: v.number(),
      renewableMix: v.object({
        solar: v.number(),
        wind: v.number(),
        other: v.number(),
      }),
      technologyCost: v.object({
        electrolyzer: v.number(),
        storage: v.number(),
        transport: v.number(),
      }),
    }),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Calculate scenario results
    const results = calculateScenarioResults(args.parameters);
    const now = Date.now();

    return await ctx.db.insert("scenarios", {
      name: args.name,
      description: args.description,
      parameters: args.parameters,
      results,
      createdBy: userId,
      isPublic: args.isPublic,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update scenario
export const updateScenario = mutation({
  args: {
    id: v.id("scenarios"),
    updates: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      parameters: v.optional(v.object({
        demandGrowth: v.number(),
        subsidyLevel: v.number(),
        carbonPrice: v.number(),
        renewableMix: v.object({
          solar: v.number(),
          wind: v.number(),
          other: v.number(),
        }),
        technologyCost: v.object({
          electrolyzer: v.number(),
          storage: v.number(),
          transport: v.number(),
        }),
      })),
      isPublic: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const scenario = await ctx.db.get(args.id);
    if (!scenario || scenario.createdBy !== userId) {
      throw new Error("Scenario not found or access denied");
    }

    let results = scenario.results;
    if (args.updates.parameters) {
      results = calculateScenarioResults(args.updates.parameters);
    }

    await ctx.db.patch(args.id, {
      ...args.updates,
      results,
      updatedAt: Date.now(),
    });
  },
});

// Delete scenario
export const deleteScenario = mutation({
  args: {
    id: v.id("scenarios"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const scenario = await ctx.db.get(args.id);
    if (!scenario || scenario.createdBy !== userId) {
      throw new Error("Scenario not found or access denied");
    }

    await ctx.db.delete(args.id);
  },
});

// Compare scenarios
export const compareScenarios = query({
  args: {
    scenarioIds: v.array(v.id("scenarios")),
  },
  handler: async (ctx, args) => {
    const scenarios = [];
    
    for (const id of args.scenarioIds) {
      const scenario = await ctx.db.get(id);
      if (scenario) {
        scenarios.push(scenario);
      }
    }

    if (scenarios.length === 0) {
      return null;
    }

    // Calculate comparison metrics
    const comparison = {
      scenarios,
      averages: {
        totalCapacity: scenarios.reduce((sum, s) => sum + s.results.totalCapacity, 0) / scenarios.length,
        totalInvestment: scenarios.reduce((sum, s) => sum + s.results.totalInvestment, 0) / scenarios.length,
        averageLcoh: scenarios.reduce((sum, s) => sum + s.results.averageLcoh, 0) / scenarios.length,
        co2Reduction: scenarios.reduce((sum, s) => sum + s.results.co2Reduction, 0) / scenarios.length,
        jobsCreated: scenarios.reduce((sum, s) => sum + s.results.jobsCreated, 0) / scenarios.length,
        energySecurity: scenarios.reduce((sum, s) => sum + s.results.energySecurity, 0) / scenarios.length,
      },
      bestPerformers: {
        capacity: scenarios.reduce((best, s) => s.results.totalCapacity > best.results.totalCapacity ? s : best),
        investment: scenarios.reduce((best, s) => s.results.totalInvestment < best.results.totalInvestment ? s : best),
        lcoh: scenarios.reduce((best, s) => s.results.averageLcoh < best.results.averageLcoh ? s : best),
        co2: scenarios.reduce((best, s) => s.results.co2Reduction > best.results.co2Reduction ? s : best),
        jobs: scenarios.reduce((best, s) => s.results.jobsCreated > best.results.jobsCreated ? s : best),
        security: scenarios.reduce((best, s) => s.results.energySecurity > best.results.energySecurity ? s : best),
      },
      parameterAnalysis: analyzeParameterImpact(scenarios),
    };

    return comparison;
  },
});

// Helper functions
function calculateScenarioResults(parameters: any) {
  // Simplified scenario calculation model
  const baseCapacity = 10000; // MW
  const baseInvestment = 20000; // Million USD
  const baseLcoh = 300; // ₹/kg
  const baseCo2Reduction = 50; // Million tonnes/year
  const baseJobs = 100000;
  const baseEnergySecurity = 70;

  // Apply parameter effects
  const demandMultiplier = 1 + (parameters.demandGrowth / 100);
  const subsidyEffect = 1 - (parameters.subsidyLevel / 100) * 0.3; // 30% cost reduction per 100% subsidy
  const carbonPriceEffect = 1 + (parameters.carbonPrice / 100) * 0.1; // 10% LCOH improvement per $100/tonne
  const techCostEffect = parameters.technologyCost.electrolyzer / 800; // Normalized to $800/kW base

  const totalCapacity = baseCapacity * demandMultiplier;
  const totalInvestment = baseInvestment * demandMultiplier * techCostEffect * subsidyEffect;
  const averageLcoh = baseLcoh * techCostEffect * subsidyEffect / carbonPriceEffect;
  const co2Reduction = baseCo2Reduction * demandMultiplier;
  const jobsCreated = baseJobs * demandMultiplier * 1.2; // 20% more jobs with growth
  const energySecurity = Math.min(baseEnergySecurity + (demandMultiplier - 1) * 20, 100);

  return {
    totalCapacity,
    totalInvestment,
    averageLcoh,
    co2Reduction,
    jobsCreated,
    energySecurity,
  };
}

function analyzeParameterImpact(scenarios: any[]) {
  const analysis = {
    demandGrowthImpact: 0,
    subsidyImpact: 0,
    carbonPriceImpact: 0,
    technologyCostImpact: 0,
  };

  // Simplified correlation analysis
  if (scenarios.length > 1) {
    const capacityRange = Math.max(...scenarios.map(s => s.results.totalCapacity)) - 
                         Math.min(...scenarios.map(s => s.results.totalCapacity));
    const demandRange = Math.max(...scenarios.map(s => s.parameters.demandGrowth)) - 
                       Math.min(...scenarios.map(s => s.parameters.demandGrowth));
    
    analysis.demandGrowthImpact = demandRange > 0 ? capacityRange / demandRange : 0;
  }

  return analysis;
}
