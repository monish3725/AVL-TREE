import React, { useState } from 'react';
import { AvlProvider } from './context/AvlContext';
import { HospitalProvider } from './context/HospitalContext';

// AVL Components
import { AvlHeader } from './components/avl/AvlHeader';
import { VisualTreeView } from './components/avl/VisualTreeView';
import { CatalogView } from './components/avl/CatalogView';
import { RotationWorkshopView } from './components/avl/RotationWorkshopView';
import { TraversalsView } from './components/avl/TraversalsView';
import { CTerminalSimulator } from './components/avl/CTerminalSimulator';
import { AvlRoadmapView } from './components/avl/AvlRoadmapView';
import { InsertBookModal } from './components/avl/InsertBookModal';

// Hospital DBMS Components
import { Header as HospitalHeader } from './components/Header';
import { PatientsView } from './components/PatientsView';
import { AppointmentsView } from './components/AppointmentsView';
import { BillingView } from './components/BillingView';
import { WardsView } from './components/WardsView';
import { SqlStudioView } from './components/SqlStudioView';
import { CppConsoleSimulator } from './components/CppConsoleSimulator';
import { RoadmapView as HospitalRoadmapView } from './components/RoadmapView';
import { PatientModal } from './components/PatientModal';
import { Patient } from './types/hospital';

import { GitBranch, Building2, Download, Github, RotateCcw } from 'lucide-react';

function AppContent() {
  // Project selection: defaults to AVL Tree (user's latest request)
  const [projectMode, setProjectMode] = useState<'avl' | 'hospital'>('avl');

  // AVL Tab state
  const [avlTab, setAvlTab] = useState<
    'tree' | 'catalog' | 'workshop' | 'traversals' | 'c_terminal' | 'roadmap'
  >('tree');
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);

  // Hospital Tab state
  const [hospitalTab, setHospitalTab] = useState<
    'patients' | 'appointments' | 'billing' | 'wards' | 'sql' | 'cpp_terminal' | 'roadmap'
  >('patients');
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [selectedPatientForBilling, setSelectedPatientForBilling] = useState<number | null>(null);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState<number | null>(null);

  const handleEditPatient = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsPatientModalOpen(true);
  };

  const handleGoToBilling = (patientId: number) => {
    setSelectedPatientForBilling(patientId);
    setHospitalTab('billing');
  };

  const handleGoToAppointment = (patientId: number) => {
    setSelectedPatientForAppointment(patientId);
    setHospitalTab('appointments');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Dual Project Switcher Strip */}
      <div className="bg-slate-950 text-slate-300 px-4 py-2 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">ACTIVE WORKBENCH:</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
              <button
                onClick={() => setProjectMode('avl')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                  projectMode === 'avl'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                AVL-TREE Library System
              </button>
              <button
                onClick={() => setProjectMode('hospital')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                  projectMode === 'hospital'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Hospital DBMS
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>By Monish Sengalvarayan</span>
            <span>·</span>
            <a
              href={
                projectMode === 'avl'
                  ? 'https://github.com/monish3725/AVL-TREE'
                  : 'https://github.com/monish3725/Hospital-Database-Management-System'
              }
              target="_blank"
              rel="noreferrer"
              className="text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
            >
              <Github className="w-3 h-3" />
              View {projectMode === 'avl' ? 'AVL-TREE' : 'Hospital-DBMS'} Repo
            </a>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE PROJECT */}
      {projectMode === 'avl' ? (
        <>
          <AvlHeader
            activeTab={avlTab}
            setActiveTab={setAvlTab}
            onOpenInsertModal={() => setIsInsertModalOpen(true)}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {avlTab === 'tree' && <VisualTreeView onOpenInsertModal={() => setIsInsertModalOpen(true)} />}
            {avlTab === 'catalog' && <CatalogView onOpenInsertModal={() => setIsInsertModalOpen(true)} />}
            {avlTab === 'workshop' && <RotationWorkshopView />}
            {avlTab === 'traversals' && <TraversalsView />}
            {avlTab === 'c_terminal' && <CTerminalSimulator />}
            {avlTab === 'roadmap' && <AvlRoadmapView />}
          </main>

          <InsertBookModal
            isOpen={isInsertModalOpen}
            onClose={() => setIsInsertModalOpen(false)}
          />
        </>
      ) : (
        <>
          <HospitalHeader
            activeTab={hospitalTab}
            setActiveTab={setHospitalTab}
            onOpenNewPatientModal={() => {
              setPatientToEdit(null);
              setIsPatientModalOpen(true);
            }}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {hospitalTab === 'patients' && (
              <PatientsView
                onOpenNewPatientModal={() => {
                  setPatientToEdit(null);
                  setIsPatientModalOpen(true);
                }}
                onEditPatient={handleEditPatient}
                onSelectPatientForBilling={handleGoToBilling}
                onSelectPatientForAppointment={handleGoToAppointment}
              />
            )}
            {hospitalTab === 'appointments' && (
              <AppointmentsView initialPatientId={selectedPatientForAppointment} />
            )}
            {hospitalTab === 'billing' && (
              <BillingView initialPatientId={selectedPatientForBilling} />
            )}
            {hospitalTab === 'wards' && (
              <WardsView onSelectPatientForBilling={handleGoToBilling} />
            )}
            {hospitalTab === 'sql' && <SqlStudioView />}
            {hospitalTab === 'cpp_terminal' && <CppConsoleSimulator />}
            {hospitalTab === 'roadmap' && <HospitalRoadmapView />}
          </main>

          <PatientModal
            isOpen={isPatientModalOpen}
            onClose={() => {
              setIsPatientModalOpen(false);
              setPatientToEdit(null);
            }}
            patientToEdit={patientToEdit}
          />
        </>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">
              {projectMode === 'avl' ? 'AVL Tree Library Operating System' : 'Apex Clinical DBMS'}
            </span>
            <span>·</span>
            <span>Elevated from Monish's GitHub Repositories</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/hospital-database-management-system.zip"
              download={projectMode === 'avl' ? 'avl-tree-library-system.zip' : 'hospital-database-management-system.zip'}
              className="text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              Download Project ZIP
            </a>
            <a
              href={
                projectMode === 'avl'
                  ? 'https://github.com/monish3725/AVL-TREE'
                  : 'https://github.com/monish3725/Hospital-Database-Management-System'
              }
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HospitalProvider>
      <AvlProvider>
        <AppContent />
      </AvlProvider>
    </HospitalProvider>
  );
}
