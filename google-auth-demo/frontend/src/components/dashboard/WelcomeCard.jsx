import { motion } from 'framer-motion';
import { Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const WelcomeCard = () => {
    const { user } = useAuth();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-1 lg:col-span-3 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
    >
        {/* Background Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
                <p className="text-blue-100 opacity-90">{today}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <button className="px-5 py-2.5 bg-white text-blue-600 rounded-lg font-semibold shadow-sm hover:scale-105 transition-transform flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                    </button>
                    <button className="px-5 py-2.5 bg-blue-700/50 hover:bg-blue-700/70 text-white rounded-lg font-semibold backdrop-blur-sm transition-colors flex items-center gap-2 text-sm border border-white/20">
                        <FileText className="w-4 h-4" />
                        View Records
                    </button>
                </div>
            </div>
            
            <div className="hidden md:block">
                 {/* Illustration placeholder or clean space */}
            </div>
        </div>
    </motion.div>
  );
};

export default WelcomeCard;
