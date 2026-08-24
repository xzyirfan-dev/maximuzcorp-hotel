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
  Radio,
  UserCheck,
  Building,
  ShieldCheck,
  Clock
} from "lucide-react";
import { useHotel, ActiveView } from "../context/HotelContext";
import { USER_ROLES } from "../mockData";
import { UserRole } from "../types";
import { LuxuryHotelCrest } from "./HotelSilhouette";

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string | number;
  badgeType?: "gold" | "emerald" | "amber" | "rose" | "neutral";
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

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

  const navGroups: NavGroup[] = [
    {
      title: t.navGroups?.core || (language === "id" ? "Operasional Kamar & Tamu" : "Rooms & Front Office"),
      items: [
        { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
        { 
          id: "room-matrix", 
          label: t.nav.roomMatrix, 
          icon: BedDouble, 
          badge: `${occupiedCount}/${rooms.length}`, 
          badgeType: "emerald" 
        },
        { 
          id: "reservations", 
          label: t.nav.reservations, 
          icon: CalendarCheck, 
          badge: dueArrivals > 0 ? `${dueArrivals} Due` : undefined, 
          badgeType: "amber" 
        },
        { 
          id: "housekeeping", 
          label: t.nav.housekeeping, 
          icon: Sparkles, 
          badge: pendingHk > 0 ? pendingHk : undefined, 
          badgeType: "rose" 
        },
        { 
          id: "maintenance", 
          label: t.nav.maintenance, 
          icon: Wrench, 
          badge: pendingEng > 0 ? pendingEng : undefined, 
          badgeType: "rose" 
        },
      ]
    },
    {
      title: t.navGroups?.services || (language === "id" ? "Layanan, F&B & Keuangan" : "Services, Dining & Finance"),
      items: [
        { id: "fnb-pos", label: t.nav.fnbPos, icon: UtensilsCrossed },
        { id: "finance", label: t.nav.finance, icon: DollarSign },
        { id: "inventory", label: t.nav.inventory, icon: Boxes },
        { 
          id: "comms", 
          label: t.nav.comms, 
          icon: MessageSquare, 
          badge: "Live", 
          badgeType: "emerald" 
        },
      ]
    },
    {
      title: t.navGroups?.management || (language === "id" ? "Manajemen & Kecerdasan" : "Management & Intelligence"),
      items: [
        { id: "staff", label: t.nav.staff, icon: Users },
        { 
          id: "ai-intelligence", 
          label: t.nav.aiIntelligence, 
          icon: Bot, 
          badge: "Gemini 3.7", 
          badgeType: "gold" 
        },
        { 
          id: "blueprint", 
          label: t.nav.blueprint, 
          icon: FileCode2, 
          badge: "Docs", 
          badgeType: "neutral" 
        },
      ]
    }
  ];

  const getBadgeClass = (type?: "gold" | "emerald" | "amber" | "rose" | "neutral", isActive?: boolean) => {
    if (isActive) {
      return "bg-[#c5a059] text-stone-950 font-extrabold shadow-2xs";
    }
    switch (type) {
      case "gold":
        return "bg-[#c5a059]/20 text-[#f5dc8c] border border-[#c5a059]/40";
      case "emerald":
        return "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50";
      case "amber":
        return "bg-amber-900/50 text-amber-300 border border-amber-700/50";
      case "rose":
        return "bg-rose-950/60 text-rose-300 border border-rose-800/50";
      case "neutral":
      default:
        return "bg-stone-800/70 text-stone-300 border border-stone-700/50";
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Unified Monolithic Luxury Dark Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0d1f17] border-r border-[#1a382b] text-stone-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-xl ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Subtle Top Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#f1d279] to-transparent opacity-90 z-20" />

        {/* 1. Brand Header */}
        <div className="p-4 border-b border-[#183528] bg-[#091710] space-y-3 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1c3e2e] to-[#0a1811] border border-[#c5a059]/40 flex items-center justify-center shadow-inner shrink-0">
                <LuxuryHotelCrest size={24} className="text-[#f1d279]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
                  {t.appName}
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-[#c5a059] text-stone-950 font-black tracking-wider shrink-0">
                    ERP
                  </span>
                </h1>
                <p className="text-[11px] text-emerald-200/80 font-medium truncate">{t.appSubname}</p>
              </div>
            </div>

            {/* Live Pulse Indicator */}
            <div className="flex items-center" title={t.liveSync}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </div>
          </div>

          {/* Seamless Unified Active Role Selector */}
          <div className="bg-[#12281e]/90 rounded-xl p-2.5 border border-[#1f4231] hover:border-[#c5a059]/40 transition-colors shadow-inner">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[9px] font-bold text-[#f5dc8c] uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-[#f5dc8c]" />
                {t.activeRolePerspective}
              </label>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#1c3e2e] text-emerald-200 border border-emerald-700/40">
                {activeRoleProfile.department.split(" ")[0]}
              </span>
            </div>

            <div className="relative">
              <select
                aria-label={t.activeRolePerspective}
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as UserRole)}
                className="w-full bg-transparent text-xs font-bold text-white appearance-none pr-6 focus:outline-hidden cursor-pointer"
              >
                {USER_ROLES.map((r) => (
                  <option key={r.role} value={r.role} className="bg-[#0d1f17] text-white">
                    {r.title} ({r.name.split(" ")[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#f5dc8c] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="mt-1 pt-1 border-t border-[#1a382b] flex items-center justify-between text-[11px] text-emerald-200/70">
              <span className="truncate max-w-[140px] font-medium text-emerald-100">{activeRoleProfile.name}</span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">Active</span>
            </div>
          </div>
        </div>

        {/* 2. Structured & Unified Navigation Menu (Grouped & Cohesive) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 custom-scrollbar">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {/* Group Category Header */}
              <div className="px-2.5 py-1 flex items-center justify-between text-[10px] font-bold text-[#c5a059]/90 uppercase tracking-wider">
                <span>{group.title}</span>
                <span className="w-1 h-1 rounded-full bg-[#c5a059]/40"></span>
              </div>

              {/* Group Items */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
                        isActive
                          ? "bg-gradient-to-r from-[#1d4130] to-[#153426] text-white font-bold shadow-xs border-l-[3px] border-[#f1d279] pl-2.5"
                          : "text-emerald-100/75 hover:text-white hover:bg-[#142e22]/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon 
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? "text-[#f1d279]" : "text-emerald-400/70 group-hover:text-emerald-300"
                          }`} 
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ml-1.5 transition-colors ${getBadgeClass(
                            item.badgeType,
                            isActive
                          )}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Unified Property Telemetry & Footer */}
        <div className="p-3 border-t border-[#183528] bg-[#091710] space-y-2.5 shrink-0">
          {/* Occupancy Card */}
          <div className="bg-[#12281e]/90 rounded-xl p-2.5 border border-[#1f4231] shadow-inner space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-200/90 font-medium flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> 
                {language === "id" ? "Okupansi Kamar" : "Live Occupancy"}
              </span>
              <span className="font-mono font-bold text-white text-xs">{occupancyPercent}%</span>
            </div>
            
            {/* Smooth Gradient Bar */}
            <div className="w-full bg-[#08150e] h-1.5 rounded-full overflow-hidden border border-[#1b3a2a]">
              <div 
                className="bg-gradient-to-r from-emerald-500 via-[#c5a059] to-[#f1d279] h-full rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-emerald-300/70 pt-0.5 font-medium">
              <span>{occupiedCount} {language === "id" ? "Terisi" : "Occupied"}</span>
              <span>{rooms.length - occupiedCount} {language === "id" ? "Tersedia" : "Available"}</span>
            </div>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetAllData}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-300/70 hover:text-white hover:bg-[#142e22] py-1.5 rounded-lg border border-transparent hover:border-[#1f4231] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-emerald-400" /> 
            <span>{t.common.resetDemoData}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
