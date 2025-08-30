import { useState, useMemo } from "react";
import apiClient, { useRestQuery } from "../apiClient";
import { DataSeeder } from "./DataSeeder";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Polyline, LayersControl, LayerGroup, Popup } from "react-leaflet";
import Plot from "react-plotly.js";
import * as turf from "@turf/turf";

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

  // Sample map data (used as fallback or preview inside the card)
  const sampleMap = useMemo(() => {
    const states: Record<string, [number, number]> = {
      "Karnataka":[12.97,77.59],
      "Maharashtra":[18.65,73.85],
      "Tamil Nadu":[11.0,78.9],
      "Gujarat":[22.3,72.6],
      "West Bengal":[22.6,88.36]
    };

    function generatePoint(lat:number,lng:number,minDistKm:number){
      let latNew:number,lngNew:number,dist:number;
      do{
        const randLat = lat + (Math.random()-0.5)*0.3;
        const randLng = lng + (Math.random()-0.5)*0.3;
        latNew = randLat;
        lngNew = randLng;
        dist = Math.sqrt(Math.pow((lat-latNew)*111,2)+Math.pow((lng-lngNew)*111*Math.cos(lat*Math.PI/180),2));
      } while(dist<minDistKm);
      return [latNew,lngNew] as [number,number];
    }

    const plants:any[] = [];
    const hubs:any[] = [];
    const storageHubs:any[] = [];
    const pipelines:any[] = [];

    for(const state in states){
      const center = states[state];
      const plant1 = generatePoint(center[0],center[1],10);
      const plant2 = generatePoint(center[0],center[1],10);
      plants.push({coords:plant1,name:`${state} Plant 1`,capacity:'150–200 MW'});
      plants.push({coords:plant2,name:`${state} Plant 2`,capacity:'150–200 MW'});

      const hub1 = generatePoint(center[0],center[1],2);
      const hub2 = generatePoint(center[0],center[1],2);
      hubs.push({coords:hub1,name:`${state} Hub 1`,output:'500 MW'});
      hubs.push({coords:hub2,name:`${state} Hub 2`,output:'500 MW'});

      const storage = generatePoint(center[0],center[1],5);
      storageHubs.push({coords:storage,name:`${state} Storage 1`,capacity:'200 MW'});

      pipelines.push({coords:[plant1,hub1],name:`${state} Pipeline 1`});
      pipelines.push({coords:[plant2,hub2],name:`${state} Pipeline 2`});
      pipelines.push({coords:[plant1,storage],name:`${state} Pipeline 3`});
      pipelines.push({coords:[plant2,storage],name:`${state} Pipeline 4`});
    }

    return { plants,hubs,storageHubs,pipelines };
  }, []);

  // Responsive styles
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "400px" }}>
      {/* Map header and controls */}
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

          {/* Data Seeder */}
            <div className="mb-6">
            <DataSeeder />
            <div className="mt-3 text-sm text-gray-600">Loaded assets: {assets?.length || 0}</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                {assetStats && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Assets:</span>
                      <span className="font-medium">{assetStats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Capacity:</span>
                      <span className="font-medium">{assetStats.totalCapacity.toFixed(0)} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Renewable Score:</span>
                      <span className="font-medium">{assetStats.averageRenewableScore?.toFixed(1) || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Operational:</span>
                      <span className="font-medium">{assetStats.byStatus.operational}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Under Construction:</span>
                      <span className="font-medium">{assetStats.byStatus.under_construction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Planned:</span>
                      <span className="font-medium">{assetStats.byStatus.planned}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Area */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div style={{ height: '100%', width: '100%' }}>
                  <MapContainer center={[22,78]} zoom={5} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

                    {/* Plants layer */}
                    <LayersControl position="topright">
                      <LayersControl.Overlay name="Hydrogen Plants" checked>
                        <LayerGroup>
                          {sampleMap.plants.map((p, i) => (
                            <CircleMarker key={`plant-${i}`} center={p.coords} pathOptions={{ radius:8, fillColor:'green', color:'white', weight:2, fillOpacity:0.9 }}>
                              <Popup>
                                <b>{p.name}</b><br/>Capacity: {p.capacity}
                              </Popup>
                            </CircleMarker>
                          ))}
                        </LayerGroup>
                      </LayersControl.Overlay>

                      {/* Hubs layer */}
                      <LayersControl.Overlay name="Power Hubs" checked>
                        <LayerGroup>
                          {sampleMap.hubs.map((h, i) => (
                            <CircleMarker key={`hub-${i}`} center={h.coords} pathOptions={{ radius:10, fillColor:'orange', color:'black', weight:2, fillOpacity:0.9 }}>
                              <Popup>
                                <b>{h.name}</b><br/>Output: {h.output}
                              </Popup>
                            </CircleMarker>
                          ))}
                        </LayerGroup>
                      </LayersControl.Overlay>

                      {/* Storage layer */}
                      <LayersControl.Overlay name="Storage Hubs" checked>
                        <LayerGroup>
                          {sampleMap.storageHubs.map((s, i) => (
                            <CircleMarker key={`storage-${i}`} center={s.coords} pathOptions={{ radius:8, fillColor:'blue', color:'white', weight:2, fillOpacity:0.8 }}>
                              <Popup>
                                <b>{s.name}</b><br/>Capacity: {s.capacity}
                              </Popup>
                            </CircleMarker>
                          ))}
                        </LayerGroup>
                      </LayersControl.Overlay>

                      {/* Pipelines (as a toggleable layer) */}
                      <LayersControl.Overlay name="Pipelines" checked>
                        <LayerGroup>
                          {sampleMap.pipelines.map((pl, i) => (
                            <Polyline key={`pl-${i}`} positions={pl.coords} pathOptions={{ color:'red', weight:3, dashArray:'5,5' }}>
                              <Popup>
                                <b>{pl.name}</b>
                              </Popup>
                            </Polyline>
                          ))}
                        </LayerGroup>
                      </LayersControl.Overlay>
                    </LayersControl>

                  </MapContainer>
                </div>
              </div>

              {/* Asset List */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Assets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assets?.slice(0, 4).map((asset) => (
                    <div key={asset._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{asset.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          asset.status === 'operational' ? 'bg-green-100 text-green-800' :
                          asset.status === 'under_construction' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {asset.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{asset.location.address}</p>
                      <div className="flex justify-between text-sm">
                        <span>Capacity: {asset.capacity} MW</span>
                        <span>Renewable Score: {asset.renewableScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
