import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { markAttendance } from '@/services/attendanceApi';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatDistance } from '@/services/geofencing';

export const MarkAttendance: React.FC = () => {
  const { currentUser } = useAuth();
  const { location, locationCheck, isLoading, checkLocation } = useGeolocation();
  const [isMarking, setIsMarking] = useState(false);
  const [hasMarkedToday, setHasMarkedToday] = useState(false);

  useEffect(() => {
    // Check location on mount
    checkLocation();
  }, [checkLocation]);

  const handleMarkAttendance = async () => {
    if (!locationCheck || locationCheck.status !== 'inside' || !location || !currentUser) {
      return;
    }

    setIsMarking(true);

    try {
      await markAttendance(
        currentUser.id,
        currentUser.name,
        'clockIn',
        location
      );

      setHasMarkedToday(true);
      toast.success('Attendance marked successfully!', {
        description: `Clock in time: ${new Date().toLocaleTimeString()}`
      });
    } catch {
      toast.error('Failed to mark attendance. Please try again.');
    } finally {
      setIsMarking(false);
    }
  };

  const getStatusColor = () => {
    if (!locationCheck) return 'gray';
    switch (locationCheck.status) {
      case 'inside':
        return 'green';
      case 'outside':
        return 'red';
      case 'checking':
        return 'orange';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="w-6 h-6 animate-spin" />;
    if (!locationCheck) return <MapPin className="w-6 h-6" />;
    
    switch (locationCheck.status) {
      case 'inside':
        return <CheckCircle className="w-6 h-6" />;
      case 'outside':
        return <XCircle className="w-6 h-6" />;
      default:
        return <MapPin className="w-6 h-6" />;
    }
  };

  const canMarkAttendance = locationCheck?.status === 'inside' && !hasMarkedToday && !isMarking;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Location Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          {/* Status Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={locationCheck?.status === 'inside' ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 bg-${getStatusColor()}-500 rounded-full blur-xl`}
              />
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white shadow-lg">
                {getStatusIcon()}
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold text-${getStatusColor()}-600 mb-2`}>
              {isLoading ? 'Checking Location...' : locationCheck?.message || 'Location Unknown'}
            </h2>
            {locationCheck && locationCheck.distance > 0 && (
              <p className="text-gray-600">
                Distance from hospital: {formatDistance(locationCheck.distance)}
              </p>
            )}
          </div>

          {/* Current Time */}
          <div className="flex items-center justify-center gap-2 text-gray-700 mb-6">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-semibold">
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Mark Attendance Button */}
          <button
            onClick={handleMarkAttendance}
            disabled={!canMarkAttendance}
            className={`w-full h-14 rounded-xl font-semibold text-lg transition-all ${
              canMarkAttendance
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isMarking ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Marking Attendance...
              </span>
            ) : hasMarkedToday ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Attendance Marked
              </span>
            ) : (
              'Mark Attendance'
            )}
          </button>

          {/* Refresh Location Button */}
          <button
            onClick={checkLocation}
            disabled={isLoading}
            className="w-full mt-3 h-12 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Refresh Location'}
          </button>
        </motion.div>

        {/* Help Text */}
        {locationCheck?.status === 'outside' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center"
          >
            <p className="text-red-800 font-medium">
              You are outside the hospital campus. Please move closer to mark attendance.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
