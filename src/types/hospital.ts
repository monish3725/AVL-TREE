export interface PatientVitals {
  bloodPressure: string;
  heartRate: number;
  spO2: number;
  temperature: number;
}

export interface Patient {
  id: number;
  patientCode: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  doctor: string;
  date: string;
  time: string;
  bloodGroup: string;
  phone: string;
  vitals: PatientVitals;
  triage: 'Routine' | 'Urgent' | 'Emergency';
  admissionStatus: 'Outpatient' | 'Admitted' | 'Discharged';
  wardBed?: string;
  admissionDays: number;
  diagnosis: string;
  allergies: string[];
  registeredAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  room: string;
  fee: number;
  avatar: string;
  availability: string;
  activePatientsCount: number;
}

export interface Appointment {
  id: string;
  patientId: number;
  patientName: string;
  doctorName: string;
  date: string; // DD-MM-YYYY
  time: string; // HH:MM
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
  type: 'Consultation' | 'Follow-up' | 'Procedure' | 'Emergency Check';
  rescheduledHistory?: Array<{
    previousDate: string;
    previousTime: string;
    rescheduledAt: string;
    reason: string;
  }>;
}

export interface BillItem {
  id: string;
  description: string;
  category: 'Room & Board' | 'Doctor Consultation' | 'Diagnostics & Labs' | 'Pharmacy';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  patientId: number;
  patientName: string;
  doctorName: string;
  daysAdmitted: number;
  dailyRate: number; // Monish's base: 500.0
  roomType: string;
  items: BillItem[];
  subtotal: number;
  insuranceDiscount: number;
  tax: number;
  total: number;
  status: 'Paid' | 'Pending' | 'Insurance Processing';
  date: string;
  paymentMethod?: string;
}

export interface Bed {
  id: string;
  code: string;
  ward: 'General Ward' | 'Semi-Private' | 'ICU' | 'Pediatrics' | 'Post-Op';
  dailyRate: number;
  isOccupied: boolean;
  patientId?: number;
  patientName?: string;
  admittedDate?: string;
}

export interface Prescription {
  id: string;
  patientId: number;
  patientName: string;
  doctorName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: 'Active' | 'Dispensed';
  prescribedAt: string;
}
