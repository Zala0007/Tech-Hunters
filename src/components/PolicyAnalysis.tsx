import { useState } from "react";
// ...existing code...
// Additional imports for new features
// TypeScript interfaces for policy data
interface Policy {
  _id: string;
  state: string;
  overallScore: number;
  incentiveScore: number;
  regulatoryClarity: number;
  targetAmbition: number;
  sdgAlignment: {
    sdg7: string;
    sdg9: string;
    sdg13: string;
  };
  policies: Array<{
    name: string;
    description: string;
    type: string;
    value?: string;
    docLink?: string;
  }>;
  jobCreationPotential: number;
}

interface TopPolicyState {
  _id: string;
  state: string;
  policies: Array<any>;
  overallScore: number;
}

interface Comparison {
  averages: {
    incentiveScore: number;
    regulatoryClarity: number;
    targetAmbition: number;
    overallScore: number;
  };
  rankings: {
    byIncentive: Array<{ state: string }>;
    byClarity: Array<{ state: string }>;
    byAmbition: Array<{ state: string }>;
    overall: Array<{ state: string }>;
  };
  policies: Policy[];
}
import { useEffect } from "react";
// import { saveAs } from "file-saver"; // For export
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // For map integration
// import { Line } from "react-chartjs-2"; // For timeline/historical charts

export function PolicyAnalysis() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [compareStates, setCompareStates] = useState<string[]>([]);
  const [selectedPolicyType, setSelectedPolicyType] = useState<string>("");
  const [userNotes, setUserNotes] = useState<{ [state: string]: string }>({});
  const [userRatings, setUserRatings] = useState<{ [state: string]: number }>({});
  // Dummy/mock data for new features
  const policyData: Policy[] = [
    {
      _id: "1",
      state: "Gujarat",
      overallScore: 92,
      incentiveScore: 90,
      regulatoryClarity: 88,
      targetAmbition: 95,
      sdgAlignment: { sdg7: "A+", sdg9: "A", sdg13: "A" },
      policies: [
        { name: "Solar Subsidy", description: "State subsidy for solar installations.", type: "subsidy", value: "20%", docLink: "https://gujarat.gov.in/solar-policy" },
        { name: "Green Tax Incentive", description: "Tax incentives for green hydrogen.", type: "tax_incentive", value: "15%", docLink: "https://gujarat.gov.in/green-tax" },
        { name: "Hydrogen Regulation", description: "Clear regulatory framework for hydrogen.", type: "regulatory", docLink: "https://gujarat.gov.in/hydrogen-regulation" },
      ],
      jobCreationPotential: 120,
    },
    {
      _id: "2",
      state: "Karnataka",
      overallScore: 88,
      incentiveScore: 85,
      regulatoryClarity: 90,
      targetAmbition: 87,
      sdgAlignment: { sdg7: "A", sdg9: "A+", sdg13: "B+" },
      policies: [
        { name: "Wind Energy Subsidy", description: "Subsidy for wind energy projects.", type: "subsidy", value: "18%", docLink: "https://karnataka.gov.in/wind-policy" },
        { name: "Hydrogen Roadmap", description: "Ambitious hydrogen targets.", type: "regulatory", docLink: "https://karnataka.gov.in/hydrogen-roadmap" },
      ],
      jobCreationPotential: 100,
    },
  ];

  const topPolicyStates: TopPolicyState[] = [
    { _id: "1", state: "Gujarat", policies: [], overallScore: 92 },
    { _id: "2", state: "Karnataka", policies: [], overallScore: 88 },
    { _id: "3", state: "Tamil Nadu", policies: [], overallScore: 85 },
    { _id: "4", state: "Maharashtra", policies: [], overallScore: 83 },
  ];

  const comparison: Comparison | null = compareStates.length > 1 ? {
    averages: { incentiveScore: 87, regulatoryClarity: 89, targetAmbition: 91, overallScore: 89 },
    rankings: {
      byIncentive: [{ state: "Gujarat" }],
      byClarity: [{ state: "Karnataka" }],
      byAmbition: [{ state: "Tamil Nadu" }],
      overall: [{ state: "Maharashtra" }],
    },
    policies: policyData.filter(p => compareStates.includes(p.state)),
  } : null;

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
  <div className="p-6 bg-gradient-to-r from-[#5fa708] via-[#228B22] to-[#0b3d08] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Policy & Regulatory Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State Selection, Type Filter, Top Performers, Export */}
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
            {/* Policy Type Filter */}
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Filter by Policy Type</h4>
              <select
                value={selectedPolicyType}
                onChange={(e) => setSelectedPolicyType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Types</option>
                <option value="subsidy">Subsidy</option>
                <option value="tax_incentive">Tax Incentive</option>
                <option value="regulatory">Regulatory</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* Export Button */}
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition" onClick={() => {/* export logic */}}>Export Data</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🏆 Top Policy States</h3>
            <div className="space-y-3">
              {/* ...existing code for topPolicyStates... */}
            </div>
          </div>
        </div>

        {/* Policy Details */}
        <div className="lg:col-span-2">
          {selectedState && policyData && policyData.length > 0 ? (
            <div className="space-y-6">
              {/* Timeline Visualization */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Policy Timeline</h3>
                {/* Timeline chart or list here */}
                <div className="text-sm text-gray-500">(Timeline visualization placeholder)</div>
              </div>
              {/* Impact Analysis */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Impact Analysis</h3>
                {/* Impact metrics and charts here */}
                <div className="text-sm text-gray-500">(Impact analysis placeholder)</div>
              </div>
              {/* Policy Details with Type Filter, Document Links, Notes & Ratings */}
              {policyData
                .filter(policy => selectedPolicyType === "" || policy.policies.some(pol => pol.type === selectedPolicyType))
                .map((policy) => (
                  <div key={policy._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">{policy.state} Policy Framework</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{policy.overallScore.toFixed(0)}</div>
                        <div className="text-xs text-gray-500">Overall Score</div>
                        {/* User Rating */}
                        <div className="mt-2">
                          <span className="text-xs text-gray-600">Your Rating: </span>
                          <input type="number" min={1} max={5} value={userRatings[policy.state] || ""} onChange={e => setUserRatings(r => ({ ...r, [policy.state]: Number(e.target.value) }))} className="w-12 border rounded px-1" />
                        </div>
                      </div>
                    </div>
                    {/* Score Breakdown ...existing code... */}
                    {/* SDG Alignment ...existing code... */}
                    {/* Policies List with Document Links */}
                    <div>
                      <h4 className="font-medium mb-3">Key Policies ({policy.policies.length})</h4>
                      <div className="space-y-2">
                        {policy.policies
                          .filter(pol => selectedPolicyType === "" || pol.type === selectedPolicyType)
                          .slice(0, 5)
                          .map((pol, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-sm">{pol.name}</div>
                                <div className="text-xs text-gray-600">{pol.description}</div>
                                {/* Document Link */}
                                {pol.docLink && (
                                  <a href={pol.docLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">View Document</a>
                                )}
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
                    {/* User Notes */}
                    <div className="mt-4">
                      <textarea
                        className="w-full border rounded p-2 text-sm"
                        rows={2}
                        placeholder="Add your notes about this state's policy..."
                        value={userNotes[policy.state] || ""}
                        onChange={e => setUserNotes(n => ({ ...n, [policy.state]: e.target.value }))}
                      />
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
                {/* Policy Suggestion Engine */}
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Policy Suggestions</h4>
                  <div className="text-xs text-gray-600">(Best practices and recommendations placeholder)</div>
                </div>
                {/* Historical Comparison Chart */}
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Historical Comparison</h4>
                  <div className="text-xs text-gray-600">(Historical chart placeholder)</div>
                </div>
                {/* Interactive Map Integration */}
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Policy Coverage Map</h4>
                  <div className="text-xs text-gray-600">(Map integration placeholder)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
