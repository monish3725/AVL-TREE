import React from 'react';
import {
  Sparkles,
  Database,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Code2,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Overview */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
        <span className="text-xs font-mono font-semibold text-teal-400 uppercase tracking-wider block mb-1">
          Engineering Architecture Review & Roadmap
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          How to Take "Hospital-Database-Management-System" to the Next Level
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
          Monish's project provides an intuitive, clean OOP foundation in C++ demonstrating menu-driven
          record manipulation. Below is an engineer's comprehensive blueprint to elevate this system from
          an introductory classroom console script into a production-grade Clinical DBMS.
        </p>
      </div>

      {/* 6 Core Enhancement Pillars */}
      <div className="space-y-4">
        {/* Pillar 1: Data Structures & C++ Modernization */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Pillar 01 · Data Structures & C++</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                Dynamic Memory & Fast Lookups: Replace Fixed Arrays with STL
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Currently, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">Patient patients[100];</code> caps
                capacity at 100 records and consumes static memory. Searching is an $O(N)$ linear loop, and deletion requires
                manual array shifting.
              </p>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-200">
                  <span className="font-semibold text-rose-900 block mb-1">Original Implementation</span>
                  <pre className="font-mono text-[11px] text-rose-800">
{`Patient patients[100]; // Fixed cap
// O(N) linear search
for (int i = 0; i < count; i++) {
  if (patients[i].id == id) { ... }
}`}
                  </pre>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
                  <span className="font-semibold text-emerald-900 block mb-1">Next-Level Upgrade</span>
                  <pre className="font-mono text-[11px] text-emerald-800">
{`// Dynamic storage & O(1) hash map
std::unordered_map<int, Patient> registry;
auto it = registry.find(id); // O(1)
if (it != registry.end()) { ... }`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Relational Normalization */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Pillar 02 · Relational Architecture</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                Relational Database Normalization (3NF): Decouple Entities
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                In <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">struct Patient</code>, doctor names,
                appointment dates, and times are bundled inside the patient. This violates 3rd Normal Form (3NF) and causes
                update anomalies. In the next-level system:
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">PATIENTS</span>
                  <span className="text-[11px] text-slate-500">id, name, age, phone, blood_group</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">DOCTORS</span>
                  <span className="text-[11px] text-slate-500">id, name, specialty, room, fee</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">APPOINTMENTS</span>
                  <span className="text-[11px] text-slate-500">id, patient_id, doctor_id, date, status</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Real Database Persistence */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Pillar 03 · Persistence & ACID</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                Persistent Storage: Integrate SQLite or PostgreSQL
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Currently, when the program terminates, all data vanishes. Integrating an embedded database like
                <strong className="text-slate-900"> SQLite</strong> (zero server setup, single file <code className="font-mono">hospital.db</code>)
                gives you real SQL queries, ACID transaction safety, foreign keys, and permanent disk persistence.
              </p>
            </div>
          </div>
        </div>

        {/* Pillar 4: Dynamic Clinical Billing */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Pillar 04 · Healthcare Financials</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                Itemized Billing Engine: Beyond Flat Daily Tariffs
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Monish's formula <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">total = days * 500.0</code> was
                a great start. Elevating it means:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-inside">
                <li>Tiered ward tariffs: ICU ($1,200/day) vs Post-Op ($650/day) vs General ($350/day).</li>
                <li>Itemized billing for lab tests (ECG, CMP, X-Rays) and pharmacy meds.</li>
                <li>Insurance adjudication, deductible co-pays, and printable PDF/receipt invoices.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pillar 5: Security, RBAC & HIPAA */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Pillar 05 · Compliance & Security</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                Role-Based Access Control (RBAC) & HIPAA Data Privacy
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Hospital databases handle sensitive Protected Health Information (PHI). Production systems require:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-inside">
                <li><strong className="text-slate-800">Role Separation:</strong> Doctors see medical EHR; Receptionists see booking; Billing sees invoices.</li>
                <li><strong className="text-slate-800">Audit Logs:</strong> Who accessed or modified patient record #1 and when?</li>
                <li><strong className="text-slate-800">Encryption:</strong> Passwords hashed with bcrypt/Argon2; database encrypted at rest.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pillar 6: Full-Stack Interface */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Pillar 06 · Full-Stack Delivery</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                Modern Responsive Web Interface & REST API
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Transform the CLI into a cloud-native Clinical Operating System (like the one built right here in this applet)
                with responsive dashboards, real-time bed tracking, interactive calendars, and SQL inspection tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
