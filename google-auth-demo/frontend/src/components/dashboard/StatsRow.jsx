import { motion } from 'framer-motion';
import { Calendar, FileText, Activity, Beaker } from 'lucide-react';
import { HEALTH_STATS } from '../../data/mockData';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
    </motion.div>
);

const StatsRow = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Calendar} label="Total Appointments" value="12" color="bg-blue-500" delay={0.1} />
        <StatCard icon={FileText} label="Total Records" value="28" color="bg-teal-500" delay={0.2} />
        <StatCard icon={Activity} label="Active Medications" value={HEALTH_STATS.activeMedications} color="bg-orange-500" delay={0.3} />
        <StatCard icon={Beaker} label="Upcoming Tests" value={HEALTH_STATS.upcomingTests} color="bg-purple-500" delay={0.4} />
    </div>
  );
};

export default StatsRow;
