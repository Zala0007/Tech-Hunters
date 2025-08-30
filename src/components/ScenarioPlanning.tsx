import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ScenarioPlanning() {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'compare' | 'sensitivity'>('scenarios');
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const userScenarios = useQuery(api.scenarios.getUserScenarios, { limit: 20 });
  const publicScenarios = useQuery(api.scenarios.getPublicScenarios, { limit: 10 });
  const createScenario = useMutation(api.scenarios.createScenario);
  const deleteScenario = useMutation(api.scenarios.deleteScenario);
  
  const comparison = selectedScenarios.length > 1 ? 
    useQuery(api.scenarios.compareScenarios, { scenarioIds: selectedScenarios as any }) : null;

  const [scenarioForm, setScenarioForm] = useState({
    name: "",
    description: "",
    parameters: {
      demandGrowth: 15, // % per year
      subsidyLevel: 25, // % of CAPEX
      carbonPrice: 50, // $/tonne CO2
      renewableMix: {
        solar: 60,
        wind: 35,
        other: 5,
      },
      technologyCost: {
        electrolyzer: 800, // $/kW
        storage: 500, // $/kg
        transport: 2, // $/km
      },
    },
    isPublic: false,
  });

  const handleCreateScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createScenario(scenarioForm);
      toast.success("Scenario created successfully");
      setShowCreateForm(false);
      setScenarioForm({
        name: "",
        description: "",
        parameters: {
          demandGrowth: 15,
          subsidyLevel: 25,
          carbonPrice: 50,
          renewableMix: { solar: 60, wind: 35, other: 5 },
          technologyCost: { electrolyzer: 800, storage: 500, transport: 2 },
        },
        isPublic: false,
      });
    } catch (error) {
      toast.error("Failed to create scenario");
    }
  };

  const handleDeleteScenario = async (id: string) => {
    if (confirm("Are you sure you want to delete this scenario?")) {
      try {
        await deleteScenario({ id: id as any });
        toast.success("Scenario deleted successfully");
      } catch (error) {
        toast.error("Failed to delete scenario");
      }
    }
  };

  const handleScenarioSelect = (id: string) => {
    setSelectedScenarios(prev => 
      prev.includes(id) 
        ? prev.filter(scenarioId => scenarioId !== id)
        : [...prev, id]
    );
  };

  const renewableMixTotal = scenarioForm.parameters.renewableMix.solar + 
                           scenarioForm.parameters.renewableMix.wind + 
                           scenarioForm.parameters.renewableMix.other;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Scenario Planning & Analysis</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Scenario
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'scenarios', label: 'My Scenarios', icon: '📋' },
          { id: 'compare', label: 'Compare', icon: '⚖️' },
          { id: 'sensitivity', label: 'Sensitivity', icon: '📈' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Scenarios */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">📋 Your Scenarios</h3>
            {userScenarios && userScenarios.length > 0 ? (
              <div className="space-y-4">
                {userScenarios.map((scenario) => (
                  <div key={scenario._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedScenarios.includes(scenario._id)}
                          onChange={() => handleScenarioSelect(scenario._id)}
                          className="mr-3"
                        />
                        <div>
                          <h4 className="font-medium">{scenario.name}</h4>
                          {scenario.description && (
                            <p className="text-sm text-gray-600">{scenario.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {scenario.isPublic && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            Public
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteScenario(scenario._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Capacity: </span>
                        <span className="font-medium">{scenario.results.totalCapacity.toFixed(0)} MW</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Investment: </span>
                        <span className="font-medium">${scenario.results.totalInvestment.toFixed(0)}M</span>
                      </div>
                      <div>
                        <span className="text-gray-600">LCOH: </span>
                        <span className="font-medium">₹{scenario.results.averageLcoh.toFixed(0)}/kg</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Jobs Created: </span>
                        <span className="font-medium">{scenario.results.jobsCreated.toFixed(0)}</span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Created: {new Date(scenario.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>No scenarios yet. Create your first scenario!</p>
              </div>
            )}
          </div>

          {/* Public Scenarios */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🌐 Public Scenarios</h3>
            <div className="space-y-4">
              {publicScenarios?.map((scenario) => (
                <div key={scenario._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{scenario.name}</h4>
                      {scenario.description && (
                        <p className="text-sm text-gray-600">{scenario.description}</p>
                      )}
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      Public
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Capacity: </span>
                      <span className="font-medium">{scenario.results.totalCapacity.toFixed(0)} MW</span>
                    </div>
                    <div>
                      <span className="text-gray-600">LCOH: </span>
                      <span className="font-medium">₹{scenario.results.averageLcoh.toFixed(0)}/kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compare Tab */}
      {activeTab === 'compare' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">⚖️ Scenario Comparison</h3>
          
          {selectedScenarios.length < 2 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>Select at least 2 scenarios from "My Scenarios" tab to compare</p>
              <p className="text-sm mt-2">Selected: {selectedScenarios.length} scenarios</p>
            </div>
          ) : comparison ? (
            <div className="space-y-6">
              {/* Comparison Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Average Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Capacity:</span>
                      <span className="font-medium">{comparison.averages.totalCapacity.toFixed(0)} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment:</span>
                      <span className="font-medium">${comparison.averages.totalInvestment.toFixed(0)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LCOH:</span>
                      <span className="font-medium">₹{comparison.averages.averageLcoh.toFixed(0)}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CO₂ Reduction:</span>
                      <span className="font-medium">{comparison.averages.co2Reduction.toFixed(0)}M t/yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jobs Created:</span>
                      <span className="font-medium">{comparison.averages.jobsCreated.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Best Performers</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Highest Capacity: </span>
                      <span className="font-medium">{comparison.bestPerformers.capacity.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lowest Investment: </span>
                      <span className="font-medium">{comparison.bestPerformers.investment.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lowest LCOH: </span>
                      <span className="font-medium">{comparison.bestPerformers.lcoh.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Most CO₂ Reduction: </span>
                      <span className="font-medium">{comparison.bestPerformers.co2.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Most Jobs: </span>
                      <span className="font-medium">{comparison.bestPerformers.jobs.name}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Selected Scenarios</h4>
                  <div className="space-y-1 text-sm">
                    {comparison.scenarios.map((scenario, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="truncate">{scenario.name}</span>
                        <span className="font-medium">{scenario.results.averageLcoh.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Comparison Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scenario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity (MW)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment ($M)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LCOH (₹/kg)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO₂ Reduction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comparison.scenarios.map((scenario) => (
                      <tr key={scenario._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {scenario.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {scenario.results.totalCapacity.toFixed(0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {scenario.results.totalInvestment.toFixed(0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {scenario.results.averageLcoh.toFixed(0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {scenario.results.co2Reduction.toFixed(1)}M t/yr
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {scenario.results.jobsCreated.toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Sensitivity Tab */}
      {activeTab === 'sensitivity' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📈 Sensitivity Analysis</h3>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔬</div>
            <p>Sensitivity analysis feature coming soon!</p>
            <p className="text-sm mt-2">This will show how changes in key parameters affect scenario outcomes.</p>
          </div>
        </div>
      )}

      {/* Create Scenario Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create New Scenario</h3>
            <form onSubmit={handleCreateScenario} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Scenario Name"
                  value={scenarioForm.name}
                  onChange={(e) => setScenarioForm(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={scenarioForm.description}
                  onChange={(e) => setScenarioForm(prev => ({ ...prev, description: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Economic Parameters</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Demand Growth (% per year): {scenarioForm.parameters.demandGrowth}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={scenarioForm.parameters.demandGrowth}
                        onChange={(e) => setScenarioForm(prev => ({
                          ...prev,
                          parameters: { ...prev.parameters, demandGrowth: Number(e.target.value) }
                        }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subsidy Level (% of CAPEX): {scenarioForm.parameters.subsidyLevel}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scenarioForm.parameters.subsidyLevel}
                        onChange={(e) => setScenarioForm(prev => ({
                          ...prev,
                          parameters: { ...prev.parameters, subsidyLevel: Number(e.target.value) }
                        }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Carbon Price ($/tonne): ${scenarioForm.parameters.carbonPrice}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={scenarioForm.parameters.carbonPrice}
                        onChange={(e) => setScenarioForm(prev => ({
                          ...prev,
                          parameters: { ...prev.parameters, carbonPrice: Number(e.target.value) }
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Renewable Mix</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Solar (%): {scenarioForm.parameters.renewableMix.solar}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scenarioForm.parameters.renewableMix.solar}
                        onChange={(e) => setScenarioForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            renewableMix: { ...prev.parameters.renewableMix, solar: Number(e.target.value) }
                          }
                        }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Wind (%): {scenarioForm.parameters.renewableMix.wind}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scenarioForm.parameters.renewableMix.wind}
                        onChange={(e) => setScenarioForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            renewableMix: { ...prev.parameters.renewableMix, wind: Number(e.target.value) }
                          }
                        }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other (%): {scenarioForm.parameters.renewableMix.other}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scenarioForm.parameters.renewableMix.other}
                        onChange={(e) => setScenarioForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            renewableMix: { ...prev.parameters.renewableMix, other: Number(e.target.value) }
                          }
                        }))}
                        className="w-full"
                      />
                    </div>
                    <div className="text-sm">
                      <span className={`font-medium ${renewableMixTotal === 100 ? 'text-green-600' : 'text-red-600'}`}>
                        Total: {renewableMixTotal}%
                      </span>
                      {renewableMixTotal !== 100 && (
                        <span className="text-red-600 ml-2">Must total 100%</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Technology Costs</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Electrolyzer ($/kW): ${scenarioForm.parameters.technologyCost.electrolyzer}
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="2000"
                        value={scenarioForm.parameters.technologyCost.electrolyzer}
                        onChange={(e) => setScenarioForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            technologyCost: { ...prev.parameters.technologyCost, electrolyzer: Number(e.target.value) }
                          }
                        }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Storage ($/kg): ${scenarioForm.parameters.technologyCost.storage}
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="1000"
                        value={scenarioForm.parameters.technologyCost.storage}
                        onChange={(e) => setScenarioForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            technologyCost: { ...prev.parameters.technologyCost, storage: Number(e.target.value) }
                          }
                        }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transport ($/km): ${scenarioForm.parameters.technologyCost.transport}
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.1"
                        value={scenarioForm.parameters.technologyCost.transport}
                        onChange={(e) => setScenarioForm(prev => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            technologyCost: { ...prev.parameters.technologyCost, transport: Number(e.target.value) }
                          }
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={scenarioForm.isPublic}
                  onChange={(e) => setScenarioForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Make this scenario public</label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renewableMixTotal !== 100}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Create Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
