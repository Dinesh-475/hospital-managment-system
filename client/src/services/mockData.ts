import { 
  Patient, 
  MedicalRecord, 
  Appointment, 
  TestResult, 
  Notification, 
  HealthMetric,
  Announcement
} from '@/types/patient';

// Generate realistic patient data
export const mockPatient: Patient = {
  id: 'patient_001',
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+1987654321',
  dateOfBirth: new Date('1988-05-15'),
  age: 35,
  gender: 'male',
  bloodGroup: 'O+',
  height: 175, // cm
  weight: 75, // kg
  bmi: 24.5,
  allergies: ['Penicillin', 'Peanuts'],
  chronicConditions: ['Hypertension'],
  emergencyContact: {
    name: 'Jane Doe',
    relationship: 'Spouse',
    phone: '+1555123456'
  },
  vaccinations: [
    {
      id: 'vac_001',
      name: 'COVID-19 Booster',
      dateAdministered: new Date('2024-01-15'),
      nextDueDate: new Date('2025-01-15'),
      administeredBy: 'Dr. Sarah Johnson'
    },
    {
      id: 'vac_002',
      name: 'Influenza',
      dateAdministered: new Date('2023-10-01'),
      nextDueDate: new Date('2024-10-01'),
      administeredBy: 'Dr. Sarah Johnson'
    }
  ],
  familyHistory: ['Diabetes (Father)', 'Heart Disease (Grandfather)']
};

// Generate 20+ medical records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 'rec_001',
    date: new Date('2024-01-20'),
    type: 'consultation',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialization: 'Cardiology',
    diagnosis: 'Routine Checkup - Blood Pressure Monitoring',
    notes: 'Patient reports feeling well. Blood pressure slightly elevated at 135/85. Recommended lifestyle modifications including reduced sodium intake and regular exercise.',
    documents: [
      {
        id: 'doc_001',
        name: 'Consultation_Notes.pdf',
        type: 'pdf',
        url: '/documents/consultation_001.pdf',
        size: 245000,
        uploadedAt: new Date('2024-01-20')
      }
    ],
    aiSummary: 'Routine checkup with slightly elevated BP. Lifestyle changes recommended.',
    criticalFindings: []
  },
  {
    id: 'rec_002',
    date: new Date('2024-01-15'),
    type: 'lab_report',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialization: 'General Medicine',
    diagnosis: 'Complete Blood Count (CBC)',
    notes: 'All values within normal range. Hemoglobin: 14.5 g/dL, WBC: 7,200/μL, Platelets: 250,000/μL',
    documents: [
      {
        id: 'doc_002',
        name: 'CBC_Report.pdf',
        type: 'pdf',
        url: '/documents/lab_001.pdf',
        size: 180000,
        uploadedAt: new Date('2024-01-15')
      }
    ],
    aiSummary: 'All blood count values normal. No abnormalities detected.',
    criticalFindings: []
  },
  {
    id: 'rec_003',
    date: new Date('2024-01-10'),
    type: 'prescription',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialization: 'Cardiology',
    diagnosis: 'Hypertension Management',
    notes: 'Prescribed Amlodipine 5mg once daily. Continue for 3 months. Follow-up in 6 weeks.',
    documents: [
      {
        id: 'doc_003',
        name: 'Prescription_Jan2024.pdf',
        type: 'pdf',
        url: '/documents/prescription_001.pdf',
        size: 120000,
        uploadedAt: new Date('2024-01-10')
      }
    ],
    aiSummary: 'Blood pressure medication prescribed for 3 months.',
    criticalFindings: []
  },
  {
    id: 'rec_004',
    date: new Date('2023-12-15'),
    type: 'lab_report',
    doctorName: 'Dr. Emily Rodriguez',
    doctorSpecialization: 'Endocrinology',
    diagnosis: 'Lipid Profile',
    notes: 'Total Cholesterol: 210 mg/dL (borderline high), LDL: 135 mg/dL, HDL: 45 mg/dL, Triglycerides: 150 mg/dL',
    documents: [
      {
        id: 'doc_004',
        name: 'Lipid_Profile.pdf',
        type: 'pdf',
        url: '/documents/lab_002.pdf',
        size: 195000,
        uploadedAt: new Date('2023-12-15')
      }
    ],
    aiSummary: 'Cholesterol slightly elevated. Dietary modifications recommended.',
    criticalFindings: ['Total Cholesterol: Borderline High']
  },
  {
    id: 'rec_005',
    date: new Date('2023-11-20'),
    type: 'consultation',
    doctorName: 'Dr. Robert Williams',
    doctorSpecialization: 'Orthopedics',
    diagnosis: 'Lower Back Pain Assessment',
    notes: 'Patient reports intermittent lower back pain for 2 weeks. Physical examination shows mild muscle tension. Recommended physiotherapy and pain management.',
    documents: [],
    aiSummary: 'Back pain assessment. Physiotherapy recommended.',
    criticalFindings: []
  }
];

// Generate more records (total 20+)
for (let i = 6; i <= 25; i++) {
  const types: ('consultation' | 'lab_report' | 'prescription' | 'document')[] = ['consultation', 'lab_report', 'prescription', 'document'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  mockMedicalRecords.push({
    id: `rec_${String(i).padStart(3, '0')}`,
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: randomType,
    doctorName: `Dr. ${['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'Robert Williams'][Math.floor(Math.random() * 4)]}`,
    doctorSpecialization: ['Cardiology', 'General Medicine', 'Orthopedics', 'Endocrinology'][Math.floor(Math.random() * 4)],
    diagnosis: `${randomType === 'lab_report' ? 'Lab Test' : 'Medical'} Record ${i}`,
    notes: `Sample medical notes for record ${i}. Patient condition stable.`,
    documents: [],
    aiSummary: `AI-generated summary for record ${i}`,
    criticalFindings: []
  });
}

// Sort by date (newest first)
mockMedicalRecords.sort((a, b) => b.date.getTime() - a.date.getTime());

// Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'apt_001',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    time: '10:00 AM',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialization: 'Cardiology',
    department: 'Cardiology',
    status: 'scheduled',
    reason: 'Follow-up Consultation',
    location: 'Room 301, Building A'
  },
  {
    id: 'apt_002',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    time: '2:30 PM',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialization: 'General Medicine',
    department: 'General Medicine',
    status: 'scheduled',
    reason: 'Annual Checkup',
    location: 'Room 205, Building B'
  },
  {
    id: 'apt_003',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    time: '11:15 AM',
    doctorName: 'Dr. Emily Rodriguez',
    doctorSpecialization: 'Endocrinology',
    department: 'Endocrinology',
    status: 'scheduled',
    reason: 'Diabetes Screening',
    location: 'Room 410, Building A'
  }
];

// Test Results
export const mockTestResults: TestResult[] = [
  {
    id: 'test_001',
    testName: 'Blood Glucose',
    value: 95,
    unit: 'mg/dL',
    normalRange: '70-100',
    status: 'normal',
    date: new Date('2024-01-15'),
    recordId: 'rec_002'
  },
  {
    id: 'test_002',
    testName: 'Hemoglobin',
    value: 14.5,
    unit: 'g/dL',
    normalRange: '13.5-17.5',
    status: 'normal',
    date: new Date('2024-01-15'),
    recordId: 'rec_002'
  },
  {
    id: 'test_003',
    testName: 'Total Cholesterol',
    value: 210,
    unit: 'mg/dL',
    normalRange: '<200',
    status: 'high',
    date: new Date('2023-12-15'),
    recordId: 'rec_004'
  },
  {
    id: 'test_004',
    testName: 'Blood Pressure',
    value: '135/85',
    unit: 'mmHg',
    normalRange: '<120/80',
    status: 'high',
    date: new Date('2024-01-20'),
    recordId: 'rec_001'
  },
  {
    id: 'test_005',
    testName: 'Heart Rate',
    value: 72,
    unit: 'bpm',
    normalRange: '60-100',
    status: 'normal',
    date: new Date('2024-01-20')
  }
];

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: 'You have an appointment with Dr. Sarah Johnson on Jan 22, 2024 at 10:00 AM',
    date: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/appointments'
  },
  {
    id: 'notif_002',
    type: 'test_result',
    title: 'New Test Results Available',
    message: 'Your CBC test results are now available',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/medical-records'
  },
  {
    id: 'notif_003',
    type: 'prescription',
    title: 'Prescription Renewal Reminder',
    message: 'Your Amlodipine prescription expires in 7 days',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true
  }
];

// Health Metrics
export const mockHealthMetrics: HealthMetric[] = [
  { id: 'metric_001', type: 'weight', value: 75, unit: 'kg', date: new Date('2024-01-20') },
  { id: 'metric_002', type: 'weight', value: 76, unit: 'kg', date: new Date('2024-01-10') },
  { id: 'metric_003', type: 'weight', value: 77, unit: 'kg', date: new Date('2023-12-20') },
  { id: 'metric_004', type: 'blood_pressure', value: '135/85', unit: 'mmHg', date: new Date('2024-01-20') },
  { id: 'metric_005', type: 'blood_pressure', value: '130/82', unit: 'mmHg', date: new Date('2024-01-10') }
];

// Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann_001',
    title: 'New Cardiology Wing Opening',
    message: 'We are excited to announce the opening of our state-of-the-art cardiology wing with advanced diagnostic equipment.',
    date: new Date('2024-01-15'),
    priority: 'high'
  },
  {
    id: 'ann_002',
    title: 'Flu Vaccination Drive',
    message: 'Annual flu vaccination drive starting next week. Book your appointment today!',
    date: new Date('2024-01-10'),
    priority: 'medium'
  },
  {
    id: 'ann_003',
    title: 'Updated Visiting Hours',
    message: 'Hospital visiting hours have been updated. Please check the new timings on our website.',
    date: new Date('2024-01-05'),
    priority: 'low'
  }
];
