import { useEffect, useState } from 'react';
import { AttendanceButton } from '@/components/attendance/AttendanceButton';
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';
import { attendanceService } from '@/services/attendanceService';
import { isSameDay, startOfDay } from 'date-fns';

export const AttendancePage = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [todayRecord, setTodayRecord] = useState<any>(null);
    // const [loading, setLoading] = useState(true);

    const fetchAttendance = async () => {
        try {
            const data = await attendanceService.getMyAttendance();
            setHistory(data.data || []);
            
            // Find today's record
            const today = startOfDay(new Date());
            const todayRec = (data.data || []).find((r: any) => 
                isSameDay(new Date(r.date), today)
            );
            setTodayRecord(todayRec);
        } catch (err) {
            console.error(err);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <AttendanceButton 
                        onAttendanceUpdate={fetchAttendance} 
                        todayRecord={todayRecord}
                    />
                    
                    {/* Simple Stat Cards could go here */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-card border rounded-lg p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-green-600">
                                {history.filter(h => h.attendanceStatus === 'PRESENT').length}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold">Present</div>
                        </div>
                        <div className="bg-card border rounded-lg p-4 text-center shadow-sm">
                            <div className="text-2xl font-bold text-red-500">
                                {history.filter(h => h.attendanceStatus === 'LATE').length}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold">Late</div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 lg:col-span-2 h-[400px]">
                    <AttendanceCalendar data={history} />
                </div>
            </div>
            
            {/* Recent History Table */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Recent History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="p-3 rounded-tl-lg">Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Check In</th>
                                <th className="p-3 rounded-tr-lg">Check Out</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {history.slice(0, 5).map((record) => (
                                <tr key={record.id} className="hover:bg-muted/20">
                                    <td className="p-3 font-medium">
                                        {new Date(record.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                                            ${record.attendanceStatus === 'PRESENT' ? 'bg-green-100 text-green-700' : 
                                              record.attendanceStatus === 'LATE' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'}
                                        `}>
                                            {record.attendanceStatus}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                    </td>
                                    <td className="p-3">
                                        {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">No attendance records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
