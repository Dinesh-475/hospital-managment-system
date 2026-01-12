import { useState } from 'react';
import Calendar from 'react-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isSameDay, parseISO } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import '@/styles/calendar-overrides.css'; // We will create this

interface AttendanceRecord {
    date: string; // ISO string
    checkInTime: string;
    checkOutTime?: string;
    attendanceStatus: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
}

interface AttendanceCalendarProps {
    data: AttendanceRecord[];
}

export const AttendanceCalendar = ({ data }: AttendanceCalendarProps) => {
    const [value, onChange] = useState<any>(new Date());

    const getTileContent = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const record = data.find(d => isSameDay(parseISO(d.date), date));
            if (record) {
                let colorClass = 'bg-gray-400';
                if (record.attendanceStatus === 'PRESENT') colorClass = 'bg-green-500';
                if (record.attendanceStatus === 'LATE') colorClass = 'bg-yellow-500';
                if (record.attendanceStatus === 'ABSENT') colorClass = 'bg-red-500';

                return (
                    <div className="flex justify-center mt-1">
                        <div className={`h-2 w-2 rounded-full ${colorClass}`} title={record.attendanceStatus}></div>
                    </div>
                );
            }
        }
        return null;
    };

    const getTileClassName = ({ date, view }: { date: Date, view: string }) => {
         if (view === 'month') {
            const record = data.find(d => isSameDay(parseISO(d.date), date));
             if (record) {
                 return 'has-attendance-record';
             }
         }
         return null;
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Monthly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                <Calendar 
                    onChange={onChange} 
                    value={value} 
                    tileContent={getTileContent}
                    tileClassName={getTileClassName}
                    className="w-full border-none shadow-none text-sm font-outfit rounded-md"
                />
                
                <div className="flex gap-4 mt-6 text-xs justify-center text-muted-foreground">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Present</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Late</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</div>
                </div>
            </CardContent>
        </Card>
    );
};
