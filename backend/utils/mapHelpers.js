// utils/mapHelpers.js

/**
 * Calculate distance between two geo points (latitude, longitude) in kilometers using Haversine formula.
 * @param {Array} coord1 [lat, lng]
 * @param {Array} coord2 [lat, lng]
 * @returns {Number} Distance in km
 */
function calculateDistance(coord1, coord2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2[0] - coord1[0]);
    const dLng = toRad(coord2[1] - coord1[1]);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1[0])) * Math.cos(toRad(coord2[0])) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

/**
 * Validate GeoJSON Point object
 * @param {Object} geojson 
 * @returns {Boolean}
 */
function isValidGeoJSONPoint(geojson) {
    return geojson &&
        geojson.type === 'Point' &&
        Array.isArray(geojson.coordinates) &&
        geojson.coordinates.length === 2 &&
        typeof geojson.coordinates[0] === 'number' &&
        typeof geojson.coordinates[1] === 'number';
}

module.exports = {
    calculateDistance,
    isValidGeoJSONPoint
};
