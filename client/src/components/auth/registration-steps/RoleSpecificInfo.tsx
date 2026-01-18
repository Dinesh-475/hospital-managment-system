import React from 'react';
import { motion } from 'framer-motion';
import { UserRole, PatientData, DoctorData, StaffData } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoleSpecificInfoProps {
  role: UserRole;
  data: {
    patientData?: Partial<PatientData>;
    doctorData?: Partial<DoctorData>;
    staffData?: Partial<StaffData>;
  };
  onChange: (field: string, value: string | number | boolean) => void;
  errors: Record<string, string>;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const RoleSpecificInfo: React.FC<RoleSpecificInfoProps> = ({ role, data, onChange, errors }) => {
  if (role === 'patient') {
    const patientData = data.patientData || {};
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Information</h2>
          <p className="text-gray-600">Tell us more about your health profile</p>
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Age</Label>
          <Input
            type="number"
            value={patientData.age || ''}
            onChange={(e) => onChange('patientData.age', parseInt(e.target.value))}
            placeholder="25"
            className={`h-12 ${errors['patientData.age'] ? 'border-red-500' : ''}`}
          />
          {errors['patientData.age'] && (
            <p className="text-sm text-red-600 mt-1">{errors['patientData.age']}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Blood Group</Label>
          <Select value={patientData.bloodGroup || ''} onValueChange={(value) => onChange('patientData.bloodGroup', value)}>
            <SelectTrigger className={`h-12 ${errors['patientData.bloodGroup'] ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {bloodGroups.map((group) => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors['patientData.bloodGroup'] && (
            <p className="text-sm text-red-600 mt-1">{errors['patientData.bloodGroup']}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Emergency Contact</Label>
          <Input
            type="tel"
            value={patientData.emergencyContact || ''}
            onChange={(e) => onChange('patientData.emergencyContact', e.target.value)}
            placeholder="+1234567890"
            className={`h-12 ${errors['patientData.emergencyContact'] ? 'border-red-500' : ''}`}
          />
          {errors['patientData.emergencyContact'] && (
            <p className="text-sm text-red-600 mt-1">{errors['patientData.emergencyContact']}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Medical History</Label>
          <textarea
            value={patientData.medicalHistory || ''}
            onChange={(e) => onChange('patientData.medicalHistory', e.target.value)}
            placeholder="Any allergies, chronic conditions, or medications..."
            rows={4}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${errors['patientData.medicalHistory'] ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors['patientData.medicalHistory'] && (
            <p className="text-sm text-red-600 mt-1">{errors['patientData.medicalHistory']}</p>
          )}
        </div>
      </motion.div>
    );
  }

  if (role === 'doctor') {
    const doctorData = data.doctorData || {};
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Information</h2>
          <p className="text-gray-600">Provide your professional details</p>
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Employee ID</Label>
          <Input
            type="text"
            value={doctorData.employeeId || ''}
            onChange={(e) => onChange('doctorData.employeeId', e.target.value)}
            placeholder="DOC001"
            className={`h-12 ${errors['doctorData.employeeId'] ? 'border-red-500' : ''}`}
          />
          {errors['doctorData.employeeId'] && (
            <p className="text-sm text-red-600 mt-1">{errors['doctorData.employeeId']}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Specialization</Label>
          <Input
            type="text"
            value={doctorData.specialization || ''}
            onChange={(e) => onChange('doctorData.specialization', e.target.value)}
            placeholder="Cardiology"
            className={`h-12 ${errors['doctorData.specialization'] ? 'border-red-500' : ''}`}
          />
          {errors['doctorData.specialization'] && (
            <p className="text-sm text-red-600 mt-1">{errors['doctorData.specialization']}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Qualifications</Label>
          <Input
            type="text"
            value={doctorData.qualifications || ''}
            onChange={(e) => onChange('doctorData.qualifications', e.target.value)}
            placeholder="MD, FACC"
            className={`h-12 ${errors['doctorData.qualifications'] ? 'border-red-500' : ''}`}
          />
          {errors['doctorData.qualifications'] && (
            <p className="text-sm text-red-600 mt-1">{errors['doctorData.qualifications']}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Room Number</Label>
          <Input
            type="text"
            value={doctorData.roomNumber || ''}
            onChange={(e) => onChange('doctorData.roomNumber', e.target.value)}
            placeholder="301"
            className={`h-12 ${errors['doctorData.roomNumber'] ? 'border-red-500' : ''}`}
          />
          {errors['doctorData.roomNumber'] && (
            <p className="text-sm text-red-600 mt-1">{errors['doctorData.roomNumber']}</p>
          )}
        </div>
      </motion.div>
    );
  }

  if (role === 'staff' || role === 'manager' || role === 'admin') {
    const staffData = data.staffData || {};
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Staff Information</h2>
          <p className="text-gray-600">Provide your employment details</p>
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Employee ID</Label>
          <Input
            type="text"
            value={staffData.employeeId || ''}
            onChange={(e) => onChange('staffData.employeeId', e.target.value)}
            placeholder="STF001"
            className={`h-12 ${errors['staffData.employeeId'] ? 'border-red-500' : ''}`}
          />
          {errors['staffData.employeeId'] && (
            <p className="text-sm text-red-600 mt-1">{errors['staffData.employeeId']}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Department</Label>
          <Input
            type="text"
            value={staffData.department || ''}
            onChange={(e) => onChange('staffData.department', e.target.value)}
            placeholder="Administration"
            className={`h-12 ${errors['staffData.department'] ? 'border-red-500' : ''}`}
          />
          {errors['staffData.department'] && (
            <p className="text-sm text-red-600 mt-1">{errors['staffData.department']}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Position</Label>
          <Input
            type="text"
            value={staffData.position || ''}
            onChange={(e) => onChange('staffData.position', e.target.value)}
            placeholder="Receptionist"
            className={`h-12 ${errors['staffData.position'] ? 'border-red-500' : ''}`}
          />
          {errors['staffData.position'] && (
            <p className="text-sm text-red-600 mt-1">{errors['staffData.position']}</p>
          )}
        </div>
      </motion.div>
    );
  }

  return null;
};
