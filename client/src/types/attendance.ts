// Geolocation Types
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  timestamp: Date;
}

// Attendance Record
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'on-leave';
export type ShiftType = 'morning' | 'evening' | 'night' | 'flexible';

export interface AttendanceRecord {
  recordId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  department: string;
  date: string; // YYYY-MM-DD
  clockIn: string | null; // HH:MM:SS
  clockInLocation: GeoLocation | null;
  clockOut: string | null;
  clockOutLocation: GeoLocation | null;
  totalHours: number;
  status: AttendanceStatus;
  shiftType: ShiftType;
  notes?: string;
  isLate: boolean;
  lateByMinutes?: number;
}

// Geofence Configuration
export interface GeofenceConfig {
  hospitalLocation: GeoLocation;
  radiusMeters: number;
  entryPoints: EntryPoint[];
  workingHours: WorkingHours;
  gracePeriodMinutes: number;
  requiredAccuracy: number; // meters
}

export interface EntryPoint {
  name: string;
  location: GeoLocation;
  description: string;
}

export interface WorkingHours {
  start: string; // "09:00"
  end: string; // "17:00"
  weeklyOffs: number[]; // [0, 6] for Sunday, Saturday
}

// Attendance Statistics
export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  leaveDays: number;
  attendancePercentage: number;
  averageHoursPerDay: number;
  totalHoursWorked: number;
}

// Location Status
export type LocationStatus = 'inside' | 'outside' | 'checking' | 'error';

export interface LocationCheck {
  status: LocationStatus;
  distance: number; // meters from hospital
  location: GeoLocation | null;
  message: string;
}

// Team Attendance (for managers)
export interface TeamAttendance {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeaveToday: number;
  onCampusNow: number;
  employees: EmployeeAttendance[];
}

export interface EmployeeAttendance {
  userId: string;
  userName: string;
  userPhoto?: string;
  department: string;
  status: AttendanceStatus;
  clockIn?: string;
  isOnCampus: boolean;
}
