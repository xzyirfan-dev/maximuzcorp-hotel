import React from "react";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Sparkles, 
  MessageSquare,
  Plus
} from "lucide-react";
import { useHotel, ActiveView } from "../context/HotelContext";

export const MobileBottomBar: React.FC<{ 
  onOpenNewBooking: () => void;
}> = ({ onOpenNewBooking }) => {
  const { activeView, setActiveView, t, reservations, housekeepingTasks } = useHotel();

  const dueArrivals = reservations.filter(r => r.status === "CONFIRMED").length;
  const pendingHk = housekeepingTasks.filter(t => t.status === "DIRTY" || t.status === "IN_PROGRESS").length;

  const tabs: { id: ActiveView; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "room-matrix", label: "Tape Chart", icon: BedDouble },
    { id: "reservations", label: "Bookings", icon: CalendarCheck, badge: dueArrivals },
    { id: "housekeeping", label: "Rooms", icon: Sparkles, badge: pendingHk },
    { id: "comms", label: "Channels", icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcfbf9]/95 backdrop-blur-lg border-t border-[#e2ded6] px-2 py-1.5 flex items-center justify-around lg:hidden shadow-lg safe-area-bottom">
      {tabs.slice(0, 2).map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all relative ${
              isActive 
                ? "text-[#27523d] font-bold" 
                : "text-stone-500 hover:text-stone-800 font-medium"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}

      {/* Floating Center Action Button: Quick Booking */}
      <button
        onClick={onOpenNewBooking}
        className="w-11 h-11 -mt-5 rounded-full bg-[#27523d] text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#1c3e2e] active:scale-95 transition-all cursor-pointer"
        aria-label="New Reservation"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>

      {tabs.slice(2).map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all relative ${
              isActive 
                ? "text-[#27523d] font-bold" 
                : "text-stone-500 hover:text-stone-800 font-medium"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
