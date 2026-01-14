import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatsRow from '../components/dashboard/StatsRow';
import AppointmentsCard from '../components/dashboard/AppointmentsList';
import { HealthSummary, AIAssistant } from '../components/dashboard/SidebarWidgets';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, Megaphone } from 'lucide-react';
import { TEST_RESULTS, ANNOUNCEMENTS } from '../data/mockData';

const RecentTests = () => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Test Results</h2>
            {TEST_RESULTS.length > 0 && (
              <button className="text-blue-600 hover:underline text-sm">View All</button>
            )}
        </div>
        {TEST_RESULTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No test results yet</p>
          </div>
        ) : (
          <div className="space-y-3">
              {TEST_RESULTS.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                          <p className="font-semibold text-gray-800 text-sm">{test.name}</p>
                          <p className="text-xs text-gray-500">{test.date}</p>
                      </div>
                      <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${test.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {test.status}
                          </span>
                      </div>
                  </div>
              ))}
          </div>
        )}
    </motion.div>
);

const Announcements = () => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Announcements</h2>
        </div>
        {ANNOUNCEMENTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Megaphone className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No announcements</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {ANNOUNCEMENTS.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                      <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{item.title}</h4>
                          <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{item.date}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{item.category}</span>
                      </div>
                      <div className="h-px bg-gray-100 mt-3 group-last:hidden"></div>
                  </div>
              ))}
          </div>
        )}
    </motion.div>
);

const PatientDashboard = () => {
    return (
        <div className="space-y-6 pb-6">
            <WelcomeCard />
            <StatsRow />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <AppointmentsCard />
                    <RecentTests />
                </div>
                <div className="space-y-6">
                    <HealthSummary />
                    <AIAssistant />
                    <Announcements />
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
