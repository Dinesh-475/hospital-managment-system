import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star } from 'lucide-react';

// Apple Design Components
import GlassCard from '@/components/ui/GlassCard';
import AppleButton from '@/components/ui/AppleButton';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { staggerContainer, fadeInUp } from '@/utils/animations';
import { BookingModal } from './BookingModal';

interface Doctor {
    doctorId: string;
    user: {
        firstName: string;
        lastName: string;
        profilePictureUrl?: string; // Updated to match type
    };
    specialization: string;
    consultationFee: number;
    yearsOfExperience: number;
    availableDays: string[];
}

export const DoctorList = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get('/appointments/doctors');
            setDoctors(res.data.data);
        } catch (error) {
            console.error("Failed to fetch doctors", error);
            // Mock data with better aesthetics
            setDoctors([
                {
                    doctorId: '1',
                    user: { firstName: 'Sarah', lastName: 'Connor', profilePictureUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300' },
                    specialization: 'Cardiologist',
                    consultationFee: 150,
                    yearsOfExperience: 12,
                    availableDays: ['MON', 'WED', 'FRI']
                },
                {
                    doctorId: '2',
                    user: { firstName: 'James', lastName: 'Wilson', profilePictureUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300' },
                    specialization: 'Dermatologist',
                    consultationFee: 120,
                    yearsOfExperience: 8,
                    availableDays: ['TUE', 'THU']
                },
                {
                    doctorId: '3',
                    user: { firstName: 'Emily', lastName: 'Chen', profilePictureUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300' },
                    specialization: 'Pediatrician',
                    consultationFee: 100,
                    yearsOfExperience: 5,
                    availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI']
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    return (
        <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-display font-bold text-ios-gray-900 tracking-tight">Find your Specialist</h1>
                <p className="text-ios-gray-500 font-text text-lg">Book appointments with top-rated doctors.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doc) => (
                    <motion.div variants={fadeInUp} key={doc.doctorId}>
                        <GlassCard className="h-full flex flex-col justify-between group relative overflow-hidden">
                             {/* Decorative gradient blob background */}
                             <div className="absolute -top-20 -right-20 w-40 h-40 bg-ios-blue/5 rounded-full blur-3xl group-hover:bg-ios-blue/10 transition-colors duration-500" />
                             
                             <div>
                                <div className="flex flex-row gap-4 items-start mb-4 relative z-10">
                                     <div className="relative">
                                        <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-md ring-2 ring-white/50">
                                            {doc.user.profilePictureUrl ? (
                                                <img src={doc.user.profilePictureUrl} alt={doc.user.firstName} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-ios-gray-100 to-ios-gray-200 flex items-center justify-center text-ios-gray-500 font-bold text-xl">
                                                    {doc.user.firstName[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white ring-1 ring-green-100"></div>
                                     </div>
                                     
                                     <div>
                                         <h3 className="font-display font-semibold text-lg text-ios-gray-900 leading-tight">
                                            Dr. {doc.user.firstName} {doc.user.lastName}
                                         </h3>
                                         <p className="font-medium text-ios-blue text-sm mb-1">{doc.specialization}</p>
                                         <div className="flex items-center text-xs text-ios-gray-500">
                                             <Star className="w-3.5 h-3.5 fill-ios-yellow text-ios-yellow mr-1" />
                                             <span className="font-semibold text-ios-gray-700 mr-1">4.9</span>
                                             <span>(120 reviews)</span>
                                         </div>
                                     </div>
                                </div>

                                <div className="space-y-3 text-sm relative z-10">
                                     <div className="flex items-center text-ios-gray-600 bg-ios-gray-50/50 p-2 rounded-lg">
                                        <Clock className="w-4 h-4 mr-2 text-ios-blue" />
                                        <span className="font-medium">{doc.yearsOfExperience} years experience</span>
                                     </div>
                                     <div className="flex items-center text-ios-gray-600 px-2">
                                        <MapPin className="w-4 h-4 mr-2 text-ios-gray-400" />
                                        <span>Room 304, 3rd Floor</span>
                                     </div>
                                     
                                     <div className="flex flex-wrap gap-1.5 mt-3">
                                        {doc.availableDays.map(day => (
                                            <StatusBadge key={day} status="info" text={day} />
                                        ))}
                                     </div>
                                </div>
                             </div>

                             <div className="flex justify-between items-center border-t border-ios-gray-100 pt-5 mt-5">
                                <div>
                                    <span className="text-xs text-ios-gray-400 uppercase tracking-wider font-semibold">Consultation</span>
                                    <div className="flex items-baseline">
                                        <span className="font-display font-bold text-xl text-ios-gray-900">${doc.consultationFee}</span>
                                        <span className="text-sm text-ios-gray-500 ml-1">/ session</span>
                                    </div>
                                </div>
                                <AppleButton onClick={() => setSelectedDoctor(doc)} size="sm">
                                    Book Now
                                </AppleButton>
                             </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <BookingModal 
                doctor={selectedDoctor} 
                isOpen={!!selectedDoctor} 
                onClose={() => setSelectedDoctor(null)} 
            />
        </motion.div>
    );
};
