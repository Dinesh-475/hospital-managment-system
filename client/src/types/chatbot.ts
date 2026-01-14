// Message Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  documentId?: string;
  analysisType?: string;
  confidence?: number;
  isEmergency?: boolean;
  needsEscalation?: boolean;
}

// Conversation Types
export interface Conversation {
  id: string;
  userId: string;
  userType: 'patient' | 'doctor';
  messages: Message[];
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationContext {
  patientHistory?: any;
  currentSymptoms?: string[];
  appointmentContext?: any;
  documentContext?: any;
  medicalRecords?: any[];
}

// AI Response Types
export interface AIResponse {
  text: string;
  suggestions?: string[];
  needsEscalation?: boolean;
  isEmergency?: boolean;
  confidence?: number;
  metadata?: any;
}

// Quick Action Types
export type QuickActionType = 
  | 'book_appointment'
  | 'check_symptoms'
  | 'find_doctor'
  | 'hospital_services'
  | 'emergency_help';

export interface QuickAction {
  id: QuickActionType;
  label: string;
  icon: string;
  prompt: string;
}

// Document Analysis Types
export type AnalysisType = 
  | 'lab_report'
  | 'discharge_summary'
  | 'radiology'
  | 'prescription'
  | 'general';

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  documentName: string;
  analysisType: AnalysisType;
  summary: string;
  keyFindings: string[];
  abnormalValues: AbnormalValue[];
  recommendations: string[];
  confidence: number;
  analyzedAt: Date;
}

export interface AbnormalValue {
  testName: string;
  value: string | number;
  normalRange: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
}

// Clinical Assistant Types
export interface ClinicalQuery {
  id: string;
  type: 'diagnosis' | 'treatment' | 'drug_interaction' | 'guideline' | 'research';
  query: string;
  response: string;
  references?: string[];
  timestamp: Date;
}

// Chat UI State
export interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  isTyping: boolean;
  unreadCount: number;
  currentConversation: Conversation | null;
}

// Voice Input Types
export interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  error?: string;
}
