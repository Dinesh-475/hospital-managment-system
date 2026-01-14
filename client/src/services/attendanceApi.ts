import { AttendanceRecord, AttendanceStats, AttendanceStatus } from '@/types/attendance';
import { GeoLocation } from '@/types/attendance';
import { calculateLateMinutes, HOSPITAL_CONFIG } from '@/services/geofencing';

// Mock attendance data
const mockAttendanceRecords: AttendanceRecord[] = [];

// Generate mock data for current month
function generateMockAttendance(userId: string, userName: string): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Generate records for each day of the month (up to today)
  for (let day = 1; day <= today.getDate(); day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    // Random status (90% present, 5% late, 5% absent)
    const rand = Math.random();
    let status: AttendanceStatus;
    let clockIn: string | null;
    let clockOut: string | null;
    let isLate = false;
    let lateByMinutes = 0;
    
    if (rand < 0.05) {
      status = 'absent';
      clockIn = null;
      clockOut = null;
    } else if (rand < 0.10) {
      status = 'late';
      clockIn = '09:25:00'; // 25 minutes late
      clockOut = '17:30:00';
      isLate = true;
      lateByMinutes = 25;
    } else {
      status = 'present';
      clockIn = '08:55:00';
      clockOut = '17:05:00';
    }
    
    const totalHours = clockIn && clockOut 
      ? calculateHours(clockIn, clockOut)
      : 0;
    
    records.push({
      recordId: `rec_${userId}_${date.toISOString().split('T')[0]}`,
      userId,
      userName,
      department: 'Cardiology',
      date: date.toISOString().split('T')[0],
      clockIn,
      clockInLocation: clockIn ? {
        latitude: 28.6140,
        longitude: 77.2091,
        accuracy: 15,
        timestamp: new Date(date.toISOString().split('T')[0] + 'T' + clockIn)
      } : null,
      clockOut,
      clockOutLocation: clockOut ? {
        latitude: 28.6140,
        longitude: 77.2091,
        accuracy: 15,
        timestamp: new Date(date.toISOString().split('T')[0] + 'T' + clockOut)
      } : null,
      totalHours,
      status,
      shiftType: 'morning',
      isLate,
      lateByMinutes: isLate ? lateByMinutes : undefined
    });
  }
  
  return records;
}

function calculateHours(clockIn: string, clockOut: string): number {
  const [inHour, inMin] = clockIn.split(':').map(Number);
  const [outHour, outMin] = clockOut.split(':').map(Number);
  
  const inMinutes = inHour * 60 + inMin;
  const outMinutes = outHour * 60 + outMin;
  
  return (outMinutes - inMinutes) / 60;
}

// API Functions

export async function fetchAttendanceRecords(userId: string, userName: string): Promise<AttendanceRecord[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return generateMockAttendance(userId, userName);
}

export async function markAttendance(
  userId: string,
  userName: string,
  type: 'clockIn' | 'clockOut',
  location: GeoLocation
): Promise<AttendanceRecord> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().split(' ')[0];
  
  const lateMinutes = type === 'clockIn' 
    ? calculateLateMinutes(currentTime, HOSPITAL_CONFIG.workingHours)
    : 0;
  
  const isLate = lateMinutes > HOSPITAL_CONFIG.gracePeriodMinutes;
  
  const record: AttendanceRecord = {
    recordId: `rec_${userId}_${today}`,
    userId,
    userName,
    department: 'Cardiology',
    date: today,
    clockIn: type === 'clockIn' ? currentTime : null,
    clockInLocation: type === 'clockIn' ? location : null,
    clockOut: type === 'clockOut' ? currentTime : null,
    clockOutLocation: type === 'clockOut' ? location : null,
    totalHours: 0,
    status: isLate ? 'late' : 'present',
    shiftType: 'morning',
    isLate,
    lateByMinutes: isLate ? lateMinutes : undefined
  };
  
  return record;
}

export async function calculateAttendanceStats(records: AttendanceRecord[]): Promise<AttendanceStats> {
  const totalDays = records.length;
  const presentDays = records.filter(r => r.status === 'present').length;
  const absentDays = records.filter(r => r.status === 'absent').length;
  const lateDays = records.filter(r => r.status === 'late').length;
  const halfDays = records.filter(r => r.status === 'half-day').length;
  const leaveDays = records.filter(r => r.status === 'on-leave').length;
  
  const totalHoursWorked = records.reduce((sum, r) => sum + r.totalHours, 0);
  const workingDays = totalDays - absentDays - leaveDays;
  const averageHoursPerDay = workingDays > 0 ? totalHoursWorked / workingDays : 0;
  const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays + halfDays) / totalDays) * 100 : 0;
  
  return {
    totalDays,
    presentDays,
    absentDays,
    lateDays,
    halfDays,
    leaveDays,
    attendancePercentage,
    averageHoursPerDay,
    totalHoursWorked
  };
}
