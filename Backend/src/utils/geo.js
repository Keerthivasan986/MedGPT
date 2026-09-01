const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Haversine distance between two [longitude, latitude] pairs.
export function distanceKm([lng1, lat1], [lng2, lat2]) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return Number((2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))).toFixed(2));
}

export function nearSphere([lng, lat], radiusKm) {
  return {
    $nearSphere: {
      $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
      $maxDistance: Number(radiusKm) * 1000
    }
  };
}

export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
