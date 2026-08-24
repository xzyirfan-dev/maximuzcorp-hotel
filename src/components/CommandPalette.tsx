import React, { useState, useEffect } from "react";
import { 
  Search, 
  BedDouble, 
  CalendarCheck, 
  Sparkles, 
  Wrench, 
  DollarSign, 
  Bot, 
  User, 
  X,
  ArrowRight,
  Globe,
  Check
} from "lucide-react";
import { useHotel, ActiveView } from "../context/HotelContext";
import { LANGUAGE_OPTIONS, Language } from "../i18n/translations";

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    rooms, 
    reservations, 
    guests, 
    setActiveView, 
    setSelectedRoom, 
    setSelectedGuest,
    language,
    setLanguage,
    t
  } = useHotel();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = searchQuery.toLowerCase().trim();

  // Search results
  const filteredRooms = q ? rooms.filter(r => r.roomNumber.includes(q) || r.category.toLowerCase().includes(q) || (r.currentGuestName && r.currentGuestName.toLowerCase().includes(q))) : [];
  const filteredReservations = q ? reservations.filter(res => res.bookingCode.toLowerCase().includes(q) || res.guestName.toLowerCase().includes(q) || res.roomNumber.includes(q)) : [];
  const filteredGuests = q ? guests.filter(g => g.fullName.toLowerCase().includes(q) || g.email.toLowerCase().includes(q) || g.nationality.toLowerCase().includes(q)) : [];

  const quickNavs: { title: string; view: ActiveView; icon: React.FC<{ className?: string }> }[] = [
    { title: t.nav.dashboard, view: "dashboard", icon: DollarSign },
    { title: t.nav.roomMatrix, view: "room-matrix", icon: BedDouble },
    { title: t.nav.reservations, view: "reservations", icon: CalendarCheck },
    { title: t.nav.housekeeping, view: "housekeeping", icon: Sparkles },
    { title: t.nav.maintenance, view: "maintenance", icon: Wrench },
    { title: t.nav.aiIntelligence, view: "ai-intelligence", icon: Bot },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div 
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#ded9cf] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e8e4dc] bg-[#faf8f5]">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder={t.quickSearchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-stone-100 text-xs">
          {/* Quick Language Actions if matched or top-level */}
          {(!q || q.includes("bahasa") || q.includes("lang") || q.includes("english") || q.includes("indonesia")) && (
            <div className="py-2">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                <span>{t.switchLanguage}</span>
                <span className="text-[9px] font-mono">🇮🇩 / 🇺🇸</span>
              </p>
              <div className="grid grid-cols-2 gap-1.5 px-2 pt-1 pb-1">
                {LANGUAGE_OPTIONS.map((opt) => {
                  const isSelected = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLanguage(opt.code);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer border ${
                        isSelected 
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold" 
                          : "bg-[#faf9f6] border-stone-200 hover:bg-stone-100 text-stone-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{opt.flag}</span>
                        <span className="text-xs">{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Navigation suggestions */}
          {!q && (
            <div className="py-2">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                {t.quickNavTitle}
              </p>
              {quickNavs.map((nav) => {
                const Icon = nav.icon;
                return (
                  <button
                    key={nav.view}
                    onClick={() => {
                      setActiveView(nav.view);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f5f2ea] text-stone-800 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-emerald-800" />
                      <span className="font-medium text-stone-800">{nav.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Rooms */}
          {filteredRooms.length > 0 && (
            <div className="py-2">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                {t.allRooms} ({filteredRooms.length})
              </p>
              {filteredRooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRoom(r);
                    setActiveView("room-matrix");
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f5f2ea] text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded">
                      #{r.roomNumber}
                    </span>
                    <div>
                      <p className="font-semibold text-stone-800">{r.category}</p>
                      <p className="text-[11px] text-stone-500">
                        {(r.status || "").replace(/_/g, " ")} {r.currentGuestName ? `• ${r.currentGuestName}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-stone-600">Rp {r.currentRate.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}

          {/* Reservations */}
          {filteredReservations.length > 0 && (
            <div className="py-2">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                {t.allReservations} ({filteredReservations.length})
              </p>
              {filteredReservations.map((res) => (
                <button
                  key={res.id}
                  onClick={() => {
                    setActiveView("reservations");
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f5f2ea] text-left cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-800">{res.bookingCode}</span>
                      <span className="font-medium text-stone-900">{res.guestName}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {t.common.room} {res.roomNumber} • {res.checkInDate} to {res.checkOutDate} ({res.nights} {t.reservations.nights})
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-stone-100 text-stone-700">
                    {res.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Guests */}
          {filteredGuests.length > 0 && (
            <div className="py-2">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                {t.allGuests} ({filteredGuests.length})
              </p>
              {filteredGuests.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGuest(g);
                    setActiveView("reservations");
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f5f2ea] text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-stone-400" />
                    <div>
                      <p className="font-semibold text-stone-900">{g.fullName}</p>
                      <p className="text-[11px] text-stone-500">{g.email} • {g.nationality}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    {g.vipLevel}
                  </span>
                </button>
              ))}
            </div>
          )}

          {q && filteredRooms.length === 0 && filteredReservations.length === 0 && filteredGuests.length === 0 && (
            <div className="py-8 text-center text-stone-500">
              <p className="font-medium">{t.noResultsFound} "{searchQuery}"</p>
              <p className="text-[11px] text-stone-400 mt-1">Try searching for room number, guest name, or booking code.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#faf8f5] border-t border-[#e8e4dc] flex items-center justify-between text-[11px] text-stone-500">
          <span>Navigate with <kbd className="px-1 py-0.5 rounded bg-stone-200 font-mono">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-stone-200 font-mono">↓</kbd></span>
          <span>Close with <kbd className="px-1 py-0.5 rounded bg-stone-200 font-mono">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
};
