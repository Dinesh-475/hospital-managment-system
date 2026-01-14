import { useState, useEffect } from 'react';
import { GeoLocation, LocationCheck } from '@/types/attendance';
import { getCurrentLocation, checkGeofence, requestLocationPermission } from '@/services/geofencing';

export function useGeolocation() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [locationCheck, setLocationCheck] = useState<LocationCheck | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Request permission on mount
  useEffect(() => {
    requestLocationPermission().then(setHasPermission);
  }, []);

  const checkLocation = async () => {
    if (!hasPermission) {
      setError('Location permission not granted');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      const check = checkGeofence(currentLocation);
      setLocationCheck(check);

      if (check.status === 'error') {
        setError(check.message);
      }
    } catch (err) {
      setError('Failed to get location. Please try again.');
      console.error('Location error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLocation = () => {
    checkLocation();
  };

  return {
    location,
    locationCheck,
    isLoading,
    error,
    hasPermission,
    checkLocation,
    refreshLocation
  };
}
