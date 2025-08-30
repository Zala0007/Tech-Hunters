import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get policy data for states
export const getPolicyData = query({
  args: {
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let policies = await ctx.db.query("policyData").collect();

    if (args.state) {
      policies = policies.filter(policy => policy.state === args.state);
    }

    return policies.sort((a, b) => b.overallScore - a.overallScore);
  },
});

// Get top performing states by policy
export const getTopPolicyStates = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const policies = await ctx.db.query("policyData").collect();
    
    policies.sort((a, b) => b.overallScore - a.overallScore);
    
    return policies.slice(0, args.limit || 10);
  },
});

// Get policy comparison between states
export const comparePolicies = query({
  args: {
    states: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const policies = [];
    const allPolicies = await ctx.db.query("policyData").collect();
    
    for (const state of args.states) {
      const statePolicy = allPolicies.find(p => p.state === state);
      if (statePolicy) {
        policies.push(statePolicy);
      }
    }

    // Calculate comparison metrics
    const comparison = {
      policies,
      averages: {
        incentiveScore: policies.length > 0 ? policies.reduce((sum, p) => sum + p.incentiveScore, 0) / policies.length : 0,
        regulatoryClarity: policies.length > 0 ? policies.reduce((sum, p) => sum + p.regulatoryClarity, 0) / policies.length : 0,
        targetAmbition: policies.length > 0 ? policies.reduce((sum, p) => sum + p.targetAmbition, 0) / policies.length : 0,
        overallScore: policies.length > 0 ? policies.reduce((sum, p) => sum + p.overallScore, 0) / policies.length : 0,
      },
      rankings: {
        byIncentive: [...policies].sort((a, b) => b.incentiveScore - a.incentiveScore),
        byClarity: [...policies].sort((a, b) => b.regulatoryClarity - a.regulatoryClarity),
        byAmbition: [...policies].sort((a, b) => b.targetAmbition - a.targetAmbition),
        overall: [...policies].sort((a, b) => b.overallScore - a.overallScore),
      },
    };

    return comparison;
  },
});

// Get policy recommendations for a location
export const getPolicyRecommendations = query({
  args: {
    state: v.string(),
    projectType: v.union(v.literal("production"), v.literal("storage"), v.literal("transport"), v.literal("industrial")),
    investmentSize: v.number(), // Million USD
  },
  handler: async (ctx, args) => {
    const allPolicies = await ctx.db.query("policyData").collect();
    const statePolicy = allPolicies.find(p => p.state === args.state);

    if (!statePolicy) {
      return {
        recommendations: ["No policy data available for this state"],
        applicablePolicies: [],
        estimatedIncentives: 0,
      };
    }

    const applicablePolicies = statePolicy.policies.filter(policy => {
      if (args.projectType === "production" && policy.type === "subsidy") return true;
      if (args.projectType === "industrial" && policy.type === "tax_incentive") return true;
      if (policy.type === "regulatory") return true;
      return false;
    });

    const estimatedIncentives = calculateIncentives(applicablePolicies, args.investmentSize);
    const recommendations = generatePolicyRecommendations(statePolicy, args.projectType, args.investmentSize);

    return {
      statePolicy,
      applicablePolicies,
      estimatedIncentives,
      recommendations,
      sdgAlignment: statePolicy.sdgAlignment,
      jobCreationPotential: statePolicy.jobCreationPotential * args.investmentSize / 100,
    };
  },
});

// Add or update policy data
export const updatePolicyData = mutation({
  args: {
    state: v.string(),
    policies: v.array(v.object({
      name: v.string(),
      type: v.union(v.literal("subsidy"), v.literal("tax_incentive"), v.literal("regulatory"), v.literal("target")),
      description: v.string(),
      value: v.optional(v.string()),
      effectiveDate: v.string(),
      expiryDate: v.optional(v.string()),
    })),
    incentiveScore: v.number(),
    regulatoryClarity: v.number(),
    targetAmbition: v.number(),
    jobCreationPotential: v.number(),
    sdgAlignment: v.object({
      sdg7: v.number(),
      sdg9: v.number(),
      sdg13: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const overallScore = (args.incentiveScore + args.regulatoryClarity + args.targetAmbition) / 3;
    const now = Date.now();

    // Check if policy data exists for this state
    const allPolicies = await ctx.db.query("policyData").collect();
    const existing = allPolicies.find(p => p.state === args.state);

    if (existing) {
      await ctx.db.patch(existing._id, {
        policies: args.policies,
        incentiveScore: args.incentiveScore,
        regulatoryClarity: args.regulatoryClarity,
        targetAmbition: args.targetAmbition,
        overallScore,
        jobCreationPotential: args.jobCreationPotential,
        sdgAlignment: args.sdgAlignment,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("policyData", {
        state: args.state,
        policies: args.policies,
        incentiveScore: args.incentiveScore,
        regulatoryClarity: args.regulatoryClarity,
        targetAmbition: args.targetAmbition,
        overallScore,
        jobCreationPotential: args.jobCreationPotential,
        sdgAlignment: args.sdgAlignment,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Helper functions
function calculateIncentives(policies: any[], investmentSize: number): number {
  let totalIncentives = 0;
  
  for (const policy of policies) {
    if (policy.type === "subsidy" && policy.value) {
      const subsidyRate = parseFloat(policy.value.replace('%', '')) / 100;
      totalIncentives += investmentSize * subsidyRate;
    } else if (policy.type === "tax_incentive" && policy.value) {
      const taxSaving = parseFloat(policy.value.replace('%', '')) / 100;
      totalIncentives += investmentSize * taxSaving * 0.3; // Assume 30% tax rate
    }
  }
  
  return totalIncentives;
}

function generatePolicyRecommendations(statePolicy: any, projectType: string, investmentSize: number): string[] {
  const recommendations = [];
  
  if (statePolicy.incentiveScore > 80) {
    recommendations.push("Excellent incentive framework - proceed with confidence");
  } else if (statePolicy.incentiveScore > 60) {
    recommendations.push("Good incentives available - consider timing with policy cycles");
  } else {
    recommendations.push("Limited incentives - focus on economic fundamentals");
  }
  
  if (statePolicy.regulatoryClarity < 60) {
    recommendations.push("Regulatory uncertainty - engage with state authorities early");
  }
  
  if (projectType === "production" && statePolicy.targetAmbition > 70) {
    recommendations.push("State has ambitious hydrogen targets - align with state goals");
  }
  
  if (investmentSize > 500 && statePolicy.jobCreationPotential > 50) {
    recommendations.push("Large project with high job creation - leverage for additional support");
  }
  
  return recommendations;
}
