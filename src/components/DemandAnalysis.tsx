import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function DemandAnalysis() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");


  // Dummy dataset of 40 clusters
  const dummyClusters = [
    {
      _id: "1",
      name: "Mumbai Industrial Cluster",
      location: { district: "Mumbai", state: "Maharashtra" },
      type: "industrial",
      priority: "high",
      currentDemand: 12000,
      projectedDemand2030: 18000,
      projectedDemand2050: 25000,
      industries: ["Petrochemicals", "Automotive"],
      transportConnectivity: 95
    },
    {
      _id: "2",
      name: "Delhi Transport Hub",
      location: { district: "Delhi", state: "Delhi" },
      type: "transport",
      priority: "high",
      currentDemand: 9000,
      projectedDemand2030: 14000,
      projectedDemand2050: 20000,
      industries: ["Logistics", "Metro"],
      transportConnectivity: 98
    },
    {
      _id: "3",
      name: "Bangalore Tech Park",
      location: { district: "Bangalore", state: "Karnataka" },
      type: "industrial",
      priority: "medium",
      currentDemand: 8000,
      projectedDemand2030: 12000,
      projectedDemand2050: 17000,
      industries: ["IT", "Electronics"],
      transportConnectivity: 90
    },
    {
      _id: "4",
      name: "Chennai Port Cluster",
      location: { district: "Chennai", state: "Tamil Nadu" },
      type: "export",
      priority: "high",
      currentDemand: 7000,
      projectedDemand2030: 11000,
      projectedDemand2050: 16000,
      industries: ["Shipping", "Automotive"],
      transportConnectivity: 92
    },
    {
      _id: "5",
      name: "Hyderabad Residential Zone",
      location: { district: "Hyderabad", state: "Telangana" },
      type: "residential",
      priority: "medium",
      currentDemand: 5000,
      projectedDemand2030: 8000,
      projectedDemand2050: 12000,
      industries: ["Housing"],
      transportConnectivity: 85
    },
    {
      _id: "6",
      name: "Ahmedabad Industrial Estate",
      location: { district: "Ahmedabad", state: "Gujarat" },
      type: "industrial",
      priority: "high",
      currentDemand: 10000,
      projectedDemand2030: 15000,
      projectedDemand2050: 21000,
      industries: ["Textiles", "Pharma"],
      transportConnectivity: 88
    },
    {
      _id: "7",
      name: "Kolkata Export Terminal",
      location: { district: "Kolkata", state: "West Bengal" },
      type: "export",
      priority: "medium",
      currentDemand: 6000,
      projectedDemand2030: 9000,
      projectedDemand2050: 13000,
      industries: ["Shipping", "Tea"],
      transportConnectivity: 80
    },
    {
      _id: "8",
      name: "Pune Residential Area",
      location: { district: "Pune", state: "Maharashtra" },
      type: "residential",
      priority: "low",
      currentDemand: 4000,
      projectedDemand2030: 6000,
      projectedDemand2050: 9000,
      industries: ["Housing"],
      transportConnectivity: 75
    },
    {
      _id: "9",
      name: "Surat Textile Cluster",
      location: { district: "Surat", state: "Gujarat" },
      type: "industrial",
      priority: "medium",
      currentDemand: 7000,
      projectedDemand2030: 10000,
      projectedDemand2050: 14000,
      industries: ["Textiles"],
      transportConnectivity: 82
    },
    {
      _id: "10",
      name: "Jaipur Transport Node",
      location: { district: "Jaipur", state: "Rajasthan" },
      type: "transport",
      priority: "medium",
      currentDemand: 5000,
      projectedDemand2030: 8000,
      projectedDemand2050: 12000,
      industries: ["Metro", "Logistics"],
      transportConnectivity: 78
    },
    {
      _id: "11",
      name: "Lucknow Residential Sector",
      location: { district: "Lucknow", state: "Uttar Pradesh" },
      type: "residential",
      priority: "low",
      currentDemand: 3500,
      projectedDemand2030: 5000,
      projectedDemand2050: 7000,
      industries: ["Housing"],
      transportConnectivity: 70
    },
    {
      _id: "12",
      name: "Indore Industrial Park",
      location: { district: "Indore", state: "Madhya Pradesh" },
      type: "industrial",
      priority: "high",
      currentDemand: 9000,
      projectedDemand2030: 13000,
      projectedDemand2050: 18000,
      industries: ["Automotive", "Textiles"],
      transportConnectivity: 86
    },
    {
      _id: "13",
      name: "Bhopal Export Hub",
      location: { district: "Bhopal", state: "Madhya Pradesh" },
      type: "export",
      priority: "medium",
      currentDemand: 4000,
      projectedDemand2030: 7000,
      projectedDemand2050: 10000,
      industries: ["Agriculture"],
      transportConnectivity: 77
    },
    {
      _id: "14",
      name: "Nagpur Transport Center",
      location: { district: "Nagpur", state: "Maharashtra" },
      type: "transport",
      priority: "high",
      currentDemand: 6000,
      projectedDemand2030: 9000,
      projectedDemand2050: 13000,
      industries: ["Logistics"],
      transportConnectivity: 89
    },
    {
      _id: "15",
      name: "Visakhapatnam Industrial Zone",
      location: { district: "Visakhapatnam", state: "Andhra Pradesh" },
      type: "industrial",
      priority: "medium",
      currentDemand: 8000,
      projectedDemand2030: 12000,
      projectedDemand2050: 17000,
      industries: ["Steel", "Shipping"],
      transportConnectivity: 84
    },
    {
      _id: "16",
      name: "Vijayawada Residential Area",
      location: { district: "Vijayawada", state: "Andhra Pradesh" },
      type: "residential",
      priority: "low",
      currentDemand: 3000,
      projectedDemand2030: 5000,
      projectedDemand2050: 8000,
      industries: ["Housing"],
      transportConnectivity: 68
    },
    {
      _id: "17",
      name: "Goa Export Cluster",
      location: { district: "Panaji", state: "Goa" },
      type: "export",
      priority: "medium",
      currentDemand: 3500,
      projectedDemand2030: 6000,
      projectedDemand2050: 9000,
      industries: ["Tourism", "Shipping"],
      transportConnectivity: 76
    },
    {
      _id: "18",
      name: "Chandigarh Residential Block",
      location: { district: "Chandigarh", state: "Punjab" },
      type: "residential",
      priority: "low",
      currentDemand: 2500,
      projectedDemand2030: 4000,
      projectedDemand2050: 6000,
      industries: ["Housing"],
      transportConnectivity: 65
    },
    {
      _id: "19",
      name: "Shimla Transport Node",
      location: { district: "Shimla", state: "Himachal Pradesh" },
      type: "transport",
      priority: "medium",
      currentDemand: 2000,
      projectedDemand2030: 3500,
      projectedDemand2050: 5000,
      industries: ["Tourism"],
      transportConnectivity: 60
    },
    {
      _id: "20",
      name: "Guwahati Industrial Estate",
      location: { district: "Guwahati", state: "Assam" },
      type: "industrial",
      priority: "high",
      currentDemand: 7000,
      projectedDemand2030: 11000,
      projectedDemand2050: 15000,
      industries: ["Tea", "Petrochemicals"],
      transportConnectivity: 83
    },
    {
      _id: "21",
      name: "Patna Export Terminal",
      location: { district: "Patna", state: "Bihar" },
      type: "export",
      priority: "medium",
      currentDemand: 3000,
      projectedDemand2030: 5000,
      projectedDemand2050: 8000,
      industries: ["Agriculture"],
      transportConnectivity: 72
    },
    {
      _id: "22",
      name: "Raipur Industrial Park",
      location: { district: "Raipur", state: "Chhattisgarh" },
      type: "industrial",
      priority: "high",
      currentDemand: 6000,
      projectedDemand2030: 9000,
      projectedDemand2050: 13000,
      industries: ["Steel", "Mining"],
      transportConnectivity: 81
    },
    {
      _id: "23",
      name: "Ranchi Residential Area",
      location: { district: "Ranchi", state: "Jharkhand" },
      type: "residential",
      priority: "low",
      currentDemand: 2000,
      projectedDemand2030: 3500,
      projectedDemand2050: 5000,
      industries: ["Housing"],
      transportConnectivity: 62
    },
    {
      _id: "24",
      name: "Bhubaneswar Export Hub",
      location: { district: "Bhubaneswar", state: "Odisha" },
      type: "export",
      priority: "medium",
      currentDemand: 4000,
      projectedDemand2030: 7000,
      projectedDemand2050: 10000,
      industries: ["Agriculture", "Shipping"],
      transportConnectivity: 74
    },
    {
      _id: "25",
      name: "Amritsar Industrial Estate",
      location: { district: "Amritsar", state: "Punjab" },
      type: "industrial",
      priority: "high",
      currentDemand: 5000,
      projectedDemand2030: 8000,
      projectedDemand2050: 12000,
      industries: ["Textiles", "Food Processing"],
      transportConnectivity: 79
    },
    {
      _id: "26",
      name: "Siliguri Transport Node",
      location: { district: "Siliguri", state: "West Bengal" },
      type: "transport",
      priority: "medium",
      currentDemand: 2500,
      projectedDemand2030: 4000,
      projectedDemand2050: 6000,
      industries: ["Logistics"],
      transportConnectivity: 66
    },
    {
      _id: "27",
      name: "Dehradun Residential Block",
      location: { district: "Dehradun", state: "Uttarakhand" },
      type: "residential",
      priority: "low",
      currentDemand: 1500,
      projectedDemand2030: 2500,
      projectedDemand2050: 4000,
      industries: ["Housing"],
      transportConnectivity: 55
    },
    {
      _id: "28",
      name: "Srinagar Export Cluster",
      location: { district: "Srinagar", state: "Jammu & Kashmir" },
      type: "export",
      priority: "medium",
      currentDemand: 2000,
      projectedDemand2030: 3500,
      projectedDemand2050: 5000,
      industries: ["Handicrafts", "Tourism"],
      transportConnectivity: 58
    },
    {
      _id: "29",
      name: "Agra Industrial Estate",
      location: { district: "Agra", state: "Uttar Pradesh" },
      type: "industrial",
      priority: "high",
      currentDemand: 4000,
      projectedDemand2030: 7000,
      projectedDemand2050: 10000,
      industries: ["Leather", "Tourism"],
      transportConnectivity: 73
    },
    {
      _id: "30",
      name: "Varanasi Transport Node",
      location: { district: "Varanasi", state: "Uttar Pradesh" },
      type: "transport",
      priority: "medium",
      currentDemand: 3000,
      projectedDemand2030: 5000,
      projectedDemand2050: 8000,
      industries: ["Tourism", "Logistics"],
      transportConnectivity: 67
    },
    {
      _id: "31",
      name: "Coimbatore Industrial Park",
      location: { district: "Coimbatore", state: "Tamil Nadu" },
      type: "industrial",
      priority: "high",
      currentDemand: 6000,
      projectedDemand2030: 9000,
      projectedDemand2050: 13000,
      industries: ["Textiles", "Engineering"],
      transportConnectivity: 80
    },
    {
      _id: "32",
      name: "Madurai Residential Area",
      location: { district: "Madurai", state: "Tamil Nadu" },
      type: "residential",
      priority: "low",
      currentDemand: 2000,
      projectedDemand2030: 3500,
      projectedDemand2050: 5000,
      industries: ["Housing"],
      transportConnectivity: 60
    },
    {
      _id: "33",
      name: "Thiruvananthapuram Export Hub",
      location: { district: "Thiruvananthapuram", state: "Kerala" },
      type: "export",
      priority: "medium",
      currentDemand: 3000,
      projectedDemand2030: 5000,
      projectedDemand2050: 8000,
      industries: ["Shipping", "Tourism"],
      transportConnectivity: 70
    },
    {
      _id: "34",
      name: "Ernakulam Industrial Estate",
      location: { district: "Ernakulam", state: "Kerala" },
      type: "industrial",
      priority: "high",
      currentDemand: 5000,
      projectedDemand2030: 8000,
      projectedDemand2050: 12000,
      industries: ["Food Processing", "Shipping"],
      transportConnectivity: 78
    },
    {
      _id: "35",
      name: "Shillong Residential Block",
      location: { district: "Shillong", state: "Meghalaya" },
      type: "residential",
      priority: "low",
      currentDemand: 1000,
      projectedDemand2030: 2000,
      projectedDemand2050: 3000,
      industries: ["Housing"],
      transportConnectivity: 50
    },
    {
      _id: "36",
      name: "Imphal Export Terminal",
      location: { district: "Imphal", state: "Manipur" },
      type: "export",
      priority: "medium",
      currentDemand: 1500,
      projectedDemand2030: 2500,
      projectedDemand2050: 4000,
      industries: ["Handicrafts"],
      transportConnectivity: 52
    },
    {
      _id: "37",
      name: "Aizawl Industrial Estate",
      location: { district: "Aizawl", state: "Mizoram" },
      type: "industrial",
      priority: "high",
      currentDemand: 2000,
      projectedDemand2030: 3500,
      projectedDemand2050: 5000,
      industries: ["Handicrafts"],
      transportConnectivity: 54
    },
    {
      _id: "38",
      name: "Kohima Residential Area",
      location: { district: "Kohima", state: "Nagaland" },
      type: "residential",
      priority: "low",
      currentDemand: 1000,
      projectedDemand2030: 2000,
      projectedDemand2050: 3000,
      industries: ["Housing"],
      transportConnectivity: 48
    },
    {
      _id: "39",
      name: "Gangtok Export Cluster",
      location: { district: "Gangtok", state: "Sikkim" },
      type: "export",
      priority: "medium",
      currentDemand: 1200,
      projectedDemand2030: 2000,
      projectedDemand2050: 3000,
      industries: ["Tourism"],
      transportConnectivity: 49
    },
    {
      _id: "40",
      name: "Tripura Industrial Estate",
      location: { district: "Agartala", state: "Tripura" },
      type: "industrial",
      priority: "high",
      currentDemand: 2500,
      projectedDemand2030: 4000,
      projectedDemand2050: 6000,
      industries: ["Handicrafts", "Food Processing"],
      transportConnectivity: 53
    }
  ];

  const demandClustersApi = useQuery(api.demandClusters.getDemandClusters, {
    type: selectedType as any || undefined,
    state: selectedState || undefined,
    priority: selectedPriority as any || undefined,
  });

  // Fallback to dummy data if API returns no clusters
  const demandClusters = demandClustersApi && demandClustersApi.length > 0
    ? demandClustersApi
    : dummyClusters.filter(cluster =>
        (!selectedType || cluster.type === selectedType) &&
        (!selectedState || cluster.location.state === selectedState) &&
        (!selectedPriority || cluster.priority === selectedPriority)
      );

  const demandStats = useQuery(api.demandClusters.getDemandStats);

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
        <h2 className="text-2xl font-bold text-gray-900">Hydrogen Demand Analysis</h2>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📈</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clusters</p>
              <p className="text-2xl font-bold text-gray-900">{demandStats?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🏭</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Current Demand</p>
              <p className="text-2xl font-bold text-gray-900">
                {demandStats ? (demandStats.totalDemand.current / 1000).toFixed(0) : 0}k t/yr
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🎯</div>
            <div>
              <p className="text-sm font-medium text-gray-600">2030 Projection</p>
              <p className="text-2xl font-bold text-gray-900">
                {demandStats ? (demandStats.totalDemand.projected2030 / 1000).toFixed(0) : 0}k t/yr
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🚀</div>
            <div>
              <p className="text-sm font-medium text-gray-600">2050 Projection</p>
              <p className="text-2xl font-bold text-gray-900">
                {demandStats ? (demandStats.totalDemand.projected2050 / 1000).toFixed(0) : 0}k t/yr
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and Controls */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="industrial">Industrial</option>
                <option value="transport">Transport</option>
                <option value="residential">Residential</option>
                <option value="export">Export</option>
              </select>

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

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Demand Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Demand by Type</h3>
            {demandStats && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Industrial</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(demandStats.byType.industrial / demandStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{demandStats.byType.industrial}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transport</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(demandStats.byType.transport / demandStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{demandStats.byType.transport}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Residential</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${(demandStats.byType.residential / demandStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{demandStats.byType.residential}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Export</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(demandStats.byType.export / demandStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{demandStats.byType.export}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Demand Clusters List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Demand Clusters</h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing {demandClusters?.length || 0} clusters
              </p>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {demandClusters?.map((cluster) => (
                <div key={cluster._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{cluster.name}</h4>
                      <p className="text-sm text-gray-600">{cluster.location.district}, {cluster.location.state}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cluster.type === 'industrial' ? 'bg-blue-100 text-blue-800' :
                        cluster.type === 'transport' ? 'bg-green-100 text-green-800' :
                        cluster.type === 'residential' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {cluster.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cluster.priority === 'high' ? 'bg-red-100 text-red-800' :
                        cluster.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cluster.priority} priority
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current:</span>
                      <div className="font-medium">{(cluster.currentDemand / 1000).toFixed(1)}k t/yr</div>
                    </div>
                    <div>
                      <span className="text-gray-600">2030:</span>
                      <div className="font-medium">{(cluster.projectedDemand2030 / 1000).toFixed(1)}k t/yr</div>
                    </div>
                    <div>
                      <span className="text-gray-600">2050:</span>
                      <div className="font-medium">{(cluster.projectedDemand2050 / 1000).toFixed(1)}k t/yr</div>
                    </div>
                  </div>

                  {cluster.industries.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm text-gray-600">Industries: </span>
                      <span className="text-sm font-medium">{cluster.industries.join(", ")}</span>
                    </div>
                  )}

                  <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-600">Transport Connectivity:</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${cluster.transportConnectivity}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{cluster.transportConnectivity}</span>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No demand clusters found</h3>
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
