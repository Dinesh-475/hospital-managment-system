import axios from '../lib/axios';

interface LocationData {
  latitude: number;
  longitude: number;
}

export const attendanceService = {
  checkIn: async (data: LocationData) => {
    const response = await axios.post('/attendance/check-in', data);
    return response.data;
  },

  checkOut: async (data: LocationData) => {
    const response = await axios.post('/attendance/check-out', data);
    return response.data;
  },

  getMyAttendance: async () => {
    const response = await axios.get('/attendance/me');
    return response.data;
  },

  getAllAttendance: async (date?: string) => {
    const params = date ? { date } : {};
    const response = await axios.get('/attendance/all', { params });
    return response.data;
  },
};
