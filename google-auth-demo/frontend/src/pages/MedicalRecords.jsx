import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Filter, Search, Calendar, 
  ChevronDown, ChevronUp, Pill, TestTube, Stethoscope, Image
} from 'lucide-react';
import { MEDICAL_RECORDS } from '../data/mockData';

const RECORD_TYPES = [
  { id: 'all', label: 'All Records', icon: FileText },
  { id: 'Prescription', label: 'Prescriptions', icon: Pill },
  { id: 'Lab Report', label: 'Lab Reports', icon: TestTube },
  { id: 'Consultation', label: 'Consultations', icon: Stethoscope },
  { id: 'X-Ray', label: 'X-Rays', icon: Image },
];

const MedicalRecords = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = MEDICAL_RECORDS.filter(record => {
    const matchesType = activeFilter === 'all' || record.type === activeFilter;
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          record.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Prescription': return <Pill className="w-5 h-5 text-green-600" />;
      case 'Lab Report': return <TestTube className="w-5 h-5 text-blue-600" />;
      case 'Consultation': return <Stethoscope className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'Prescription': return 'bg-green-100 text-green-700';
      case 'Lab Report': return 'bg-blue-100 text-blue-700';
      case 'Consultation': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
          <p className="text-gray-500">View and manage your health documents</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 self-start">
          <FileText className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {RECORD_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveFilter(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeFilter === type.id ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No records found</p>
          </div>
        ) : (
          filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div
                onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  {getTypeIcon(record.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">{record.title}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeBadgeColor(record.type)}`}>
                      {record.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{record.doctor}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {record.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-gray-500" />
                  </button>
                  {expandedRecord === record.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                </div>

              {expandedRecord === record.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-100 p-4 bg-gray-50"
                >
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Details</h4>
                  <p className="text-gray-700">{record.details}</p>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
