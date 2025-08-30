// Realistic dummy transport infrastructure data for India
// Covers highways, railways, ports, airports, pipelines across all states

export const transportInfraData = [
  // Highways
  { _id: '1', name: 'NH 44', type: 'highway', location: { state: 'Uttar Pradesh' }, capacity: 12000000, connectivity: 85, strategicImportance: 92 },
  { _id: '2', name: 'NH 16', type: 'highway', location: { state: 'Odisha' }, capacity: 9000000, connectivity: 80, strategicImportance: 88 },
  { _id: '3', name: 'NH 48', type: 'highway', location: { state: 'Gujarat' }, capacity: 11000000, connectivity: 83, strategicImportance: 90 },
  { _id: '4', name: 'NH 27', type: 'highway', location: { state: 'Assam' }, capacity: 8000000, connectivity: 78, strategicImportance: 85 },
  // Railways
  { _id: '5', name: 'Howrah–Delhi Main Line', type: 'railway', location: { state: 'West Bengal' }, capacity: 15000000, connectivity: 90, strategicImportance: 95 },
  { _id: '6', name: 'Konkan Railway', type: 'railway', location: { state: 'Goa' }, capacity: 7000000, connectivity: 75, strategicImportance: 80 },
  { _id: '7', name: 'Chennai–Mumbai Line', type: 'railway', location: { state: 'Tamil Nadu' }, capacity: 12000000, connectivity: 85, strategicImportance: 88 },
  { _id: '8', name: 'Delhi–Mumbai Line', type: 'railway', location: { state: 'Maharashtra' }, capacity: 13000000, connectivity: 87, strategicImportance: 90 },
  // Ports
  { _id: '9', name: 'Jawaharlal Nehru Port', type: 'port', location: { state: 'Maharashtra' }, capacity: 10000000, connectivity: 80, strategicImportance: 93 },
  { _id: '10', name: 'Chennai Port', type: 'port', location: { state: 'Tamil Nadu' }, capacity: 8000000, connectivity: 78, strategicImportance: 85 },
  { _id: '11', name: 'Kolkata Port', type: 'port', location: { state: 'West Bengal' }, capacity: 7000000, connectivity: 75, strategicImportance: 82 },
  { _id: '12', name: 'Paradip Port', type: 'port', location: { state: 'Odisha' }, capacity: 6000000, connectivity: 72, strategicImportance: 80 },
  // Airports
  { _id: '13', name: 'Indira Gandhi International Airport', type: 'airport', location: { state: 'Delhi' }, capacity: 18000000, connectivity: 95, strategicImportance: 98 },
  { _id: '14', name: 'Chhatrapati Shivaji Maharaj International Airport', type: 'airport', location: { state: 'Maharashtra' }, capacity: 16000000, connectivity: 92, strategicImportance: 96 },
  { _id: '15', name: 'Kempegowda International Airport', type: 'airport', location: { state: 'Karnataka' }, capacity: 14000000, connectivity: 90, strategicImportance: 94 },
  { _id: '16', name: 'Netaji Subhas Chandra Bose International Airport', type: 'airport', location: { state: 'West Bengal' }, capacity: 12000000, connectivity: 88, strategicImportance: 92 },
  // Pipelines
  { _id: '17', name: 'HBJ Gas Pipeline', type: 'pipeline', location: { state: 'Madhya Pradesh' }, capacity: 10000000, connectivity: 80, strategicImportance: 90 },
  { _id: '18', name: 'Kochi–Mangalore Pipeline', type: 'pipeline', location: { state: 'Kerala' }, capacity: 7000000, connectivity: 75, strategicImportance: 85 },
  { _id: '19', name: 'Jamnagar–Loni LPG Pipeline', type: 'pipeline', location: { state: 'Gujarat' }, capacity: 8000000, connectivity: 78, strategicImportance: 88 },
  { _id: '20', name: 'Vizag–Secunderabad Pipeline', type: 'pipeline', location: { state: 'Andhra Pradesh' }, capacity: 6000000, connectivity: 72, strategicImportance: 80 },
  // More entries for coverage (21-40)
  { _id: '21', name: 'NH 2', type: 'highway', location: { state: 'Bihar' }, capacity: 7000000, connectivity: 75, strategicImportance: 82 },
  { _id: '22', name: 'NH 7', type: 'highway', location: { state: 'Karnataka' }, capacity: 9000000, connectivity: 80, strategicImportance: 88 },
  { _id: '23', name: 'NH 8', type: 'highway', location: { state: 'Rajasthan' }, capacity: 8000000, connectivity: 78, strategicImportance: 85 },
  { _id: '24', name: 'NH 9', type: 'highway', location: { state: 'Telangana' }, capacity: 6000000, connectivity: 72, strategicImportance: 80 },
  { _id: '25', name: 'Eastern Dedicated Freight Corridor', type: 'railway', location: { state: 'Uttar Pradesh' }, capacity: 14000000, connectivity: 90, strategicImportance: 95 },
  { _id: '26', name: 'Western Dedicated Freight Corridor', type: 'railway', location: { state: 'Gujarat' }, capacity: 13000000, connectivity: 87, strategicImportance: 90 },
  { _id: '27', name: 'Mumbai Port', type: 'port', location: { state: 'Maharashtra' }, capacity: 9000000, connectivity: 80, strategicImportance: 88 },
  { _id: '28', name: 'Goa International Airport', type: 'airport', location: { state: 'Goa' }, capacity: 8000000, connectivity: 78, strategicImportance: 85 },
  { _id: '29', name: 'Barauni–Kanpur Pipeline', type: 'pipeline', location: { state: 'Uttar Pradesh' }, capacity: 7000000, connectivity: 75, strategicImportance: 82 },
  { _id: '30', name: 'NH 15', type: 'highway', location: { state: 'Assam' }, capacity: 6000000, connectivity: 72, strategicImportance: 80 },
  { _id: '31', name: 'NH 6', type: 'highway', location: { state: 'Chhattisgarh' }, capacity: 7000000, connectivity: 75, strategicImportance: 82 },
  { _id: '32', name: 'NH 17', type: 'highway', location: { state: 'Kerala' }, capacity: 8000000, connectivity: 78, strategicImportance: 85 },
  { _id: '33', name: 'NH 31', type: 'highway', location: { state: 'West Bengal' }, capacity: 9000000, connectivity: 80, strategicImportance: 88 },
  { _id: '34', name: 'NH 66', type: 'highway', location: { state: 'Goa' }, capacity: 6000000, connectivity: 72, strategicImportance: 80 },
  { _id: '35', name: 'NH 75', type: 'highway', location: { state: 'Karnataka' }, capacity: 7000000, connectivity: 75, strategicImportance: 82 },
  { _id: '36', name: 'NH 85', type: 'highway', location: { state: 'Kerala' }, capacity: 8000000, connectivity: 78, strategicImportance: 85 },
  { _id: '37', name: 'NH 205', type: 'highway', location: { state: 'Himachal Pradesh' }, capacity: 6000000, connectivity: 72, strategicImportance: 80 },
  { _id: '38', name: 'NH 707', type: 'highway', location: { state: 'Uttarakhand' }, capacity: 7000000, connectivity: 75, strategicImportance: 82 },
  { _id: '39', name: 'NH 309', type: 'highway', location: { state: 'Uttarakhand' }, capacity: 8000000, connectivity: 78, strategicImportance: 85 },
  { _id: '40', name: 'NH 10', type: 'highway', location: { state: 'Sikkim' }, capacity: 6000000, connectivity: 72, strategicImportance: 80 },
];

export const strategicCorridorsData = {
  highways: [
    { name: 'Golden Quadrilateral', strategicImportance: 98 },
    { name: 'North-South Corridor', strategicImportance: 95 },
    { name: 'East-West Corridor', strategicImportance: 93 },
  ],
  railways: [
    { name: 'Dedicated Freight Corridor', strategicImportance: 97 },
    { name: 'Rajdhani Express Route', strategicImportance: 94 },
    { name: 'Konkan Railway', strategicImportance: 90 },
  ],
  ports: [
    { name: 'Jawaharlal Nehru Port', strategicImportance: 96 },
    { name: 'Chennai Port', strategicImportance: 92 },
    { name: 'Kolkata Port', strategicImportance: 90 },
  ],
};

export const transportStatsData = {
  total: transportInfraData.length,
  averageConnectivity: (
    transportInfraData.reduce((sum, infra) => sum + infra.connectivity, 0) / transportInfraData.length
  ),
  strategicAssets: transportInfraData.filter(infra => infra.strategicImportance > 85).length,
  totalCapacity: transportInfraData.reduce((sum, infra) => sum + infra.capacity, 0),
  byType: {
    highway: transportInfraData.filter(infra => infra.type === 'highway').length,
    railway: transportInfraData.filter(infra => infra.type === 'railway').length,
    port: transportInfraData.filter(infra => infra.type === 'port').length,
    airport: transportInfraData.filter(infra => infra.type === 'airport').length,
    pipeline: transportInfraData.filter(infra => infra.type === 'pipeline').length,
  },
};
