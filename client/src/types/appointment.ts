// Doctor Types
export interface Doctor {
  doctorId: string;
  name: string;
  photo: string;
  specialization: string[];
  qualifications: string[];
  department: string;
  roomNumber: string;
  floor: number;
  experience: number; // years
  rating: number; // 0-5
  reviewCount: number;
  languages: string[];
  bio: string;
  consultationFee: number;
  consultationHours: ConsultationHours[];
  availableSlots: AvailableSlot[];
  reviews: Review[];
}

export interface ConsultationHours {
  day: string; // Monday, Tuesday, etc.
  slots: string[]; // ["09:00", "09:30", ...]
}

export interface AvailableSlot {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export interface TimeSlot {
  time: string; // "09:00"
  available: boolean;
  bookedCount: number;
  maxCapacity: number;
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: Date;
}

// Appointment Types
export type AppointmentStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled';
export type AppointmentPriority = 'regular' | 'urgent';

export interface Appointment {
  appointmentId: string;
  bookingNumber: string; // BK-20240113-0001
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorPhoto: string;
  department: string;
  specialization: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "09:00"
  status: AppointmentStatus;
  queuePosition: number;
  totalInQueue: number;
  reason: string;
  priority: AppointmentPriority;
  insurance?: string;
  estimatedWaitTime: number; // minutes
  roomNumber: string;
  floor: number;
  createdAt: Date;
  checkedIn: boolean;
}

// Queue Types
export type QueueStatus = 'waiting' | 'in-consultation' | 'completed';

export interface QueueData {
  doctorId: string;
  date: string;
  currentPosition: number;
  totalPatients: number;
  averageConsultationTime: number; // minutes
  queue: QueueEntry[];
}

export interface QueueEntry {
  position: number;
  appointmentId: string;
  patientName: string;
  timeSlot: string;
  status: QueueStatus;
  checkedIn: boolean;
}

// Crowd Monitoring Types
export type CrowdLevel = 'low' | 'moderate' | 'high';

export interface DepartmentCrowd {
  department: string;
  currentPatients: number;
  capacity: number;
  crowdLevel: CrowdLevel;
  averageWaitTime: number;
  color: string; // For heatmap
}

export interface CrowdHistory {
  date: string;
  department: string;
  averagePatients: number;
  peakHour: string;
}

// Booking Form Types
export interface BookingFormData {
  doctorId: string;
  date: string;
  timeSlot: string;
  reason: string;
  priority: AppointmentPriority;
  insurance?: string;
}

// Filter Types
export interface DoctorFilters {
  department?: string;
  specialization?: string;
  availability?: 'today' | 'tomorrow' | 'this_week';
  rating?: number;
  searchQuery?: string;
}

export type SortOption = 'name' | 'rating' | 'experience' | 'availability';

// AI Suggestion Types
export interface AIAppointmentSuggestion {
  recommendedDate: string;
  recommendedTime: string;
  reasoning: string;
  confidence: number;
  alternativeTimes: { date: string; time: string }[];
}
