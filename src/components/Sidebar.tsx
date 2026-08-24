import React from "react";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Sparkles, 
  Wrench, 
  MessageSquare, 
  UtensilsCrossed, 
  DollarSign, 
  Boxes, 
  Users, 
  Bot, 
  FileCode2, 
  RotateCcw,
  ChevronDown,
  Clock,
  Radio
} from "lucide-react";
import { useHotel, ActiveView } from "../context/HotelContext";
import { USER_ROLES } from "../mockData";
import { UserRole } from "../types";
import { LuxuryHotelCrest } from "./HotelSilhouette";

export const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: (open: boolean) => void }> = ({ isOpen, setIsOpen }) => {
  const { 
    activeView, 
    setActiveView, 
    activeRole, 
    setActiveRole, 
    activeRoleProfile,
    rooms, 
    housekeepingTasks, 
    workOrders, 
    reservations,
    resetAllData,
    t,
    language
  } = useHotel();

  const occupiedCount = rooms.filter(r => r.status === "OCCUPIED").length;
  const occupancyPercent = Math.round((occupiedCount / rooms.length) * 100);
  const pendingHk = housekeepingTasks.filter(t => t.status === "PENDING" || t.status === "IN_PROGRESS").length;
  const pendingEng = workOrders.filter(w => w.status === "OPEN" || w.status === "IN_PROGRESS").length;
  const dueArrivals = reservations.filter(r => r.status === "CONFIRMED").length;

  const navItems: { id: ActiveView; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { id: "room-matrix", label: t.nav.roomMatrix, icon: BedDouble, badge: `${occupiedCount}/${rooms.length}`, badgeColor: "bg-emerald-100 text-emerald-800" },
    { id: "reservations", label: t.nav.reservations, icon: CalendarCheck, badge: dueArrivals > 0 ? `${dueArrivals} Due` : undefined, badgeColor: "bg-amber-100 text-amber-800" },
    { id: "housekeeping", label: t.nav.housekeeping, icon: Sparkles, badge: pendingHk > 0 ? pendingHk : undefined, badgeColor: "bg-orange-100 text-orange-800" },
    { id: "maintenance", label: t.nav.maintenance, icon: Wrench, badge: pendingEng > 0 ? pendingEng : undefined, badgeColor: "bg-rose-100 text-rose-800" },
    { id: "comms", label: t.nav.comms, icon: MessageSquare, badge: "Live", badgeColor: "bg-emerald-100 text-emerald-800" },
    { id: "fnb-pos", label: t.nav.fnbPos, icon: UtensilsCrossed },
    { id: "finance", label: t.nav.finance, icon: DollarSign },
    { id: "inventory", label: t.nav.inventory, icon: Boxes },
    { id: "staff", label: t.nav.staff, icon: Users },
    { id: "ai-intelligence", label: t.nav.aiIntelligence, icon: Bot, badge: "Gemini 3.7", badgeColor: "bg-emerald-800 text-emerald-50" },
    { id: "blueprint", label: t.nav.blueprint, icon: FileCode2, badge: "Docs", badgeColor: "bg-stone-200 text-stone-700" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#f9f8f5] border-r border-[#e8e4dc] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand Header with Luxury Crest */}
        <div className="p-4 border-b border-[#e8e4dc] bg-gradient-to-b from-[#193d2c] to-[#122e21] text-white space-y-3 relative overflow-hidden shadow-xs">
          {/* Subtle gold line ornament */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8c872] to-transparent opacity-80" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-[#c5a059]/40 flex items-center justify-center shadow-inner">
                <LuxuryHotelCrest size={26} className="text-[#f1d279]" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  {t.appName}
                  <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-[#c5a059] text-stone-950 font-extrabold tracking-wider">
                    ERP
                  </span>
                </h1>
                <p className="text-[11px] text-emerald-200/90 font-medium truncate max-w-[150px]">{t.appSubname}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </div>
          </div>

          {/* Active Role Selector (Perspective Switcher) */}
          <div className="bg-white/95 text-stone-900 rounded-lg p-2 border border-emerald-900/40 shadow-sm backdrop-blur-xs">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              {t.activeRolePerspective}
            </label>
            <div className="relative">
              <select
                aria-label={t.activeRolePerspective}
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as UserRole)}
                className="w-full bg-transparent text-xs font-semibold text-stone-800 appearance-none pr-6 focus:outline-hidden cursor-pointer"
              >
                {USER_ROLES.map((r) => (
                  <option key={r.role} value={r.role}>
                    {r.title} ({r.name.split(" ")[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-600">
              <span className="truncate max-w-[130px] font-medium text-stone-800">{activeRoleProfile.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200">
                {activeRoleProfile.department.split(" ")[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 custom-scrollbar">
          <div className="px-2 py-1 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {t.nav.operations}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => {
                  setActiveView(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#27523d] text-white shadow-xs font-semibold"
                    : "text-stone-700 hover:bg-[#eae6dc] hover:text-stone-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#f1d279]" : "text-stone-500"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-emerald-900/80 text-emerald-100 border border-emerald-700" : item.badgeColor || "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Property Quick Telemetry */}
        <div className="p-3 border-t border-[#e8e4dc] bg-[#f5f2ea]/50 space-y-2">
          <div className="bg-white rounded-lg p-2.5 border border-[#e4ded4] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 font-medium flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> {language === "id" ? "Okupansi Kamar" : "Live Occupancy"}
              </span>
              <span className="font-mono font-bold text-stone-900">{occupancyPercent}%</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#27523d] to-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-500 pt-0.5">
              <span>{occupiedCount} {language === "id" ? "Terisi" : "Occupied"}</span>
              <span>{rooms.length - occupiedCount} {language === "id" ? "Tersedia" : "Available"}</span>
            </div>
          </div>

          <button
            onClick={resetAllData}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-stone-500 hover:text-stone-800 hover:bg-[#e8e3d8] py-1.5 rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> {t.common.resetDemoData}
          </button>
        </div>
      </aside>
    </>
  );
};
