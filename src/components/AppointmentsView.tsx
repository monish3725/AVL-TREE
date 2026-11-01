import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  History,
  Phone,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Appointment } from '../types/hospital';

interface AppointmentsViewProps {
  initialPatientId?: number | null;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({ initialPatientId }) => {
  const {
    appointments,
    doctors,
    patients,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
  } = useHospital();

  const [filterStatus, setFilterStatus] = useState<'all' | 'Scheduled' | 'Rescheduled' | 'Completed' | 'Cancelled'>(
    'all'
  );
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null);

  // New Booking State
  const [bookingPatientId, setBookingPatientId] = useState<number>(initialPatientId || (patients[0]?.id ?? 1));
  const [bookingDoctor, setBookingDoctor] = useState(doctors[0]?.name || '');
  const [bookingDate, setBookingDate] = useState('16-11-2026');
  const [bookingTime, setBookingTime] = useState('10:30');
  const [bookingReason, setBookingReason] = useState('Follow-up consultation');
  const [bookingType, setBookingType] = useState<Appointment['type']>('Consultation');

  // Reschedule State
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('Patient requested new slot');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesDoctor = selectedDoctorFilter === 'all' || apt.doctorName === selectedDoctorFilter;
    return matchesStatus && matchesDoctor;
  });

  const handleOpenBooking = (docName?: string) => {
    if (docName) setBookingDoctor(docName);
    setIsBookingModalOpen(true);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment({
      patientId: Number(bookingPatientId),
      doctorName: bookingDoctor,
      date: bookingDate,
      time: bookingTime,
      reason: bookingReason,
      type: bookingType,
    });
    setIsBookingModalOpen(false);
  };

  const handleOpenReschedule = (apt: Appointment) => {
    setReschedulingAppointment(apt);
    setRescheduleDate(apt.date);
    setRescheduleTime(apt.time);
    setRescheduleReason('Schedule optimization requested');
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (reschedulingAppointment) {
      rescheduleAppointment(
        reschedulingAppointment.id,
        rescheduleDate,
        rescheduleTime,
        rescheduleReason
      );
      setReschedulingAppointment(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Doctor Specialty Showcase Strip */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Medical Specialist Directory & Roster</h3>
            <p className="text-xs text-slate-500">
              Assigned specialists available for consultation & clinical appointments
            </p>
          </div>
          <button
            onClick={() => handleOpenBooking()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Book Specialist Appointment
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.slice(0, 3).map((doctor) => (
            <div
              key={doctor.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-colors flex items-start gap-3"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                {doctor.avatar ? (
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-sm">
                    {doctor.name.split(' ')[1]?.[0] || 'D'}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="font-bold text-slate-900 text-xs truncate block">{doctor.name}</span>
                <span className="text-[11px] text-teal-700 font-medium truncate block">{doctor.specialty}</span>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-mono tabular-nums">${doctor.fee}/visit</span>
                  <span>·</span>
                  <span>{doctor.room}</span>
                </div>
                <button
                  onClick={() => handleOpenBooking(doctor.name)}
                  className="mt-2 text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Book with {doctor.name.split(' ')[1]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Status Filters */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['all', 'Scheduled', 'Rescheduled', 'Completed', 'Cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  filterStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'All Schedules' : st}
              </button>
            ))}
          </div>

          {/* Doctor filter dropdown */}
          <select
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          Showing {filteredAppointments.length} appointment slots
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Appointment Time & Date</th>
                <th className="py-3 px-4">Visit Type & Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No appointments match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-slate-900">{apt.id}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{apt.patientName}</span>
                        <span className="text-[11px] text-slate-400">Patient ID #{apt.patientId}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">{apt.doctorName}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono tabular-nums text-slate-800 font-medium">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.date}</span>
                        <span className="text-slate-400">·</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.time}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{apt.type}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[200px]">{apt.reason}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          apt.status === 'Scheduled'
                            ? 'text-teal-700'
                            : apt.status === 'Rescheduled'
                            ? 'text-amber-700'
                            : apt.status === 'Completed'
                            ? 'text-slate-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {apt.status}
                      </span>
                      {apt.rescheduledHistory && apt.rescheduledHistory.length > 0 && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Prior: {apt.rescheduledHistory[apt.rescheduledHistory.length - 1].previousDate}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                          <>
                            <button
                              onClick={() => handleOpenReschedule(apt)}
                              className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => cancelAppointment(apt.id)}
                              className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Schedule Clinical Appointment</h3>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Patient *</label>
                <select
                  value={bookingPatientId}
                  onChange={(e) => setBookingPatientId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientCode}) - {p.age} yrs
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Attending Specialist *</label>
                <select
                  value={bookingDoctor}
                  onChange={(e) => setBookingDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} — {d.specialty} (${d.fee}/visit)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date (DD-MM-YYYY) *</label>
                  <input
                    type="text"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    placeholder="DD-MM-YYYY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Time (HH:MM) *</label>
                  <input
                    type="text"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    placeholder="HH:MM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Appointment Type</label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Procedure">Procedure</option>
                  <option value="Emergency Check">Emergency Check</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason / Clinical Objective</label>
                <input
                  type="text"
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  placeholder="e.g. Blood pressure review, Post-op wound inspection..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal (Directly elevating hospms.cpp rescheduleAppointment) */}
      {reschedulingAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Reschedule Appointment</h3>
                <p className="text-xs text-slate-500">
                  Elevated engine preserving patient profile while migrating slot
                </p>
              </div>
              <button
                onClick={() => setReschedulingAppointment(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-semibold text-slate-800">{reschedulingAppointment.patientName}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-semibold text-slate-800">{reschedulingAppointment.doctorName}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-500">Current Slot:</span>
                  <span className="font-mono tabular-nums font-semibold text-rose-700">
                    {reschedulingAppointment.date} at {reschedulingAppointment.time}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">New Date (DD-MM-YYYY) *</label>
                  <input
                    type="text"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">New Time (HH:MM) *</label>
                  <input
                    type="text"
                    required
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for Rescheduling</label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="e.g. Physician emergency surgery, Patient request..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingAppointment(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Confirm New Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
