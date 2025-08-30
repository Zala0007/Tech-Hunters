import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function RenewableAnalysis() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [minScore, setMinScore] = useState<number>(0);
  const [minLandArea, setMinLandArea] = useState<number>(0);

  const renewableSites = useQuery(api.renewables.getRenewablePotential, {
    state: selectedState || undefined,
    minScore: minScore || undefined,
    minLandArea: minLandArea || undefined,
    limit: 50,
  });

  const renewableStats = useQuery(api.renewables.getRenewableStats, {
    state: selectedState || undefined,
  });

  const bestSites = useQuery(api.renewables.getBestRenewableSites, {
    limit: 10,
    state: selectedState || undefined,
  });

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
        <h2 className="text-2xl font-bold text-gray-900">Renewable Energy Analysis</h2>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🌞</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sites</p>
              <p className="text-2xl font-bold text-gray-900">{renewableStats?.totalSites || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">☀️</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Solar Potential</p>
              <p className="text-2xl font-bold text-gray-900">
                {renewableStats ? (renewableStats.totalSolarPotential / 1000).toFixed(0) : 0}k MW
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💨</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Wind Potential</p>
              <p className="text-2xl font-bold text-gray-900">
                {renewableStats ? (renewableStats.totalWindPotential / 1000).toFixed(0) : 0}k MW
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🏞️</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Land Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {renewableStats ? renewableStats.totalLandAvailable.toFixed(0) : 0} km²
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters and Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Overall Score: {minScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Land Area: {minLandArea} km²
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={minLandArea}
                  onChange={(e) => setMinLandArea(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Average Scores */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Average Scores</h3>
            {renewableStats && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Solar</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${renewableStats.averageScores.solar}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{renewableStats.averageScores.solar.toFixed(0)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Wind</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${renewableStats.averageScores.wind}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{renewableStats.averageScores.wind.toFixed(0)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grid</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${renewableStats.averageScores.grid}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{renewableStats.averageScores.grid.toFixed(0)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Water</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${renewableStats.averageScores.water}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{renewableStats.averageScores.water.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Best Sites */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🏆 Top Sites</h3>
            <div className="space-y-3">
              {bestSites?.slice(0, 8).map((site, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{site.location.district}</div>
                    <div className="text-xs text-gray-600">{site.location.state}</div>
                    <div className="text-xs text-gray-500">
                      H₂: {site.hydrogenPotential?.toFixed(0) || 0} t/yr
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{site.overallScore.toFixed(0)}</div>
                    <div className="text-xs text-gray-600">
                      ₹{site.lcoh?.toFixed(0) || 0}/kg
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-2xl mb-2">🌞</div>
                  <p className="text-sm">No sites available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sites List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Renewable Energy Sites</h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing {renewableSites?.length || 0} sites
              </p>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {renewableSites?.map((site, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{site.location.district}</h4>
                      <p className="text-sm text-gray-600">{site.location.state}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{site.overallScore.toFixed(0)}</div>
                      <div className="text-xs text-gray-500">Overall Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Solar Irradiance:</span>
                      <div className="font-medium">{site.solarIrradiance.toFixed(1)} kWh/m²/day</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Wind Speed:</span>
                      <div className="font-medium">{site.windSpeed.toFixed(1)} m/s</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Solar Potential:</span>
                      <div className="font-medium">{site.solarPotential.toFixed(0)} MW</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Wind Potential:</span>
                      <div className="font-medium">{site.windPotential.toFixed(0)} MW</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Land:</span>
                      <div className="font-medium">{site.landAvailability.toFixed(0)} km²</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Grid:</span>
                      <div className="font-medium">{site.gridConnectivity}/100</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Water:</span>
                      <div className="font-medium">{site.waterAvailability}/100</div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">🌞</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No renewable sites found</h3>
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
