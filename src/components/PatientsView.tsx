import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  FileText,
  AlertCircle,
  Activity,
  Bed,
  CheckCircle,
  Download,
  Filter,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Patient } from '../types/hospital';

interface PatientsViewProps {
  onOpenNewPatientModal: () => void;
  onEditPatient: (patient: Patient) => void;
  onSelectPatientForBilling: (patientId: number) => void;
  onSelectPatientForAppointment: (patientId: number) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  onOpenNewPatientModal,
  onEditPatient,
  onSelectPatientForBilling,
  onSelectPatientForAppointment,
}) => {
  const { patients, deletePatient, exportPatientsCSV, admitPatientToBed, dischargePatientFromBed, beds } =
    useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [triageFilter, setTriageFilter] = useState<'all' | 'Routine' | 'Urgent' | 'Emergency'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Outpatient' | 'Admitted' | 'Discharged'>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Filtered patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(patient.id).includes(searchQuery) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTriage = triageFilter === 'all' || patient.triage === triageFilter;
    const matchesStatus = statusFilter === 'all' || patient.admissionStatus === statusFilter;

    return matchesSearch && matchesTriage && matchesStatus;
  });

  const handleDeleteConfirm = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete.id);
      if (selectedPatient?.id === patientToDelete.id) {
        setSelectedPatient(null);
      }
      setPatientToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Total Registered Patients</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{patients.length}</span>
            <span className="text-xs text-slate-400">Capacity: 100 max</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Currently Admitted</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-teal-700">
              {patients.filter((p) => p.admissionStatus === 'Admitted').length}
            </span>
            <span className="text-xs text-slate-500">Inpatient Wards</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Urgent / Emergency Triage</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-600">
              {patients.filter((p) => p.triage === 'Urgent' || p.triage === 'Emergency').length}
            </span>
            <span className="text-xs text-slate-500">Active monitoring</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Active Outpatients</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-700">
              {patients.filter((p) => p.admissionStatus === 'Outpatient').length}
            </span>
            <span className="text-xs text-slate-500">Consultation pool</span>
          </div>
        </div>
      </div>

      {/* Action & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, doctor, or diagnosis..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Triage filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['all', 'Routine', 'Urgent', 'Emergency'] as const).map((triage) => (
              <button
                key={triage}
                onClick={() => setTriageFilter(triage)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  triageFilter === triage ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {triage === 'all' ? 'All Triage' : triage}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['all', 'Admitted', 'Outpatient', 'Discharged'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === status ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'all' ? 'All Status' : status}
              </button>
            ))}
          </div>

          <button
            onClick={exportPatientsCSV}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Patient Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Patient Code / ID</th>
                <th className="py-3 px-4">Patient Name & Demographics</th>
                <th className="py-3 px-4">Assigned Doctor</th>
                <th className="py-3 px-4">Schedule (Date & Time)</th>
                <th className="py-3 px-4">Clinical Status & Vitals</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="font-medium text-sm text-slate-600">No matching patient records found</p>
                    <p className="text-xs mt-1">Try adjusting your search criteria or register a new patient.</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold tabular-nums text-slate-900">{patient.patientCode}</span>
                        <span className="text-[11px] text-slate-400">ID #{patient.id}</span>
                      </div>
                    </td>

                    {/* Name & Demographics */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                          {patient.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                          <span>{patient.age} yrs</span>
                          <span>·</span>
                          <span>{patient.gender}</span>
                          <span>·</span>
                          <span className="font-mono">{patient.bloodGroup}</span>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Doctor */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{patient.doctor}</span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[180px]">{patient.diagnosis}</span>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono tabular-nums text-slate-800">{patient.date}</span>
                        <span className="font-mono tabular-nums text-slate-500 text-[11px]">{patient.time}</span>
                      </div>
                    </td>

                    {/* Status & Vitals */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              patient.triage === 'Emergency'
                                ? 'text-rose-600 font-bold'
                                : patient.triage === 'Urgent'
                                ? 'text-amber-700 font-medium'
                                : 'text-slate-600'
                            }`}
                          >
                            {patient.triage}
                          </span>
                          <span>·</span>
                          <span className="text-slate-600">
                            {patient.admissionStatus}
                            {patient.wardBed && ` (${patient.wardBed})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono tabular-nums text-[11px] text-slate-500">
                          <span>BP: {patient.vitals.bloodPressure}</span>
                          <span>·</span>
                          <span>HR: {patient.vitals.heartRate} bpm</span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectPatientForAppointment(patient.id)}
                          title="Schedule / Reschedule Appointment"
                          className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectPatientForBilling(patient.id)}
                          title="Generate Clinical Bill"
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditPatient(patient)}
                          title="Edit Patient Details"
                          className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPatientToDelete(patient)}
                          title="Safe Delete Record"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Patient Detailed EHR Drawer / Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    {selectedPatient.name}
                    <span className="text-xs font-mono font-normal text-slate-500">
                      ({selectedPatient.patientCode})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registered: {selectedPatient.registeredAt} · Assigned to {selectedPatient.doctor}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Demographics & Vitals Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Clinical Vitals & Metrics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Blood Pressure</span>
                    <span className="font-mono font-semibold text-slate-900 text-sm">
                      {selectedPatient.vitals.bloodPressure} mmHg
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Heart Rate</span>
                    <span className="font-mono font-semibold text-slate-900 text-sm">
                      {selectedPatient.vitals.heartRate} bpm
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Blood Oxygen</span>
                    <span className="font-mono font-semibold text-slate-900 text-sm">
                      {selectedPatient.vitals.spO2}% SpO2
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Temperature</span>
                    <span className="font-mono font-semibold text-slate-900 text-sm">
                      {selectedPatient.vitals.temperature}°F
                    </span>
                  </div>
                </div>
              </div>

              {/* Diagnosis & Clinical History */}
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-700 block mb-1">Primary Clinical Diagnosis</span>
                  <p className="text-xs text-slate-800 leading-relaxed">{selectedPatient.diagnosis}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 block mb-1">Known Allergies</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedPatient.allergies.map((allergy, i) => (
                        <span key={i} className="text-xs text-rose-700 font-medium">
                          {allergy}
                          {i < selectedPatient.allergies.length - 1 && ' · '}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 block mb-1">Inpatient Status & Bed</span>
                    <p className="text-xs text-slate-800">
                      Status: <span className="font-semibold">{selectedPatient.admissionStatus}</span>
                      {selectedPatient.wardBed ? ` · Bed ${selectedPatient.wardBed}` : ' · Outpatient'}
                    </p>
                    {selectedPatient.admissionDays > 0 && (
                      <p className="text-xs text-slate-500 mt-1">
                        Admission Duration: {selectedPatient.admissionDays} days
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Monish Original C++ Mapping View */}
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl">
                <span className="text-xs font-bold text-teal-900 block mb-1">
                  C++ Struct & Memory Mapping
                </span>
                <p className="text-xs text-teal-800">
                  This patient directly occupies slot{' '}
                  <code className="font-mono bg-teal-100 px-1 py-0.5 rounded text-teal-900">
                    patients[{selectedPatient.id - 1}]
                  </code>{' '}
                  in Monish's original C++ memory layout with ID{' '}
                  <code className="font-mono bg-teal-100 px-1 py-0.5 rounded text-teal-900">
                    {selectedPatient.id}
                  </code>
                  . In this elevated architecture, the record is decoupled into indexed relational entities.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  const p = selectedPatient;
                  setSelectedPatient(null);
                  onEditPatient(p);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg"
              >
                Edit Record
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const id = selectedPatient.id;
                    setSelectedPatient(null);
                    onSelectPatientForAppointment(id);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Manage Appointment
                </button>
                <button
                  onClick={() => {
                    const id = selectedPatient.id;
                    setSelectedPatient(null);
                    onSelectPatientForBilling(id);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                >
                  Generate Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {patientToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">Confirm Record Deletion</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to remove patient{' '}
                  <span className="font-semibold text-slate-800">
                    {patientToDelete.name} ({patientToDelete.patientCode})
                  </span>
                  ? In Monish's C++ code, this shifted the array elements to prevent fragmentation. Here, we
                  cleanly deallocate associated beds and un-assign reservations.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setPatientToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
