import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  BedDouble, 
  TrendingUp, 
  Sparkles, 
  CalendarCheck, 
  ArrowUpRight, 
  Plus, 
  ArrowRight,
  Bot,
  Radio,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ChevronRight
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { HotelSilhouette, LuxuryHotelCrest, LuxuryOrnamentBorder } from "../HotelSilhouette";
import { getWibTimeInfo, WibTimeInfo } from "../../utils/wibTime";

export const DashboardView: React.FC<{ onOpenNewBooking: () => void }> = ({ onOpenNewBooking }) => {
  const { 
    rooms, 
    reservations, 
    housekeepingTasks, 
    workOrders, 
    shiftLogs, 
    setActiveView, 
    setSelectedRoom,
    setSelectedFolio,
    folios,
    checkInReservation,
    t,
    language
  } = useHotel();

  const [wibInfo, setWibInfo] = useState<WibTimeInfo>(() => getWibTimeInfo());

  useEffect(() => {
    const timer = setInterval(() => {
      setWibInfo(getWibTimeInfo());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === "OCCUPIED").length;
  const occupancyPercent = Number(((occupiedRooms / totalRooms) * 100).toFixed(1));
  
  const cleanRooms = rooms.filter(r => r.status === "VACANT_CLEAN" || r.status === "VACANT_INSPECTED").length;
  const dirtyRooms = rooms.filter(r => r.status === "VACANT_DIRTY" || r.status === "IN_PROGRESS").length;
  const oooRooms = rooms.filter(r => r.status === "OUT_OF_ORDER").length;
  
  const totalRoomRevenueToday = rooms.filter(r => r.status === "OCCUPIED").reduce((sum, r) => sum + r.currentRate, 0);
  const totalFnbToday = 9800000;
  const totalGrossToday = totalRoomRevenueToday + totalFnbToday + 2600000;
  
  const adr = occupiedRooms > 0 ? Math.round(totalRoomRevenueToday / occupiedRooms) : 0;
  const revPar = Math.round(totalRoomRevenueToday / totalRooms);

  const dueArrivals = reservations.filter(r => r.status === "CONFIRMED");
  const inHouseGuests = reservations.filter(r => r.status === "CHECKED_IN");
  const recentHandover = shiftLogs[0];

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300 pb-16 lg:pb-0">
      {/* Top Luxury Banner: Hotel Executive Status with Abstract Architectural Silhouette */}
      <div className="bg-gradient-to-br from-[#122e21] via-[#1a3d2e] to-[#0c2017] text-white rounded-2xl p-5 sm:p-6 lg:p-7 shadow-lg relative overflow-hidden border border-[#c5a059]/30">
        {/* Fine gold-metallic top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f1d279] to-transparent opacity-90" />

        {/* Abstract Hotel Architectural Silhouette Background Artwork */}
        <div className="absolute right-0 bottom-0 top-0 w-full sm:w-3/4 lg:w-3/5 pointer-events-none overflow-hidden flex items-end justify-end">
          <HotelSilhouette className="w-full h-full max-h-[300px] text-[#e8c872] transform translate-y-4 scale-105" opacity={0.16} />
        </div>

        {/* Subtle Radial Glow */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            {/* Live System Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold tracking-wider bg-[#c5a059]/20 text-[#f5dc8c] border border-[#c5a059]/50 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5dc8c] animate-pulse"></span>
                MaximuzCorp • Enterprise Suite
              </span>
              <span className="text-xs text-emerald-200/90 flex items-center gap-1.5 font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{language === "id" ? "Sinkronisasi Saluran Aktif" : "Channel Sync Active"}</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-900/50 border border-emerald-700/40">
                {wibInfo.timeString} WIB
              </span>
            </div>

            {/* Hotel Title with Crest */}
            <div className="flex items-start sm:items-center gap-3 pt-1">
              <div className="hidden xs:flex w-11 h-11 rounded-xl bg-emerald-950/90 border border-[#c5a059]/40 items-center justify-center shrink-0 shadow-inner">
                <LuxuryHotelCrest size={30} className="text-[#f5dc8c]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Maximuz Grand Heritage Hotel & Suites
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 font-medium mt-0.5">
                  {language === "id" 
                    ? `Waktu Resmi: ${wibInfo.dateStringId} • ${wibInfo.shiftLabelId}`
                    : `Official Time: ${wibInfo.dateStringEn} • ${wibInfo.shiftLabelEn}`
                  }
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed hidden sm:block">
              {language === "id"
                ? "Status Properti: 48 Kamar Aktif. Okupansi hari ini bergerak +14.2% lebih tinggi dari rata-rata pekan lalu dengan performa yield optimal."
                : "Property Status: 48 Rooms Active. Today's occupancy is pacing +14.2% higher than last week's average with optimal yield performance."
              }
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <button
              onClick={() => setActiveView("ai-intelligence")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-white text-xs font-semibold border border-[#c5a059]/50 hover:border-[#f5dc8c] transition-all shadow-sm cursor-pointer active:scale-98"
            >
              <Bot className="w-4 h-4 text-[#f5dc8c]" />
              <span>{language === "id" ? "Optimasi Pendapatan AI" : "AI Revenue Optimizer"}</span>
            </button>
            <button
              onClick={onOpenNewBooking}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#f5dc8c] to-[#c5a059] hover:from-[#fae6a2] hover:to-[#d4af37] text-[#0f241a] text-xs font-bold transition-all shadow-md cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{language === "id" ? "Reservasi Baru" : "Quick Check-In"}</span>
            </button>
          </div>
        </div>

        {/* Luxury Ornament Bottom Divider */}
        <div className="mt-5 pt-3 border-t border-emerald-800/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-200/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{language === "id" ? "Duty Manager Bertugas:" : "Active Duty Manager:"}</span>
            <strong className="text-white font-semibold">{wibInfo.dutyManagerName}</strong>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-emerald-300/80">
            <span>AUDIT: 23:30 WIB</span>
            <span>•</span>
            <span>SHIFT: {wibInfo.shiftProgressPercent}% COMPLETE</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (Responsive 1-col on phone, 2-col on tablet, 4-col on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Occupancy Rate */}
        <div 
          onClick={() => setActiveView("room-matrix")}
          className="bg-white p-4.5 rounded-xl border border-[#e4ded4] shadow-xs space-y-2 hover:border-[#27523d] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {language === "id" ? "Tingkat Okupansi" : "Occupancy Rate"}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 group-hover:bg-[#27523d] group-hover:text-white transition-colors">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-stone-900">{occupancyPercent}%</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +6.4% MoM
            </span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#27523d] to-emerald-600 h-full rounded-full" style={{ width: `${occupancyPercent}%` }} />
          </div>
          <p className="text-[11px] text-stone-500 flex justify-between pt-0.5">
            <span>{occupiedRooms} {language === "id" ? "Terisi" : "Occupied"}</span>
            <span className="font-semibold text-stone-700">{totalRooms - occupiedRooms} {language === "id" ? "Tersedia" : "Available"}</span>
          </p>
        </div>

        {/* Card 2: ADR (Average Daily Rate) */}
        <div 
          onClick={() => setActiveView("finance")}
          className="bg-white p-4.5 rounded-xl border border-[#e4ded4] shadow-xs space-y-2 hover:border-amber-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">ADR (Average Rate)</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-stone-900">
              Rp {(adr / 1000).toLocaleString()}k
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +8.2%
            </span>
          </div>
          <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
            Target: <span className="font-mono text-stone-900 font-bold">Rp 1,400,000</span> ({language === "id" ? "Tercapai" : "Achieved"} 103%)
          </p>
        </div>

        {/* Card 3: RevPAR (Revenue Per Available Room) */}
        <div 
          onClick={() => setActiveView("finance")}
          className="bg-white p-4.5 rounded-xl border border-[#e4ded4] shadow-xs space-y-2 hover:border-teal-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">RevPAR (Yield)</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-stone-900">
              Rp {(revPar / 1000).toLocaleString()}k
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.8%
            </span>
          </div>
          <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
            {language === "id" ? "Kapasitas 48 unit kamar aktif" : "Per available room capacity metric"}
          </p>
        </div>

        {/* Card 4: Daily Gross Revenue */}
        <div 
          onClick={() => setActiveView("finance")}
          className="bg-white p-4.5 rounded-xl border border-[#e4ded4] shadow-xs space-y-2 hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {language === "id" ? "Pendapatan Hari Ini" : "Gross Revenue Today"}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-stone-900">
              Rp {(totalGrossToday / 1000000).toFixed(1)}M
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-200">
              Audited
            </span>
          </div>
          <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 truncate">
            Rooms: Rp {(totalRoomRevenueToday / 1000000).toFixed(1)}M • F&B: Rp {(totalFnbToday / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Interactive Operational Matrix Overview (Responsive Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column (8 cols on desktop): Room Inventory Status & Expected Arrivals */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          {/* Room Rack Status Distribution */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e4ded4] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#27523d]" />
                  {language === "id" ? "Distribusi Status Kamar Real-Time" : "Live Room Status Distribution"}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === "id" 
                    ? "Sinkronisasi inventaris Housekeeping, Front Desk & Channel Manager"
                    : "Real-time housekeeping, front desk & OTA channel manager inventory sync"
                  }
                </p>
              </div>
              <button
                onClick={() => setActiveView("room-matrix")}
                className="text-xs font-bold text-[#27523d] hover:text-[#193d2c] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>{language === "id" ? "Buka Tape Chart Lengkap" : "Open Full Tape Chart"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Status Progress Bar */}
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-stone-100 mb-4 shadow-inner">
              <div 
                className="bg-[#27523d] h-full transition-all duration-500" 
                style={{ width: `${(occupiedRooms / totalRooms) * 100}%` }} 
                title={`Occupied: ${occupiedRooms}`}
              />
              <div 
                className="bg-emerald-400 h-full transition-all duration-500" 
                style={{ width: `${(cleanRooms / totalRooms) * 100}%` }} 
                title={`Clean & Inspected: ${cleanRooms}`}
              />
              <div 
                className="bg-amber-400 h-full transition-all duration-500" 
                style={{ width: `${(dirtyRooms / totalRooms) * 100}%` }} 
                title={`Dirty / Turnaround: ${dirtyRooms}`}
              />
              <div 
                className="bg-rose-500 h-full transition-all duration-500" 
                style={{ width: `${(oooRooms / totalRooms) * 100}%` }} 
                title={`Out of Order: ${oooRooms}`}
              />
            </div>

            {/* Status Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div 
                onClick={() => setActiveView("room-matrix")}
                className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 cursor-pointer hover:bg-emerald-100/80 transition-colors"
              >
                <span className="text-stone-600 text-[11px] font-medium block">
                  {language === "id" ? "Terisi (Occupied)" : "Occupied"}
                </span>
                <span className="text-lg font-extrabold font-mono text-emerald-950">{occupiedRooms} Rooms</span>
              </div>
              <div 
                onClick={() => setActiveView("housekeeping")}
                className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200 cursor-pointer hover:bg-emerald-100/50 transition-colors"
              >
                <span className="text-stone-600 text-[11px] font-medium block">
                  {language === "id" ? "Bersih / Diinspeksi" : "Clean / Inspected"}
                </span>
                <span className="text-lg font-extrabold font-mono text-emerald-900">{cleanRooms} Rooms</span>
              </div>
              <div 
                onClick={() => setActiveView("housekeeping")}
                className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 cursor-pointer hover:bg-amber-100/80 transition-colors"
              >
                <span className="text-stone-600 text-[11px] font-medium block">
                  {language === "id" ? "Kotor / Proses Bersih" : "Dirty / In Progress"}
                </span>
                <span className="text-lg font-extrabold font-mono text-amber-900">{dirtyRooms} Rooms</span>
              </div>
              <div 
                onClick={() => setActiveView("maintenance")}
                className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 cursor-pointer hover:bg-rose-100/80 transition-colors"
              >
                <span className="text-stone-600 text-[11px] font-medium block">
                  {language === "id" ? "Perbaikan (OOO)" : "Out of Order (OOO)"}
                </span>
                <span className="text-lg font-extrabold font-mono text-rose-900">{oooRooms} Rooms</span>
              </div>
            </div>

            {/* Quick Room Matrix Snippet (Clickable Floor Rack) */}
            <div className="mt-4 pt-3.5 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  {language === "id" ? "Rak Cepat Kamar Lantai 1 & 2" : "Floor 1 & 2 Quick Rack"}
                </p>
                <span className="text-[10px] text-stone-500 font-mono">Tap room to inspect</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {rooms.slice(0, 6).map((room) => {
                  const statusColors: Record<string, string> = {
                    OCCUPIED: "bg-[#27523d] text-white border-[#1d4030]",
                    VACANT_CLEAN: "bg-emerald-50 text-emerald-900 border-emerald-300",
                    VACANT_INSPECTED: "bg-emerald-100 text-emerald-950 border-emerald-400",
                    VACANT_DIRTY: "bg-amber-50 text-amber-900 border-amber-300",
                    IN_PROGRESS: "bg-amber-100 text-amber-900 border-amber-400",
                    RESERVED: "bg-blue-50 text-blue-900 border-blue-300",
                    OUT_OF_ORDER: "bg-rose-100 text-rose-900 border-rose-300",
                  };
                  return (
                    <button
                      key={room.id}
                      onClick={() => {
                        setSelectedRoom(room);
                        setActiveView("room-matrix");
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all hover:scale-102 shadow-2xs cursor-pointer ${statusColors[room.status] || "bg-stone-100"}`}
                    >
                      <div className="flex justify-between items-center text-xs font-mono font-bold">
                        <span>#{room.roomNumber}</span>
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-black/10">{room.status.substring(0, 3)}</span>
                      </div>
                      <p className="text-[10px] truncate mt-1 opacity-90 font-medium">{room.category.split(" ")[0]}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Today's Expected Arrivals & Departures */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e4ded4] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#27523d]" />
                  {language === "id" ? "Kedatangan Prioritas & Check-In Hari Ini" : "Today's Priority Arrivals & Check-Ins"}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === "id"
                    ? "Pemrosesan check-in cepat dan protokol penyambutan VIP"
                    : "Fast check-in processing and VIP welcoming protocol"
                  }
                </p>
              </div>
              <button
                onClick={() => setActiveView("reservations")}
                className="text-xs font-bold text-[#27523d] hover:text-[#193d2c] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>{language === "id" ? `Lihat Semua (${reservations.length})` : `View All (${reservations.length})`}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {reservations.slice(0, 4).map((res) => {
                const isCheckedIn = res.status === "CHECKED_IN";
                const isConfirmed = res.status === "CONFIRMED";
                const folio = folios.find(f => f.reservationId === res.id || f.roomNumber === res.roomNumber);

                return (
                  <div key={res.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f4f1ea] border border-[#e2ded4] flex items-center justify-center font-mono font-bold text-xs text-stone-900 shrink-0">
                        {res.roomNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-stone-900 text-xs">{res.guestName}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                            {res.vipLevel}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500 hidden sm:inline">
                            {res.bookingCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {res.category} • {res.nights} {language === "id" ? "Malam" : "Nights"} • {(res.channel || "").replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {folio && (
                        <button
                          onClick={() => setSelectedFolio(folio)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
                        >
                          Folio (Rp {(folio.grandTotal / 1000).toLocaleString()}k)
                        </button>
                      )}
                      {isConfirmed && (
                        <button
                          onClick={() => checkInReservation(res.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#27523d] hover:bg-[#1d4030] text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          Express Check-In
                        </button>
                      )}
                      {isCheckedIn && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          ✓ In-House
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on desktop): Operational Handover, Facilities Alerts & Department Feed */}
        <div className="lg:col-span-4 space-y-5 sm:space-y-6">
          {/* Shift Handover Briefing Card */}
          {recentHandover && (
            <div className="bg-gradient-to-b from-[#fdfbf7] to-[#f7f4ec] p-4.5 rounded-2xl border border-[#ded8cc] shadow-xs space-y-2.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#27523d] bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {language === "id" ? "Log Serah Terima Shift" : "Shift Log Handover"}
                </span>
                <span className="text-[11px] text-stone-600 font-mono font-bold">{wibInfo.shiftShortId}</span>
              </div>
              <h4 className="text-xs font-bold text-stone-900">
                Duty Manager: {recentHandover.dutyManager}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed italic bg-white/70 p-2.5 rounded-lg border border-stone-200/60">
                "{recentHandover.keyNotes}"
              </p>
              <div className="pt-2 border-t border-stone-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">
                  {language === "id" ? "Tindakan Tertunda:" : "Pending Actions:"}
                </span>
                {recentHandover.pendingActions.map((act, i) => (
                  <p key={i} className="text-[11px] text-stone-700 flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold">•</span> {act}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setActiveView("comms")}
                className="w-full mt-1 text-center text-xs font-bold text-[#27523d] hover:text-[#183a2b] pt-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{language === "id" ? "Buka Komunikasi & Log Shift" : "Open Comms & Shift Logs"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Critical Engineering & Housekeeping Alerts */}
          <div className="bg-white p-4.5 rounded-2xl border border-[#e4ded4] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                {language === "id" ? "Perintah Kerja Teknik" : "Active Work Orders"}
              </h3>
              <button 
                onClick={() => setActiveView("maintenance")}
                className="text-[11px] font-bold text-[#27523d] hover:underline cursor-pointer"
              >
                Manage ({workOrders.length})
              </button>
            </div>

            <div className="space-y-2">
              {workOrders.slice(0, 3).map((wo) => {
                const priorityStyles: Record<string, string> = {
                  CRITICAL_URGENT: "bg-rose-100 text-rose-900 border-rose-200",
                  HIGH: "bg-amber-100 text-amber-900 border-amber-200",
                  MEDIUM: "bg-blue-50 text-blue-900 border-blue-200",
                };
                return (
                  <div key={wo.id} className="p-2.5 rounded-xl bg-[#faf8f5] border border-[#e8e4dc] space-y-1 hover:border-stone-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-stone-500">{wo.ticketCode}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${priorityStyles[wo.priority] || "bg-stone-100"}`}>
                        {(wo.priority || "").replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-stone-900 truncate">{wo.title}</p>
                    <p className="text-[11px] text-stone-500">{wo.location} • Tech: {wo.assignedTechnician}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick AI Intelligence Widget with Gold Luxury Accent */}
          <div className="bg-gradient-to-br from-[#122e21] to-[#0c2017] text-white p-4.5 rounded-2xl shadow-md space-y-3 border border-[#c5a059]/40 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f5dc8c]" />
                <h4 className="text-xs font-bold text-white">Maximuz Revenue AI</h4>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#c5a059]/20 text-[#f5dc8c] border border-[#c5a059]/40">
                Gemini 3.7
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed relative z-10">
              {language === "id"
                ? "Prakiraan harga dinamis: Disarankan menaikkan tarif Executive Suite sebesar +12% untuk akhir pekan karena agenda konvensi medis regional."
                : "Dynamic pricing forecast: Recommend increasing Executive Suite rate by +12% for weekend due to regional medical convention."
              }
            </p>
            <button
              onClick={() => setActiveView("ai-intelligence")}
              className="w-full py-2 bg-gradient-to-r from-[#f5dc8c] to-[#c5a059] hover:from-[#fae6a2] hover:to-[#d4af37] text-[#0c2017] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {language === "id" ? "Analisis Tarif Dinamis & RevPAR →" : "Analyze Dynamic Rates & RevPAR →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
