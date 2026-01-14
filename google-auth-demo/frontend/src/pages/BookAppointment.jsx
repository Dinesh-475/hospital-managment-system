import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Brain, Bone, Eye, Baby, Stethoscope,
  Calendar, Clock, MapPin, Star, ArrowLeft, ArrowRight, Check
} from 'lucide-react';

const DEPARTMENTS = [
  { id: 'cardiology', name: 'Cardiology', icon: Heart, color: 'bg-red-500' },
  { id: 'neurology', name: 'Neurology', icon: Brain, color: 'bg-purple-500' },
  { id: 'orthopedics', name: 'Orthopedics', icon: Bone, color: 'bg-orange-500' },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: Eye, color: 'bg-blue-500' },
  { id: 'pediatrics', name: 'Pediatrics', icon: Baby, color: 'bg-pink-500' },
  { id: 'general', name: 'General Medicine', icon: Stethoscope, color: 'bg-teal-500' },
];

const DOCTORS = [
  { id: 'd1', name: 'Dr. Sarah Wilson', specialization: 'Cardiologist', rating: 4.9, experience: '15 years', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300', department: 'cardiology', fee: '$150' },
  { id: 'd2', name: 'Dr. Michael Chen', specialization: 'Neurologist', rating: 4.8, experience: '12 years', photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300', department: 'neurology', fee: '$180' },
  { id: 'd3', name: 'Dr. Emily Brooks', specialization: 'General Physician', rating: 4.7, experience: '10 years', photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300', department: 'general', fee: '$100' },
];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const filteredDoctors = selectedDept 
    ? DOCTORS.filter(d => d.department === selectedDept)
    : DOCTORS;

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleBooking = () => {
    const id = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setBookingId(id);
    setBookingComplete(true);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedDept(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingComplete(false);
    setBookingId('');
  };

  if (bookingComplete) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
        <p className="text-gray-500 mb-6">Your appointment has been successfully scheduled.</p>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img src={selectedDoctor?.photo} alt="" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h3 className="font-bold text-gray-800">{selectedDoctor?.name}</h3>
              <p className="text-sm text-blue-600">{selectedDoctor?.specialization}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {selectedDate?.toDateString()}</p>
            <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {selectedTime}</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Room 304</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">Booking ID</p>
            <p className="font-mono font-bold text-lg text-blue-600">{bookingId}</p>
          </div>
        </div>
        
        <button 
          onClick={resetBooking}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Book Another Appointment
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
        <p className="text-gray-500">Schedule a consultation with our specialists</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 max-w-md">
        {['Department', 'Doctor', 'Schedule'].map((label, idx) => (
          <div key={label} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > idx + 1 ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
            <span className={`ml-2 text-sm ${step === idx + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{label}</span>
            {idx < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Department Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Department</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => { setSelectedDept(dept.id); setStep(2); }}
                  className={`p-6 rounded-2xl border-2 transition-all hover:shadow-md flex flex-col items-center gap-3 ${selectedDept === dept.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}
                >
                  <div className={`w-12 h-12 ${dept.color} rounded-xl flex items-center justify-center`}>
                    <dept.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{dept.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Doctor Selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Select Doctor</h2>
              <button onClick={() => setStep(1)} className="text-sm text-blue-600 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => { setSelectedDoctor(doctor); setStep(3); }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all hover:shadow-md flex items-center gap-4 text-left ${selectedDoctor?.id === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}
                >
                  <img src={doctor.photo} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                    <p className="text-sm text-blue-600">{doctor.specialization}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {doctor.rating}</span>
                      <span>{doctor.experience}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{doctor.fee}</p>
                    <p className="text-xs text-gray-400">per visit</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Date & Time Selection */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Select Date & Time</h2>
              <button onClick={() => setStep(2)} className="text-sm text-blue-600 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Available Dates</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {getNextWeekDates().map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex-shrink-0 w-16 p-3 rounded-xl text-center transition-all ${selectedDate?.toDateString() === date.toDateString() ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <p className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className="text-lg font-bold">{date.getDate()}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 mb-6"
              >
                <h3 className="text-sm font-medium text-gray-500 mb-3">Available Time Slots</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedDate && selectedTime && (
              <button
                onClick={handleBooking}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Confirm Booking <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookAppointment;
