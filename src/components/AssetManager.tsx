import { useState } from "react";
import apiClient, { useRestQuery, useRestMutation } from "../apiClient";
import { toast } from "sonner";

export function AssetManager() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);

  const assets: any[] = useRestQuery(apiClient.assets.list, { type: selectedType || undefined, state: selectedState || undefined, status: selectedStatus || undefined }) || [];
  const addAsset = useRestMutation(apiClient.assets.create);
  const deleteAsset = useRestMutation(apiClient.assets.delete);
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
  await addAsset(assetForm);
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
        await deleteAsset(id);
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
            Showing {assets?.length || 0} assets
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets?.map((asset) => (
          <div key={asset._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
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
                    onClick={() => handleDeleteAsset(asset._id)}
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
                  <span className={`font-medium ${
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
