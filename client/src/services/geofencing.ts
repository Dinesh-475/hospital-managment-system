import { GeoLocation, GeofenceConfig, LocationCheck, WorkingHours } from '@/types/attendance';

// Hospital Configuration (Delhi, India - example coordinates)
export const HOSPITAL_CONFIG: GeofenceConfig = {
  hospitalLocation: {
    latitude: 28.6139,
    longitude: 77.2090,
    accuracy: 10,
    timestamp: new Date()
  },
  radiusMeters: 100,
  entryPoints: [
    {
      name: 'Main Entrance',
      location: { latitude: 28.6140, longitude: 77.2091, accuracy: 5, timestamp: new Date() },
      description: 'Primary hospital entrance'
    },
    {
      name: 'Emergency Entrance',
      location: { latitude: 28.6138, longitude: 77.2089, accuracy: 5, timestamp: new Date() },
      description: 'Emergency department entrance'
    },
    {
      name: 'Staff Entrance',
      location: { latitude: 28.6141, longitude: 77.2088, accuracy: 5, timestamp: new Date() },
      description: 'Staff and employee entrance'
    }
  ],
  workingHours: {
    start: '09:00',
    end: '17:00',
    weeklyOffs: [0, 6] // Sunday, Saturday
  },
  gracePeriodMinutes: 15,
  requiredAccuracy: 50
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Check if a location is within the geofence
 * @param userLocation User's current location
 * @param config Geofence configuration
 * @returns LocationCheck result
 */
export function checkGeofence(
  userLocation: GeoLocation,
  config: GeofenceConfig = HOSPITAL_CONFIG
): LocationCheck {
  // Check GPS accuracy
  if (userLocation.accuracy > config.requiredAccuracy) {
    return {
      status: 'error',
      distance: 0,
      location: userLocation,
      message: `GPS accuracy too low (${Math.round(userLocation.accuracy)}m). Please move to an open area.`
    };
  }

  // Calculate distance from hospital
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    config.hospitalLocation.latitude,
    config.hospitalLocation.longitude
  );

  // Check if within geofence
  if (distance <= config.radiusMeters) {
    return {
      status: 'inside',
      distance: Math.round(distance),
      location: userLocation,
      message: `Inside campus (${Math.round(distance)}m from center)`
    };
  } else {
    return {
      status: 'outside',
      distance: Math.round(distance),
      location: userLocation,
      message: `Outside campus (${Math.round(distance)}m away)`
    };
  }
}

/**
 * Get current location (simulated for development)
 * In production, this would use navigator.geolocation
 */
export async function getCurrentLocation(): Promise<GeoLocation> {
  return new Promise((resolve) => {
    // Simulate location fetch delay
    setTimeout(() => {
      // For development: return a location near hospital (within geofence)
      // In production, use: navigator.geolocation.getCurrentPosition()
      
      const mockLocation: GeoLocation = {
        latitude: 28.6140, // Slightly offset from hospital center
        longitude: 77.2091,
        accuracy: 15, // Good GPS accuracy
        timestamp: new Date()
      };

      resolve(mockLocation);
    }, 1000);
  });
}

/**
 * Request location permission (simulated)
 */
export async function requestLocationPermission(): Promise<boolean> {
  // In production: check navigator.permissions
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Simulate permission granted
    }, 500);
  });
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

/**
 * Check if current time is within working hours
 */
export function isWithinWorkingHours(
  workingHours: WorkingHours = HOSPITAL_CONFIG.workingHours
): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  
  // Check if it's a weekly off
  if (workingHours.weeklyOffs.includes(currentDay)) {
    return false;
  }

  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return currentTime >= workingHours.start && currentTime <= workingHours.end;
}

/**
 * Calculate if arrival is late
 */
export function calculateLateMinutes(
  clockInTime: string,
  workingHours: WorkingHours = HOSPITAL_CONFIG.workingHours
): number {
  const [clockHour, clockMin] = clockInTime.split(':').map(Number);
  const [startHour, startMin] = workingHours.start.split(':').map(Number);
  
  const clockInMinutes = clockHour * 60 + clockMin;
  const startMinutes = startHour * 60 + startMin;
  
  return Math.max(0, clockInMinutes - startMinutes);
}
