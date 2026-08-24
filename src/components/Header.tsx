import React, { useState } from "react";
import { 
  Menu, 
  Search, 
  Sparkles, 
  Plus, 
  Moon, 
  Bell, 
  Building,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useHotel } from "../context/HotelContext";
import { LanguageSelector } from "./LanguageSelector";
import { WibClockBadge } from "./WibClockBadge";

export const Header: React.FC<{ 
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onOpenNewBookingModal: () => void;
}> = ({ onOpenMobileMenu, onOpenCommandPalette, onOpenNewBookingModal }) => {
  const { 
    activeView, 
    setActiveView, 
    runNightAudit,
    workOrders,
    housekeepingTasks,
    t,
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
    <header className="sticky top-0 z-30 bg-[#0d1f17]/95 backdrop-blur-md border-b border-[#1a382b] px-4 sm:px-6 py-2.5 flex items-center justify-between text-stone-100 shadow-md">
      {/* Seamless Top Gold Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#f1d279] via-[#c5a059] to-transparent opacity-90" />

      {/* Left: Breadcrumbs & Mobile Trigger */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-lg hover:bg-[#183629] lg:hidden text-emerald-200 cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-emerald-200/80 font-medium">
            <span className="flex items-center gap-1 text-[#f5dc8c] font-bold tracking-wide truncate max-w-[150px] sm:max-w-none">
              <Building className="w-3.5 h-3.5 text-[#f1d279] shrink-0" /> Maximuz Grand Heritage
            </span>
            <span className="text-[#c5a059]/60">/</span>
            <span className="text-white font-bold tracking-tight truncate max-w-[130px] sm:max-w-none">{currentInfo.title}</span>
          </div>
          <p className="text-[11px] text-emerald-300/70 hidden md:block truncate max-w-md">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions - Seamless Dark Luxury Cockpit */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Real-time Indonesian WIB Clock & Shift Tracker Badge */}
        <div className="hidden sm:block">
          <WibClockBadge />
        </div>

        {/* Search trigger button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 bg-[#142c20] hover:bg-[#1a382b] text-emerald-100 rounded-xl text-xs font-medium border border-[#234937] hover:border-[#c5a059]/50 transition-all cursor-pointer shadow-xs"
          title="Pencarian Cepat (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-[#f5dc8c]" />
          <span className="hidden md:inline">{t.header.quickSearch}</span>
          <kbd className="hidden sm:inline font-mono text-[10px] bg-[#0c1d15] px-1.5 py-0.5 rounded border border-[#234937] text-emerald-300">
            ⌘K
          </kbd>
        </button>

        {/* Action: New Reservation */}
        <button
          onClick={onOpenNewBookingModal}
          className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#f1d279] to-[#c5a059] hover:from-[#f5dc8c] hover:to-[#d4af37] text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">{t.header.newBooking}</span>
        </button>

        {/* Quick AI Hub Shortcut */}
        <button
          onClick={() => setActiveView("ai-intelligence")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
            activeView === "ai-intelligence"
              ? "bg-[#1d4130] text-white border-[#f1d279] shadow-xs"
              : "bg-[#142c20] text-emerald-200 border-[#234937] hover:bg-[#1a382b] hover:border-[#c5a059]/40"
          }`}
          title="Buka Pusat Kecerdasan AI Maximuz"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#f1d279]" />
          <span className="hidden lg:inline">{t.header.aiHub}</span>
        </button>

        {/* Night Audit 1-Click Trigger */}
        <button
          onClick={runNightAudit}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#142c20] hover:bg-[#1a382b] text-emerald-200 text-xs font-medium rounded-xl border border-[#234937] hover:border-[#c5a059]/40 transition-colors cursor-pointer"
          title="Jalankan Simulasi Audit Malam (WIB System)"
        >
          <Moon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px]">{t.header.nightAudit}</span>
        </button>

        {/* LANGUAGE SWITCHER MENU (Indonesian 🇮🇩 / English US 🇺🇸) */}
        <LanguageSelector variant="header" />

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-emerald-200 hover:bg-[#183629] hover:text-white transition-colors cursor-pointer border border-transparent hover:border-[#234937]"
            aria-label="Notifikasi Operasional"
          >
            <Bell className="w-4 h-4" />
            {(criticalEng.length > 0 || urgentHk.length > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0d1f17] animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#10241b] rounded-2xl shadow-2xl border border-[#234937] p-3 text-xs z-50 animate-in fade-in zoom-in-95 text-stone-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e3c2e] mb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#f1d279]" />
                  {t.header.operationalAlerts}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">{t.liveSync}</span>
              </div>
              <div className="space-y-2">
                {criticalEng.map(w => (
                  <div key={w.id} className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-200">{w.title}</p>
                      <p className="text-[11px] text-rose-300/80">{w.location} • {t.header.assignedTo} {w.assignedTechnician}</p>
                    </div>
                  </div>
                ))}
                {urgentHk.map(tTask => (
                  <div key={tTask.id} className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-200">{t.common.room} {tTask.roomNumber} - {t.header.vipTurndown}</p>
                      <p className="text-[11px] text-amber-300/80">{tTask.notes}</p>
                    </div>
                  </div>
                ))}
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-200">{t.header.otaSyncActive}</p>
                    <p className="text-[11px] text-emerald-300/80">{t.header.otaSyncDesc}</p>
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
