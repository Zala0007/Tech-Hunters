/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as dataSeeder from "../dataSeeder.js";
import type * as demandClusters from "../demandClusters.js";
import type * as environment from "../environment.js";
import type * as http from "../http.js";
import type * as hydrogenAssets from "../hydrogenAssets.js";
import type * as policies from "../policies.js";
import type * as recommendations from "../recommendations.js";
import type * as renewables from "../renewables.js";
import type * as router from "../router.js";
import type * as sampleData from "../sampleData.js";
import type * as scenarios from "../scenarios.js";
import type * as transport from "../transport.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  dataSeeder: typeof dataSeeder;
  demandClusters: typeof demandClusters;
  environment: typeof environment;
  http: typeof http;
  hydrogenAssets: typeof hydrogenAssets;
  policies: typeof policies;
  recommendations: typeof recommendations;
  renewables: typeof renewables;
  router: typeof router;
  sampleData: typeof sampleData;
  scenarios: typeof scenarios;
  transport: typeof transport;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
