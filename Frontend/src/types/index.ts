export type UserRole = 'patient' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  avatar: string;
  available: boolean;
  nextAvailable: string;
  bio: string;
  languages: string[];
  hospital: string;
}

export type AppointmentStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  type: 'lab_report' | 'prescription' | 'imaging' | 'other';
  description: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  doctorName?: string;
}

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  approvedAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
  totalPatients: number;
  totalDoctors: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: UserRole;
}
