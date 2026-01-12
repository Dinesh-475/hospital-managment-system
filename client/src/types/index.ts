export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'NURSE' | 'STAFF' | 'MANAGER';
  profilePictureUrl?: string;
  name?: string; // Fallback
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contact: string;
  address: string;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  availability: string[];
}
