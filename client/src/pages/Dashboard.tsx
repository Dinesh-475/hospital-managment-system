import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Calendar, FileText, MessageSquare, 
  Clock, Activity, ChevronRight, Bell 
} from 'lucide-react';
import { RootState } from '@/store';

// Apple Design Components
import GlassCard from '@/components/ui/GlassCard';
import AppIcon from '@/components/ui/AppIcon';
import AppleButton from '@/components/ui/AppleButton';
import { staggerContainer, fadeInUp } from '@/utils/animations';

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  const role = user.role as string;

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-4xl font-display font-bold text-ios-gray-900 tracking-tight">
                    Good Morning, {user.firstName || user.name}
                </h1>
                <p className="text-lg text-ios-gray-500 font-text mt-2">
                    Here's what's happening at Docvista today.
                </p>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/40 shadow-sm">
                <Clock className="w-5 h-5 text-ios-blue" />
                <span className="font-medium text-ios-gray-700 font-mono text-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                </span>
            </div>
        </div>

        {/* Quick Actions Grid - iOS App Style */}
        <div className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-ios-gray-900 px-1">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div variants={fadeInUp}>
                    <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:cursor-pointer group" hoverable>
                        <AppIcon icon={Calendar} gradient="from-ios-blue to-cyan-400" size="md" />
                        <span className="mt-3 font-medium text-ios-gray-900 group-hover:text-ios-blue transition-colors">Appointments</span>
                    </GlassCard>
                </motion.div>
                <motion.div variants={fadeInUp}>
                    <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:cursor-pointer group" hoverable>
                        <AppIcon icon={FileText} gradient="from-ios-indigo to-purple-400" size="md" />
                        <span className="mt-3 font-medium text-ios-gray-900 group-hover:text-ios-indigo transition-colors">Records</span>
                    </GlassCard>
                </motion.div>
                <motion.div variants={fadeInUp}>
                     <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:cursor-pointer group" hoverable>
                        <AppIcon icon={MessageSquare} gradient="from-ios-green to-teal-400" size="md" />
                        <span className="mt-3 font-medium text-ios-gray-900 group-hover:text-ios-green transition-colors">Messages</span>
                    </GlassCard>
                </motion.div>
                <motion.div variants={fadeInUp}>
                     <GlassCard className="flex flex-col items-center justify-center p-6 text-center hover:cursor-pointer group" hoverable>
                        <AppIcon icon={Activity} gradient="from-ios-orange to-red-400" size="md" />
                        <span className="mt-3 font-medium text-ios-gray-900 group-hover:text-ios-orange transition-colors">Vitals</span>
                    </GlassCard>
                </motion.div>
            </div>
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Assessments/Appointments) */}
            <div className="lg:col-span-2 space-y-8">
                <GlassCard className="min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-display font-bold text-ios-gray-900">
                            {role === 'DOCTOR' ? 'Upcoming Appointments' : 'Your Schedule'}
                        </h3>
                        <AppleButton variant="ghost" size="sm" className="text-sm">See All</AppleButton>
                    </div>
                    {/* Placeholder for appointment list */}
                    <div className="flex flex-col items-center justify-center h-48 text-ios-gray-400 space-y-3">
                        <div className="bg-ios-gray-50 p-4 rounded-full">
                            <Calendar size={32} className="opacity-50" />
                        </div>
                        <p>No appointments scheduled for today</p>
                        <AppleButton variant="secondary" size="sm">Schedule New</AppleButton>
                    </div>
                </GlassCard>
            </div>

            {/* Right Column (Notifications/Status) */}
            <div className="space-y-8">
                <GlassCard className="relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-ios-red" />
                        <h3 className="font-semibold text-ios-gray-900">Notifications</h3>
                    </div>
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/80 transition-colors cursor-pointer">
                                <div className="h-2 w-2 mt-2 rounded-full bg-ios-blue shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-ios-gray-900">New lab results available</p>
                                    <p className="text-xs text-ios-gray-500 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-ios-gray-100">
                        <div className="flex items-center justify-between text-sm text-ios-gray-500 hover:text-ios-blue cursor-pointer transition-colors group">
                            <span>View all notifications</span>
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </GlassCard>

                {role === 'MANAGER' && (
                     <GlassCard className="bg-gradient-to-br from-ios-gray-900 to-ios-gray-800 text-white border-none">
                         <div className="mb-4">
                             <h3 className="font-semibold text-lg">Hospital Status</h3>
                             <p className="text-ios-gray-400 text-sm">Real-time overview</p>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white/10 rounded-xl p-3 backdrop-blur-md">
                                 <p className="text-xs text-ios-gray-300">Occupancy</p>
                                 <p className="text-2xl font-bold">84%</p>
                             </div>
                             <div className="bg-white/10 rounded-xl p-3 backdrop-blur-md">
                                 <p className="text-xs text-ios-gray-300">Staff</p>
                                 <p className="text-2xl font-bold">12/15</p>
                             </div>
                         </div>
                     </GlassCard>
                )}
            </div>
        </div>
    </motion.div>
  );
}
