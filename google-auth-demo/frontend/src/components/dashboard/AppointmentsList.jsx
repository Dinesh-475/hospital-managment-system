import { motion } from 'framer-motion';
import { Clock, MapPin, Calendar, ArrowRight, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UPCOMING_APPOINTMENTS } from '../../data/mockData';

const AppointmentsCard = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Appointments</h2>
            {UPCOMING_APPOINTMENTS.length > 0 && (
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group">
                  View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
        </div>

        {UPCOMING_APPOINTMENTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <CalendarPlus className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Appointments Yet</h3>
            <p className="text-gray-500 text-sm mb-6 text-center max-w-sm">
              Book your first appointment with our expert doctors and start your healthcare journey.
            </p>
            <button
              onClick={() => navigate('/appointments')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <CalendarPlus className="w-5 h-5" />
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
              {UPCOMING_APPOINTMENTS.map((apt) => (
                  <div key={apt.id} className="flex items-center p-4 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                      <img src={apt.photo} alt={apt.doctorName} className="w-14 h-14 rounded-full object-cover border border-gray-100" />
                      <div className="ml-4 flex-1">
                          <div className="flex justify-between items-start">
                              <div>
                                  <h3 className="font-semibold text-gray-800">{apt.doctorName}</h3>
                                  <p className="text-sm text-blue-600 font-medium">{apt.specialization}</p>
                              </div>
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                  {apt.status}
                              </span>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                               <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {apt.date}</span>
                               <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.time}</span>
                               <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Room {apt.room}</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        )}
    </motion.div>
  );
};

export default AppointmentsCard;
