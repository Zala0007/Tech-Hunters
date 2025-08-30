import { useState } from "react";
import { toast } from "sonner";

// Dummy data for assets
const dummyAssets = [
  // Production Plants
  { _id: "1", name: "Gujarat Green H2 Plant", type: "plant", location: { lat: 23.0225, lng: 72.5714, address: "GIFT City, Gandhinagar", state: "Gujarat", district: "Gandhinagar" }, capacity: 150, status: "operational", operator: "Reliance Industries", renewableScore: 85, transportScore: 90, environmentalRisk: 20 },
  { _id: "2", name: "Rajasthan Solar H2 Facility", type: "plant", location: { lat: 26.9124, lng: 75.7873, address: "Jaipur Industrial Area", state: "Rajasthan", district: "Jaipur" }, capacity: 200, status: "under_construction", operator: "Adani Green Energy", renewableScore: 92, transportScore: 75, environmentalRisk: 15 },
  { _id: "3", name: "Tamil Nadu Coastal Plant", type: "plant", location: { lat: 13.0827, lng: 80.2707, address: "Chennai Port", state: "Tamil Nadu", district: "Chennai" }, capacity: 120, status: "operational", operator: "L&T Energy", renewableScore: 78, transportScore: 95, environmentalRisk: 25 },
  { _id: "4", name: "Maharashtra Wind H2 Plant", type: "plant", location: { lat: 19.0760, lng: 72.8777, address: "Mumbai Industrial Complex", state: "Maharashtra", district: "Mumbai" }, capacity: 180, status: "planned", operator: "Tata Power", renewableScore: 88, transportScore: 85, environmentalRisk: 18 },
  { _id: "5", name: "Karnataka Solar H2 Hub", type: "plant", location: { lat: 12.9716, lng: 77.5946, address: "Bangalore Tech Park", state: "Karnataka", district: "Bangalore" }, capacity: 160, status: "operational", operator: "JSW Energy", renewableScore: 90, transportScore: 80, environmentalRisk: 22 },
  { _id: "6", name: "Andhra Pradesh Mega Plant", type: "plant", location: { lat: 17.3850, lng: 78.4867, address: "Hyderabad Industrial Corridor", state: "Andhra Pradesh", district: "Hyderabad" }, capacity: 250, status: "under_construction", operator: "NTPC Limited", renewableScore: 87, transportScore: 88, environmentalRisk: 20 },
  { _id: "7", name: "West Bengal Green Plant", type: "plant", location: { lat: 22.5726, lng: 88.3639, address: "Kolkata Port Area", state: "West Bengal", district: "Kolkata" }, capacity: 140, status: "planned", operator: "ONGC Energy", renewableScore: 75, transportScore: 90, environmentalRisk: 30 },
  { _id: "8", name: "Punjab Agricultural H2", type: "plant", location: { lat: 31.6340, lng: 74.8723, address: "Amritsar Industrial Zone", state: "Punjab", district: "Amritsar" }, capacity: 100, status: "operational", operator: "IOC Limited", renewableScore: 82, transportScore: 70, environmentalRisk: 25 },
  { _id: "9", name: "Odisha Coastal Facility", type: "plant", location: { lat: 20.9517, lng: 85.0985, address: "Bhubaneswar Tech City", state: "Odisha", district: "Bhubaneswar" }, capacity: 130, status: "under_construction", operator: "Vedanta Limited", renewableScore: 80, transportScore: 85, environmentalRisk: 28 },
  { _id: "10", name: "Haryana Industrial Plant", type: "plant", location: { lat: 28.4595, lng: 77.0266, address: "Gurgaon Industrial Area", state: "Haryana", district: "Gurgaon" }, capacity: 110, status: "planned", operator: "Hero Future Energies", renewableScore: 85, transportScore: 88, environmentalRisk: 20 },

  // Storage Facilities
  { _id: "11", name: "Gujarat H2 Storage Hub", type: "storage", location: { lat: 22.3072, lng: 70.8022, address: "Kandla Port Storage", state: "Gujarat", district: "Kutch" }, capacity: 50, status: "operational", operator: "Gujarat Gas Limited", renewableScore: 70, transportScore: 95, environmentalRisk: 15 },
  { _id: "12", name: "Rajasthan Desert Storage", type: "storage", location: { lat: 27.0238, lng: 74.2179, address: "Bikaner Storage Complex", state: "Rajasthan", district: "Bikaner" }, capacity: 60, status: "under_construction", operator: "Rajasthan State Gas", renewableScore: 65, transportScore: 60, environmentalRisk: 20 },
  { _id: "13", name: "Tamil Nadu Port Storage", type: "storage", location: { lat: 8.0883, lng: 77.5385, address: "Tuticorin Port", state: "Tamil Nadu", district: "Tuticorin" }, capacity: 80, status: "operational", operator: "Indian Oil Corporation", renewableScore: 75, transportScore: 90, environmentalRisk: 18 },
  { _id: "14", name: "Maharashtra Central Storage", type: "storage", location: { lat: 18.5204, lng: 73.8567, address: "Pune Industrial Estate", state: "Maharashtra", district: "Pune" }, capacity: 70, status: "planned", operator: "Bharat Petroleum", renewableScore: 72, transportScore: 85, environmentalRisk: 22 },
  { _id: "15", name: "Karnataka Tech Storage", type: "storage", location: { lat: 15.3173, lng: 75.7139, address: "Hubli Industrial Area", state: "Karnataka", district: "Hubli" }, capacity: 45, status: "operational", operator: "Hindustan Petroleum", renewableScore: 78, transportScore: 75, environmentalRisk: 25 },
  { _id: "16", name: "Andhra Pradesh Coastal Storage", type: "storage", location: { lat: 16.5062, lng: 80.6480, address: "Vijayawada Port", state: "Andhra Pradesh", district: "Vijayawada" }, capacity: 90, status: "under_construction", operator: "Gas Authority of India", renewableScore: 80, transportScore: 88, environmentalRisk: 20 },
  { _id: "17", name: "West Bengal River Storage", type: "storage", location: { lat: 22.9868, lng: 87.8550, address: "Haldia Port Complex", state: "West Bengal", district: "Haldia" }, capacity: 55, status: "planned", operator: "Petronet LNG", renewableScore: 68, transportScore: 85, environmentalRisk: 30 },
  { _id: "18", name: "Punjab Agricultural Storage", type: "storage", location: { lat: 30.9010, lng: 75.8573, address: "Ludhiana Industrial Hub", state: "Punjab", district: "Ludhiana" }, capacity: 40, status: "operational", operator: "Punjab State Gas", renewableScore: 70, transportScore: 70, environmentalRisk: 25 },
  { _id: "19", name: "Odisha Mining Storage", type: "storage", location: { lat: 22.2497, lng: 84.9102, address: "Rourkela Steel City", state: "Odisha", district: "Rourkela" }, capacity: 65, status: "under_construction", operator: "Steel Authority of India", renewableScore: 65, transportScore: 80, environmentalRisk: 35 },
  { _id: "20", name: "Haryana Metro Storage", type: "storage", location: { lat: 28.7041, lng: 77.1025, address: "Delhi NCR Hub", state: "Haryana", district: "Faridabad" }, capacity: 75, status: "planned", operator: "Indraprastha Gas", renewableScore: 75, transportScore: 90, environmentalRisk: 18 },

  // Pipelines
  { _id: "21", name: "Gujarat-Rajasthan Pipeline", type: "pipeline", location: { lat: 24.5854, lng: 73.7125, address: "Udaipur-Ahmedabad Corridor", state: "Gujarat", district: "Ahmedabad" }, capacity: 30, status: "operational", operator: "GAIL India Limited", renewableScore: 60, transportScore: 95, environmentalRisk: 15 },
  { _id: "22", name: "Tamil Nadu Coastal Pipeline", type: "pipeline", location: { lat: 11.9416, lng: 79.8083, address: "Puducherry-Chennai Line", state: "Tamil Nadu", district: "Puducherry" }, capacity: 25, status: "under_construction", operator: "South India Gas", renewableScore: 65, transportScore: 90, environmentalRisk: 20 },
  { _id: "23", name: "Maharashtra Industrial Pipeline", type: "pipeline", location: { lat: 19.9975, lng: 73.7898, address: "Nashik-Mumbai Corridor", state: "Maharashtra", district: "Nashik" }, capacity: 35, status: "planned", operator: "Maharashtra Gas", renewableScore: 70, transportScore: 88, environmentalRisk: 22 },
  { _id: "24", name: "Karnataka Express Pipeline", type: "pipeline", location: { lat: 14.2401, lng: 76.4616, address: "Shimoga-Bangalore Route", state: "Karnataka", district: "Shimoga" }, capacity: 28, status: "operational", operator: "Karnataka Gas Distribution", renewableScore: 68, transportScore: 85, environmentalRisk: 25 },
  { _id: "25", name: "Andhra Pradesh Trunk Pipeline", type: "pipeline", location: { lat: 15.9129, lng: 79.7400, address: "Kurnool-Vizag Corridor", state: "Andhra Pradesh", district: "Kurnool" }, capacity: 40, status: "under_construction", operator: "AP Gas Infrastructure", renewableScore: 72, transportScore: 92, environmentalRisk: 18 },
  { _id: "26", name: "West Bengal Delta Pipeline", type: "pipeline", location: { lat: 23.2599, lng: 87.0840, address: "Durgapur-Asansol Line", state: "West Bengal", district: "Durgapur" }, capacity: 22, status: "planned", operator: "Bengal Gas Company", renewableScore: 60, transportScore: 80, environmentalRisk: 30 },
  { _id: "27", name: "Punjab Agricultural Pipeline", type: "pipeline", location: { lat: 31.3260, lng: 75.5762, address: "Jalandhar-Chandigarh Route", state: "Punjab", district: "Jalandhar" }, capacity: 20, status: "operational", operator: "Punjab Gas Systems", renewableScore: 65, transportScore: 75, environmentalRisk: 25 },
  { _id: "28", name: "Odisha Mineral Pipeline", type: "pipeline", location: { lat: 21.2787, lng: 81.8661, address: "Raipur-Cuttack Corridor", state: "Odisha", district: "Cuttack" }, capacity: 32, status: "under_construction", operator: "Odisha Industrial Gas", renewableScore: 58, transportScore: 85, environmentalRisk: 32 },
  { _id: "29", name: "Haryana Capital Pipeline", type: "pipeline", location: { lat: 29.0588, lng: 76.0856, address: "Karnal-Delhi Connection", state: "Haryana", district: "Karnal" }, capacity: 38, status: "planned", operator: "Haryana City Gas", renewableScore: 75, transportScore: 95, environmentalRisk: 15 },
  { _id: "30", name: "Rajasthan Border Pipeline", type: "pipeline", location: { lat: 25.3176, lng: 73.0022, address: "Udaipur-Jodhpur Line", state: "Rajasthan", district: "Jodhpur" }, capacity: 26, status: "operational", operator: "Rajasthan Gas Authority", renewableScore: 62, transportScore: 70, environmentalRisk: 28 },

  // Refueling Stations
  { _id: "31", name: "Gujarat Highway Station", type: "refueling", location: { lat: 23.0225, lng: 72.5714, address: "NH-8 Ahmedabad", state: "Gujarat", district: "Ahmedabad" }, capacity: 5, status: "operational", operator: "Indian Oil Hydrogen", renewableScore: 80, transportScore: 95, environmentalRisk: 10 },
  { _id: "32", name: "Rajasthan Desert Station", type: "refueling", location: { lat: 26.9124, lng: 75.7873, address: "Jaipur Ring Road", state: "Rajasthan", district: "Jaipur" }, capacity: 4, status: "under_construction", operator: "Bharat Petroleum H2", renewableScore: 75, transportScore: 85, environmentalRisk: 15 },
  { _id: "33", name: "Tamil Nadu IT Corridor Station", type: "refueling", location: { lat: 12.9716, lng: 80.2431, address: "Chennai OMR", state: "Tamil Nadu", district: "Chennai" }, capacity: 6, status: "operational", operator: "Hindustan Petroleum H2", renewableScore: 82, transportScore: 90, environmentalRisk: 12 },
  { _id: "34", name: "Maharashtra Express Station", type: "refueling", location: { lat: 18.5204, lng: 73.8567, address: "Mumbai-Pune Expressway", state: "Maharashtra", district: "Pune" }, capacity: 7, status: "planned", operator: "Reliance Hydrogen", renewableScore: 85, transportScore: 95, environmentalRisk: 8 },
  { _id: "35", name: "Karnataka Tech Hub Station", type: "refueling", location: { lat: 12.9716, lng: 77.5946, address: "Bangalore Electronic City", state: "Karnataka", district: "Bangalore" }, capacity: 5, status: "operational", operator: "Shell Hydrogen India", renewableScore: 88, transportScore: 85, environmentalRisk: 10 },
  { _id: "36", name: "Andhra Pradesh Port Station", type: "refueling", location: { lat: 17.6868, lng: 83.2185, address: "Visakhapatnam Port Road", state: "Andhra Pradesh", district: "Visakhapatnam" }, capacity: 6, status: "under_construction", operator: "HPCL Hydrogen", renewableScore: 78, transportScore: 88, environmentalRisk: 18 },
  { _id: "37", name: "West Bengal Industrial Station", type: "refueling", location: { lat: 22.5726, lng: 88.3639, address: "Kolkata Bypass", state: "West Bengal", district: "Kolkata" }, capacity: 4, status: "planned", operator: "BPCL Hydrogen", renewableScore: 70, transportScore: 80, environmentalRisk: 25 },
  { _id: "38", name: "Punjab Highway Station", type: "refueling", location: { lat: 30.7333, lng: 76.7794, address: "Chandigarh-Delhi Highway", state: "Punjab", district: "Chandigarh" }, capacity: 5, status: "operational", operator: "IOCL Hydrogen", renewableScore: 77, transportScore: 88, environmentalRisk: 20 },
  { _id: "39", name: "Odisha Coastal Station", type: "refueling", location: { lat: 19.8107, lng: 85.8245, address: "Puri-Bhubaneswar Highway", state: "Odisha", district: "Puri" }, capacity: 4, status: "under_construction", operator: "Total Energies H2", renewableScore: 72, transportScore: 75, environmentalRisk: 22 },
  { _id: "40", name: "Haryana NCR Station", type: "refueling", location: { lat: 28.4595, lng: 77.0266, address: "Gurgaon Cyber City", state: "Haryana", district: "Gurgaon" }, capacity: 8, status: "planned", operator: "Air Liquide India", renewableScore: 90, transportScore: 95, environmentalRisk: 5 }
];

export function AssetManager() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Filter dummy assets based on selected filters
  const filteredAssets = dummyAssets.filter(asset => {
    const typeMatch = !selectedType || asset.type === selectedType;
    const stateMatch = !selectedState || asset.location.state === selectedState;
    const statusMatch = !selectedStatus || asset.status === selectedStatus;
    return typeMatch && stateMatch && statusMatch;
  });

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset);
  };

  const handleBackToList = () => {
    setSelectedAsset(null);
  };

  // Interactive button functions
  const handleViewAnalytics = () => {
    toast.success(`📊 Loading analytics for ${selectedAsset.name}...`);
    setShowAnalytics(true);
  };

  const handleMaintenanceSchedule = () => {
    toast.success(`🔧 Opening maintenance schedule for ${selectedAsset.name}...`);
    // Simulate maintenance schedule
    setTimeout(() => {
      toast.info("Maintenance calendar would display upcoming inspections, repairs, and scheduled downtime.");
    }, 1000);
  };

  const handleGenerateReport = () => {
    toast.success("📋 Generating comprehensive asset report...");
    
    // Create Excel-like data structure
    const reportData = {
      assetInfo: {
        name: selectedAsset.name,
        type: selectedAsset.type,
        operator: selectedAsset.operator,
        capacity: selectedAsset.capacity,
        status: selectedAsset.status,
        assetId: selectedAsset._id
      },
      location: {
        address: selectedAsset.location.address,
        district: selectedAsset.location.district,
        state: selectedAsset.location.state,
        coordinates: `${selectedAsset.location.lat.toFixed(4)}, ${selectedAsset.location.lng.toFixed(4)}`
      },
      performance: {
        renewableScore: selectedAsset.renewableScore,
        transportScore: selectedAsset.transportScore,
        environmentalRisk: selectedAsset.environmentalRisk
      },
      reportGenerated: new Date().toLocaleString()
    };

    // Convert to CSV format for Excel compatibility
    const csvContent = generateCSVReport(reportData);
    downloadCSVFile(csvContent, `${selectedAsset.name}_Asset_Report_${new Date().toISOString().split('T')[0]}.csv`);
    
    setTimeout(() => {
      toast.success("✅ Asset report downloaded successfully!");
    }, 1500);
  };

  const generateCSVReport = (data: any) => {
    const csvRows = [
      // Header
      "Asset Comprehensive Report",
      "",
      "Asset Information",
      "Field,Value",
      `Asset Name,${data.assetInfo.name}`,
      `Asset Type,${data.assetInfo.type}`,
      `Operator,${data.assetInfo.operator}`,
      `Capacity,${data.assetInfo.capacity} MW`,
      `Status,${data.assetInfo.status}`,
      `Asset ID,${data.assetInfo.assetId}`,
      "",
      "Location Details",
      "Field,Value",
      `Address,${data.location.address}`,
      `District,${data.location.district}`,
      `State,${data.location.state}`,
      `Coordinates,${data.location.coordinates}`,
      "",
      "Performance Metrics",
      "Metric,Score (0-100)",
      `Renewable Energy Score,${data.performance.renewableScore}`,
      `Transport Connectivity,${data.performance.transportScore}`,
      `Environmental Risk,${data.performance.environmentalRisk}`,
      "",
      "Report Details",
      "Field,Value",
      `Generated On,${data.reportGenerated}`,
      `Report Type,Comprehensive Asset Analysis`,
      `Data Source,Hydrogen Infrastructure Management System`
    ];
    
    return csvRows.join('\n');
  };

  const downloadCSVFile = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const [assetForm, setAssetForm] = useState({
    name: "",
    type: "plant" as const,
    location: {
      lat: 0,
      lng: 0,
      address: "",
      state: "",
      district: "",
    },
    capacity: 0,
    status: "planned" as const,
    operator: "",
    renewableScore: 0,
    transportScore: 0,
    environmentalRisk: 0,
  });

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate adding asset
      toast.success("Asset added successfully");
      setShowAddForm(false);
      setAssetForm({
        name: "",
        type: "plant",
        location: { lat: 0, lng: 0, address: "", state: "", district: "" },
        capacity: 0,
        status: "planned",
        operator: "",
        renewableScore: 0,
        transportScore: 0,
        environmentalRisk: 0,
      });
    } catch (error) {
      toast.error("Failed to add asset");
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        // Simulate deleting asset
        toast.success("Asset deleted successfully");
      } catch (error) {
        toast.error("Failed to delete asset");
      }
    }
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  // If analytics view is selected, show analytics dashboard
  if (showAnalytics && selectedAsset) {
    return (
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setShowAnalytics(false)}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
          >
            <span className="mr-2 text-lg">←</span>
            <span className="font-medium">Back to Asset Details</span>
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">{selectedAsset.name}</p>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">📊 Key Performance Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Efficiency Score</p>
                    <p className="text-2xl font-bold text-blue-800">{((selectedAsset.renewableScore + selectedAsset.transportScore) / 2).toFixed(1)}%</p>
                  </div>
                  <div className="text-3xl">⚡</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Capacity Utilization</p>
                    <p className="text-2xl font-bold text-green-800">{Math.floor(Math.random() * 30 + 70)}%</p>
                  </div>
                  <div className="text-3xl">🏭</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Uptime</p>
                    <p className="text-2xl font-bold text-yellow-800">{Math.floor(Math.random() * 10 + 90)}.{Math.floor(Math.random() * 9)}%</p>
                  </div>
                  <div className="text-3xl">🕒</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">ROI</p>
                    <p className="text-2xl font-bold text-purple-800">{Math.floor(Math.random() * 8 + 12)}%</p>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">📈 Performance Trends (Last 12 Months)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Production Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Monthly Production (MW)</h3>
                <div className="h-48 bg-gray-50 rounded-lg p-4 relative">
                  <div className="flex items-end justify-between h-full space-x-1 relative">
                    {(() => {
                      // Generate realistic production data based on asset capacity and seasonal patterns
                      const baseProduction = selectedAsset.capacity * 0.7; // 70% base utilization
                      const monthlyData = Array.from({length: 12}, (_, i) => {
                        // Seasonal factors: higher in winter (Dec-Feb), lower in monsoon (Jun-Sep)
                        const seasonalMultiplier = [1.2, 1.15, 1.0, 0.95, 0.9, 0.75, 0.7, 0.75, 0.85, 0.95, 1.1, 1.25][i];
                        // Add some random variation (±15%)
                        const randomFactor = 0.85 + Math.random() * 0.3;
                        // Consider asset status
                        const statusFactor = selectedAsset.status === 'operational' ? 1.0 : 
                                           selectedAsset.status === 'under_construction' ? 0.3 : 0.1;
                        
                        const production = baseProduction * seasonalMultiplier * randomFactor * statusFactor;
                        const height = Math.min((production / selectedAsset.capacity) * 100, 100);
                        
                        return {
                          value: production.toFixed(1),
                          height: height,
                          month: ['J','F','M','A','M','J','J','A','S','O','N','D'][i]
                        };
                      });

                      // Create SVG line path
                      const chartHeight = 144; // h-36 in pixels
                      const chartWidth = 264; // approximate width for 12 bars with spacing
                      const pathData = monthlyData.map((data, i) => {
                        const x = (i / 11) * chartWidth; // distribute evenly across width
                        const y = chartHeight - (data.height / 100) * chartHeight; // invert Y for SVG
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ');

                      return (
                        <>
                          {/* Red trend line */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{top: '16px', left: '16px', right: '16px', bottom: '32px'}}>
                            <path
                              d={pathData}
                              stroke="#dc2626"
                              strokeWidth="2"
                              fill="none"
                              className="drop-shadow-sm"
                            />
                            {/* Data points */}
                            {monthlyData.map((data, i) => {
                              const x = (i / 11) * chartWidth;
                              const y = chartHeight - (data.height / 100) * chartHeight;
                              return (
                                <circle
                                  key={i}
                                  cx={x}
                                  cy={y}
                                  r="3"
                                  fill="#dc2626"
                                  className="drop-shadow-sm"
                                />
                              );
                            })}
                          </svg>
                          
                          {/* Bar chart */}
                          {monthlyData.map((data, i) => (
                            <div key={i} className="flex flex-col items-center space-y-1 group relative z-10">
                              <div 
                                className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t w-6 transition-all duration-300 hover:from-blue-700 hover:to-blue-500 cursor-pointer opacity-80"
                                style={{height: `${data.height}%`}}
                              >
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity z-20">
                                  {data.value} MW
                                </div>
                              </div>
                              <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-1 top-4 bottom-8 flex flex-col justify-between text-xs text-gray-400">
                    <span>{selectedAsset.capacity}</span>
                    <span>{Math.round(selectedAsset.capacity * 0.75)}</span>
                    <span>{Math.round(selectedAsset.capacity * 0.5)}</span>
                    <span>{Math.round(selectedAsset.capacity * 0.25)}</span>
                    <span>0</span>
                  </div>
                </div>
                
                {/* Production insights */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <span className="text-blue-600 font-medium">Peak:</span> 
                    <span className="text-blue-800 ml-1">Dec-Jan</span>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <span className="text-orange-600 font-medium">Low:</span> 
                    <span className="text-orange-800 ml-1">Monsoon</span>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <span className="text-red-600 font-medium">Trend:</span> 
                    <span className="text-red-800 ml-1">Line Graph</span>
                  </div>
                </div>
              </div>

              {/* Efficiency Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Efficiency Trends (%)</h3>
                <div className="h-48 bg-gray-50 rounded-lg p-4 relative">
                  <div className="flex items-end justify-between h-full space-x-1 relative">
                    {(() => {
                      // Generate realistic efficiency data with gradual improvements and maintenance dips
                      const baseEfficiency = (selectedAsset.renewableScore + selectedAsset.transportScore) / 2;
                      const monthlyEfficiency = Array.from({length: 12}, (_, i) => {
                        // Efficiency typically improves over time with optimizations
                        const improvementTrend = i * 0.5; // 0.5% improvement per month
                        
                        // Maintenance dips (assume maintenance in months 3, 7, 11)
                        const maintenanceDip = [3, 7, 11].includes(i) ? -8 : 0;
                        
                        // Seasonal efficiency (better in moderate weather)
                        const seasonalFactor = [0, 2, 4, 6, 5, -2, -5, -3, 1, 4, 3, 1][i];
                        
                        // Random variation (±3%)
                        const randomVariation = (Math.random() - 0.5) * 6;
                        
                        const efficiency = Math.max(40, Math.min(95, 
                          baseEfficiency + improvementTrend + maintenanceDip + seasonalFactor + randomVariation
                        ));
                        
                        return {
                          value: efficiency.toFixed(1),
                          height: efficiency,
                          month: ['J','F','M','A','M','J','J','A','S','O','N','D'][i],
                          isMaintenance: [3, 7, 11].includes(i)
                        };
                      });

                      // Create SVG line path for efficiency
                      const chartHeight = 144; // h-36 in pixels
                      const chartWidth = 264; // approximate width for 12 bars with spacing
                      const pathData = monthlyEfficiency.map((data, i) => {
                        const x = (i / 11) * chartWidth;
                        const y = chartHeight - (data.height / 100) * chartHeight; // invert Y for SVG
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ');

                      return (
                        <>
                          {/* Red trend line */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{top: '16px', left: '16px', right: '16px', bottom: '32px'}}>
                            <path
                              d={pathData}
                              stroke="#dc2626"
                              strokeWidth="2"
                              fill="none"
                              className="drop-shadow-sm"
                            />
                            {/* Data points with different colors for maintenance */}
                            {monthlyEfficiency.map((data, i) => {
                              const x = (i / 11) * chartWidth;
                              const y = chartHeight - (data.height / 100) * chartHeight;
                              return (
                                <circle
                                  key={i}
                                  cx={x}
                                  cy={y}
                                  r="3"
                                  fill={data.isMaintenance ? "#f97316" : "#dc2626"}
                                  className="drop-shadow-sm"
                                />
                              );
                            })}
                          </svg>
                          
                          {/* Bar chart */}
                          {monthlyEfficiency.map((data, i) => (
                            <div key={i} className="flex flex-col items-center space-y-1 group relative z-10">
                              <div 
                                className={`rounded-t w-6 transition-all duration-300 cursor-pointer opacity-80 ${
                                  data.isMaintenance 
                                    ? 'bg-gradient-to-t from-orange-500 to-orange-300 hover:from-orange-600 hover:to-orange-400'
                                    : 'bg-gradient-to-t from-green-600 to-green-400 hover:from-green-700 hover:to-green-500'
                                }`}
                                style={{height: `${data.height}%`}}
                              >
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity z-20">
                                  {data.value}% {data.isMaintenance ? '(Maintenance)' : ''}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-1 top-4 bottom-8 flex flex-col justify-between text-xs text-gray-400">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>
                </div>
                
                {/* Efficiency insights */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-green-50 p-2 rounded">
                    <span className="text-green-600 font-medium">Trend:</span> 
                    <span className="text-green-800 ml-1">↗ Improving</span>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <span className="text-orange-600 font-medium">Maintenance:</span> 
                    <span className="text-orange-800 ml-1">Mar, Jul, Nov</span>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <span className="text-red-600 font-medium">Line:</span> 
                    <span className="text-red-800 ml-1">Trend Graph</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chart Legend and Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">📊 Production Analysis</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Peak production during winter months</li>
                  <li>• Reduced output during monsoon season</li>
                  <li>• Current capacity utilization: {Math.round((selectedAsset.renewableScore + selectedAsset.transportScore) / 2)}%</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">⚡ Efficiency Analysis</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Steady improvement trend over time</li>
                  <li>• Temporary dips during maintenance periods</li>
                  <li>• Weather-dependent performance variations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Operational Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Environmental Impact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">🌍 Environmental Impact</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">CO₂ Reduction</span>
                  <span className="font-bold text-green-600">{Math.floor(Math.random() * 500 + 1000)} tons/year</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Water Usage</span>
                  <span className="font-bold text-blue-600">{Math.floor(Math.random() * 100 + 200)} m³/day</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-gray-700">Energy Efficiency</span>
                  <span className="font-bold text-yellow-600">{selectedAsset.renewableScore}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700">Risk Level</span>
                  <span className="font-bold text-red-600">
                    {selectedAsset.environmentalRisk < 20 ? 'Low' : 
                     selectedAsset.environmentalRisk < 40 ? 'Medium' : 'High'}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">💰 Financial Analysis</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Annual Revenue</span>
                  <span className="font-bold text-purple-600">₹{Math.floor(selectedAsset.capacity * 2.5 + Math.random() * 100)} Cr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700">Operating Costs</span>
                  <span className="font-bold text-orange-600">₹{Math.floor(selectedAsset.capacity * 0.8 + Math.random() * 50)} Cr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Profit Margin</span>
                  <span className="font-bold text-green-600">{Math.floor(Math.random() * 15 + 25)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Payback Period</span>
                  <span className="font-bold text-blue-600">{Math.floor(Math.random() * 3 + 6)} years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance & Operations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">🔧 Maintenance & Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🛠️</div>
                <h3 className="font-semibold text-gray-800">Last Maintenance</h3>
                <p className="text-gray-600">{Math.floor(Math.random() * 30 + 1)} days ago</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="font-semibold text-gray-800">Next Scheduled</h3>
                <p className="text-gray-600">In {Math.floor(Math.random() * 60 + 10)} days</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">⚠️</div>
                <h3 className="font-semibold text-gray-800">Alerts</h3>
                <p className="text-gray-600">{Math.floor(Math.random() * 5)} active</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">💡 AI-Powered Recommendations</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="text-blue-500 text-xl">🚀</div>
                <div>
                  <h3 className="font-semibold text-blue-800">Optimize Production Schedule</h3>
                  <p className="text-blue-700 text-sm">Consider increasing production during peak demand hours (2-6 PM) to improve efficiency by 12%.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="text-green-500 text-xl">🌱</div>
                <div>
                  <h3 className="font-semibold text-green-800">Renewable Integration</h3>
                  <p className="text-green-700 text-sm">Installing additional solar panels could increase your renewable score by 8 points and reduce costs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div className="text-yellow-500 text-xl">⚡</div>
                <div>
                  <h3 className="font-semibold text-yellow-800">Maintenance Optimization</h3>
                  <p className="text-yellow-700 text-sm">Predictive maintenance could reduce downtime by 15% and save ₹2.5 Cr annually.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">📤 Export Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={handleGenerateReport}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                📊 Download Full Report
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                📈 Export Charts
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                📋 Share Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If an asset is selected, show detailed view
  if (selectedAsset) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
          >
            <span className="mr-2 text-lg">←</span>
            <span className="font-medium">Back to Asset List</span>
          </button>
        </div>

        {/* Asset Detail View */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedAsset.name}</h2>
                <p className="text-gray-600 text-lg">{selectedAsset.operator}</p>
                <div className="flex items-center mt-3 space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedAsset.type === 'plant' ? 'bg-blue-100 text-blue-800' :
                    selectedAsset.type === 'storage' ? 'bg-green-100 text-green-800' :
                    selectedAsset.type === 'pipeline' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedAsset.type === 'plant' ? '🏭 Production Plant' :
                     selectedAsset.type === 'storage' ? '🏗️ Storage Facility' :
                     selectedAsset.type === 'pipeline' ? '🚛 Pipeline' :
                     '⛽ Refueling Station'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    selectedAsset.status === 'operational' ? 'bg-green-100 text-green-800' :
                    selectedAsset.status === 'under_construction' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedAsset.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{selectedAsset.capacity} MW</div>
                <div className="text-gray-500">Capacity</div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Location Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📍 Location Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Address:</span>
                    <span className="text-gray-900">{selectedAsset.location.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">District:</span>
                    <span className="text-gray-900">{selectedAsset.location.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">State:</span>
                    <span className="text-gray-900">{selectedAsset.location.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Coordinates:</span>
                    <span className="text-gray-900">{selectedAsset.location.lat.toFixed(4)}, {selectedAsset.location.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Renewable Energy Score</span>
                      <span className="text-green-600 font-bold">{selectedAsset.renewableScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${selectedAsset.renewableScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Transport Connectivity</span>
                      <span className="text-blue-600 font-bold">{selectedAsset.transportScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${selectedAsset.transportScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Environmental Risk</span>
                      <span className="text-red-600 font-bold">{selectedAsset.environmentalRisk}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-red-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${selectedAsset.environmentalRisk}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              {/* Asset Statistics */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Asset Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedAsset.capacity}</div>
                    <div className="text-blue-700 text-sm">MW Capacity</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedAsset.renewableScore}</div>
                    <div className="text-green-700 text-sm">Renewable Score</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedAsset.transportScore}</div>
                    <div className="text-purple-700 text-sm">Transport Score</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{selectedAsset.environmentalRisk}</div>
                    <div className="text-red-700 text-sm">Env. Risk</div>
                  </div>
                </div>
              </div>

              {/* Operational Details */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Operational Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Asset Type:</span>
                    <span className="text-gray-900 capitalize">{selectedAsset.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Current Status:</span>
                    <span className={`font-medium capitalize ${
                      selectedAsset.status === 'operational' ? 'text-green-600' :
                      selectedAsset.status === 'under_construction' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {selectedAsset.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Operator:</span>
                    <span className="text-gray-900">{selectedAsset.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Asset ID:</span>
                    <span className="text-gray-900">{selectedAsset._id}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleViewAnalytics}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  📊 View Analytics
                </button>
                <button 
                  onClick={handleMaintenanceSchedule}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  🔧 Maintenance Schedule
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  📋 Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hydrogen Asset Manager</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Asset
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="plant">Production Plant</option>
            <option value="storage">Storage Facility</option>
            <option value="pipeline">Pipeline</option>
            <option value="refueling">Refueling Station</option>
          </select>

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

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="operational">Operational</option>
            <option value="under_construction">Under Construction</option>
            <option value="planned">Planned</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredAssets?.length || 0} assets
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets?.map((asset) => (
          <div 
            key={asset._id} 
            onClick={() => handleAssetClick(asset)}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02] border-2 border-transparent hover:border-blue-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{asset.name}</h3>
                  <p className="text-sm text-gray-600">{asset.operator}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    asset.type === 'plant' ? 'bg-blue-100 text-blue-800' :
                    asset.type === 'storage' ? 'bg-green-100 text-green-800' :
                    asset.type === 'pipeline' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {asset.type}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAsset(asset._id);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{asset.location.district}, {asset.location.state}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{asset.capacity} MW</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium capitalize ${
                    asset.status === 'operational' ? 'text-green-600' :
                    asset.status === 'under_construction' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {asset.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Renewable Score:</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${asset.renewableScore}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{asset.renewableScore}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Transport Score:</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${asset.transportScore}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{asset.transportScore}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Environmental Risk:</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${asset.environmentalRisk}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{asset.environmentalRisk}</span>
                  </div>
                </div>
              </div>
              
              {/* Click indicator */}
              <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                <span className="text-xs text-blue-600 font-medium hover:text-blue-800">
                  Click to view detailed information →
                </span>
              </div>
            </div>
          </div>
        )) || (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🏭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No assets found</h3>
            <p className="text-gray-600">Add your first hydrogen infrastructure asset to get started.</p>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Asset</h3>
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Asset Name"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={assetForm.type}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="plant">Production Plant</option>
                  <option value="storage">Storage Facility</option>
                  <option value="pipeline">Pipeline</option>
                  <option value="refueling">Refueling Station</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.000001"
                  placeholder="Latitude"
                  value={assetForm.location.lat || ""}
                  onChange={(e) => setAssetForm(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, lat: Number(e.target.value) }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="number"
                  step="0.000001"
                  placeholder="Longitude"
                  value={assetForm.location.lng || ""}
                  onChange={(e) => setAssetForm(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, lng: Number(e.target.value) }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                value={assetForm.location.address}
                onChange={(e) => setAssetForm(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, address: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={assetForm.location.state}
                  onChange={(e) => setAssetForm(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, state: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="District"
                  value={assetForm.location.district}
                  onChange={(e) => setAssetForm(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, district: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Capacity (MW)"
                  value={assetForm.capacity || ""}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={assetForm.status}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="planned">Planned</option>
                  <option value="under_construction">Under Construction</option>
                  <option value="operational">Operational</option>
                </select>
                <input
                  type="text"
                  placeholder="Operator"
                  value={assetForm.operator}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, operator: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Renewable Score (0-100): {assetForm.renewableScore}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={assetForm.renewableScore}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, renewableScore: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transport Score (0-100): {assetForm.transportScore}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={assetForm.transportScore}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, transportScore: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Environmental Risk (0-100): {assetForm.environmentalRisk}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={assetForm.environmentalRisk}
                    onChange={(e) => setAssetForm(prev => ({ ...prev, environmentalRisk: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
