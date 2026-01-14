import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RegistrationData } from '@/types/auth';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { ProgressIndicator } from '@/components/auth/ProgressIndicator';
import { BasicInfo } from '@/components/auth/registration-steps/BasicInfo';
import { RoleSpecificInfo } from '@/components/auth/registration-steps/RoleSpecificInfo';
import { ProfilePhoto } from '@/components/auth/registration-steps/ProfilePhoto';
import { Success } from '@/components/auth/registration-steps/Success';
import { Button } from '@/components/ui/button';
import { validators } from '@/utils/validators';

const steps = ['Basic Info', 'Role Details', 'Profile Photo'];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, sendOTP, verifyRegistrationOTP, isLoading } = useAuth(); // Extended AuthHook

  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  // Phone Verification State
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    phone: '',
    role: null as any, // Initial state is null, validation ensures it's set before submission
    patientData: {},
    doctorData: {},
    staffData: {},
    profilePhoto: undefined
  });

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof RegistrationData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleSendOTP = async () => {
    const phoneError = validators.phone(formData.phone);
    if (phoneError) {
      setErrors(prev => ({ ...prev, phone: phoneError }));
      return;
    }
    
    // Send OTP
    const success = await sendOTP(formData.phone);
    if (success) {
      setOtpSent(true);
      setErrors(prev => { 
        const newErrors = {...prev}; 
        delete newErrors.phone; 
        return newErrors; 
      });
    }
  };

  const handleVerifyOTP = async () => {
      // Use verifyRegistrationOTP which uses verifyOTPOnly endpoint
      const success = await verifyRegistrationOTP(formData.phone, otp);
      if (success) {
          setIsPhoneVerified(true);
          setOtpSent(false); // Hide OTP field
          setOtp('');
      } else {
          setErrors(prev => ({ ...prev, otp: 'Invalid OTP' }));
      }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Validate basic info
      const nameError = validators.name(formData.name);
      const emailError = validators.email(formData.email);
      const phoneError = validators.phone(formData.phone);
      
      if (nameError) newErrors.name = nameError;
      if (emailError) newErrors.email = emailError;
      if (phoneError) newErrors.phone = phoneError;
      if (!isPhoneVerified) newErrors.phone = 'Please verify your phone number first';
      if (!formData.role) newErrors.role = 'Please select a role';
    }

    if (step === 1 && formData.role) {
      // Validate role-specific info
      if (formData.role === 'patient') {
        const ageError = formData.patientData?.age ? validators.age(formData.patientData.age) : 'Age is required';
        const bloodGroupError = formData.patientData?.bloodGroup ? validators.bloodGroup(formData.patientData.bloodGroup) : 'Blood group is required';
        const emergencyContactError = formData.patientData?.emergencyContact ? validators.phone(formData.patientData.emergencyContact) : 'Emergency contact is required';
        const medicalHistoryError = formData.patientData?.medicalHistory ? null : 'Medical history is required';
        
        if (ageError) newErrors['patientData.age'] = ageError;
        if (bloodGroupError) newErrors['patientData.bloodGroup'] = bloodGroupError;
        if (emergencyContactError) newErrors['patientData.emergencyContact'] = emergencyContactError;
        if (medicalHistoryError) newErrors['patientData.medicalHistory'] = medicalHistoryError;
      }

      if (formData.role === 'doctor') {
        const employeeIdError = formData.doctorData?.employeeId ? validators.employeeId(formData.doctorData.employeeId) : 'Employee ID is required';
        const specializationError = formData.doctorData?.specialization ? null : 'Specialization is required';
        const qualificationsError = formData.doctorData?.qualifications ? null : 'Qualifications are required';
        const roomNumberError = formData.doctorData?.roomNumber ? null : 'Room number is required';
        
        if (employeeIdError) newErrors['doctorData.employeeId'] = employeeIdError;
        if (specializationError) newErrors['doctorData.specialization'] = specializationError;
        if (qualificationsError) newErrors['doctorData.qualifications'] = qualificationsError;
        if (roomNumberError) newErrors['doctorData.roomNumber'] = roomNumberError;
      }

      if (formData.role === 'staff' || formData.role === 'manager' || formData.role === 'admin') {
        const employeeIdError = formData.staffData?.employeeId ? validators.employeeId(formData.staffData.employeeId) : 'Employee ID is required';
        const departmentError = formData.staffData?.department ? null : 'Department is required';
        const positionError = formData.staffData?.position ? null : 'Position is required';
        
        if (employeeIdError) newErrors['staffData.employeeId'] = employeeIdError;
        if (departmentError) newErrors['staffData.department'] = departmentError;
        if (positionError) newErrors['staffData.position'] = positionError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    const success = await register(formData as RegistrationData);
    
    if (success) {
      setIsSuccess(true);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <AnimatedBackground />
        <div className="relative z-10 w-full max-w-2xl px-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
            <Success userName={formData.name} onContinue={handleContinue} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl px-4"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join Docvista and start your healthcare journey
            </p>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
          />

          {/* Form Steps */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <BasicInfo
                  data={{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role
                  }}
                  onChange={handleChange}
                  errors={errors}
                  
                  // OTP Props
                  isPhoneVerified={isPhoneVerified}
                  otpSent={otpSent}
                  otp={otp}
                  onOtpChange={setOtp}
                  onSendOTP={handleSendOTP}
                  onVerifyOTP={handleVerifyOTP}
                  isLoading={isLoading}
                />
              )}

              {currentStep === 1 && formData.role && (
                <RoleSpecificInfo
                  role={formData.role}
                  data={{
                    patientData: formData.patientData,
                    doctorData: formData.doctorData,
                    staffData: formData.staffData
                  }}
                  onChange={handleChange}
                  errors={errors}
                />
              )}

              {currentStep === 2 && (
                <ProfilePhoto
                  photo={formData.profilePhoto || null}
                  onChange={(photo) => handleChange('profilePhoto', photo)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="flex-1"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Processing...' : 'Complete Registration'}
              </Button>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
