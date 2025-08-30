import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { SiteRecommendations } from "./SiteRecommendations";
import { ScenarioPlanning } from "./ScenarioPlanning";
import { DemandAnalysis } from "./DemandAnalysis";

export function Dashboard() {
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [showSiteRecommendations, setShowSiteRecommendations] = useState(false);
  const [showScenarioPlanning, setShowScenarioPlanning] = useState(false);
  const [showDemandAnalysis, setShowDemandAnalysis] = useState(false);
  const [recommendationForm, setRecommendationForm] = useState({
    weights: {
      renewable: 30,
      demand: 25,
      transport: 25,
      environmental: 20,
    },
    minLandArea: 10,
    maxResults: 10,
    targetState: "",
  });

  const user = useQuery(api.auth.loggedInUser);
  const assetStats = useQuery(api.hydrogenAssets.getAssetStats);
  const demandStats = useQuery(api.demandClusters.getDemandStats);
  const renewableStats = useQuery(api.renewables.getRenewableStats, {});
  const topRecommendations = useQuery(api.recommendations.getTopRecommendations, { limit: 5 });
  const generateRecommendations = useAction(api.recommendations.generateRecommendations);

  const handleGenerateRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await generateRecommendations(recommendationForm);
      toast.success("Site recommendations generated successfully");
      setShowGenerateForm(false);
    } catch (error) {
      toast.error("Failed to generate recommendations");
    }
  };

  const weightsTotal = recommendationForm.weights.renewable + 
                     recommendationForm.weights.demand + 
                     recommendationForm.weights.transport + 
                     recommendationForm.weights.environmental;

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  // If showing site recommendations, render that component instead
  if (showSiteRecommendations) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowSiteRecommendations(false)}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
          >
            <span className="mr-2 text-lg">←</span>
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
        <SiteRecommendations />
      </div>
    );
  }

  // If showing scenario planning, render that component instead
  if (showScenarioPlanning) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowScenarioPlanning(false)}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
          >
            <span className="mr-2 text-lg">←</span>
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
        <ScenarioPlanning />
      </div>
    );
  }

  // If showing demand analysis, render that component instead
  if (showDemandAnalysis) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowDemandAnalysis(false)}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
          >
            <span className="mr-2 text-lg">←</span>
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
        <DemandAnalysis />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of India's hydrogen infrastructure landscape
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🏭</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">{assetStats?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">⚡</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {assetStats?.totalCapacity?.toFixed(0) || 0} MW
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📈</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Demand Clusters</p>
              <p className="text-2xl font-bold text-gray-900">{demandStats?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🌞</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Renewable Sites</p>
              <p className="text-2xl font-bold text-gray-900">{renewableStats?.totalSites || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Asset Distribution</h3>
          {assetStats && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Production Plants</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(assetStats.byType.plant / assetStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{assetStats.byType.plant}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Storage Facilities</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(assetStats.byType.storage / assetStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{assetStats.byType.storage}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pipelines</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${(assetStats.byType.pipeline / assetStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{assetStats.byType.pipeline}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Refueling Stations</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(assetStats.byType.refueling / assetStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{assetStats.byType.refueling}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demand Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Demand Overview</h3>
          {demandStats && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Current Demand</span>
                  <span className="font-medium">
                    {(demandStats.totalDemand.current / 1000).toFixed(0)}k tonnes/year
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Projected 2030</span>
                  <span className="font-medium">
                    {(demandStats.totalDemand.projected2030 / 1000).toFixed(0)}k tonnes/year
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Projected 2050</span>
                  <span className="font-medium">
                    {(demandStats.totalDemand.projected2050 / 1000).toFixed(0)}k tonnes/year
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Recommendations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Site Recommendations</h3>
          <div className="space-y-3">
            {topRecommendations?.map((rec, index) => (
              <div key={rec._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{rec.location.district}, {rec.location.state}</div>
                  <div className="text-xs text-gray-600">
                    Score: {rec.scores.overall.toFixed(1)} | LCOH: ₹{rec.lcoh.toFixed(0)}/kg
                  </div>
                </div>
                <div className="text-lg">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                </div>
              </div>
            )) || (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm">No recommendations yet</p>
                </div>
              )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              onClick={() => setShowSiteRecommendations(true)}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🎯</span>
                <span className="text-sm font-medium">Generate Site Recommendations</span>
              </div>
              <span className="text-blue-600">→</span>
            </button>
            <button 
              className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              onClick={() => setShowScenarioPlanning(true)}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🔮</span>
                <span className="text-sm font-medium">Create New Scenario</span>
              </div>
              <span className="text-green-600">→</span>
            </button>
            <button 
              className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              onClick={() => setShowDemandAnalysis(true)}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">📊</span>
                <span className="text-sm font-medium">View Analytics</span>
              </div>
              <span className="text-purple-600">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generate Recommendations Modal */}
      {showGenerateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Generate Site Recommendations</h3>
            <form onSubmit={handleGenerateRecommendations} className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Scoring Weights</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renewable Energy ({recommendationForm.weights.renewable}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={recommendationForm.weights.renewable}
                      onChange={(e) => setRecommendationForm(prev => ({
                        ...prev,
                        weights: { ...prev.weights, renewable: Number(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Demand Proximity ({recommendationForm.weights.demand}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={recommendationForm.weights.demand}
                      onChange={(e) => setRecommendationForm(prev => ({
                        ...prev,
                        weights: { ...prev.weights, demand: Number(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transport Access ({recommendationForm.weights.transport}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={recommendationForm.weights.transport}
                      onChange={(e) => setRecommendationForm(prev => ({
                        ...prev,
                        weights: { ...prev.weights, transport: Number(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Environmental ({recommendationForm.weights.environmental}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={recommendationForm.weights.environmental}
                      onChange={(e) => setRecommendationForm(prev => ({
                        ...prev,
                        weights: { ...prev.weights, environmental: Number(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="text-sm mt-2">
                  <span className={`font-medium ${weightsTotal === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    Total: {weightsTotal}%
                  </span>
                  {weightsTotal !== 100 && (
                    <span className="text-red-600 ml-2">Weights should total 100%</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Land Area: {recommendationForm.minLandArea} km²
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="1000"
                    value={recommendationForm.minLandArea}
                    onChange={(e) => setRecommendationForm(prev => ({
                      ...prev,
                      minLandArea: Number(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Results: {recommendationForm.maxResults}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={recommendationForm.maxResults}
                    onChange={(e) => setRecommendationForm(prev => ({
                      ...prev,
                      maxResults: Number(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
                <select
                  value={recommendationForm.targetState}
                  onChange={(e) => setRecommendationForm(prev => ({
                    ...prev,
                    targetState: e.target.value
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All States</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowGenerateForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={weightsTotal !== 100}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Generate Recommendations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
