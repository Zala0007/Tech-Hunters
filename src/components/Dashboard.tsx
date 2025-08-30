import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Dashboard() {
  const user = useQuery(api.auth.loggedInUser);
  const assetStats = useQuery(api.hydrogenAssets.getAssetStats);
  const demandStats = useQuery(api.demandClusters.getDemandStats);
  const renewableStats = useQuery(api.renewables.getRenewableStats, {});
  const topRecommendations = useQuery(api.recommendations.getTopRecommendations, { limit: 5 });

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
            <button className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">🎯</span>
                <span className="text-sm font-medium">Generate Site Recommendations</span>
              </div>
              <span className="text-blue-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">🔮</span>
                <span className="text-sm font-medium">Create New Scenario</span>
              </div>
              <span className="text-green-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">📊</span>
                <span className="text-sm font-medium">View Analytics</span>
              </div>
              <span className="text-purple-600">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
