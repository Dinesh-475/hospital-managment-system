import { getDistance } from 'geolib';

export const isWithinGeofence = (
  userLat: number,
  userLng: number,
  centerLat: number,
  centerLng: number,
  radiusMeters: number
): boolean => {
  const distance = getDistance(
    { latitude: userLat, longitude: userLng },
    { latitude: centerLat, longitude: centerLng }
  );
  return distance <= radiusMeters;
};

export const calculateDistanceFromCenter = (
  userLat: number,
  userLng: number,
  centerLat: number,
  centerLng: number
): number => {
  return getDistance(
    { latitude: userLat, longitude: userLng },
    { latitude: centerLat, longitude: centerLng }
  );
};
