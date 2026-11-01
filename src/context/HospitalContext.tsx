import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, Doctor, Appointment, Bill, Bed, Prescription } from '../types/hospital';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_BILLS,
  INITIAL_BEDS,
  INITIAL_PRESCRIPTIONS,
} from '../data/mockData';

interface HospitalContextType {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  bills: Bill[];
  beds: Bed[];
  prescriptions: Prescription[];
  
  // Patient CRUD (Extending Monish's hospms.cpp)
  addPatient: (data: Omit<Patient, 'id' | 'patientCode' | 'registeredAt'>) => Patient;
  updatePatient: (id: number, data: Partial<Patient>) => boolean;
  deletePatient: (id: number) => boolean;
  getPatientById: (id: number) => Patient | undefined;
  
  // Appointment Management
  bookAppointment: (data: {
    patientId: number;
    doctorName: string;
    date: string;
    time: string;
    reason: string;
    type: Appointment['type'];
  }) => Appointment;
  rescheduleAppointment: (
    appointmentId: string,
    newDate: string,
    newTime: string,
    reason?: string
  ) => boolean;
  cancelAppointment: (appointmentId: string) => boolean;
  
  // Billing Engine (Extending days * 500.0)
  generateBill: (data: {
    patientId: number;
    daysAdmitted: number;
    dailyRate?: number;
    roomType?: string;
    customItems?: Array<{ description: string; category: Bill['items'][0]['category']; quantity: number; unitPrice: number }>;
    insuranceDiscount?: number;
    paymentMethod?: string;
  }) => Bill;
  markBillPaid: (billId: string, method?: string) => boolean;
  
  // Bed & Ward Allocation
  admitPatientToBed: (patientId: number, bedCode: string) => boolean;
  dischargePatientFromBed: (patientId: number) => boolean;
  
  // Prescriptions
  addPrescription: (data: Omit<Prescription, 'id' | 'prescribedAt'>) => Prescription;
  dispensePrescription: (prescriptionId: string) => boolean;
  
  // Database Utilities
  resetToDefaults: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonData: string) => boolean;
  exportPatientsCSV: () => void;
  exportBillsCSV: () => void;
  
  // SQL Query Runner
  executeSql: (query: string) => { success: boolean; data?: any[]; error?: string; rowCount?: number; executionTimeMs: number };
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENTS: 'apex_hdms_patients_v1',
  DOCTORS: 'apex_hdms_doctors_v1',
  APPOINTMENTS: 'apex_hdms_appointments_v1',
  BILLS: 'apex_hdms_bills_v1',
  BEDS: 'apex_hdms_beds_v1',
  PRESCRIPTIONS: 'apex_hdms_prescriptions_v1',
};

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return stored ? JSON.parse(stored) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      return stored ? JSON.parse(stored) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return stored ? JSON.parse(stored) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BILLS);
      return stored ? JSON.parse(stored) : INITIAL_BILLS;
    } catch {
      return INITIAL_BILLS;
    }
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BEDS);
      return stored ? JSON.parse(stored) : INITIAL_BEDS;
    } catch {
      return INITIAL_BEDS;
    }
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
      return stored ? JSON.parse(stored) : INITIAL_PRESCRIPTIONS;
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  });

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));
  }, [beds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  // Patients Management
  const addPatient = (data: Omit<Patient, 'id' | 'patientCode' | 'registeredAt'>): Patient => {
    const nextId = patients.length > 0 ? Math.max(...patients.map((p) => p.id)) + 1 : 1;
    const now = new Date();
    const registeredAt = now.toISOString().replace('T', ' ').substring(0, 16);

    const newPatient: Patient = {
      ...data,
      id: nextId,
      patientCode: `PAT-${1000 + nextId}`,
      registeredAt,
    };

    setPatients((prev) => [...prev, newPatient]);

    // Automatically synchronize with appointment if date and time are supplied
    if (data.date && data.time && data.doctor) {
      const newAppointment: Appointment = {
        id: `APT-${800 + nextId}`,
        patientId: nextId,
        patientName: data.name,
        doctorName: data.doctor,
        date: data.date,
        time: data.time,
        reason: data.diagnosis || 'Initial consultation and clinical evaluation',
        status: 'Scheduled',
        type: 'Consultation',
      };
      setAppointments((prev) => [...prev, newAppointment]);
    }

    return newPatient;
  };

  const updatePatient = (id: number, data: Partial<Patient>): boolean => {
    let found = false;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          found = true;
          return { ...p, ...data };
        }
        return p;
      })
    );

    // If doctor or appointment date changed, sync related active appointments
    if (data.doctor || data.date || data.time || data.name) {
      setAppointments((prev) =>
        prev.map((apt) => {
          if (apt.patientId === id && apt.status === 'Scheduled') {
            return {
              ...apt,
              patientName: data.name ?? apt.patientName,
              doctorName: data.doctor ?? apt.doctorName,
              date: data.date ?? apt.date,
              time: data.time ?? apt.time,
            };
          }
          return apt;
        })
      );
    }

    return found;
  };

  const deletePatient = (id: number): boolean => {
    const exists = patients.some((p) => p.id === id);
    if (!exists) return false;

    // Release any beds occupied by this patient
    setBeds((prev) =>
      prev.map((b) => (b.patientId === id ? { ...b, isOccupied: false, patientId: undefined, patientName: undefined } : b))
    );

    // Remove patient
    setPatients((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const getPatientById = (id: number): Patient | undefined => {
    return patients.find((p) => p.id === id);
  };

  // Appointment Management
  const bookAppointment = (data: {
    patientId: number;
    doctorName: string;
    date: string;
    time: string;
    reason: string;
    type: Appointment['type'];
  }): Appointment => {
    const patient = patients.find((p) => p.id === data.patientId);
    const newApt: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: data.patientId,
      patientName: patient ? patient.name : `Patient #${data.patientId}`,
      doctorName: data.doctorName,
      date: data.date,
      time: data.time,
      reason: data.reason,
      status: 'Scheduled',
      type: data.type,
    };

    setAppointments((prev) => [...prev, newApt]);

    // Also update patient's current active schedule & doctor
    updatePatient(data.patientId, {
      doctor: data.doctorName,
      date: data.date,
      time: data.time,
    });

    return newApt;
  };

  const rescheduleAppointment = (
    appointmentId: string,
    newDate: string,
    newTime: string,
    reason?: string
  ): boolean => {
    let success = false;
    let targetPatientId: number | null = null;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          success = true;
          targetPatientId = apt.patientId;
          const historyEntry = {
            previousDate: apt.date,
            previousTime: apt.time,
            rescheduledAt: new Date().toISOString().substring(0, 16),
            reason: reason || 'Schedule adjustment requested',
          };
          return {
            ...apt,
            date: newDate,
            time: newTime,
            status: 'Rescheduled',
            rescheduledHistory: [...(apt.rescheduledHistory || []), historyEntry],
          };
        }
        return apt;
      })
    );

    if (success && targetPatientId) {
      updatePatient(targetPatientId, {
        date: newDate,
        time: newTime,
      });
    }

    return success;
  };

  const cancelAppointment = (appointmentId: string): boolean => {
    let success = false;
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          success = true;
          return { ...apt, status: 'Cancelled' };
        }
        return apt;
      })
    );
    return success;
  };

  // Billing Engine
  const generateBill = ({
    patientId,
    daysAdmitted,
    dailyRate = 500.0,
    roomType = 'Standard Inpatient Ward',
    customItems = [],
    insuranceDiscount = 0,
    paymentMethod = 'Insurance Co-Pay',
  }: {
    patientId: number;
    daysAdmitted: number;
    dailyRate?: number;
    roomType?: string;
    customItems?: Array<{ description: string; category: Bill['items'][0]['category']; quantity: number; unitPrice: number }>;
    insuranceDiscount?: number;
    paymentMethod?: string;
  }): Bill => {
    const patient = patients.find((p) => p.id === patientId);
    const assignedDoctor = doctors.find((d) => d.name === patient?.doctor);
    const doctorFee = assignedDoctor ? assignedDoctor.fee : 150;

    // Room Tariff calculation (Monish's core: days * charge)
    const roomTotal = Math.max(0, daysAdmitted) * dailyRate;
    const baseItems: Bill['items'] = [];

    if (daysAdmitted > 0) {
      baseItems.push({
        id: `bi-room-${Date.now()}`,
        description: `${roomType} (${daysAdmitted} Days × $${dailyRate.toFixed(2)})`,
        category: 'Room & Board',
        quantity: daysAdmitted,
        unitPrice: dailyRate,
        total: roomTotal,
      });
    }

    // Doctor Consultation
    baseItems.push({
      id: `bi-doc-${Date.now()}`,
      description: `Primary Physician Care (${patient?.doctor || 'Attending Specialist'})`,
      category: 'Doctor Consultation',
      quantity: Math.max(1, daysAdmitted || 1),
      unitPrice: doctorFee,
      total: Math.max(1, daysAdmitted || 1) * doctorFee,
    });

    // Custom items (Diagnostics, pharmacy, procedures)
    customItems.forEach((ci, idx) => {
      baseItems.push({
        id: `bi-custom-${Date.now()}-${idx}`,
        description: ci.description,
        category: ci.category,
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        total: ci.quantity * ci.unitPrice,
      });
    });

    const subtotal = baseItems.reduce((acc, item) => acc + item.total, 0);
    const tax = Math.round((subtotal - insuranceDiscount) * 0.04 * 100) / 100;
    const total = Math.max(0, subtotal - insuranceDiscount + (tax > 0 ? tax : 0));

    const newBill: Bill = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      billNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientId,
      patientName: patient?.name || `Patient #${patientId}`,
      doctorName: patient?.doctor || 'Attending Physician',
      daysAdmitted,
      dailyRate,
      roomType,
      items: baseItems,
      subtotal,
      insuranceDiscount,
      tax,
      total,
      status: 'Pending',
      date: new Date().toISOString().substring(0, 10),
      paymentMethod,
    };

    setBills((prev) => [newBill, ...prev]);
    return newBill;
  };

  const markBillPaid = (billId: string, method?: string): boolean => {
    let success = false;
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          success = true;
          return {
            ...b,
            status: 'Paid',
            paymentMethod: method || b.paymentMethod || 'Credit Card',
          };
        }
        return b;
      })
    );
    return success;
  };

  // Bed & Ward Allocation
  const admitPatientToBed = (patientId: number, bedCode: string): boolean => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return false;

    // Release any previous bed
    setBeds((prev) =>
      prev.map((b) => {
        if (b.patientId === patientId) {
          return { ...b, isOccupied: false, patientId: undefined, patientName: undefined, admittedDate: undefined };
        }
        if (b.code === bedCode) {
          return {
            ...b,
            isOccupied: true,
            patientId,
            patientName: patient.name,
            admittedDate: new Date().toISOString().substring(0, 10),
          };
        }
        return b;
      })
    );

    // Update patient status
    updatePatient(patientId, {
      admissionStatus: 'Admitted',
      wardBed: bedCode,
      admissionDays: Math.max(1, patient.admissionDays || 1),
    });

    return true;
  };

  const dischargePatientFromBed = (patientId: number): boolean => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return false;

    setBeds((prev) =>
      prev.map((b) => (b.patientId === patientId ? { ...b, isOccupied: false, patientId: undefined, patientName: undefined } : b))
    );

    updatePatient(patientId, {
      admissionStatus: 'Discharged',
      wardBed: undefined,
    });

    return true;
  };

  // Prescriptions
  const addPrescription = (data: Omit<Prescription, 'id' | 'prescribedAt'>): Prescription => {
    const newPrescription: Prescription = {
      ...data,
      id: `RX-${Math.floor(100 + Math.random() * 900)}`,
      prescribedAt: new Date().toISOString().substring(0, 10),
    };
    setPrescriptions((prev) => [newPrescription, ...prev]);
    return newPrescription;
  };

  const dispensePrescription = (prescriptionId: string): boolean => {
    let success = false;
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id === prescriptionId) {
          success = true;
          return { ...rx, status: 'Dispensed' };
        }
        return rx;
      })
    );
    return success;
  };

  // Database Management
  const resetToDefaults = () => {
    setPatients(INITIAL_PATIENTS);
    setDoctors(INITIAL_DOCTORS);
    setAppointments(INITIAL_APPOINTMENTS);
    setBills(INITIAL_BILLS);
    setBeds(INITIAL_BEDS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);

    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.DOCTORS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.BILLS);
    localStorage.removeItem(STORAGE_KEYS.BEDS);
    localStorage.removeItem(STORAGE_KEYS.PRESCRIPTIONS);
  };

  const exportDatabaseJSON = (): string => {
    const snapshot = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '2.0-enterprise',
        system: 'Apex Clinical DBMS',
      },
      patients,
      doctors,
      appointments,
      bills,
      beds,
      prescriptions,
    };
    return JSON.stringify(snapshot, null, 2);
  };

  const importDatabaseJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.patients && Array.isArray(parsed.patients)) {
        setPatients(parsed.patients);
        if (parsed.doctors) setDoctors(parsed.doctors);
        if (parsed.appointments) setAppointments(parsed.appointments);
        if (parsed.bills) setBills(parsed.bills);
        if (parsed.beds) setBeds(parsed.beds);
        if (parsed.prescriptions) setPrescriptions(parsed.prescriptions);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const exportPatientsCSV = () => {
    const headers = ['ID', 'Patient Code', 'Name', 'Age', 'Gender', 'Doctor', 'Date', 'Time', 'Blood Group', 'Phone', 'Triage', 'Admission Status', 'Diagnosis'];
    const rows = patients.map((p) => [
      p.id,
      p.patientCode,
      `"${p.name}"`,
      p.age,
      p.gender,
      `"${p.doctor}"`,
      p.date,
      p.time,
      p.bloodGroup,
      `"${p.phone}"`,
      p.triage,
      p.admissionStatus,
      `"${p.diagnosis.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hospital_patients_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportBillsCSV = () => {
    const headers = ['Bill ID', 'Bill Number', 'Patient ID', 'Patient Name', 'Doctor', 'Days Admitted', 'Daily Rate', 'Subtotal', 'Insurance Discount', 'Tax', 'Total', 'Status', 'Date'];
    const rows = bills.map((b) => [
      b.id,
      b.billNumber,
      b.patientId,
      `"${b.patientName}"`,
      `"${b.doctorName}"`,
      b.daysAdmitted,
      b.dailyRate,
      b.subtotal,
      b.insuranceDiscount,
      b.tax,
      b.total,
      b.status,
      b.date,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hospital_bills_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SQL Query Runner Engine
  const executeSql = (query: string) => {
    const start = performance.now();
    const cleanQuery = query.trim().replace(/;+$/, '');

    try {
      if (!cleanQuery.toUpperCase().startsWith('SELECT')) {
        return {
          success: false,
          error: 'Syntax Error: In this client sandbox, read-only analytical SQL queries (SELECT ...) are currently supported to protect database integrity.',
          executionTimeMs: Math.round((performance.now() - start) * 10) / 10,
        };
      }

      // Simple SQL Parser for local datasets
      const match = cleanQuery.match(/FROM\s+([a-zA-Z0-9_]+)/i);
      if (!match) {
        return {
          success: false,
          error: 'Syntax Error: Could not parse target table in FROM clause. Try: SELECT * FROM patients',
          executionTimeMs: Math.round((performance.now() - start) * 10) / 10,
        };
      }

      const tableName = match[1].toLowerCase();
      let sourceData: any[] = [];
      if (tableName === 'patients') sourceData = patients;
      else if (tableName === 'doctors') sourceData = doctors;
      else if (tableName === 'appointments') sourceData = appointments;
      else if (tableName === 'bills') sourceData = bills;
      else if (tableName === 'beds') sourceData = beds;
      else if (tableName === 'prescriptions') sourceData = prescriptions;
      else {
        return {
          success: false,
          error: `Table '${tableName}' not found. Available tables: patients, doctors, appointments, bills, beds, prescriptions`,
          executionTimeMs: Math.round((performance.now() - start) * 10) / 10,
        };
      }

      let result = [...sourceData];

      // WHERE clause filtering
      const whereMatch = cleanQuery.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
      if (whereMatch) {
        const condition = whereMatch[1].trim();
        // Simple condition matcher e.g. age > 30, triage = 'Urgent', status = 'Paid'
        if (condition.includes('=')) {
          const [rawKey, rawVal] = condition.split('=').map((s) => s.trim());
          const cleanVal = rawVal.replace(/['"]/g, '');
          result = result.filter((row) => String(row[rawKey]).toLowerCase() === cleanVal.toLowerCase());
        } else if (condition.includes('>')) {
          const [rawKey, rawVal] = condition.split('>').map((s) => s.trim());
          const numVal = parseFloat(rawVal);
          result = result.filter((row) => Number(row[rawKey]) > numVal);
        } else if (condition.includes('<')) {
          const [rawKey, rawVal] = condition.split('<').map((s) => s.trim());
          const numVal = parseFloat(rawVal);
          result = result.filter((row) => Number(row[rawKey]) < numVal);
        }
      }

      // ORDER BY clause
      const orderMatch = cleanQuery.match(/ORDER\s+BY\s+([a-zA-Z0-9_]+)(?:\s+(ASC|DESC))?/i);
      if (orderMatch) {
        const field = orderMatch[1];
        const isDesc = orderMatch[2]?.toUpperCase() === 'DESC';
        result.sort((a, b) => {
          if (a[field] < b[field]) return isDesc ? 1 : -1;
          if (a[field] > b[field]) return isDesc ? -1 : 1;
          return 0;
        });
      }

      // LIMIT clause
      const limitMatch = cleanQuery.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        const limit = parseInt(limitMatch[1], 10);
        result = result.slice(0, limit);
      }

      // Projection (columns)
      const selectColsMatch = cleanQuery.match(/SELECT\s+(.+?)\s+FROM/i);
      if (selectColsMatch && selectColsMatch[1].trim() !== '*') {
        const cols = selectColsMatch[1].split(',').map((c) => c.trim());
        result = result.map((row) => {
          const projected: any = {};
          cols.forEach((col) => {
            if (row[col] !== undefined) projected[col] = row[col];
          });
          return projected;
        });
      }

      const executionTimeMs = Math.round((performance.now() - start) * 10) / 10;
      return {
        success: true,
        data: result,
        rowCount: result.length,
        executionTimeMs,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Execution error during SQL evaluation',
        executionTimeMs: Math.round((performance.now() - start) * 10) / 10,
      };
    }
  };

  return (
    <HospitalContext.Provider
      value={{
        patients,
        doctors,
        appointments,
        bills,
        beds,
        prescriptions,
        addPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        bookAppointment,
        rescheduleAppointment,
        cancelAppointment,
        generateBill,
        markBillPaid,
        admitPatientToBed,
        dischargePatientFromBed,
        addPrescription,
        dispensePrescription,
        resetToDefaults,
        exportDatabaseJSON,
        importDatabaseJSON,
        exportPatientsCSV,
        exportBillsCSV,
        executeSql,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
