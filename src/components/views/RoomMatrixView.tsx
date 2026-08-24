import React, { useState } from "react";
import { 
  BedDouble, 
  Sparkles, 
  User, 
  Key, 
  Calendar, 
  SlidersHorizontal, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Layers
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { Room, RoomStatus } from "../../types";

export const RoomMatrixView: React.FC = () => {
  const { 
    rooms, 
    updateRoomStatus, 
    selectedRoom, 
    setSelectedRoom, 
    setSelectedFolio, 
    folios,
    staff
  } = useHotel();

  const [viewMode, setViewMode] = useState<"GRID" | "TAPE_CHART">("GRID");
  const [floorFilter, setFloorFilter] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    if (floorFilter !== "ALL" && r.floor !== floorFilter) return false;
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    return true;
  });

  const housekeepingStaff = staff.filter(s => s.department === "Housekeeping");

  const statusConfig: Record<RoomStatus, { label: string; bg: string; text: string; border: string; badge: string }> = {
    OCCUPIED: { label: "Occupied", bg: "bg-[#27523d]", text: "text-white", border: "border-[#1e4030]", badge: "bg-emerald-900 text-white" },
    VACANT_CLEAN: { label: "Vacant Clean", bg: "bg-emerald-50", text: "text-emerald-950", border: "border-emerald-300", badge: "bg-emerald-200 text-emerald-900" },
    VACANT_INSPECTED: { label: "Inspected & Ready", bg: "bg-emerald-100", text: "text-emerald-950", border: "border-emerald-400", badge: "bg-emerald-300 text-emerald-950 font-bold" },
    VACANT_DIRTY: { label: "Vacant Dirty", bg: "bg-amber-50", text: "text-amber-950", border: "border-amber-300", badge: "bg-amber-200 text-amber-900" },
    IN_PROGRESS: { label: "Cleaning in Progress", bg: "bg-amber-100", text: "text-amber-950", border: "border-amber-400", badge: "bg-amber-300 text-amber-950" },
    RESERVED: { label: "Reserved / Due-In", bg: "bg-sky-50", text: "text-sky-950", border: "border-sky-300", badge: "bg-sky-200 text-sky-900" },
    DUE_OUT: { label: "Due Out Today", bg: "bg-orange-50", text: "text-orange-950", border: "border-orange-300", badge: "bg-orange-200 text-orange-900" },
    OUT_OF_ORDER: { label: "Out of Order (OOO)", bg: "bg-rose-100", text: "text-rose-950", border: "border-rose-300", badge: "bg-rose-200 text-rose-900" },
  };

  const handleOpenRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setDrawerOpen(true);
  };

  // Tape chart 7-day timeline dates
  const daysTimeline = [
    { date: "2026-08-23", label: "Sun 23", isToday: false },
    { date: "2026-08-24", label: "Mon 24", isToday: true },
    { date: "2026-08-25", label: "Tue 25", isToday: false },
    { date: "2026-08-26", label: "Wed 26", isToday: false },
    { date: "2026-08-27", label: "Thu 27", isToday: false },
    { date: "2026-08-28", label: "Fri 28", isToday: false },
    { date: "2026-08-29", label: "Sat 29", isToday: false },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Control Bar: Filters & View Switcher */}
      <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Floor Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-stone-600 font-semibold uppercase text-[10px] tracking-wider mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Floor:
          </span>
          {(["ALL", 1, 2, 3, 4] as const).map((fl) => (
            <button
              key={fl}
              onClick={() => setFloorFilter(fl)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                floorFilter === fl
                  ? "bg-[#27523d] text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {fl === "ALL" ? "All Floors (48)" : `Floor ${fl}`}
            </button>
          ))}
        </div>

        {/* Status Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 bg-[#f5f2ea] px-2.5 py-1 rounded-lg border border-[#ded8cc]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Room Statuses</option>
              <option value="OCCUPIED">Occupied Only</option>
              <option value="VACANT_INSPECTED">Inspected & Ready</option>
              <option value="VACANT_CLEAN">Vacant Clean</option>
              <option value="VACANT_DIRTY">Vacant Dirty</option>
              <option value="IN_PROGRESS">Cleaning in Progress</option>
              <option value="OUT_OF_ORDER">Out of Order</option>
            </select>
          </div>

          <div className="flex rounded-lg border border-[#ded8cc] bg-stone-100 p-0.5">
            <button
              onClick={() => setViewMode("GRID")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === "GRID" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Room Rack
            </button>
            <button
              onClick={() => setViewMode("TAPE_CHART")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === "TAPE_CHART" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              7-Day Tape Chart
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE ROOM RACK (GRID) */}
      {viewMode === "GRID" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const conf = statusConfig[room.status] || statusConfig.VACANT_CLEAN;
            const isOccupied = room.status === "OCCUPIED";

            return (
              <div
                key={room.id}
                onClick={() => handleOpenRoomDetails(room)}
                className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${conf.bg} ${conf.border} relative flex flex-col justify-between min-h-[170px]`}
              >
                <div>
                  {/* Card Header: Room Number, Floor, Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-mono font-bold ${isOccupied ? "text-white" : "text-stone-900"}`}>
                        #{room.roomNumber}
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${isOccupied ? "bg-emerald-800 text-emerald-200" : "bg-stone-200/80 text-stone-700"}`}>
                        Fl {room.floor}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${conf.badge}`}>
                      {conf.label}
                    </span>
                  </div>

                  {/* Room Category & Bed */}
                  <p className={`text-xs font-semibold mt-1.5 ${isOccupied ? "text-emerald-100" : "text-stone-800"}`}>
                    {room.category}
                  </p>
                  <p className={`text-[11px] ${isOccupied ? "text-emerald-200/70" : "text-stone-500"}`}>
                    {room.bedType} • Max {room.maxOccupancy} Guests
                  </p>

                  {/* Current Guest info if occupied */}
                  {room.currentGuestName && (
                    <div className={`mt-2.5 p-2 rounded-lg ${isOccupied ? "bg-emerald-950/60 border border-emerald-800/60" : "bg-white/80 border border-stone-200"} flex items-center justify-between text-xs`}>
                      <div className="flex items-center gap-1.5 truncate">
                        <User className={`w-3.5 h-3.5 ${isOccupied ? "text-emerald-300" : "text-stone-500"}`} />
                        <span className={`font-semibold truncate ${isOccupied ? "text-white" : "text-stone-900"}`}>
                          {room.currentGuestName}
                        </span>
                      </div>
                      {room.keycardCount !== undefined && (
                        <span className={`text-[10px] font-mono flex items-center gap-0.5 ${isOccupied ? "text-emerald-300" : "text-stone-600"}`}>
                          <Key className="w-3 h-3" /> {room.keycardCount}
                        </span>
                      )}
                    </div>
                  )}

                  {room.notes && (
                    <p className={`text-[10px] mt-1.5 italic truncate ${isOccupied ? "text-emerald-200/80" : "text-amber-900 font-medium"}`}>
                      ⚠️ {room.notes}
                    </p>
                  )}
                </div>

                {/* Card Footer: Rate & HK assignment */}
                <div className={`mt-3 pt-2 border-t ${isOccupied ? "border-emerald-800/80" : "border-stone-200/60"} flex items-center justify-between text-[11px]`}>
                  <span className={`font-mono font-bold ${isOccupied ? "text-emerald-200" : "text-stone-700"}`}>
                    Rp {room.currentRate.toLocaleString()}
                  </span>
                  <span className={`text-[10px] ${isOccupied ? "text-emerald-300/80" : "text-stone-500"} truncate max-w-[120px]`}>
                    HK: {room.assignedHousekeeper || "Unassigned"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: 7-DAY VISUAL TAPE CHART */}
      {viewMode === "TAPE_CHART" && (
        <div className="bg-white rounded-xl border border-[#e4ded4] shadow-xs overflow-x-auto">
          <div className="min-w-[850px]">
            {/* Timeline Header */}
            <div className="grid grid-cols-8 border-b border-[#e4ded4] bg-[#faf8f5] text-xs font-semibold text-stone-700">
              <div className="p-3 border-r border-[#e4ded4] bg-[#f5f2ea] text-stone-900 font-bold">
                Room / Type
              </div>
              {daysTimeline.map((d) => (
                <div 
                  key={d.date} 
                  className={`p-3 text-center border-r border-[#e4ded4] ${
                    d.isToday ? "bg-emerald-100/70 text-emerald-950 font-bold" : ""
                  }`}
                >
                  <p>{d.label}</p>
                  {d.isToday && <span className="text-[9px] uppercase tracking-wider text-emerald-800 font-mono">Today</span>}
                </div>
              ))}
            </div>

            {/* Room Rows */}
            <div className="divide-y divide-stone-100 text-xs">
              {filteredRooms.map((room) => {
                const isOccupied = room.status === "OCCUPIED";

                return (
                  <div key={room.id} className="grid grid-cols-8 items-center hover:bg-stone-50 transition-colors">
                    {/* Left Column: Room Info */}
                    <div 
                      onClick={() => handleOpenRoomDetails(room)}
                      className="p-2.5 border-r border-[#e4ded4] cursor-pointer bg-stone-50/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-stone-900">#{room.roomNumber}</span>
                        <span className="text-[10px] text-stone-500">{room.category.split(" ")[0]}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800 block truncate">
                        Rp {(room.currentRate / 1000).toLocaleString()}k
                      </span>
                    </div>

                    {/* Timeline Cells for 7 Days */}
                    {daysTimeline.map((d) => {
                      if (d.isToday && isOccupied) {
                        return (
                          <div 
                            key={d.date} 
                            onClick={() => handleOpenRoomDetails(room)}
                            className="p-1.5 border-r border-stone-100 col-span-2 bg-[#27523d] text-white rounded-md m-1 cursor-pointer flex items-center justify-between px-2 text-[11px] shadow-2xs truncate"
                          >
                            <span className="font-semibold truncate">{room.currentGuestName || "Occupied"}</span>
                            <span className="text-[9px] font-mono px-1 bg-emerald-900 rounded">Stay</span>
                          </div>
                        );
                      } else if (d.date === "2026-08-25" && isOccupied) {
                        // Skip rendering as spanned
                        return null;
                      } else {
                        return (
                          <div 
                            key={d.date} 
                            onClick={() => handleOpenRoomDetails(room)}
                            className="p-2.5 border-r border-stone-100 text-center text-[10px] text-stone-400 hover:bg-emerald-50/50 cursor-pointer h-full flex items-center justify-center font-mono"
                          >
                            {room.status === "OUT_OF_ORDER" ? "OOO" : "Available"}
                          </div>
                        );
                      }
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ROOM INSPECTION & STATUS DRAWER (MODAL) */}
      {drawerOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-end">
          <div 
            className="w-full max-w-md h-full bg-white shadow-2xl border-l border-[#ded9cf] flex flex-col justify-between animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#e8e4dc] bg-[#faf8f5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#27523d] text-white flex items-center justify-center font-mono font-bold text-sm">
                  {selectedRoom.roomNumber}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">{selectedRoom.category}</h3>
                  <p className="text-[11px] text-stone-500">Floor {selectedRoom.floor} • {selectedRoom.bedType}</p>
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Current Status Control */}
              <div className="bg-[#f5f2ea] p-3 rounded-lg border border-[#e2ded6] space-y-2">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
                  Change Room Status
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["VACANT_CLEAN", "VACANT_INSPECTED", "VACANT_DIRTY", "IN_PROGRESS", "OCCUPIED", "OUT_OF_ORDER"] as RoomStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateRoomStatus(selectedRoom.id, st)}
                      className={`p-2 rounded text-[11px] font-semibold text-left border transition-all ${
                        selectedRoom.status === st
                          ? "bg-[#27523d] text-white border-[#1d4030] shadow-xs"
                          : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {statusConfig[st]?.label || st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest & Reservation Info */}
              {selectedRoom.currentGuestName ? (
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      In-House Guest Details
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                      Occupied
                    </span>
                  </div>
                  <p className="text-sm font-bold text-emerald-950">{selectedRoom.currentGuestName}</p>
                  <p className="text-[11px] text-emerald-800">
                    Keycards Issued: <strong className="font-mono">{selectedRoom.keycardCount || 2}</strong>
                  </p>

                  {/* Linked Folio Button */}
                  {folios.find(f => f.roomNumber === selectedRoom.roomNumber && !f.isClosed) && (
                    <button
                      onClick={() => {
                        const targetFolio = folios.find(f => f.roomNumber === selectedRoom.roomNumber && !f.isClosed);
                        if (targetFolio) {
                          setSelectedFolio(targetFolio);
                          setDrawerOpen(false);
                        }
                      }}
                      className="w-full mt-2 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-semibold text-xs transition-colors"
                    >
                      Open Guest Billing Folio →
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-stone-300 text-center text-stone-500">
                  <p className="font-medium">No guest currently checked into this room.</p>
                </div>
              )}

              {/* Housekeeper Assignment */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
                  Assigned Housekeeper
                </label>
                <select
                  aria-label="Assigned Housekeeper"
                  value={selectedRoom.assignedHousekeeper || ""}
                  onChange={(e) => updateRoomStatus(selectedRoom.id, selectedRoom.status, e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs font-medium text-stone-800 focus:outline-hidden"
                >
                  <option value="">Unassigned</option>
                  {housekeepingStaff.map(h => (
                    <option key={h.id} value={h.fullName}>{h.fullName} ({h.shift} Shift)</option>
                  ))}
                </select>
              </div>

              {/* Room Amenities list */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
                  Room Features & Amenities
                </label>
                <div className="flex flex-wrap gap-1">
                  {selectedRoom.amenities.map((am, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-200">
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Room Operational Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
                  Internal Operational Notes
                </label>
                <textarea
                  rows={3}
                  defaultValue={selectedRoom.notes || ""}
                  onBlur={(e) => updateRoomStatus(selectedRoom.id, selectedRoom.status, selectedRoom.assignedHousekeeper, e.target.value)}
                  placeholder="Add notes for front desk, housekeeping or engineering..."
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs text-stone-800 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#e8e4dc] bg-[#faf8f5] flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-stone-700">
                Rate: Rp {selectedRoom.currentRate.toLocaleString()}/night
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
