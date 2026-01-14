import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, UserSearch, Building, AlertCircle } from 'lucide-react';

interface QuickActionsProps {
  onAction: (actionId: string) => void;
  userType: 'patient' | 'doctor';
}

const patientActions = [
  { id: 'book_appointment', label: 'Book Appointment', icon: Calendar, color: 'blue' },
  { id: 'check_symptoms', label: 'Check Symptoms', icon: Activity, color: 'green' },
  { id: 'find_doctor', label: 'Find a Doctor', icon: UserSearch, color: 'purple' },
  { id: 'hospital_services', label: 'Hospital Services', icon: Building, color: 'teal' },
  { id: 'emergency_help', label: 'Emergency Help', icon: AlertCircle, color: 'red' }
];

const doctorActions = [
  { id: 'analyze_document', label: 'Analyze Document', icon: Activity, color: 'blue' },
  { id: 'clinical_guidelines', label: 'Clinical Guidelines', icon: Building, color: 'green' },
  { id: 'drug_interaction', label: 'Drug Interactions', icon: AlertCircle, color: 'orange' },
  { id: 'research_query', label: 'Research Query', icon: UserSearch, color: 'purple' }
];

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, userType }) => {
  const actions = userType === 'patient' ? patientActions : doctorActions;

  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <p className="text-sm text-gray-600 mb-3">Quick actions:</p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAction(action.id)}
              className={`p-3 rounded-xl border-2 border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100 transition-colors flex items-center gap-2 text-left`}
            >
              <Icon className={`w-5 h-5 text-${action.color}-600`} />
              <span className={`text-sm font-medium text-${action.color}-700`}>
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
