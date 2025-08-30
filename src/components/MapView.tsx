import { useState, useMemo } from "react";
import apiClient, { useRestQuery } from "../apiClient";
import { DataSeeder } from "./DataSeeder";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Polyline, LayersControl, LayerGroup, Popup } from "react-leaflet";
import L from "leaflet";

export function MapView() {
  const [selectedState, setSelectedState] = useState<string>("");

  const assets: any[] = useRestQuery(apiClient.assets.list, { state: selectedState || undefined }) || [];
  const demandClusters: any[] = useRestQuery(apiClient.demand.list, { state: selectedState || undefined }) || [];
  const assetStats: any = useRestQuery(apiClient.assets.stats) || null;

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  // Extra fixed assets (solar, wind, H2, water)
  // Extra fixed assets (solar, wind, H2, water, storage)
  const extraAssets = [
    // --- Solar & Wind ---
    { name: "Khavda Hybrid RE Park", coords: [24.1167, 69.3500], type: "Solar & Wind" },
    { name: "Khavda (Adani) Solar Farm", coords: [24.1132, 69.3669], type: "Solar" },
    { name: "Charanka Solar Park", coords: [23.9086, 71.20], type: "Solar" },
    { name: "Dholera Solar Park", coords: [22.15, 72.20], type: "Solar" },
    { name: "Nizar Solar Park (Tapi)", coords: [21.4741, 74.1751], type: "Solar" },
    { name: "Namalpur (Narmada)", coords: [22.0037, 73.6339], type: "Solar" },
    { name: "Netrang Canal-top Solar (Bharuch)", coords: [21.6539, 73.3678], type: "Solar" },

    // --- Hydrogen ---
    { name: "Kandla Port (Deendayal Port)", coords: [23.0185, 70.2310], type: "H2" },
    { name: "Kutch District Land Parcels", coords: [23.5, 69.5], type: "H2" },
    { name: "Banaskantha District Land Parcels", coords: [24.5, 71.0], type: "H2" },
    { name: "Jamnagar (Reliance Giga Complex)", coords: [22.4707, 70.0577], type: "H2" },

    { name: "Muppandal Wind Farm", coords: [8.2569, 77.5560], type: "Wind" },
    { name: "Jaisalmer Wind Park", coords: [26.9167, 70.9167], type: "Wind" },
    { name: "Kayathar Wind Farm", coords: [8.9, 77.8], type: "Wind" },
    { name: "Dhar Wind Cluster", coords: [22.6, 75.3], type: "Wind" },

    // Hydro / Water
    { name: "Tehri Dam", coords: [30.38, 78.48], type: "Water" },
    { name: "Sardar Sarovar Dam", coords: [21.82, 73.73], type: "Water" },
    { name: "Bhakra Nangal Dam", coords: [31.41, 76.42], type: "Water" },
    { name: "Koyna Dam", coords: [17.4, 73.75], type: "Water" },

    // --- Storage Hubs (BESS + PSP + Hybrid) ---
    {
      name: "GUVNL BESS – Bhachunda (Kutch)",
      coords: [23.4650, 69.7600],
      type: "Storage",
      description: "Part of GUVNL’s 750 MW / 1,500 MWh intent. Grid-scale battery storage supporting renewables in Kutch."
    },
    {
      name: "GUVNL BESS – Sanand",
      coords: [23.05, 72.38],
      type: "Storage",
      description: "Battery storage hub near Sanand industrial cluster. Supports EV, hydrogen, and solar projects."
    },
    {
      name: "GUVNL BESS – Amreli",
      coords: [21.60, 71.22],
      type: "Storage",
      description: "BESS installation strengthening southern Gujarat’s renewable integration."
    },
    {
      name: "IndiGrid BESS Project (Grid-connected)",
      coords: [22.90, 72.60],
      type: "Storage",
      description: "180 MW / 360 MWh grid-scale battery storage, improving Gujarat’s renewable balancing."
    },
    {
      name: "Tehri Pumped Storage (supplying Gujarat)",
      coords: [30.38, 78.48],
      type: "Storage",
      description: "Uttarakhand-based ~184 MW PSP project. Supplies balancing power for Gujarat’s RE mix."
    },
    {
      name: "Modhera Solar + Storage",
      coords: [23.59, 72.13],
      type: "Storage",
      description: "India’s first solar-powered village with 6 MW solar + 15 MWh battery energy storage."
    },

     // Solar
  { 
    name: "Bhadla Solar Park (Rajasthan)", 
    coords: [27.5320, 71.7674], 
    type: "Solar", 
    description: "World's largest solar park | Capacity: ~2,245 MW" 
  },
  { 
    name: "Pavagada Solar Park (Karnataka)", 
    coords: [14.1566, 77.3566], 
    type: "Solar", 
    description: "Shakti Sthala | Capacity: ~2,050 MW" 
  },

  // Wind
  { 
    name: "Muppandal Wind Farm (Tamil Nadu)", 
    coords: [8.2569, 77.5560], 
    type: "Wind", 
    description: "One of Asia's largest onshore wind farms | Capacity: ~1,500 MW" 
  },
  { 
    name: "Kayathar Wind Farm (Tamil Nadu)", 
    coords: [8.9, 77.8], 
    type: "Wind", 
    description: "Wind cluster in southern TN | Capacity: ~300 MW" 
  },

  // Hydro
  { 
    name: "Koyna Dam (Maharashtra)", 
    coords: [17.4, 73.75], 
    type: "Water", 
    description: "Major hydroelectric project | Capacity: ~1,960 MW" 
  },
  { 
    name: "Tehri Dam (Uttarakhand)", 
    coords: [30.38, 78.48], 
    type: "Water", 
    description: "Tallest dam in India | Capacity: ~1,000 MW" 
  },

  // Hydrogen
  { 
    name: "Jamnagar (Reliance Giga Complex, Gujarat)", 
    coords: [22.4707, 70.0577], 
    type: "H2", 
    description: "Planned Green Hydrogen hub by Reliance" 
  },
  { 
    name: "Kandla Port (Deendayal Port, Gujarat)", 
    coords: [23.0185, 70.2310], 
    type: "H2", 
    description: "Green Hydrogen & Ammonia export hub" 
  },

  // Offshore Wind
  { 
    name: "Gujarat Offshore Wind (Planned)", 
    coords: [21.6907, 69.1462], 
    type: "Wind", 
    description: "India's first offshore wind project | Capacity: ~500 MW (planned)" 
  },
  { 
    name: "Tamil Nadu Offshore Wind (Planned)", 
    coords: [8.5667, 79.3333], 
    type: "Wind", 
    description: "Proposed offshore wind zone | Capacity: ~1,000 MW (planned)" 
  }
];

  // Color mapping
  const colorMap: Record<string, string> = {
    "Solar": "yellow",
    "Wind": "lightblue",
    "Water": "darkblue",
    "H2": "green",
    "Solar & Wind": "orange",
    "Storage": "purple"
  };

  // Map container
  return (
    <div className="bg-gradient-to-r from-[#69b708] via-[#228B22] to-[#0b3d08]" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "400px" }}>
      <div style={{ flex: "2 1 65%", minHeight: "300px" }}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Infrastructure Map</h2>
            <div className="flex space-x-4">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All States</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Seeder */}
          <div className="mb-6">
            <DataSeeder />
            <div className="mt-3 text-sm text-gray-600">Loaded assets: {assets?.length || 0}</div>
          </div>

          {/* Map */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 border-2 border-dashed border-gray-300">
            <MapContainer center={[22.5, 72]} zoom={6} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              <LayersControl position="topright">
                {/* Extra Renewable Assets */}
                <LayersControl.Overlay name="Energy Assets" checked>
                  <LayerGroup>
                    {extraAssets.map((asset, idx) => (
                      <CircleMarker
                        key={idx}
                        center={asset.coords as [number, number]}
                        radius={10}
                        pathOptions={{
                          fillColor: {
                            'Solar': '#eab308',
                            'Wind': '#2563eb',
                            'Water': '#1e293b',
                            'H2': '#166534',
                            'Solar & Wind': '#ea580c',
                            'Storage': '#7c3aed',
                          }[asset.type] || "#374151",
                          color: "black",
                          weight: 2,
                          fillOpacity: 0.85,
                        }}
                      >
                        {/* Small logo SVG, centered, smaller than radius */}
                        <div style={{ position: 'relative', left: '-10px', top: '-10px', width: '20px', height: '20px', pointerEvents: 'none' }}>
                          {asset.type === 'Solar' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#b45309" style={{ display: 'block', margin: 'auto' }}>
                              <circle cx="12" cy="12" r="5" fill="#f59e42" />
                              <g stroke="#b45309" strokeWidth="2">
                                <line x1="12" y1="2" x2="12" y2="6" />
                                <line x1="12" y1="18" x2="12" y2="22" />
                                <line x1="2" y1="12" x2="6" y2="12" />
                                <line x1="18" y1="12" x2="22" y2="12" />
                              </g>
                            </svg>
                          )}
                          {asset.type === 'Wind' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1e40af" style={{ display: 'block', margin: 'auto' }}>
                              <path d="M12 2v20M12 12l6-6M12 12l-6 6" stroke="#1e40af" strokeWidth="2" fill="none" />
                            </svg>
                          )}
                          {asset.type === 'Water' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0ea5e9" style={{ display: 'block', margin: 'auto' }}>
                              <ellipse cx="12" cy="16" rx="7" ry="5" fill="#0ea5e9" />
                              <path d="M12 2C15 7 19 12 12 16C5 12 9 7 12 2Z" fill="#1e293b" />
                            </svg>
                          )}
                          {asset.type === 'H2' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#166534" style={{ display: 'block', margin: 'auto' }}>
                              <text x="2" y="12" fontSize="12" fill="#166534" fontWeight="bold">H₂</text>
                            </svg>
                          )}
                          {asset.type === 'Solar & Wind' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
                              <circle cx="7" cy="7" r="3" fill="#f59e42" />
                              <path d="M17 17l-4-4" stroke="#1e40af" strokeWidth="2" />
                            </svg>
                          )}
                          {asset.type === 'Storage' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#7c3aed" style={{ display: 'block', margin: 'auto' }}>
                              <rect x="4" y="8" width="16" height="8" rx="2" fill="#7c3aed" />
                              <rect x="8" y="10" width="8" height="4" rx="1" fill="#c4b5fd" />
                            </svg>
                          )}
                        </div>
                        <Popup>
                          <b>{asset.name}</b><br />
                          Type: {asset.type}<br />
                          Coordinates: {asset.coords[0].toFixed(4)}, {asset.coords[1].toFixed(4)}
                        </Popup>
                      </CircleMarker>
                    ))}
                  </LayerGroup>
                </LayersControl.Overlay>
              </LayersControl>
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Color Legend Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Energy Asset Types Legend</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(colorMap).map(([type, color]) => (
            <div key={type} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-black"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-sm text-gray-600">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
