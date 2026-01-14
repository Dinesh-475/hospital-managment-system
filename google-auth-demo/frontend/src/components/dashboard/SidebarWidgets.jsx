import { motion } from 'framer-motion';
import { Activity, Droplet, Heart, Thermometer, MessageSquare, CalendarCheck } from 'lucide-react';
import { HEALTH_STATS } from '../../data/mockData';

export const HealthSummary = () => {
    const items = [
        { label: 'Last Checkup', value: HEALTH_STATS.lastCheckup, icon: CalendarCheck, color: 'text-blue-600 bg-blue-50' },
        { label: 'Blood Group', value: HEALTH_STATS.bloodGroup, icon: Droplet, color: 'text-red-500 bg-red-50' },
        { label: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-rose-500 bg-rose-50' },
        { label: 'Body Temp', value: '98.6 F', icon: Thermometer, color: 'text-orange-500 bg-orange-50' },
    ];
    // CalendarCheck needs import
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Health Summary</h2>
                <button className="text-sm text-gray-400 hover:text-gray-600">Details</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col items-center text-center gap-2">
                    <Droplet className="w-6 h-6 text-red-500" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Blood Group</p>
                        <p className="font-bold text-gray-800">{HEALTH_STATS.bloodGroup}</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col items-center text-center gap-2">
                    <Activity className="w-6 h-6 text-blue-500" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                        <p className="font-bold text-gray-800 text-green-600">Healthy</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col items-center text-center gap-2">
                    <Heart className="w-6 h-6 text-rose-500" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Heart Rate</p>
                        <p className="font-bold text-gray-800">72 bpm</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col items-center text-center gap-2">
                    <Thermometer className="w-6 h-6 text-orange-500" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Weight</p>
                        <p className="font-bold text-gray-800">75 kg</p>
                    </div>
                </div>
            </div>
      </motion.div>
    );
};

export const AIAssistant = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden"
        >
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
             
             <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                     <MessageSquare className="w-6 h-6 text-white" />
                 </div>
                 
                 <h2 className="text-xl font-bold mb-2">AI Health Assistant</h2>
                 <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                     Have questions about your health? Get instant answers powered by AI.
                 </p>
                 
                 <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                     Start Chat
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 </button>
             </div>
        </motion.div>
    )
}
