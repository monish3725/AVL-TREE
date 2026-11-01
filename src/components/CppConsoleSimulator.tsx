import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, RotateCcw, Code, ExternalLink, Sparkles } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const CppConsoleSimulator: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useHospital();

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Compiled with: g++ -O3 hospms.cpp -o hospital_system',
    'Executing ./hospital_system ...',
    '',
    '====== Hospital Management System ======',
    '1. Add Patient',
    '2. View Patients',
    '3. Search Patient',
    '4. Update Patient',
    '5. Delete Patient',
    '6. Billing',
    '7. Book Appointment',
    '8. Reschedule Appointment',
    '9. Exit',
    'Enter choice: (Select an option below or type choice)',
  ]);

  const [inputVal, setInputVal] = useState('');
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [tempFormData, setTempFormData] = useState<any>({});
  const [showCodeModal, setShowCodeModal] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const appendLogs = (lines: string[]) => {
    setTerminalLogs((prev) => [...prev, ...lines]);
  };

  const showMainMenu = () => {
    appendLogs([
      '',
      '====== Hospital Management System ======',
      '1. Add Patient',
      '2. View Patients',
      '3. Search Patient',
      '4. Update Patient',
      '5. Delete Patient',
      '6. Billing',
      '7. Book Appointment',
      '8. Reschedule Appointment',
      '9. Exit',
      'Enter choice: ',
    ]);
    setActiveWorkflow(null);
    setWorkflowStep(0);
    setTempFormData({});
  };

  const handleSelectOption = (choice: number) => {
    appendLogs([`> ${choice}`]);

    switch (choice) {
      case 1:
      case 7: {
        // Add Patient / Book Appointment
        if (patients.length >= 100) {
          appendLogs(['[Error] Hospital is at full capacity!']);
          showMainMenu();
          return;
        }
        appendLogs(['--- Add Patient ---', 'Enter name: ']);
        setActiveWorkflow('add_patient');
        setWorkflowStep(1);
        break;
      }
      case 2: {
        // View Patients
        appendLogs(['--- Patient List ---']);
        if (patients.length === 0) {
          appendLogs(['No records found.']);
        } else {
          patients.forEach((p) => {
            appendLogs([
              `ID: ${p.id} | Name: ${p.name} | Age: ${p.age} | Doctor: ${p.doctor} | Date: ${p.date} | Time: ${p.time}`,
            ]);
          });
        }
        showMainMenu();
        break;
      }
      case 3: {
        // Search Patient
        appendLogs(['Enter Patient ID: ']);
        setActiveWorkflow('search_patient');
        setWorkflowStep(1);
        break;
      }
      case 4: {
        // Update Patient
        appendLogs(['Enter Patient ID to update: ']);
        setActiveWorkflow('update_patient');
        setWorkflowStep(1);
        break;
      }
      case 5: {
        // Delete Patient
        appendLogs(['Enter Patient ID to delete: ']);
        setActiveWorkflow('delete_patient');
        setWorkflowStep(1);
        break;
      }
      case 6: {
        // Billing
        appendLogs(['--- Billing ---', 'Enter number of days admitted: ']);
        setActiveWorkflow('billing');
        setWorkflowStep(1);
        break;
      }
      case 8: {
        // Reschedule Appointment
        appendLogs(['Enter Patient ID to reschedule: ']);
        setActiveWorkflow('reschedule');
        setWorkflowStep(1);
        break;
      }
      case 9: {
        appendLogs(['Exiting...', 'Process finished with exit code 0.']);
        setActiveWorkflow('exited');
        break;
      }
      default: {
        appendLogs(['Invalid choice!']);
        showMainMenu();
      }
    }
  };

  const handleWorkflowInput = (input: string) => {
    appendLogs([`> ${input}`]);

    if (!activeWorkflow) {
      const choice = parseInt(input.trim(), 10);
      if (!isNaN(choice)) {
        handleSelectOption(choice);
      } else {
        appendLogs(['Invalid choice!']);
        showMainMenu();
      }
      return;
    }

    // Add Patient Workflow
    if (activeWorkflow === 'add_patient') {
      if (workflowStep === 1) {
        setTempFormData((prev: any) => ({ ...prev, name: input }));
        appendLogs(['Enter age: ']);
        setWorkflowStep(2);
      } else if (workflowStep === 2) {
        setTempFormData((prev: any) => ({ ...prev, age: parseInt(input, 10) || 30 }));
        appendLogs(['Enter doctor: ']);
        setWorkflowStep(3);
      } else if (workflowStep === 3) {
        setTempFormData((prev: any) => ({ ...prev, doctor: input }));
        appendLogs(['Enter appointment date (DD-MM-YYYY): ']);
        setWorkflowStep(4);
      } else if (workflowStep === 4) {
        setTempFormData((prev: any) => ({ ...prev, date: input }));
        appendLogs(['Enter time (HH:MM): ']);
        setWorkflowStep(5);
      } else if (workflowStep === 5) {
        const full = { ...tempFormData, time: input };
        addPatient({
          name: full.name,
          age: full.age,
          gender: 'Other',
          doctor: full.doctor,
          date: full.date,
          time: full.time,
          bloodGroup: 'O+',
          phone: '+1 555-0000',
          vitals: { bloodPressure: '120/80', heartRate: 72, spO2: 98, temperature: 98.6 },
          triage: 'Routine',
          admissionStatus: 'Outpatient',
          admissionDays: 0,
          diagnosis: 'Registered via C++ CLI Terminal Simulator',
          allergies: ['None recorded'],
        });
        appendLogs(['Patient added successfully!']);
        showMainMenu();
      }
      return;
    }

    // Search Patient Workflow
    if (activeWorkflow === 'search_patient') {
      const id = parseInt(input, 10);
      const found = patients.find((p) => p.id === id);
      if (found) {
        appendLogs([`Found: ${found.name}, Doctor: ${found.doctor}, Date: ${found.date}, Time: ${found.time}`]);
      } else {
        appendLogs(['Patient not found!']);
      }
      showMainMenu();
      return;
    }

    // Delete Patient Workflow
    if (activeWorkflow === 'delete_patient') {
      const id = parseInt(input, 10);
      const ok = deletePatient(id);
      if (ok) {
        appendLogs(['Deleted successfully! (Array elements shifted)']);
      } else {
        appendLogs(['Patient not found!']);
      }
      showMainMenu();
      return;
    }

    // Update Patient Workflow
    if (activeWorkflow === 'update_patient') {
      if (workflowStep === 1) {
        const id = parseInt(input, 10);
        const p = patients.find((pt) => pt.id === id);
        if (!p) {
          appendLogs(['Patient not found!']);
          showMainMenu();
          return;
        }
        setTempFormData({ id });
        appendLogs(['Enter new name: ']);
        setWorkflowStep(2);
      } else if (workflowStep === 2) {
        setTempFormData((prev: any) => ({ ...prev, name: input }));
        appendLogs(['Enter new age: ']);
        setWorkflowStep(3);
      } else if (workflowStep === 3) {
        setTempFormData((prev: any) => ({ ...prev, age: parseInt(input, 10) || 30 }));
        appendLogs(['Enter new doctor: ']);
        setWorkflowStep(4);
      } else if (workflowStep === 4) {
        setTempFormData((prev: any) => ({ ...prev, doctor: input }));
        appendLogs(['Enter new date: ']);
        setWorkflowStep(5);
      } else if (workflowStep === 5) {
        setTempFormData((prev: any) => ({ ...prev, date: input }));
        appendLogs(['Enter new time: ']);
        setWorkflowStep(6);
      } else if (workflowStep === 6) {
        updatePatient(tempFormData.id, {
          name: tempFormData.name,
          age: tempFormData.age,
          doctor: tempFormData.doctor,
          date: tempFormData.date,
          time: input,
        });
        appendLogs(['Updated successfully!']);
        showMainMenu();
      }
      return;
    }

    // Billing Workflow
    if (activeWorkflow === 'billing') {
      const days = parseInt(input, 10);
      const charge = 500.0;
      if (isNaN(days) || days < 0) {
        appendLogs(['Invalid number of days.']);
      } else {
        const total = days * charge;
        appendLogs([`Total Bill: ${total}`]);
      }
      showMainMenu();
      return;
    }

    // Reschedule Workflow
    if (activeWorkflow === 'reschedule') {
      if (workflowStep === 1) {
        const id = parseInt(input, 10);
        const p = patients.find((pt) => pt.id === id);
        if (!p) {
          appendLogs(['Patient not found!']);
          showMainMenu();
          return;
        }
        setTempFormData({ id });
        appendLogs([`Current Date: ${p.date} | Time: ${p.time}`, 'Enter new date: ']);
        setWorkflowStep(2);
      } else if (workflowStep === 2) {
        setTempFormData((prev: any) => ({ ...prev, date: input }));
        appendLogs(['Enter new time: ']);
        setWorkflowStep(3);
      } else if (workflowStep === 3) {
        updatePatient(tempFormData.id, {
          date: tempFormData.date,
          time: input,
        });
        appendLogs(['Rescheduled successfully!']);
        showMainMenu();
      }
      return;
    }
  };

  const handleRestartTerminal = () => {
    setTerminalLogs([
      'Compiled with: g++ -O3 hospms.cpp -o hospital_system',
      'Executing ./hospital_system ...',
      '',
      '====== Hospital Management System ======',
      '1. Add Patient',
      '2. View Patients',
      '3. Search Patient',
      '4. Update Patient',
      '5. Delete Patient',
      '6. Billing',
      '7. Book Appointment',
      '8. Reschedule Appointment',
      '9. Exit',
      'Enter choice: ',
    ]);
    setActiveWorkflow(null);
    setWorkflowStep(0);
    setTempFormData({});
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600" />
            Monish's Original C++ CLI Simulator (hospms.cpp)
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Experience the original console application running in real-time. Any records added or modified
            here are synchronized bi-directionally with the modern EHR and Billing modules!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCodeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            View hospms.cpp Source
          </button>
          <button
            onClick={handleRestartTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Process
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-400 text-[11px]">bash: ./hospital_system (C++11 stdout)</span>
          </div>
          <span className="text-[11px] text-emerald-500">READY</span>
        </div>

        {/* Terminal Screen */}
        <div className="p-5 min-h-[360px] max-h-[460px] overflow-y-auto space-y-1 text-slate-300">
          {terminalLogs.map((log, idx) => (
            <div
              key={idx}
              className={`${
                log.startsWith('======') || log.startsWith('---')
                  ? 'text-teal-400 font-bold'
                  : log.startsWith('>')
                  ? 'text-emerald-400 font-bold'
                  : log.startsWith('[Error]')
                  ? 'text-rose-400 font-bold'
                  : log.includes('successfully') || log.includes('Found')
                  ? 'text-emerald-300'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Line */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold">{'>'}</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputVal.trim()) {
                handleWorkflowInput(inputVal);
                setInputVal('');
              }
            }}
            placeholder="Type choice (1-9) or input value and press Enter..."
            className="flex-1 bg-transparent text-emerald-300 focus:outline-none text-xs font-mono"
          />
          <button
            onClick={() => {
              if (inputVal.trim()) {
                handleWorkflowInput(inputVal);
                setInputVal('');
              }
            }}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-sans font-medium"
          >
            Send
          </button>
        </div>
      </div>

      {/* Quick Interactive Menu Buttons */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
          Quick Menu Buttons (Simulating cin &gt;&gt; choice)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <button
            onClick={() => handleSelectOption(1)}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">1. Add Patient</span>
            <span className="text-[10px] text-slate-400">addPatient()</span>
          </button>

          <button
            onClick={() => handleSelectOption(2)}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">2. View Patients</span>
            <span className="text-[10px] text-slate-400">viewPatients()</span>
          </button>

          <button
            onClick={() => handleSelectOption(3)}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">3. Search Patient</span>
            <span className="text-[10px] text-slate-400">searchPatient()</span>
          </button>

          <button
            onClick={() => handleSelectOption(4)}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">4. Update Patient</span>
            <span className="text-[10px] text-slate-400">updatePatient()</span>
          </button>

          <button
            onClick={() => handleSelectOption(5)}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">5. Delete Patient</span>
            <span className="text-[10px] text-slate-400">deletePatient()</span>
          </button>

          <button
            onClick={() => handleSelectOption(6)}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">6. Billing</span>
            <span className="text-[10px] text-slate-400">billing() ($500/day)</span>
          </button>

          <button
            onClick={() => handleSelectOption(7)}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">7. Book Appointment</span>
            <span className="text-[10px] text-slate-400">bookAppointment()</span>
          </button>

          <button
            onClick={() => handleSelectOption(8)}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">8. Reschedule</span>
            <span className="text-[10px] text-slate-400">rescheduleAppointment()</span>
          </button>

          <button
            onClick={() => handleSelectOption(9)}
            className="p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-rose-50 hover:text-rose-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-rose-700 block">9. Exit</span>
            <span className="text-[10px] text-slate-400">return 0</span>
          </button>
        </div>
      </div>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl max-w-3xl w-full border border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-mono text-xs text-slate-300 font-bold">
                monish3725 / Hospital-Database-Management-System / hospms.cpp
              </span>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            <pre className="mt-4 p-4 bg-slate-900 text-slate-200 font-mono text-xs max-h-[60vh] overflow-y-auto rounded-lg leading-relaxed">
{`#include <iostream>
#include <string>
using namespace std;

class Hospital
{
private:
    struct Patient
    {
        int id;
        string name;
        int age;
        string doctor;
        string date;
        string time;
    };
    Patient patients[100];
    int count = 0;

public:
    void addPatient() { ... }
    void viewPatients() { ... }
    void searchPatient() { ... }
    void updatePatient() { ... }
    void deletePatient() { ... }
    void billing() {
        int days;
        float charge = 500.0;
        cout << "\\n--- Billing ---\\n";
        cout << "Enter number of days admitted: ";
        cin >> days;
        float total = days * charge;
        cout << "Total Bill: " << total << endl;
    }
    void bookAppointment() { addPatient(); }
    void rescheduleAppointment() { ... }
};`}
            </pre>
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
