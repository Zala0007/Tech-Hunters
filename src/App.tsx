import { useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
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
import { Toaster } from "sonner";
import { motion } from "framer-motion";

type TabType =
  | "dashboard"
  | "map"
  | "assets"
  | "demand"
  | "renewable"
  | "transport"
  | "policy"
  | "recommendations"
  | "scenarios";

// 🎈 Bubble component
const H2Bubbles = () => {
  const bubbles = Array.from({ length: 12 }); // number of bubbles

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: "100vh",
            x: Math.random() * window.innerWidth,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            y: "-10vh",
            opacity: [0, 1, 1, 0],
            x: [
              `${Math.random() * 100}vw`,
              `${Math.random() * 100}vw`,
            ], // drifting effect
            scale: [0.8, 1, 0.9],
          }}
          transition={{
            duration: 10 + Math.random() * 6,
            repeat: Infinity,
            delay: i * 1.2,
          }}
          className="absolute flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm border border-white/50 shadow-md text-blue-700 font-bold"
          style={{
            width: 60,
            height: 60,
            fontSize: "1.25rem",
          }}
        >
          H₂
        </motion.div>
      ))}
    </div>
  );
};

// 🌍 Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 text-center py-4 mt-auto">
    <p className="text-sm">
      © {new Date().getFullYear()} Green Hydrogen Infrastructure Platform. All rights reserved.
    </p>
  </footer>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Unauthenticated>
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-[#ADFF2F] to-[#228B22]  overflow-hidden">
          {/* H₂ Bubbles in background */}
          <H2Bubbles />

          <div className="border-2 border-gray-600 rounded-xl p-8 shadow-lg bg-transparent w-full max-w-md relative z-10">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">⚡</div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Green Hydrogen Infrastructure Platform
                </h1>
                <p className="text-white">
                  Advanced planning and analysis for India's hydrogen economy
                </p>
              </div>
              <SignInForm />
            </div>
          </div>
        </div>

        {/* Footer for login page */}
        {/* <Footer /> */}
      </Unauthenticated>

      <Authenticated>
        <div className="flex flex-col h-screen">
          <div className="flex flex-1">
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
                    { id: "dashboard", label: "Dashboard", icon: "📊" },
                    { id: "map", label: "Interactive Map", icon: "🗺" },
                    { id: "assets", label: "Asset Manager", icon: "🏭" },
                    { id: "demand", label: "Demand Analysis", icon: "📈" },
                    { id: "renewable", label: "Renewable Sites", icon: "🌞" },
                    { id: "transport", label: "Transport Network", icon: "🚛" },
                    { id: "policy", label: "Policy Analysis", icon: "📋" },
                    {
                      id: "recommendations",
                      label: "Site Recommendations",
                      icon: "🎯",
                    },
                    {
                      id: "scenarios",
                      label: "Scenario Planning",
                      icon: "🔮",
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-white hover:bg-gray-700"
                        }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </nav>

              <div className="absolute bottom-16 left-4">
                <SignOutButton />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "dashboard" && <Dashboard />}
              {activeTab === "map" && <MapView />}
              {activeTab === "assets" && <AssetManager />}
              {activeTab === "demand" && <DemandAnalysis />}
              {activeTab === "renewable" && <RenewableAnalysis />}
              {activeTab === "transport" && <TransportAnalysis />}
              {activeTab === "policy" && <PolicyAnalysis />}
              {activeTab === "recommendations" && <SiteRecommendations />}
              {activeTab === "scenarios" && <ScenarioPlanning />}
            </div>
          </div>

          {/* Footer for authenticated pages */}
          <Footer />
        </div>
      </Authenticated>

      <Toaster position="top-right" />
    </main>
  );
}
