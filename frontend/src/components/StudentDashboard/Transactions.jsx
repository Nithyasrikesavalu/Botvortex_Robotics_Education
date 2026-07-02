import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Download, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, Search, Filter, X, Bot, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const transactions = [
  { id: 'TRX-9921', type: 'Purchase',   item: '1,000 Coins Bundle',    instructor: '-',          amount: '$10.00',    date: 'Oct 24, 2026', status: 'Completed', icon: ArrowUpRight,   color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'TRX-9920', type: 'Enrollment', item: 'Advanced Robotics V2',  instructor: 'Alex Bensom', amount: '500 Coins', date: 'Oct 20, 2026', status: 'Completed', icon: ArrowDownRight, color: 'text-blue-400',    bg: 'bg-blue-400/10'    },
  { id: 'TRX-9919', type: 'Purchase',   item: '500 Coins Bundle',      instructor: '-',          amount: '$5.50',     date: 'Oct 15, 2026', status: 'Completed', icon: ArrowUpRight,   color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'TRX-9918', type: 'Enrollment', item: 'Python for Automation', instructor: 'Alex Bensom', amount: '200 Coins', date: 'Oct 10, 2026', status: 'Processing', icon: Clock,         color: 'text-amber-400',   bg: 'bg-amber-400/10'   },
];

/* ─────────────────────────────────────────────────────────────
   Receipt Modal
───────────────────────────────────────────────────────────── */
const ReceiptModal = ({ trx, onClose }) => {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
      const pdfWidth  = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BotVortex-Receipt-${trx.id}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const isCoins  = trx.amount.includes('Coins');
  const statusOk = trx.status === 'Completed';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1,   y: 0  }}
          exit={{ opacity: 0,   scale: 0.9, y: 24 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Action Buttons (outside receipt so they don't appear in PDF) */}
          <div className="flex justify-end items-center mb-3 px-1">

            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* ── RECEIPT BODY (captured by html2canvas) ── */}
          <div
            ref={receiptRef}
            className="bg-white rounded-2xl overflow-hidden shadow-2xl text-slate-800"
          >
            {/* Header Strip */}
            <div className="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] px-8 py-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-white/5" />
              <div className="relative flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                    <Bot size={22} className="text-white" />
                  </div>
                  <span className="text-2xl font-black tracking-wider">BOTVORTEX</span>
                </div>
                <p className="text-white/70 text-xs font-medium tracking-widest uppercase">Official Receipt</p>
              </div>
            </div>

            {/* Receipt Meta */}
            <div className="px-8 py-6 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Transaction ID</p>
                  <p className="font-mono font-bold text-slate-700 text-sm">{trx.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  statusOk
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}>
                  {statusOk ? <CheckCircle size={11} /> : <Clock size={11} />}
                  {trx.status}
                </span>
              </div>
            </div>

            {/* Line Items */}
            <div className="px-8 py-6 space-y-4">
              {[
                { label: 'Type',        value: trx.type },
                { label: 'Description', value: trx.item },
                { label: 'Instructor',  value: trx.instructor },
                { label: 'Date',        value: trx.date },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="text-slate-700 font-semibold text-right max-w-[55%]">{value}</span>
                </div>
              ))}
            </div>

            {/* Amount Total */}
            <div className="mx-8 mb-6 p-4 bg-gradient-to-r from-[#7C3AED]/5 to-[#4F46E5]/5 rounded-xl border border-[#7C3AED]/20">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Amount</span>
                <span className={`text-2xl font-black ${isCoins ? 'text-[#7C3AED]' : 'text-emerald-600'}`}>
                  {trx.amount}
                </span>
              </div>
              {isCoins && (
                <p className="text-[11px] text-slate-400 mt-1 text-right">Paid in BotVortex Coins</p>
              )}
            </div>

            {/* Dotted Divider */}
            <div className="mx-8 border-t-2 border-dashed border-slate-200 mb-6" />

            {/* Footer */}
            <div className="px-8 pb-7 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText size={14} className="text-slate-400" />
                <p className="text-[11px] text-slate-400 font-medium">
                  This is a computer-generated receipt. No signature required.
                </p>
              </div>
              <p className="text-[10px] text-slate-300">
                BotVortex Academy · support@botvortex.com · botvortex.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Transactions Page
───────────────────────────────────────────────────────────── */
const Transactions = () => {
  const navigate = useNavigate();
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredTransactions = transactions.filter(trx => {
    const matchesSearch = trx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trx.item.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "All" || trx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("No data to export!");
      return;
    }
    
    const headers = ['Transaction ID', 'Type', 'Item Details', 'Instructor', 'Date', 'Amount', 'Status'];
    const rows = filteredTransactions.map(trx => [
      trx.id,
      trx.type,
      `"${trx.item}"`,
      `"${trx.instructor}"`,
      `"${trx.date}"`,
      trx.amount,
      trx.status
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'BotVortex_Transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <CreditCard size={32} className="text-[#7C3AED]" />
            Transactions &amp; Billing
          </h2>
          <p className="text-slate-400 mt-2">Manage your coin purchases, course enrollments, and receipts.</p>
        </div>

        <div className="flex items-center gap-4 bg-[#0A192F]/60 p-2 rounded-2xl border border-white/10">
          <div className="text-right px-4 border-r border-white/10">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Balance</p>
            <p className="text-xl font-black text-[#00E5FF]">1,250 Coins</p>
          </div>
          <button 
            onClick={() => navigate('/buy-coins')}
            className="px-6 py-2 bg-gradient-to-r from-[#7C3AED] to-[#9D4EDD] hover:from-[#9D4EDD] hover:to-[#7C3AED] text-white font-bold rounded-xl shadow-lg transition-all text-sm"
          >
            Add Coins
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0A192F]/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or Item..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#7C3AED]/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-9 pr-8 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium rounded-xl border border-white/5 transition-colors focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0A192F] text-white">All Types</option>
              <option value="Purchase" className="bg-[#0A192F] text-white">Purchase</option>
              <option value="Enrollment" className="bg-[#0A192F] text-white">Enrollment</option>
            </select>
            {/* Custom dropdown arrow to replace the default one removed by appearance-none */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium rounded-xl border border-white/5 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0A192F]/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-widest font-black text-slate-400">
                <th className="p-4 pl-6">Transaction ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Item Details</th>
                <th className="p-4">Instructor</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx, i) => (
                <motion.tr
                  key={trx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-4 pl-6 font-mono text-sm text-slate-300">{trx.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${trx.bg}`}>
                        <trx.icon size={14} className={trx.color} />
                      </div>
                      <span className="text-sm font-bold text-white">{trx.type}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-300 font-medium">{trx.item}</td>
                  <td className="p-4 text-sm text-slate-400">{trx.instructor}</td>
                  <td className="p-4 text-sm text-slate-400">{trx.date}</td>
                  <td className={`p-4 text-right text-sm font-bold ${trx.amount.includes('Coins') ? 'text-[#00E5FF]' : 'text-emerald-400'}`}>
                    {trx.amount}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                        trx.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {trx.status === 'Completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {trx.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setSelectedTrx(trx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-lg transition-all text-xs font-bold border border-transparent hover:border-[#7C3AED]/20"
                        title="View & Download Receipt"
                      >
                        <FileText size={15} />
                        <span className="hidden sm:inline">Receipt</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-slate-400">
          <span>Showing 1–{filteredTransactions.length} of {filteredTransactions.length} transactions</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-not-allowed opacity-50">Prev</button>
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedTrx && (
        <ReceiptModal trx={selectedTrx} onClose={() => setSelectedTrx(null)} />
      )}
    </div>
  );
};

export default Transactions;
