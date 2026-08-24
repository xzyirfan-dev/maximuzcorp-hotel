import React, { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Moon, 
  Calendar, 
  FileSpreadsheet, 
  CheckCircle, 
  Download, 
  ShieldCheck, 
  AlertCircle,
  Building,
  CreditCard,
  Layers
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { NightAuditReport } from "../../types";

export const FinanceView: React.FC = () => {
  const { 
    rooms, 
    folios, 
    nightAuditReports, 
    runNightAudit, 
    activeRoleProfile 
  } = useHotel();

  const [selectedAuditReport, setSelectedAuditReport] = useState<NightAuditReport | null>(nightAuditReports[0] || null);
  const [isAuditing, setIsAuditing] = useState(false);

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === "OCCUPIED").length;
  const occupancyPercent = Number(((occupiedRooms / totalRooms) * 100).toFixed(1));
  
  const roomRevenueToday = rooms.filter(r => r.status === "OCCUPIED").reduce((sum, r) => sum + r.currentRate, 0);
  const fnbRevenueToday = 9800000;
  const spaRevenueToday = 2600000;
  const grossToday = roomRevenueToday + fnbRevenueToday + spaRevenueToday;

  const adr = occupiedRooms > 0 ? Math.round(roomRevenueToday / occupiedRooms) : 0;
  const revPar = Math.round(roomRevenueToday / totalRooms);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      runNightAudit();
      setIsAuditing(false);
      setSelectedAuditReport(nightAuditReports[0] || null);
    }, 1200);
  };

  // Past 7 Days Revenue Trend Simulation
  const weeklyTrends = [
    { day: "Tue 18", room: 42000000, fnb: 7500000, occ: 72 },
    { day: "Wed 19", room: 45500000, fnb: 8200000, occ: 78 },
    { day: "Thu 20", room: 48000000, fnb: 8900000, occ: 82 },
    { day: "Fri 21", room: 58000000, fnb: 12400000, occ: 95 },
    { day: "Sat 22", room: 62000000, fnb: 14800000, occ: 98 },
    { day: "Sun 23", room: 52000000, fnb: 10200000, occ: 88 },
    { day: "Mon 24 (Today)", room: roomRevenueToday, fnb: fnbRevenueToday, occ: occupancyPercent },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Financial Overview & Night Audit Trigger */}
      <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase">
              Financial Controller Module
            </span>
            <span className="text-xs text-stone-500 font-mono">Business Date: 24 Aug 2026</span>
          </div>
          <h2 className="text-base font-bold text-stone-900 mt-1">Daily Flash Revenue & Night Audit Ledger</h2>
          <p className="text-xs text-stone-500">Automated end-of-day revenue reconciliation, tax calculations and ledger posting</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-4 py-2 bg-[#27523d] hover:bg-[#1d4030] disabled:bg-stone-400 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Moon className="w-4 h-4" />
            <span>{isAuditing ? "Processing Night Audit Ledger..." : "Run End-of-Day Night Audit"}</span>
          </button>
        </div>
      </div>

      {/* KPI Flash Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-stone-500">Gross Hotel Revenue Today</span>
          <p className="text-2xl font-bold font-mono text-stone-900">
            Rp {(grossToday / 1000000).toFixed(2)}M
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +12.4% vs Budget
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-stone-500">Room Revenue (Net)</span>
          <p className="text-2xl font-bold font-mono text-emerald-950">
            Rp {(roomRevenueToday / 1000000).toFixed(2)}M
          </p>
          <span className="text-[11px] text-stone-500">
            {occupiedRooms} / {totalRooms} rooms occupied ({occupancyPercent}%)
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-stone-500">Average Daily Rate (ADR)</span>
          <p className="text-2xl font-bold font-mono text-stone-900">
            Rp {adr.toLocaleString()}
          </p>
          <span className="text-[11px] text-stone-500">
            Weighted across Standard to Penthouse
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-stone-500">RevPAR (Yield Performance)</span>
          <p className="text-2xl font-bold font-mono text-stone-900">
            Rp {revPar.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold">
            Top tier compset benchmark: 108%
          </span>
        </div>
      </div>

      {/* Revenue Distribution & 7-Day Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 7-Day Flash Chart */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                7-Day Revenue & Occupancy Pace
              </h3>
              <p className="text-[11px] text-stone-500">Comparative Rooms vs F&B departmental yields</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#27523d]"></span> Rooms
              </span>
              <span className="flex items-center gap-1 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> F&B
              </span>
            </div>
          </div>

          {/* Bar Visualizer */}
          <div className="space-y-3 pt-2">
            {weeklyTrends.map((t, idx) => {
              const maxVal = 75000000;
              const roomWidth = Math.round((t.room / maxVal) * 100);
              const fnbWidth = Math.round((t.fnb / maxVal) * 100);

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-stone-800">{t.day}</span>
                    <span className="font-mono text-stone-600">
                      Total: Rp {((t.room + t.fnb) / 1000000).toFixed(1)}M ({t.occ}% Occ)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-100 flex overflow-hidden">
                    <div 
                      className="bg-[#27523d] h-full"
                      style={{ width: `${roomWidth}%` }}
                      title={`Rooms: Rp ${t.room.toLocaleString()}`}
                    />
                    <div 
                      className="bg-amber-500 h-full"
                      style={{ width: `${fnbWidth}%` }}
                      title={`F&B: Rp ${t.fnb.toLocaleString()}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Departmental Split */}
        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Departmental Revenue Split Today
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e8e4dc] flex justify-between items-center">
              <div>
                <p className="font-bold text-stone-900">Room Division</p>
                <p className="text-[11px] text-stone-500">Lodging & Suite upgrades</p>
              </div>
              <span className="font-mono font-bold text-stone-900">
                Rp {roomRevenueToday.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e8e4dc] flex justify-between items-center">
              <div>
                <p className="font-bold text-stone-900">F&B & In-Room Dining</p>
                <p className="text-[11px] text-stone-500">Restaurant, Bar & Room Service</p>
              </div>
              <span className="font-mono font-bold text-stone-900">
                Rp {fnbRevenueToday.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e8e4dc] flex justify-between items-center">
              <div>
                <p className="font-bold text-stone-900">Spa, Wellness & Misc</p>
                <p className="text-[11px] text-stone-500">Treatments, laundry & transport</p>
              </div>
              <span className="font-mono font-bold text-stone-900">
                Rp {spaRevenueToday.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between items-center font-mono">
              <span className="text-stone-600 text-xs">Total Tax & Service Accrued:</span>
              <span className="font-bold text-emerald-900 text-xs">
                Rp {Math.round(grossToday * 0.21).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Night Audit Ledger Logs */}
      <div className="bg-white rounded-xl border border-[#e4ded4] shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              End-of-Day Night Audit Historical Reports ({nightAuditReports.length})
            </h3>
            <p className="text-[11px] text-stone-500">Automated ledger closes with trial balance verification</p>
          </div>
          <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Trial Balance Balanced (0 Discrepancy)
          </span>
        </div>

        <div className="divide-y divide-stone-100 text-xs">
          {nightAuditReports.map(report => (
            <div key={report.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-900">{report.date}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                    {report.status}
                  </span>
                  <span className="text-stone-500">Auditor: {report.auditorName}</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1">
                  Rooms: Rp {report.totalRoomRevenue.toLocaleString()} • F&B: Rp {report.totalFnbRevenue.toLocaleString()} • Tax (11%): Rp {report.totalTaxCollected.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <div className="text-right">
                  <span className="text-stone-900 font-bold block text-sm">
                    Rp {report.grossRevenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    ADR: Rp {report.adr.toLocaleString()} | Occ: {report.occupancyRate}%
                  </span>
                </div>
                <button
                  onClick={() => alert(`Exporting Official Tax & Audit Ledger for ${report.date}...`)}
                  className="p-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700"
                  title="Download Ledger CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
