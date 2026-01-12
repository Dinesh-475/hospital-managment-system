import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import { attendanceService } from '@/services/attendanceService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AttendanceButtonProps {
  onAttendanceUpdate: () => void;
  todayRecord: any | null; 
}

export const AttendanceButton = ({ onAttendanceUpdate, todayRecord }: AttendanceButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<string | null>(null);

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      }
    });
  };

  const handleAttendance = async (type: 'CHECK_IN' | 'CHECK_OUT') => {
    setLoading(true);
    setLocationError(null);
    setDistanceInfo(null);

    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;

      const action = type === 'CHECK_IN' ? attendanceService.checkIn : attendanceService.checkOut;
      await action({ latitude, longitude });

      toast.success(type === 'CHECK_IN' ? 'Checked in successfully!' : 'Checked out successfully!');
      onAttendanceUpdate();
      
    } catch (error: any) {
      console.error(error);
      if (error instanceof GeolocationPositionError) {
        let msg = 'Unknown location error';
        switch(error.code) {
             case error.PERMISSION_DENIED: msg = "Location permission denied. Please enable it to mark attendance."; break;
             case error.POSITION_UNAVAILABLE: msg = "Location information is unavailable."; break;
             case error.TIMEOUT: msg = "The request to get user location timed out."; break;
        }
        setLocationError(msg);
        toast.error(msg);
      } else if (error.response?.data?.message) {
        const msg = error.response.data.message;
        const dist = error.response.data.distance;
        toast.error(msg);
        setLocationError(msg);
        if (dist) setDistanceInfo(dist);
      } else {
        toast.error('Failed to mark attendance');
      }
    } finally {
      setLoading(false);
    }
  };

  const isCheckedIn = !!todayRecord;
  const isCheckedOut = !!todayRecord?.checkOutTime;

  return (
    <Card className="w-full max-w-md mx-auto shadow-md border-t-4 border-t-primary">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-5 h-5 text-primary" />
            Attendance
        </CardTitle>
        <CardDescription>
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCheckedOut ? (
            <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">Day Completed</h3>
                <p className="text-sm text-green-600 dark:text-green-500">
                    Checked out at {format(new Date(todayRecord.checkOutTime), 'hh:mm a')}
                </p>
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                 {!isCheckedIn ? (
                    <Button 
                        onClick={() => handleAttendance('CHECK_IN')} 
                        disabled={loading}
                        className="w-full h-12 text-lg font-medium"
                    >
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MapPin className="mr-2 h-5 w-5" />}
                        Check In
                    </Button>
                 ) : (
                    <div className="space-y-3">
                         <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 flex justify-between items-center">
                            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                                Checked In: {format(new Date(todayRecord.checkInTime), 'hh:mm a')}
                            </span>
                            <span className={cn(
                                "text-xs px-2 py-1 rounded-full font-bold",
                                todayRecord.attendanceStatus === 'LATE' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                            )}>
                                {todayRecord.attendanceStatus}
                            </span>
                         </div>
                         <Button 
                            variant="outline"
                            onClick={() => handleAttendance('CHECK_OUT')} 
                            disabled={loading}
                            className="w-full border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Check Out"}
                        </Button>
                    </div>
                 )}
            </div>
        )}

        {locationError && (
             <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 p-3 rounded-md">
                <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                    <p>{locationError}</p>
                    {distanceInfo && <p className="font-semibold mt-1">{distanceInfo}</p>}
                </div>
             </div>
        )}
      </CardContent>
    </Card>
  );
};
