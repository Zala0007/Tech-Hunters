import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function PolicyAnalysis() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [compareStates, setCompareStates] = useState<string[]>([]);

  const policyData = useQuery(api.policies.getPolicyData, {
    state: selectedState || undefined,
  });

  const topPolicyStates = useQuery(api.policies.getTopPolicyStates, { limit: 10 });

  const comparison = compareStates.length > 1 ? 
    useQuery(api.policies.comparePolicies, { states: compareStates }) : null;

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  const handleStateCompare = (state: string) => {
    setCompareStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : prev.length < 4 ? [...prev, state] : prev
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Policy & Regulatory Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State Selection and Top Performers */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Select State</h3>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a state</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🏆 Top Policy States</h3>
            <div className="space-y-3">
              {topPolicyStates?.map((state, index) => (
                <div key={state._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-lg mr-3">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{state.state}</div>
                      <div className="text-xs text-gray-600">
                        {state.policies.length} policies
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{state.overallScore.toFixed(0)}</div>
                    <div className="flex space-x-1 mt-1">
                      <input
                        type="checkbox"
                        checked={compareStates.includes(state.state)}
                        onChange={() => handleStateCompare(state.state)}
                        className="text-xs"
                      />
                      <span className="text-xs text-gray-500">Compare</span>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-2xl mb-2">📋</div>
                  <p className="text-sm">No policy data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Policy Details */}
        <div className="lg:col-span-2">
          {selectedState && policyData && policyData.length > 0 ? (
            <div className="space-y-6">
              {policyData.map((policy) => (
                <div key={policy._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{policy.state} Policy Framework</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{policy.overallScore.toFixed(0)}</div>
                      <div className="text-xs text-gray-500">Overall Score</div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Incentive Score</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${policy.incentiveScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{policy.incentiveScore}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Regulatory Clarity</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${policy.regulatoryClarity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{policy.regulatoryClarity}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Target Ambition</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${policy.targetAmbition}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{policy.targetAmbition}</span>
                      </div>
                    </div>
                  </div>

                  {/* SDG Alignment */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">SDG Alignment</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{policy.sdgAlignment.sdg7}</div>
                        <div className="text-xs text-gray-600">SDG 7: Clean Energy</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{policy.sdgAlignment.sdg9}</div>
                        <div className="text-xs text-gray-600">SDG 9: Infrastructure</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{policy.sdgAlignment.sdg13}</div>
                        <div className="text-xs text-gray-600">SDG 13: Climate Action</div>
                      </div>
                    </div>
                  </div>

                  {/* Policies List */}
                  <div>
                    <h4 className="font-medium mb-3">Key Policies ({policy.policies.length})</h4>
                    <div className="space-y-2">
                      {policy.policies.slice(0, 5).map((pol, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{pol.name}</div>
                            <div className="text-xs text-gray-600">{pol.description}</div>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              pol.type === 'subsidy' ? 'bg-green-100 text-green-800' :
                              pol.type === 'tax_incentive' ? 'bg-blue-100 text-blue-800' :
                              pol.type === 'regulatory' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {pol.type.replace('_', ' ')}
                            </span>
                            {pol.value && (
                              <span className="text-sm font-medium text-gray-700">{pol.value}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    Job Creation Potential: {policy.jobCreationPotential} jobs per million USD investment
                  </div>
                </div>
              ))}
            </div>
          ) : comparison && compareStates.length > 1 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">State Comparison</h3>
              
              {/* Comparison Overview */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium mb-3">Average Scores</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Incentive Score:</span>
                      <span className="font-medium">{comparison.averages.incentiveScore.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Regulatory Clarity:</span>
                      <span className="font-medium">{comparison.averages.regulatoryClarity.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Target Ambition:</span>
                      <span className="font-medium">{comparison.averages.targetAmbition.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Overall Score:</span>
                      <span className="font-medium">{comparison.averages.overallScore.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Best Performers</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Best Incentives: </span>
                      <span className="font-medium">{comparison.rankings.byIncentive[0]?.state}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Clearest Regulations: </span>
                      <span className="font-medium">{comparison.rankings.byClarity[0]?.state}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Most Ambitious: </span>
                      <span className="font-medium">{comparison.rankings.byAmbition[0]?.state}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Overall Leader: </span>
                      <span className="font-medium">{comparison.rankings.overall[0]?.state}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Comparison Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incentive</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clarity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ambition</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policies</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comparison.policies.map((policy) => (
                      <tr key={policy._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {policy.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {policy.incentiveScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {policy.regulatoryClarity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {policy.targetAmbition}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="font-medium">{policy.overallScore.toFixed(0)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {policy.policies.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Policy Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Select a state to view detailed policy information, or choose multiple states to compare their hydrogen policies.
                </p>
                <div className="text-sm text-gray-500">
                  {compareStates.length > 0 && (
                    <p>Selected for comparison: {compareStates.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
