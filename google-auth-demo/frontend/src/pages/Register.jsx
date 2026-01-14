import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Stethoscope, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        dob: '',
        role: 'Patient',
        specialization: ''
    });

    const { registerUser } = useAuth();
    const navigate = useNavigate();

    const handleNext = (e) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const handlePrev = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        registerUser(formData);
        navigate('/dashboard');
    };

    const steps = [
        { id: 1, title: 'Personal Info' },
        { id: 2, title: 'Account Details' },
        { id: 3, title: 'Role Selection' },
        { id: 4, title: 'Confirmation' },
    ];

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                    placeholder="9876543210"
                                    required
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="date" 
                                        value={formData.dob}
                                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="grid grid-cols-2 gap-3">
                            {['Patient', 'Doctor', 'Staff', 'Admin'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setFormData({...formData, role})}
                                    className={clsx(
                                        "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                                        formData.role === role 
                                            ? "border-blue-600 bg-blue-50 text-blue-700" 
                                            : "border-gray-100 bg-white hover:border-gray-200"
                                    )}
                                >
                                    <Stethoscope className={clsx("w-6 h-6", formData.role === role ? "text-blue-600" : "text-gray-400")} />
                                    <span className="font-medium">{role}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center space-y-4">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎉</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Almost There!</h3>
                        <p className="text-gray-500">
                            You are registering as a <span className="font-bold text-blue-600">{formData.role}</span>.
                            <br/>Click below to complete setup.
                        </p>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link to="/login" className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-blue-600">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                </Link>
                <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                
                {/* Progress Bar */}
                <div className="flex gap-2 mt-6 mb-8">
                    {steps.map((s) => (
                        <div 
                            key={s.id} 
                            className={clsx(
                                "h-2 flex-1 rounded-full transition-all duration-300",
                                step >= s.id ? "bg-blue-600" : "bg-gray-100"
                            )}
                        />
                    ))}
                </div>
            </div>

            <form onSubmit={step === 4 ? handleSubmit : handleNext}>
                <div className="min-h-[280px]">
                    {renderStep()}
                </div>

                <div className="mt-8 flex gap-3">
                    {step > 1 && (
                        <button 
                            type="button" 
                            onClick={handlePrev}
                            className="flex-1 py-3 border border-gray-200 font-semibold rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    <button 
                        type="submit" 
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                        {step === 4 ? 'Complete Registration' : 'Continue'}
                        {step !== 4 && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
