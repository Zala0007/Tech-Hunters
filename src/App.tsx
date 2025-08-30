import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Dashboard } from "./components/Dashboard";
import { MapView } from "./components/MapView";
import { AssetManager } from "./components/AssetManager";
import { DemandAnalysis } from "./components/DemandAnalysis";
import { RenewableAnalysis } from "./components/RenewableAnalysis";
import { TransportAnalysis } from "./components/TransportAnalysis";
import { PolicyAnalysis } from "./components/PolicyAnalysis";
import { SiteRecommendations } from "./components/SiteRecommendations";
import { ScenarioPlanning } from "./components/ScenarioPlanning";
import { InvestmentCalculator } from "./components/InvestmentCalculator";
import { Toaster } from "sonner";

type TabType = 'dashboard' | 'map' | 'assets' | 'demand' | 'renewable' | 'transport' | 'policy' | 'recommendations' | 'scenarios' | 'investment';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <main className="min-h-screen bg-gray-50">
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-gray-200">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚡</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Green Hydrogen Infrastructure Platform
              </h1>
              <p className="text-gray-600">
                Advanced planning and analysis for India's hydrogen economy
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
      
      <Authenticated>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 shadow-lg">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <h1 className="text-lg font-bold text-white">GH2 Mapping</h1>
                  <p className="text-xs text-white">Infrastructure Planning</p>
                </div>
              </div>
            </div>
            
            <nav className="p-4">
              <div className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                  { id: 'map', label: 'Interactive Map', icon: '🗺' },
                  { id: 'assets', label: 'Asset Manager', icon: '🏭' },
                  { id: 'demand', label: 'Demand Analysis', icon: '📈' },
                  { id: 'renewable', label: 'Renewable Sites', icon: '🌞' },
                  { id: 'transport', label: 'Transport Network', icon: '🚛' },
                  { id: 'policy', label: 'Policy Analysis', icon: '📋' },
                  { id: 'recommendations', label: 'Site Recommendations', icon: '🎯' },
                  { id: 'scenarios', label: 'Scenario Planning', icon: '🔮' },
                  { id: 'investment', label: 'Investment Calculator', icon: '💰' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>
            
            <div className="absolute bottom-4 left-4 right-4">
              <SignOutButton />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'map' && <MapView />}
            {activeTab === 'assets' && <AssetManager />}
            {activeTab === 'demand' && <DemandAnalysis />}
            {activeTab === 'renewable' && <RenewableAnalysis />}
            {activeTab === 'transport' && <TransportAnalysis />}
            {activeTab === 'policy' && <PolicyAnalysis />}
            {activeTab === 'recommendations' && <SiteRecommendations />}
            {activeTab === 'scenarios' && <ScenarioPlanning />}
            {activeTab === 'investment' && <InvestmentCalculator />}
          </div>
        </div>
      </Authenticated>
      
      <Toaster position="top-right" />
    </main>
  );
}
