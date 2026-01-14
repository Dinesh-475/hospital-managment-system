// Patient Profile
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: EmergencyContact;
  vaccinations: Vaccination[];
  familyHistory: string[];
  profilePhoto?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Vaccination {
  id: string;
  name: string;
  dateAdministered: Date;
  nextDueDate?: Date;
  administeredBy: string;
}

// Medical Records
export type RecordType = 'prescription' | 'lab_report' | 'consultation' | 'document';

export interface MedicalRecord {
  id: string;
  date: Date;
  type: RecordType;
  doctorName: string;
  doctorSpecialization: string;
  diagnosis: string;
  notes: string;
  documents: MedicalDocument[];
  aiSummary?: string;
  criticalFindings?: string[];
  expanded?: boolean; // UI state
}

export interface MedicalDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'other';
  url: string;
  size: number; // bytes
  uploadedAt: Date;
}

// Test Results
export type TestStatus = 'normal' | 'high' | 'low' | 'critical';

export interface TestResult {
  id: string;
  testName: string;
  value: number | string;
  unit: string;
  normalRange: string;
  status: TestStatus;
  date: Date;
  recordId?: string; // Link to medical record
}

// Appointments
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorPhoto?: string;
  department: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  location: string;
}

// Notifications
export type NotificationType = 'appointment' | 'test_result' | 'prescription' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  actionUrl?: string;
}

// Health Metrics
export interface HealthMetric {
  id: string;
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'temperature' | 'glucose';
  value: number | string;
  unit: string;
  date: Date;
}

// Announcements
export interface Announcement {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  date: Date;
  priority: 'high' | 'medium' | 'low';
}

// AI Processing
export interface AIProcessingResult {
  summary: string;
  extractedData: {
    testResults?: TestResult[];
    medications?: string[];
    diagnoses?: string[];
  };
  criticalFindings: string[];
  confidence: number;
}

// Dashboard Stats
export interface DashboardStats {
  upcomingAppointments: number;
  totalRecords: number;
  unreadNotifications: number;
  pendingTests: number;
}
