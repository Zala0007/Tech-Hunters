import { useState } from "react";
import {
  transportInfraData,
  transportStatsData,
  strategicCorridorsData
} from "../lib/transportData";

export function TransportAnalysis() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");

  // Filter infrastructure data by selected type and state
  const transportInfra = transportInfraData.filter(
    infra =>
      (selectedType === "" || infra.type === selectedType) &&
      (selectedState === "" || infra.location.state === selectedState)
  );

  // Filter stats by selection
  const filteredStats = {
    total: transportInfra.length,
    averageConnectivity:
      transportInfra.length > 0
        ? transportInfra.reduce((sum, infra) => sum + infra.connectivity, 0) / transportInfra.length
        : 0,
    strategicAssets: transportInfra.filter(infra => infra.strategicImportance > 85).length,
    totalCapacity: transportInfra.reduce((sum, infra) => sum + infra.capacity, 0),
    byType: {
      highway: transportInfra.filter(infra => infra.type === "highway").length,
      railway: transportInfra.filter(infra => infra.type === "railway").length,
      port: transportInfra.filter(infra => infra.type === "port").length,
      airport: transportInfra.filter(infra => infra.type === "airport").length,
      pipeline: transportInfra.filter(infra => infra.type === "pipeline").length,
    },
  };

  // Strategic corridors (static for now)
  const strategicCorridors = strategicCorridorsData;

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-[#5fa708] via-[#228B22] to-[#0b3d08]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transport Infrastructure Analysis</h2>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🚛</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Infrastructure</p>
              <p className="text-2xl font-bold text-gray-900">{filteredStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📊</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Connectivity</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStats.averageConnectivity.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">⭐</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Strategic Assets</p>
              <p className="text-2xl font-bold text-gray-900">{filteredStats.strategicAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🏗️</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {(filteredStats.totalCapacity / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters and Distribution */}
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
                <option value="highway">Highway</option>
                <option value="railway">Railway</option>
                <option value="port">Port</option>
                <option value="airport">Airport</option>
                <option value="pipeline">Pipeline</option>
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
            </div>
          </div>

          {/* Infrastructure Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Infrastructure by Type</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🛣️ Highways</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${filteredStats.total > 0 ? (filteredStats.byType.highway / filteredStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{filteredStats.byType.highway}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🚂 Railways</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${filteredStats.total > 0 ? (filteredStats.byType.railway / filteredStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{filteredStats.byType.railway}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🚢 Ports</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${filteredStats.total > 0 ? (filteredStats.byType.port / filteredStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{filteredStats.byType.port}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">✈️ Airports</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${filteredStats.total > 0 ? (filteredStats.byType.airport / filteredStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{filteredStats.byType.airport}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🔧 Pipelines</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${filteredStats.total > 0 ? (filteredStats.byType.pipeline / filteredStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{filteredStats.byType.pipeline}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Corridors */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🌟 Strategic Corridors</h3>
            <div className="space-y-4">
              {strategicCorridors && (
                <>
                  {strategicCorridors.highways.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">🛣️ Highways</h4>
                      <div className="space-y-1">
                        {strategicCorridors.highways.slice(0, 3).map((highway, index) => (
                          <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                            <div className="font-medium">{highway.name}</div>
                            <div className="text-xs text-gray-600">
                              Importance: {highway.strategicImportance}/100
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {strategicCorridors.railways.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">🚂 Railways</h4>
                      <div className="space-y-1">
                        {strategicCorridors.railways.slice(0, 3).map((railway, index) => (
                          <div key={index} className="text-sm bg-green-50 p-2 rounded">
                            <div className="font-medium">{railway.name}</div>
                            <div className="text-xs text-gray-600">
                              Importance: {railway.strategicImportance}/100
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {strategicCorridors.ports.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">🚢 Ports</h4>
                      <div className="space-y-1">
                        {strategicCorridors.ports.slice(0, 3).map((port, index) => (
                          <div key={index} className="text-sm bg-yellow-50 p-2 rounded">
                            <div className="font-medium">{port.name}</div>
                            <div className="text-xs text-gray-600">
                              Importance: {port.strategicImportance}/100
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Infrastructure List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Transport Infrastructure</h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing {transportInfra?.length || 0} infrastructure assets
              </p>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {transportInfra?.map((infra) => (
                <div key={infra._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{infra.name}</h4>
                      <p className="text-sm text-gray-600">{infra.location.state}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        infra.type === 'highway' ? 'bg-blue-100 text-blue-800' :
                        infra.type === 'railway' ? 'bg-green-100 text-green-800' :
                        infra.type === 'port' ? 'bg-yellow-100 text-yellow-800' :
                        infra.type === 'airport' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {infra.type}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    {infra.capacity && (
                      <div>
                        <span className="text-gray-600">Capacity:</span>
                        <div className="font-medium">{(infra.capacity / 1000000).toFixed(1)}M units</div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Connectivity:</span>
                      <div className="font-medium">{infra.connectivity}/100</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Strategic Importance:</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${infra.strategicImportance}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{infra.strategicImportance}/100</span>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">🚛</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No transport infrastructure found</h3>
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
