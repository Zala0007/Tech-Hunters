import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Sample data initialization endpoint
http.route({
  path: "/init-sample-data",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const result = await ctx.runMutation(api.sampleData.addSampleData, {});
      return new Response(JSON.stringify({ success: true, message: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: String(error) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
