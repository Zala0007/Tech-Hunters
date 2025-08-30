import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function DemandAnalysis() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");

  const demandClusters = useQuery(api.demandClusters.getDemandClusters, {
    type: selectedType as any || undefined,
    state: selectedState || undefined,
    priority: selectedPriority as any || undefined,
  });

  const demandStats = useQuery(api.demandClusters.getDemandStats);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hydrogen Demand Analysis</h2>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📈</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clusters</p>
              <p className="text-2xl font-bold text-gray-900">{demandStats?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🏭</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Current Demand</p>
              <p className="text-2xl font-bold text-gray-900">
                {demandStats ? (demandStats.totalDemand.current / 1000).toFixed(0) : 0}k t/yr
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🎯</div>
            <div>
              <p className="text-sm font-medium text-gray-600">2030 Projection</p>
              <p className="text-2xl font-bold text-gray-900">
                {demandStats ? (demandStats.totalDemand.projected2030 / 1000).toFixed(0) : 0}k t/yr
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🚀</div>
            <div>
              <p className="text-sm font-medium text-gray-600">2050 Projection</p>
              <p className="text-2xl font-bold text-gray-900">
                {demandStats ? (demandStats.totalDemand.projected2050 / 1000).toFixed(0) : 0}k t/yr
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and Controls */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="industrial">Industrial</option>
                <option value="transport">Transport</option>
                <option value="residential">Residential</option>
                <option value="export">Export</option>
              </select>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All States</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Demand Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Demand by Type</h3>
            {demandStats && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Industrial</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(demandStats.byType.industrial / demandStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{demandStats.byType.industrial}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transport</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(demandStats.byType.transport / demandStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{demandStats.byType.transport}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Residential</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${(demandStats.byType.residential / demandStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{demandStats.byType.residential}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Export</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(demandStats.byType.export / demandStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{demandStats.byType.export}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Demand Clusters List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Demand Clusters</h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing {demandClusters?.length || 0} clusters
              </p>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {demandClusters?.map((cluster) => (
                <div key={cluster._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{cluster.name}</h4>
                      <p className="text-sm text-gray-600">{cluster.location.district}, {cluster.location.state}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cluster.type === 'industrial' ? 'bg-blue-100 text-blue-800' :
                        cluster.type === 'transport' ? 'bg-green-100 text-green-800' :
                        cluster.type === 'residential' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {cluster.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cluster.priority === 'high' ? 'bg-red-100 text-red-800' :
                        cluster.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cluster.priority} priority
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current:</span>
                      <div className="font-medium">{(cluster.currentDemand / 1000).toFixed(1)}k t/yr</div>
                    </div>
                    <div>
                      <span className="text-gray-600">2030:</span>
                      <div className="font-medium">{(cluster.projectedDemand2030 / 1000).toFixed(1)}k t/yr</div>
                    </div>
                    <div>
                      <span className="text-gray-600">2050:</span>
                      <div className="font-medium">{(cluster.projectedDemand2050 / 1000).toFixed(1)}k t/yr</div>
                    </div>
                  </div>

                  {cluster.industries.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm text-gray-600">Industries: </span>
                      <span className="text-sm font-medium">{cluster.industries.join(", ")}</span>
                    </div>
                  )}

                  <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-600">Transport Connectivity:</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${cluster.transportConnectivity}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{cluster.transportConnectivity}</span>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No demand clusters found</h3>
                  <p className="text-gray-600">Try adjusting your filters or load sample data.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
