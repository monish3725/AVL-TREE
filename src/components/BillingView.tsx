import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle,
  Printer,
  Download,
  AlertCircle,
  FileCheck,
  Calendar,
  Building,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Bill, BillItem } from '../types/hospital';

interface BillingViewProps {
  initialPatientId?: number | null;
}

export const BillingView: React.FC<BillingViewProps> = ({ initialPatientId }) => {
  const { bills, patients, doctors, generateBill, markBillPaid, exportBillsCSV } = useHospital();

  const [filterStatus, setFilterStatus] = useState<'all' | 'Paid' | 'Pending'>('all');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Bill | null>(null);

  // Bill Generation Form State
  const [selectedPatientId, setSelectedPatientId] = useState<number>(
    initialPatientId || (patients[0]?.id ?? 1)
  );
  const [daysAdmitted, setDaysAdmitted] = useState<number>(3);
  const [dailyRate, setDailyRate] = useState<number>(500.0); // Monish's 500.0 baseline
  const [roomType, setRoomType] = useState('Standard Inpatient Bed');
  const [insuranceDiscount, setInsuranceDiscount] = useState<number>(250);
  const [paymentMethod, setPaymentMethod] = useState('Insurance Co-Pay');

  // Additional clinical item selection
  const [includeEcg, setIncludeEcg] = useState(true);
  const [includeBloodPanel, setIncludeBloodPanel] = useState(true);
  const [includeIvMeds, setIncludeIvMeds] = useState(false);
  const [includeXray, setIncludeXray] = useState(false);

  const filteredBills = bills.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const totalRevenue = bills.filter((b) => b.status === 'Paid').reduce((sum, b) => sum + b.total, 0);
  const pendingRevenue = bills.filter((b) => b.status === 'Pending').reduce((sum, b) => sum + b.total, 0);

  const handleOpenGenerate = (patientId?: number) => {
    if (patientId) {
      setSelectedPatientId(patientId);
      const targetPatient = patients.find((p) => p.id === patientId);
      if (targetPatient) {
        setDaysAdmitted(targetPatient.admissionDays || 1);
      }
    }
    setIsGenerateModalOpen(true);
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();

    const customItems: Array<{
      description: string;
      category: BillItem['category'];
      quantity: number;
      unitPrice: number;
    }> = [];

    if (includeEcg) {
      customItems.push({
        description: '12-Lead Electrocardiogram (ECG) Diagnostic Review',
        category: 'Diagnostics & Labs',
        quantity: 1,
        unitPrice: 220,
      });
    }

    if (includeBloodPanel) {
      customItems.push({
        description: 'Comprehensive Metabolic Panel (CMP) & CBC',
        category: 'Diagnostics & Labs',
        quantity: 1,
        unitPrice: 140,
      });
    }

    if (includeIvMeds) {
      customItems.push({
        description: 'Clinical IV Infusions & Pharmacological Therapy',
        category: 'Pharmacy',
        quantity: 1,
        unitPrice: 180,
      });
    }

    if (includeXray) {
      customItems.push({
        description: 'Digital High-Resolution Radiography / X-Ray',
        category: 'Diagnostics & Labs',
        quantity: 1,
        unitPrice: 195,
      });
    }

    const newBill = generateBill({
      patientId: Number(selectedPatientId),
      daysAdmitted: Number(daysAdmitted),
      dailyRate: Number(dailyRate),
      roomType,
      customItems,
      insuranceDiscount: Number(insuranceDiscount),
      paymentMethod,
    });

    setIsGenerateModalOpen(false);
    setSelectedInvoiceForPrint(newBill);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Revenue & Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Collected Revenue (Paid)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-teal-700">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {bills.filter((b) => b.status === 'Paid').length} paid invoices
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Outstanding Receivable (Pending)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-700">
              ${pendingRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {bills.filter((b) => b.status === 'Pending').length} pending
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Base Daily Tariff Standard</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">$500.00/day</span>
            <span className="text-xs text-slate-500">hospms.cpp baseline</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Status Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['all', 'Pending', 'Paid'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  filterStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'All Invoices' : st}
              </button>
            ))}
          </div>

          <button
            onClick={exportBillsCSV}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export Ledger CSV
          </button>
        </div>

        <button
          onClick={() => handleOpenGenerate()}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Patient Bill
        </button>
      </div>

      {/* Invoices Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient & Attending Doctor</th>
                <th className="py-3 px-4">Days Admitted</th>
                <th className="py-3 px-4">Room Tariff</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">Total Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No billing records found.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-slate-900">{bill.billNumber}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{bill.patientName}</span>
                        <span className="text-[11px] text-slate-500">
                          {bill.doctorName} · ID #{bill.patientId}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-800">
                      {bill.daysAdmitted} {bill.daysAdmitted === 1 ? 'day' : 'days'}
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600">
                      ${bill.dailyRate.toFixed(2)}/day
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600">
                      ${bill.subtotal.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-slate-900">
                      ${bill.total.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          bill.status === 'Paid' ? 'text-teal-700' : 'text-amber-700'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoiceForPrint(bill)}
                          title="View / Print Official Invoice"
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          Invoice
                        </button>

                        {bill.status === 'Pending' && (
                          <button
                            onClick={() => markBillPaid(bill.id, 'Credit Card')}
                            className="px-2.5 py-1 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
                          >
                            Mark Paid
                          </button>
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

      {/* Generate Bill Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Dynamic Inpatient Billing Engine</h3>
                <p className="text-xs text-slate-500">
                  Elevating Monish's flat tariff with itemized diagnostics, consults, and insurance
                </p>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Patient *</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedPatientId(id);
                    const p = patients.find((pt) => pt.id === id);
                    if (p) setDaysAdmitted(p.admissionDays || 1);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientCode}) — Assigned: {p.doctor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Number of Days Admitted *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={daysAdmitted}
                    onChange={(e) => setDaysAdmitted(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Matches cin &gt;&gt; days in hospms.cpp
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Daily Hospital Tariff ($) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="50"
                    required
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Original default: 500.0
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Room / Bed Classification</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="General Inpatient Ward">General Inpatient Ward ($350 - $500/day)</option>
                  <option value="Semi-Private Deluxe Room">Semi-Private Deluxe Room ($550/day)</option>
                  <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU) ($1,200/day)</option>
                  <option value="Pediatric Care Ward">Pediatric Care Ward ($450/day)</option>
                  <option value="Post-Operative Recovery Ward">Post-Operative Recovery Ward ($650/day)</option>
                </select>
              </div>

              {/* Itemized Clinical Checkboxes */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Itemized Diagnostic & Clinical Add-Ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeEcg}
                      onChange={(e) => setIncludeEcg(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>12-Lead ECG Review (+$220)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeBloodPanel}
                      onChange={(e) => setIncludeBloodPanel(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Comprehensive Blood Panel (+$140)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeIvMeds}
                      onChange={(e) => setIncludeIvMeds(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>IV Infusion Supplies (+$180)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeXray}
                      onChange={(e) => setIncludeXray(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Diagnostic X-Ray (+$195)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Insurance Co-Pay Deduction ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={insuranceDiscount}
                    onChange={(e) => setInsuranceDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Settlement Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Insurance Co-Pay">Insurance Co-Pay</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Direct Cash">Direct Cash</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-teal-900">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Room Tariff: {daysAdmitted} days × ${dailyRate}</span>
                  <span className="font-mono tabular-nums">${(daysAdmitted * dailyRate).toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-teal-700 mt-1">
                  Plus attending physician consult + selected diagnostics minus insurance allowance.
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  Generate Official Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Medical Invoice Modal */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Invoice Top Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    +
                  </div>
                  <span className="font-bold text-lg text-slate-900">Apex Medical Center</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Department of Patient Accounting & Clinical Billing
                </p>
                <p className="text-xs text-slate-400">100 Healthcare Pavilion Way · Suite 500</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Official Statement
                </span>
                <span className="font-mono text-base font-bold text-slate-900">
                  {selectedInvoiceForPrint.billNumber}
                </span>
                <span className="text-xs text-slate-500 block mt-1">Date: {selectedInvoiceForPrint.date}</span>
                <span
                  className={`inline-block mt-2 px-2.5 py-0.5 rounded text-xs font-bold ${
                    selectedInvoiceForPrint.status === 'Paid'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {selectedInvoiceForPrint.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Patient & Admission Info */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Billed To (Patient):</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {selectedInvoiceForPrint.patientName}
                </span>
                <span className="text-slate-500">Patient Identifier: #{selectedInvoiceForPrint.patientId}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Attending Physician:</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {selectedInvoiceForPrint.doctorName}
                </span>
                <span className="text-slate-500">
                  Admission Duration: {selectedInvoiceForPrint.daysAdmitted} days (Tariff ${selectedInvoiceForPrint.dailyRate}/day)
                </span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2">Description</th>
                    <th className="py-2">Category</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {selectedInvoiceForPrint.items.map((item) => (
                    <tr key={item.id} className="text-slate-800">
                      <td className="py-2.5 font-sans font-medium text-slate-900">{item.description}</td>
                      <td className="py-2.5 font-sans text-slate-500 text-[11px]">{item.category}</td>
                      <td className="py-2.5 text-right tabular-nums">{item.quantity}</td>
                      <td className="py-2.5 text-right tabular-nums">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 text-right font-semibold tabular-nums text-slate-900">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-slate-200 flex justify-end text-xs">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Subtotal:</span>
                  <span className="font-mono tabular-nums">${selectedInvoiceForPrint.subtotal.toFixed(2)}</span>
                </div>
                {selectedInvoiceForPrint.insuranceDiscount > 0 && (
                  <div className="flex justify-between text-teal-700">
                    <span>Insurance Allowance:</span>
                    <span className="font-mono tabular-nums">
                      -${selectedInvoiceForPrint.insuranceDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Sales & Municipal Tax (4%):</span>
                  <span className="font-mono tabular-nums">${selectedInvoiceForPrint.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                  <span>Net Amount Due:</span>
                  <span className="font-mono tabular-nums text-teal-800">
                    ${selectedInvoiceForPrint.total.toFixed(2)}
                  </span>
                </div>
                {selectedInvoiceForPrint.paymentMethod && (
                  <div className="text-[11px] text-slate-400 text-right">
                    Settlement Method: {selectedInvoiceForPrint.paymentMethod}
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Footer Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Generated from Hospital DBMS dynamic billing pipeline
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Statement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
