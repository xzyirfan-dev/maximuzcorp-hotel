import React, { useState } from "react";
import { 
  Menu, 
  Search, 
  Sparkles, 
  Plus, 
  Moon, 
  Bell, 
  Clock, 
  Building,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useHotel } from "../context/HotelContext";
import { LanguageSelector } from "./LanguageSelector";

export const Header: React.FC<{ 
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onOpenNewBookingModal: () => void;
}> = ({ onOpenMobileMenu, onOpenCommandPalette, onOpenNewBookingModal }) => {
  const { 
    activeView, 
    setActiveView, 
    activeRoleProfile,
    runNightAudit,
    workOrders,
    housekeepingTasks,
    t,
    language
  } = useHotel();

  const [showNotifications, setShowNotifications] = useState(false);

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: t.nav.dashboard, subtitle: t.navSubtitles.dashboard },
    "room-matrix": { title: t.nav.roomMatrix, subtitle: t.navSubtitles.roomMatrix },
    reservations: { title: t.nav.reservations, subtitle: t.navSubtitles.reservations },
    housekeeping: { title: t.nav.housekeeping, subtitle: t.navSubtitles.housekeeping },
    maintenance: { title: t.nav.maintenance, subtitle: t.navSubtitles.maintenance },
    comms: { title: t.nav.comms, subtitle: t.navSubtitles.comms },
    "fnb-pos": { title: t.nav.fnbPos, subtitle: t.navSubtitles.fnbPos },
    finance: { title: t.nav.finance, subtitle: t.navSubtitles.finance },
    inventory: { title: t.nav.inventory, subtitle: t.navSubtitles.inventory },
    staff: { title: t.nav.staff, subtitle: t.navSubtitles.staff },
    "ai-intelligence": { title: t.nav.aiIntelligence, subtitle: t.navSubtitles.aiIntelligence },
    blueprint: { title: t.nav.blueprint, subtitle: t.navSubtitles.blueprint },
  };

  const currentInfo = viewTitles[activeView] || viewTitles.dashboard;
  const criticalEng = workOrders.filter(w => w.priority === "CRITICAL_URGENT" && w.status !== "RESOLVED");
  const urgentHk = housekeepingTasks.filter(t => t.priority === "URGENT" && t.status !== "COMPLETED" && t.status !== "VERIFIED");

  return (
    <header className="sticky top-0 z-30 bg-[#fcfbf9]/90 backdrop-blur-md border-b border-[#e8e4dc] px-4 lg:px-6 py-2.5 flex items-center justify-between">
      {/* Left: Breadcrumbs & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-md hover:bg-stone-200/60 lg:hidden text-stone-700 cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
            <span className="flex items-center gap-1 text-stone-600">
              <Building className="w-3.5 h-3.5 text-[#27523d]" /> Maximuz Grand Heritage
            </span>
            <span>/</span>
            <span className="text-stone-900 font-semibold">{currentInfo.title}</span>
          </div>
          <p className="text-[11px] text-stone-600 hidden sm:block truncate max-w-md">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Search trigger button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-[#f0ede4] hover:bg-[#e7e3da] text-stone-600 rounded-lg text-xs font-medium border border-[#ded8cc] transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-stone-500" />
          <span className="hidden md:inline">{t.header.quickSearch}</span>
          <kbd className="hidden sm:inline font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-300 text-stone-500">
            ⌘K
          </kbd>
        </button>

        {/* Business Date Tracker Badge */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#eef5f1] border border-emerald-200 text-emerald-900 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-emerald-700" />
          <span>24 Aug 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span className="text-[10px] uppercase font-bold text-emerald-800">{t.header.morningShift}</span>
        </div>

        {/* Action: New Reservation */}
        <button
          onClick={onOpenNewBookingModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#27523d] hover:bg-[#1d4030] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.header.newBooking}</span>
        </button>

        {/* Quick AI Hub Shortcut */}
        <button
          onClick={() => setActiveView("ai-intelligence")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
            activeView === "ai-intelligence"
              ? "bg-emerald-900 text-white border-emerald-900"
              : "bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-50"
          }`}
          title="Open Gemini AI Intelligence Hub"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden md:inline">{t.header.aiHub}</span>
        </button>

        {/* Night Audit 1-Click Trigger */}
        <button
          onClick={runNightAudit}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg border border-stone-300 transition-colors cursor-pointer"
          title="Run Automated Night Audit Simulation"
        >
          <Moon className="w-3.5 h-3.5 text-stone-600" />
          <span className="text-[11px]">{t.header.nightAudit}</span>
        </button>

        {/* LANGUAGE SWITCHER MENU (Indonesian 🇮🇩 / English US 🇺🇸) */}
        <LanguageSelector variant="header" />

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {(criticalEng.length > 0 || urgentHk.length > 0) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#e4ded4] p-3 text-xs z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                <span className="font-semibold text-stone-900">{t.header.operationalAlerts}</span>
                <span className="text-[10px] text-stone-600 font-mono">{t.liveSync}</span>
              </div>
              <div className="space-y-2">
                {criticalEng.map(w => (
                  <div key={w.id} className="p-2 rounded-lg bg-rose-50 border border-rose-100 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-rose-900">{w.title}</p>
                      <p className="text-[11px] text-rose-700">{w.location} • {t.header.assignedTo} {w.assignedTechnician}</p>
                    </div>
                  </div>
                ))}
                {urgentHk.map(tTask => (
                  <div key={tTask.id} className="p-2 rounded-lg bg-amber-50 border border-amber-100 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900">{t.common.room} {tTask.roomNumber} - {t.header.vipTurndown}</p>
                      <p className="text-[11px] text-amber-700">{tTask.notes}</p>
                    </div>
                  </div>
                ))}
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900">{t.header.otaSyncActive}</p>
                    <p className="text-[11px] text-emerald-700">{t.header.otaSyncDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

