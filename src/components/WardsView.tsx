import React, { useState } from 'react';
import { Bed, UserCheck, AlertCircle, CheckCircle2, UserX, Plus } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

interface WardsViewProps {
  onSelectPatientForBilling: (patientId: number) => void;
}

export const WardsView: React.FC<WardsViewProps> = ({ onSelectPatientForBilling }) => {
  const { beds, patients, admitPatientToBed, dischargePatientFromBed } = useHospital();

  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [bedToAdmit, setBedToAdmit] = useState<string | null>(null);
  const [patientIdToAdmit, setPatientIdToAdmit] = useState<number>(1);

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.isOccupied).length;
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  const wardsList = ['all', 'ICU', 'General Ward', 'Semi-Private', 'Pediatrics', 'Post-Op'];

  const filteredBeds = beds.filter((b) => {
    if (selectedWard === 'all') return true;
    return b.ward === selectedWard;
  });

  const availablePatients = patients.filter((p) => p.admissionStatus !== 'Admitted');

  const handleConfirmAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (bedToAdmit) {
      admitPatientToBed(Number(patientIdToAdmit), bedToAdmit);
      setBedToAdmit(null);
    }
  };

  const handleDischarge = (patientId: number) => {
    dischargePatientFromBed(patientId);
  };

  return (
    <div className="space-y-6">
      {/* Bed Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Total Operational Beds</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{totalBeds}</span>
            <span className="text-xs text-slate-400">All departments</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Currently Occupied</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-teal-700">{occupiedBeds}</span>
            <span className="text-xs text-slate-400">Admitted patients</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Available Vacancies</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600">{availableBeds}</span>
            <span className="text-xs text-slate-400">Ready for intake</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Occupancy Ratio</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{occupancyRate}%</span>
            <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: `${occupancyRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Ward Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {wardsList.map((ward) => (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedWard === ward ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {ward === 'all' ? 'All Wards' : ward}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Click any available bed to admit an outpatient or discharge an inpatient
        </div>
      </div>

      {/* Bed Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => (
          <div
            key={bed.id}
            className={`p-4 rounded-xl border transition-all ${
              bed.isOccupied
                ? 'bg-white border-teal-200 shadow-xs'
                : 'bg-slate-50/70 border-dashed border-slate-300 hover:border-teal-400 hover:bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-bold text-sm text-slate-900">{bed.code}</span>
                <span className="text-[11px] text-slate-500 block">{bed.ward}</span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  bed.isOccupied ? 'bg-teal-50 text-teal-800' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {bed.isOccupied ? 'Occupied' : 'Vacant'}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
              {bed.isOccupied ? (
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Patient:</span>
                    <span className="font-semibold text-slate-900 truncate block">{bed.patientName}</span>
                    <span className="text-slate-500 text-[11px] font-mono">Admitted: {bed.admittedDate}</span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2">
                    <button
                      onClick={() => bed.patientId && handleDischarge(bed.patientId)}
                      className="flex-1 py-1 px-2 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      Discharge
                    </button>
                    {bed.patientId && (
                      <button
                        onClick={() => onSelectPatientForBilling(bed.patientId!)}
                        className="py-1 px-2 text-[11px] font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
                      >
                        Bill
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] text-slate-500 block mb-2 font-mono">
                    Tariff: ${bed.dailyRate}/day
                  </span>
                  <button
                    onClick={() => {
                      setBedToAdmit(bed.code);
                      if (availablePatients.length > 0) {
                        setPatientIdToAdmit(availablePatients[0].id);
                      }
                    }}
                    className="w-full py-1.5 px-3 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Admit to {bed.code}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bed Admission Modal */}
      {bedToAdmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Admit Patient to Bed {bedToAdmit}</h3>
              <button
                onClick={() => setBedToAdmit(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAdmission} className="mt-4 space-y-4 text-xs">
              {availablePatients.length === 0 ? (
                <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-xs">
                  All registered patients are currently admitted. Register a new patient first to assign them to
                  this bed.
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Select Outpatient to Admit</label>
                    <select
                      value={patientIdToAdmit}
                      onChange={(e) => setPatientIdToAdmit(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      {availablePatients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.patientCode}) - {p.diagnosis}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-slate-500 text-[11px]">
                    Admitting this patient sets their status to <span className="font-semibold">Admitted</span>,
                    links Bed <span className="font-mono font-semibold">{bedToAdmit}</span>, and starts inpatient
                    daily billing calculations.
                  </p>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setBedToAdmit(null)}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                    >
                      Confirm Bed Admission
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
