import React, { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Patient } from '../types/hospital';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientToEdit?: Patient | null;
}

export const PatientModal: React.FC<PatientModalProps> = ({ isOpen, onClose, patientToEdit }) => {
  const { doctors, addPatient, updatePatient, patients } = useHospital();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [doctor, setDoctor] = useState(doctors[0]?.name || 'Dr. Sarah Chen');
  const [date, setDate] = useState('15-11-2026');
  const [time, setTime] = useState('10:00');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [heartRate, setHeartRate] = useState<number>(72);
  const [spO2, setSpO2] = useState<number>(98);
  const [temperature, setTemperature] = useState<number>(98.6);
  const [triage, setTriage] = useState<'Routine' | 'Urgent' | 'Emergency'>('Routine');
  const [admissionStatus, setAdmissionStatus] = useState<'Outpatient' | 'Admitted' | 'Discharged'>('Outpatient');
  const [diagnosis, setDiagnosis] = useState('');
  const [allergies, setAllergies] = useState('None recorded');

  useEffect(() => {
    if (patientToEdit) {
      setName(patientToEdit.name);
      setAge(patientToEdit.age);
      setGender(patientToEdit.gender);
      setDoctor(patientToEdit.doctor);
      setDate(patientToEdit.date);
      setTime(patientToEdit.time);
      setBloodGroup(patientToEdit.bloodGroup);
      setPhone(patientToEdit.phone);
      setBloodPressure(patientToEdit.vitals.bloodPressure);
      setHeartRate(patientToEdit.vitals.heartRate);
      setSpO2(patientToEdit.vitals.spO2);
      setTemperature(patientToEdit.vitals.temperature);
      setTriage(patientToEdit.triage);
      setAdmissionStatus(patientToEdit.admissionStatus);
      setDiagnosis(patientToEdit.diagnosis);
      setAllergies(patientToEdit.allergies.join(', '));
    } else {
      // Defaults for new registration
      setName('');
      setAge(30);
      setGender('Male');
      setDoctor(doctors[0]?.name || 'Dr. Sarah Chen');
      setDate('15-11-2026');
      setTime('10:00');
      setBloodGroup('O+');
      setPhone('+1 (555) 000-0000');
      setBloodPressure('120/80');
      setHeartRate(72);
      setSpO2(98);
      setTemperature(98.6);
      setTriage('Routine');
      setAdmissionStatus('Outpatient');
      setDiagnosis('Routine outpatient consultation and clinical screening');
      setAllergies('None recorded');
    }
  }, [patientToEdit, isOpen, doctors]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAllergies = allergies
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    if (patientToEdit) {
      updatePatient(patientToEdit.id, {
        name,
        age: Number(age),
        gender,
        doctor,
        date,
        time,
        bloodGroup,
        phone,
        vitals: {
          bloodPressure,
          heartRate: Number(heartRate),
          spO2: Number(spO2),
          temperature: Number(temperature),
        },
        triage,
        admissionStatus,
        diagnosis,
        allergies: parsedAllergies.length > 0 ? parsedAllergies : ['None recorded'],
      });
    } else {
      // Check capacity
      if (patients.length >= 100) {
        alert('[Capacity Limit] Hospital is at full capacity (100 concurrent profiles in base schema)!');
        return;
      }

      addPatient({
        name,
        age: Number(age),
        gender,
        doctor,
        date,
        time,
        bloodGroup,
        phone,
        vitals: {
          bloodPressure,
          heartRate: Number(heartRate),
          spO2: Number(spO2),
          temperature: Number(temperature),
        },
        triage,
        admissionStatus,
        admissionDays: admissionStatus === 'Admitted' ? 1 : 0,
        diagnosis,
        allergies: parsedAllergies.length > 0 ? parsedAllergies : ['None recorded'],
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {patientToEdit ? `Update Patient Record: ${patientToEdit.name}` : 'Register New Patient Profile'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {patientToEdit
                ? `Updating ID #${patientToEdit.id} (${patientToEdit.patientCode})`
                : `Auto-incrementing sequential ID #${patients.length + 1}`}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 text-sm font-semibold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Section: Demographics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              1. Demographics & Identity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Full Patient Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander Hamilton"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Age *</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs font-mono"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section: Doctor & Schedule (From Monish's C++ prompt) */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              2. Physician Assignment & Schedule
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-slate-700 font-semibold mb-1">Assigned Doctor *</label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} ({doc.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Appointment Date (DD-MM-YYYY) *</label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Time (HH:MM) *</label>
                <input
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="HH:MM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section: Clinical Vitals & Triage */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              3. Clinical Vitals & Triage Status
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Blood Pressure</label>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="120/80"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">SpO2 (%)</label>
                <input
                  type="number"
                  value={spO2}
                  onChange={(e) => setSpO2(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Temp (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Triage Urgency</label>
                <select
                  value={triage}
                  onChange={(e) => setTriage(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs"
                >
                  <option value="Routine">Routine (Standard Consultation)</option>
                  <option value="Urgent">Urgent (Requires Priority Care)</option>
                  <option value="Emergency">Emergency (Immediate Intervention)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Admission Status</label>
                <select
                  value={admissionStatus}
                  onChange={(e) => setAdmissionStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs"
                >
                  <option value="Outpatient">Outpatient (No Bed Reserved)</option>
                  <option value="Admitted">Admitted (Allocate Inpatient Bed)</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Clinical Notes */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              4. Clinical Notes & Allergies
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Diagnosis / Reason for Visit</label>
                <textarea
                  rows={2}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Primary clinical symptoms or condition description..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Allergies (comma-separated)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Latex, Peanuts"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
            >
              {patientToEdit ? 'Save Changes' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
