import React, { useState } from 'react';
import { Database, Play, Clock, Table, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const SqlStudioView: React.FC = () => {
  const { executeSql } = useHospital();

  const [query, setQuery] = useState(
    'SELECT id, name, age, doctor, triage, admissionStatus FROM patients WHERE age > 30 ORDER BY age DESC;'
  );
  const [queryResult, setQueryResult] = useState<{
    success: boolean;
    data?: any[];
    error?: string;
    rowCount?: number;
    executionTimeMs: number;
  }>({
    success: true,
    data: [],
    rowCount: 0,
    executionTimeMs: 0,
  });
  const [hasRun, setHasRun] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState(false);

  const presets = [
    {
      title: 'Active Patients Over 30 (Demographic Triage)',
      sql: 'SELECT id, name, age, doctor, triage, admissionStatus FROM patients WHERE age > 30 ORDER BY age DESC;',
    },
    {
      title: 'All Inpatient Bills & Outstanding Dues',
      sql: 'SELECT billNumber, patientName, doctorName, daysAdmitted, total, status FROM bills;',
    },
    {
      title: 'Occupied Hospital Beds & Wards',
      sql: 'SELECT code, ward, dailyRate, isOccupied, patientName FROM beds WHERE isOccupied = true;',
    },
    {
      title: 'Specialist Directory with Consultation Tariffs',
      sql: 'SELECT name, specialty, department, fee, availability FROM doctors;',
    },
    {
      title: 'Full Patient Directory (All Fields)',
      sql: 'SELECT * FROM patients;',
    },
  ];

  const handleRunQuery = () => {
    const res = executeSql(query);
    setQueryResult(res);
    setHasRun(true);
  };

  const handleLoadPreset = (sql: string) => {
    setQuery(sql);
    const res = executeSql(sql);
    setQueryResult(res);
    setHasRun(true);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  // Run initial query on mount if not run
  React.useEffect(() => {
    if (!hasRun) {
      handleRunQuery();
    }
  }, []);

  const columns = queryResult.data && queryResult.data.length > 0 ? Object.keys(queryResult.data[0]) : [];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600" />
              Relational DBMS Query Studio
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Monish's original C++ program held records in a static memory array{' '}
              <code className="font-mono text-teal-900 bg-teal-50 px-1 py-0.5 rounded">
                struct Patient patients[100]
              </code>
              . This SQL Studio demonstrates the relational upgrade path: structured schema querying,
              declarative projections, filtering, and indexing across entities.
            </p>
          </div>
        </div>

        {/* Preset Query Badges */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1">Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadPreset(p.sql)}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 rounded-md transition-colors"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Query Editor & Run Box */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-md">
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
            <span>SQL Query Editor (Active Database)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyQuery}
              className="px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              {copiedQuery ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedQuery ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleRunQuery}
              className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded flex items-center gap-1 transition-colors"
            >
              <Play className="w-3 h-3 fill-slate-950" />
              Execute (Ctrl+Enter)
            </button>
          </div>
        </div>

        <div className="p-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleRunQuery();
              }
            }}
            rows={3}
            className="w-full bg-transparent text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            placeholder="Type your SELECT query here..."
            spellCheck={false}
          />
        </div>

        {/* Execution Metadata Bar */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            {queryResult.success ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Query executed successfully
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Execution failed
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-slate-400 tabular-nums">
            <span>Latency: {queryResult.executionTimeMs}ms</span>
            <span>Rows: {queryResult.rowCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Query Results / Error Area */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-slate-500" />
            Query Result Set ({queryResult.rowCount || 0} records)
          </span>
          <span className="text-[11px] text-slate-400">Available: patients, doctors, appointments, bills, beds</span>
        </div>

        {!queryResult.success ? (
          <div className="p-6 text-xs text-rose-600 font-mono bg-rose-50/50">
            {queryResult.error}
          </div>
        ) : queryResult.data && queryResult.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold font-mono">
                  {columns.map((col) => (
                    <th key={col} className="py-2.5 px-4 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {queryResult.data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    {columns.map((col) => (
                      <td key={col} className="py-2 px-4 whitespace-nowrap text-slate-800">
                        {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            Query returned 0 rows matching criteria.
          </div>
        )}
      </div>

      {/* Relational Schema Quick Reference */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 text-xs">
        <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
          Database Schema Entity Matrix
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-slate-900 block mb-1">TABLE patients</span>
            <ul className="text-slate-600 font-mono text-[11px] space-y-0.5">
              <li>• id (INT, PRIMARY KEY)</li>
              <li>• name (VARCHAR)</li>
              <li>• age (INT)</li>
              <li>• doctor (VARCHAR)</li>
              <li>• date (VARCHAR)</li>
              <li>• time (VARCHAR)</li>
              <li>• triage (VARCHAR)</li>
              <li>• admissionStatus (VARCHAR)</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-slate-900 block mb-1">TABLE bills</span>
            <ul className="text-slate-600 font-mono text-[11px] space-y-0.5">
              <li>• id (VARCHAR, PRIMARY KEY)</li>
              <li>• patientId (INT, FOREIGN KEY)</li>
              <li>• daysAdmitted (INT)</li>
              <li>• dailyRate (DECIMAL)</li>
              <li>• subtotal (DECIMAL)</li>
              <li>• total (DECIMAL)</li>
              <li>• status (VARCHAR)</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-slate-900 block mb-1">TABLE beds</span>
            <ul className="text-slate-600 font-mono text-[11px] space-y-0.5">
              <li>• id (VARCHAR, PRIMARY KEY)</li>
              <li>• code (VARCHAR, UNIQUE)</li>
              <li>• ward (VARCHAR)</li>
              <li>• dailyRate (DECIMAL)</li>
              <li>• isOccupied (BOOLEAN)</li>
              <li>• patientId (INT, FOREIGN KEY)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
