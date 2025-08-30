import { useState } from "react";

export function InvestmentCalculator() {
  const [projectData, setProjectData] = useState({
    projectType: "Production Plant",
    initialInvestment: 10000000,
    operatingCosts: 500000,
    expectedRevenue: 2000000,
    projectLifespan: 20
  });

  const calculateROI = () => {
    // Simple ROI calculation for demonstration
    const annualProfit = projectData.expectedRevenue - projectData.operatingCosts;
    const totalProfit = annualProfit * projectData.projectLifespan;
    const roi = ((totalProfit - projectData.initialInvestment) / projectData.initialInvestment) * 100;
    return roi;
  };

  const calculateNPV = () => {
    // Simplified NPV calculation with 8% discount rate
    const discountRate = 0.08;
    const annualCashFlow = projectData.expectedRevenue - projectData.operatingCosts;
    let npv = -projectData.initialInvestment;
    
    for (let year = 1; year <= projectData.projectLifespan; year++) {
      npv += annualCashFlow / Math.pow(1 + discountRate, year);
    }
    
    return npv;
  };

  const calculatePaybackPeriod = () => {
    const annualCashFlow = projectData.expectedRevenue - projectData.operatingCosts;
    return projectData.initialInvestment / annualCashFlow;
  };

  const npv = calculateNPV();
  const paybackPeriod = calculatePaybackPeriod();
  const roi = calculateROI();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Investment Calculator</h2>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Investment Analysis</h3>
          <p className="text-gray-600 mt-2">
            Analyze potential returns on hydrogen infrastructure investments.
          </p>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <select 
                  value={projectData.projectType}
                  onChange={(e) => setProjectData(prev => ({ ...prev, projectType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Production Plant</option>
                  <option>Storage Facility</option>
                  <option>Distribution Hub</option>
                  <option>Pipeline Segment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Investment: ${(projectData.initialInvestment / 1000000).toFixed(1)}M
                </label>
                <input 
                  type="range" 
                  min="1000000" 
                  max="500000000" 
                  step="1000000" 
                  value={projectData.initialInvestment}
                  onChange={(e) => setProjectData(prev => ({ ...prev, initialInvestment: Number(e.target.value) }))}
                  className="w-full mb-2" 
                />
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>$1M</span>
                  <span>$500M</span>
                </div>
                <input 
                  type="number" 
                  value={projectData.initialInvestment}
                  onChange={(e) => setProjectData(prev => ({ ...prev, initialInvestment: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operating Costs ($/year)</label>
                <input 
                  type="number" 
                  value={projectData.operatingCosts}
                  onChange={(e) => setProjectData(prev => ({ ...prev, operatingCosts: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Revenue ($/year)</label>
                <input 
                  type="number" 
                  value={projectData.expectedRevenue}
                  onChange={(e) => setProjectData(prev => ({ ...prev, expectedRevenue: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Lifespan (years)</label>
                <input 
                  type="number" 
                  min="5" 
                  max="50" 
                  value={projectData.projectLifespan}
                  onChange={(e) => setProjectData(prev => ({ ...prev, projectLifespan: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <button 
                onClick={calculateROI}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300"
              >
                Calculate ROI
              </button>
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Projected Returns</h3>
              
              {/* Chart Placeholder */}
              <div className="h-48 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <span className="text-gray-500">ROI Chart Visualization</span>
                  <div className="text-sm text-gray-400 mt-1">Coming Soon</div>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Net Present Value (NPV):</span>
                  <span className={`font-bold ${npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${npv >= 0 ? '+' : ''}${(npv / 1000000).toFixed(1)}M
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Return on Investment (ROI):</span>
                  <span className={`font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Payback Period:</span>
                  <span className="font-bold text-blue-600">
                    {paybackPeriod.toFixed(1)} years
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Annual Cash Flow:</span>
                  <span className="font-bold text-gray-800">
                    ${((projectData.expectedRevenue - projectData.operatingCosts) / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              {/* Investment Recommendation */}
              <div className="mt-6 p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-2">Investment Recommendation</h4>
                <p className="text-sm text-blue-700">
                  {npv > 0 && roi > 10 ? 
                    "✅ This investment shows strong potential with positive NPV and good ROI." :
                    npv > 0 ? 
                    "⚠️ Moderate investment potential. Consider market conditions." :
                    "❌ Investment may not be viable. Review parameters or explore alternatives."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
