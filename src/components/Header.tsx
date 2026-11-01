import React from 'react';
import { Database, Plus, RefreshCw, Download, Terminal, BookOpen, Layers } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

interface HeaderProps {
  activeTab: 'patients' | 'appointments' | 'billing' | 'wards' | 'sql' | 'cpp_terminal' | 'roadmap';
  setActiveTab: (tab: 'patients' | 'appointments' | 'billing' | 'wards' | 'sql' | 'cpp_terminal' | 'roadmap') => void;
  onOpenNewPatientModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenNewPatientModal }) => {
  const { exportDatabaseJSON } = useHospital();

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hospital_db_backup_${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Nav links) — Zone 3 (Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Apex Clinical DBMS
              </span>
              <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">
                Next-Gen Hospital Operating System
              </span>
            </div>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'patients'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Patients & EHR
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'appointments'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Appointments
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'billing'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Billing & Tariffs
            </button>

            <button
              onClick={() => setActiveTab('wards')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'wards'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Wards & Beds
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'sql'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              SQL Studio
            </button>

            <button
              onClick={() => setActiveTab('cpp_terminal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'cpp_terminal'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              C++ CLI Simulator
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Upgrade Guide & Architecture
            </button>
          </nav>

          {/* Zone 3: 1 primary action & download zip */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/hospital-database-management-system.zip"
              download="hospital-database-management-system.zip"
              title="Download Complete Project Source Code (.ZIP)"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4 text-teal-600" />
              Download ZIP
            </a>

            <button
              onClick={onOpenNewPatientModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Register Patient
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'patients' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Patients
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'appointments' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'billing' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveTab('wards')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'wards' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Wards
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'sql' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            SQL
          </button>
          <button
            onClick={() => setActiveTab('cpp_terminal')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'cpp_terminal' ? 'bg-emerald-700 text-white' : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            C++ CLI
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'roadmap' ? 'bg-indigo-700 text-white' : 'text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            Roadmap
          </button>
        </div>
      </div>
    </header>
  );
};
