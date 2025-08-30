import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function SiteRecommendations() {
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);

  const userRecommendations = useQuery(api.recommendations.getUserRecommendations, { limit: 20 });
  const topRecommendations = useQuery(api.recommendations.getTopRecommendations, { limit: 10 });
  const generateRecommendations = useAction(api.recommendations.generateRecommendations);
  
  const comparison = selectedRecommendations.length > 1 ? 
    useQuery(api.recommendations.compareRecommendations, { recommendationIds: selectedRecommendations as any }) : null;

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

  const handleRecommendationSelect = (id: string) => {
    setSelectedRecommendations(prev => 
      prev.includes(id) 
        ? prev.filter(recId => recId !== id)
        : [...prev, id]
    );
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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-[#5fa708] via-[#228B22] to-[#0b3d08]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Site Recommendations</h2>
        <button
          onClick={() => setShowGenerateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate New Recommendations
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your Recommendations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">🎯 Your Recommendations</h3>
            {userRecommendations && userRecommendations.length > 0 ? (
              <div className="space-y-4">
                {userRecommendations.map((rec) => (
                  <div key={rec._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRecommendations.includes(rec._id)}
                          onChange={() => handleRecommendationSelect(rec._id)}
                          className="mr-3"
                        />
                        <div>
                          <h4 className="font-medium">{rec.location.district}, {rec.location.state}</h4>
                          <p className="text-sm text-gray-600">{rec.location.address}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{rec.scores.overall.toFixed(1)}</div>
                        <div className="text-xs text-gray-500">Overall Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Renewable:</span>
                        <div className="font-medium">{rec.scores.renewable.toFixed(0)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Demand:</span>
                        <div className="font-medium">{rec.scores.demand.toFixed(0)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Transport:</span>
                        <div className="font-medium">{rec.scores.transport.toFixed(0)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Environmental:</span>
                        <div className="font-medium">{rec.scores.environmental.toFixed(0)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Capacity:</span>
                        <div className="font-medium">{rec.estimatedCapacity} MW</div>
                      </div>
                      <div>
                        <span className="text-gray-600">LCOH:</span>
                        <div className="font-medium">₹{rec.lcoh.toFixed(0)}/kg</div>
                      </div>
                      <div>
                        <span className="text-gray-600">CAPEX:</span>
                        <div className="font-medium">${rec.capex}M</div>
                      </div>
                      <div>
                        <span className="text-gray-600">CO₂ Avoided:</span>
                        <div className="font-medium">{(rec.co2Avoided / 1000).toFixed(0)}k t/yr</div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Generated: {new Date(rec.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎯</div>
                <p>No recommendations yet. Generate your first set!</p>
              </div>
            )}
          </div>

          {/* Comparison Results */}
          {comparison && selectedRecommendations.length > 1 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">⚖️ Site Comparison</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium mb-3">Average Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Score:</span>
                      <span className="font-medium">{comparison.averages.overall.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LCOH:</span>
                      <span className="font-medium">₹{comparison.averages.lcoh.toFixed(0)}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CAPEX:</span>
                      <span className="font-medium">${comparison.averages.capex.toFixed(0)}M</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Best Performers</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Highest Score: </span>
                      <span className="font-medium">{comparison.bestPerformers.overall.location.district}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lowest LCOH: </span>
                      <span className="font-medium">{comparison.bestPerformers.lcoh.location.district}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Best Renewable: </span>
                      <span className="font-medium">{comparison.bestPerformers.renewable.location.district}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LCOH (₹/kg)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAPEX ($M)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity (MW)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comparison.recommendations.map((rec) => (
                      <tr key={rec._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rec.location.district}, {rec.location.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rec.scores.overall.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{rec.lcoh.toFixed(0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${rec.capex}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rec.estimatedCapacity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Top Global Recommendations */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🌟 Top Global Sites</h3>
            <div className="space-y-3">
              {topRecommendations?.map((rec, index) => (
                <div key={rec._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{rec.location.district}</div>
                    <div className="text-xs text-gray-600">{rec.location.state}</div>
                    <div className="text-xs text-gray-500">
                      ₹{rec.lcoh.toFixed(0)}/kg | {rec.estimatedCapacity}MW
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                    </div>
                    <div className="text-sm font-medium">{rec.scores.overall.toFixed(1)}</div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm">No global recommendations</p>
                </div>
              )}
            </div>
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