import React from "react";
import { 
  DollarSign, 
  BedDouble, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Wrench, 
  CalendarCheck, 
  ArrowUpRight, 
  Plus, 
  ArrowRight,
  Bot,
  AlertCircle,
  Radio
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";

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
    checkInReservation
  } = useHotel();

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Hotel Executive Status */}
      <div className="bg-gradient-to-r from-[#27523d] to-[#1c3e2e] text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-800/80 text-emerald-200 border border-emerald-700/50">
                Enterprise PMS • Operations Live
              </span>
              <span className="text-xs text-emerald-200/80 flex items-center gap-1 font-mono">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Channel Sync Active
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Maximuz Grand Heritage Hotel & Suites
            </h2>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
              Property Status: 48 Rooms Active. Today's occupancy is pacing +14.2% higher than last week's average. 
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView("ai-intelligence")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-600 transition-colors shadow-xs"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-300" />
              <span>AI Revenue Optimizer</span>
            </button>
            <button
              onClick={onOpenNewBooking}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-[#27523d] hover:bg-emerald-50 text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Check-In</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle decorative pattern */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-8">
          <BedDouble className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Occupancy Rate */}
        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Occupancy Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-stone-900">{occupancyPercent}%</span>
            <span className="text-xs font-medium text-emerald-700 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +6.4% MoM
            </span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#27523d] h-full rounded-full" style={{ width: `${occupancyPercent}%` }} />
          </div>
          <p className="text-[11px] text-stone-500 flex justify-between">
            <span>{occupiedRooms} Occupied</span>
            <span>{totalRooms - occupiedRooms} Available</span>
          </p>
        </div>

        {/* Card 2: ADR (Average Daily Rate) */}
        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">ADR (Average Rate)</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-stone-900">
              Rp {(adr / 1000).toLocaleString()}k
            </span>
            <span className="text-xs font-medium text-emerald-700 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +8.2%
            </span>
          </div>
          <p className="text-[11px] text-stone-500 pt-2">
            Target ADR: <span className="font-mono text-stone-700 font-semibold">Rp 1,400,000</span> (Achieved 103%)
          </p>
        </div>

        {/* Card 3: RevPAR */}
        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">RevPAR (Yield)</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-stone-900">
              Rp {(revPar / 1000).toLocaleString()}k
            </span>
            <span className="text-xs font-medium text-emerald-700 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14.8%
            </span>
          </div>
          <p className="text-[11px] text-stone-500 pt-2">
            Per available room capacity metric
          </p>
        </div>

        {/* Card 4: Daily Gross Revenue */}
        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Gross Today</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-stone-900">
              Rp {(totalGrossToday / 1000000).toFixed(1)}M
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
              Audited
            </span>
          </div>
          <p className="text-[11px] text-stone-500 pt-2">
            Rooms: Rp {(totalRoomRevenueToday / 1000000).toFixed(1)}M • F&B: Rp {(totalFnbToday / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Interactive Operational Matrix Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Room Inventory Status & Expected Arrivals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Rack Status Distribution */}
          <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Live Room Status Distribution</h3>
                <p className="text-xs text-stone-500">Real-time housekeeping and front desk inventory sync</p>
              </div>
              <button
                onClick={() => setActiveView("room-matrix")}
                className="text-xs font-semibold text-[#27523d] hover:underline flex items-center gap-1"
              >
                Open Full Tape Chart <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Status Progress Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-100 mb-4">
              <div 
                className="bg-[#27523d] h-full" 
                style={{ width: `${(occupiedRooms / totalRooms) * 100}%` }} 
                title={`Occupied: ${occupiedRooms}`}
              />
              <div 
                className="bg-emerald-400 h-full" 
                style={{ width: `${(cleanRooms / totalRooms) * 100}%` }} 
                title={`Clean & Inspected: ${cleanRooms}`}
              />
              <div 
                className="bg-amber-400 h-full" 
                style={{ width: `${(dirtyRooms / totalRooms) * 100}%` }} 
                title={`Dirty / Turnaround: ${dirtyRooms}`}
              />
              <div 
                className="bg-rose-500 h-full" 
                style={{ width: `${(oooRooms / totalRooms) * 100}%` }} 
                title={`Out of Order: ${oooRooms}`}
              />
            </div>

            {/* Status Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                <span className="text-stone-500 text-[11px] block">Occupied</span>
                <span className="text-base font-bold font-mono text-emerald-950">{occupiedRooms} Rooms</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-100">
                <span className="text-stone-500 text-[11px] block">Clean / Inspected</span>
                <span className="text-base font-bold font-mono text-emerald-900">{cleanRooms} Rooms</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200">
                <span className="text-stone-500 text-[11px] block">Dirty / In Progress</span>
                <span className="text-base font-bold font-mono text-amber-900">{dirtyRooms} Rooms</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200">
                <span className="text-stone-500 text-[11px] block">Out of Order (OOO)</span>
                <span className="text-base font-bold font-mono text-rose-900">{oooRooms} Rooms</span>
              </div>
            </div>

            {/* Quick Room Matrix Snippet (Clickable) */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Floor 1 & 2 Quick Rack
              </p>
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
                      className={`p-2 rounded-lg border text-left transition-all hover:scale-102 shadow-2xs ${statusColors[room.status] || "bg-stone-100"}`}
                    >
                      <div className="flex justify-between items-center text-xs font-mono font-bold">
                        <span>#{room.roomNumber}</span>
                        <span className="text-[10px] uppercase">{room.status.substring(0, 3)}</span>
                      </div>
                      <p className="text-[10px] truncate mt-0.5 opacity-90">{room.category.split(" ")[0]}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Today's Expected Arrivals & Departures */}
          <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Today's Priority Arrivals & Check-Ins</h3>
                <p className="text-xs text-stone-500">Fast check-in processing and VIP welcoming protocol</p>
              </div>
              <button
                onClick={() => setActiveView("reservations")}
                className="text-xs font-semibold text-[#27523d] hover:underline flex items-center gap-1"
              >
                View All ({reservations.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {reservations.slice(0, 4).map((res) => {
                const isCheckedIn = res.status === "CHECKED_IN";
                const isConfirmed = res.status === "CONFIRMED";
                const folio = folios.find(f => f.reservationId === res.id || f.roomNumber === res.roomNumber);

                return (
                  <div key={res.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#f4f1ea] border border-[#e2ded4] flex items-center justify-center font-mono font-bold text-xs text-stone-800">
                        {res.roomNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900 text-xs">{res.guestName}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            {res.vipLevel}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400 hidden sm:inline">
                            {res.bookingCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {res.category} • {res.nights} Nights • {(res.channel || "").replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {folio && (
                        <button
                          onClick={() => setSelectedFolio(folio)}
                          className="px-2 py-1 rounded text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700"
                        >
                          Folio (Rp {folio.grandTotal.toLocaleString()})
                        </button>
                      )}
                      {isConfirmed && (
                        <button
                          onClick={() => checkInReservation(res.id)}
                          className="px-2.5 py-1 rounded bg-[#27523d] hover:bg-[#1d4030] text-white text-[11px] font-semibold transition-colors"
                        >
                          Express Check-In
                        </button>
                      )}
                      {isCheckedIn && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                          In-House
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Operational Handover, Facilities Alerts & Department Feed */}
        <div className="space-y-6">
          {/* Shift Handover Briefing Card */}
          {recentHandover && (
            <div className="bg-[#fbf9f5] p-4 rounded-xl border border-[#ded8cc] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#27523d] bg-emerald-100 px-2 py-0.5 rounded">
                  Shift Log Handover
                </span>
                <span className="text-[11px] text-stone-500 font-mono">{recentHandover.shift.split(" ")[0]}</span>
              </div>
              <h4 className="text-xs font-bold text-stone-900">
                Duty Manager: {recentHandover.dutyManager}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                "{recentHandover.keyNotes}"
              </p>
              <div className="pt-2 border-t border-stone-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">Pending Actions:</span>
                {recentHandover.pendingActions.map((act, i) => (
                  <p key={i} className="text-[11px] text-stone-700 flex items-start gap-1">
                    <span className="text-emerald-700 font-bold">•</span> {act}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setActiveView("comms")}
                className="w-full mt-2 text-center text-xs font-semibold text-[#27523d] hover:underline pt-1"
              >
                Open Comms & Shift Logs →
              </button>
            </div>
          )}

          {/* Critical Engineering & Housekeeping Alerts */}
          <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600">Active Work Orders</h3>
              <button 
                onClick={() => setActiveView("maintenance")}
                className="text-[11px] font-semibold text-[#27523d] hover:underline"
              >
                Manage ({workOrders.length})
              </button>
            </div>

            <div className="space-y-2">
              {workOrders.slice(0, 3).map((wo) => {
                const priorityStyles: Record<string, string> = {
                  CRITICAL_URGENT: "bg-rose-100 text-rose-800 border-rose-200",
                  HIGH: "bg-amber-100 text-amber-800 border-amber-200",
                  MEDIUM: "bg-blue-50 text-blue-800 border-blue-200",
                };
                return (
                  <div key={wo.id} className="p-2.5 rounded-lg bg-[#faf8f5] border border-[#e8e4dc] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-stone-500">{wo.ticketCode}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${priorityStyles[wo.priority] || "bg-stone-100"}`}>
                        {(wo.priority || "").replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-stone-900 truncate">{wo.title}</p>
                    <p className="text-[11px] text-stone-500">{wo.location} • Tech: {wo.assignedTechnician}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick AI Intelligence Widget */}
          <div className="bg-emerald-950 text-white p-4 rounded-xl shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-emerald-100">Maximuz Revenue AI</h4>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200">
                Gemini 3.7
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Dynamic pricing forecast: Recommend increasing Executive Suite rate by <strong className="text-emerald-100">+12%</strong> for weekend due to regional medical convention.
            </p>
            <button
              onClick={() => setActiveView("ai-intelligence")}
              className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors"
            >
              Analyze Dynamic Rates & RevPAR →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
