import React, { useState, useEffect } from "react";
import { Clock, Sun, Sunset, Moon, ShieldCheck, ChevronDown, CheckCircle2 } from "lucide-react";
import { getWibTimeInfo, WibTimeInfo } from "../utils/wibTime";
import { useHotel } from "../context/HotelContext";

export const WibClockBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language } = useHotel();
  const [wibInfo, setWibInfo] = useState<WibTimeInfo>(() => getWibTimeInfo());
  const [showShiftDetails, setShowShiftDetails] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setWibInfo(getWibTimeInfo());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getShiftIcon = () => {
    switch (wibInfo.shiftCode) {
      case "MORNING":
        return <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />;
      case "EVENING":
        return <Sunset className="w-3.5 h-3.5 text-orange-500" />;
      case "NIGHT":
        return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const getShiftBgColor = () => {
    switch (wibInfo.shiftCode) {
      case "MORNING":
        return "bg-amber-50 text-amber-900 border-amber-200/80";
      case "EVENING":
        return "bg-orange-50 text-orange-900 border-orange-200/80";
      case "NIGHT":
        return "bg-indigo-50 text-indigo-900 border-indigo-200/80";
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f0ede4] border border-[#ded8cc] text-stone-800 text-xs font-mono">
        <Clock className="w-3 h-3 text-[#27523d]" />
        <span className="font-bold">{wibInfo.timeString}</span>
        <span className="text-[10px] text-stone-500">WIB</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowShiftDetails(!showShiftDetails)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gradient-to-b from-white to-[#f7f5f0] hover:to-[#efebe2] border border-[#ded9cf] text-stone-900 text-xs shadow-2xs transition-all cursor-pointer group"
        title="Sistem Waktu Operasional Hotel (WIB - UTC+7)"
      >
        {/* Live Pulse Dot */}
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute opacity-75"></span>
          <span className="w-2 h-2 rounded-full bg-emerald-600 relative"></span>
        </div>

        {/* Digital Time Display */}
        <div className="flex items-center gap-1.5 font-mono">
          <span className="font-bold text-stone-900 tracking-tight text-xs">
            {wibInfo.timeString}
          </span>
          <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-emerald-100 text-emerald-900 font-sans">
            WIB
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 border-l border-stone-200 pl-2 text-[11px]">
          {getShiftIcon()}
          <span className="font-medium text-stone-700">
            {language === "id" ? wibInfo.shiftShortId : wibInfo.shiftShortEn}
          </span>
        </div>

        <ChevronDown className={`w-3 h-3 text-stone-400 group-hover:text-stone-700 transition-transform ${showShiftDetails ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Shift & Time Details */}
      {showShiftDetails && (
        <div className="absolute right-0 mt-2 w-76 bg-white rounded-xl shadow-2xl border border-[#ded9cf] p-3 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#27523d]" />
              <span className="font-bold text-stone-900">
                {language === "id" ? "Waktu Operasional Hotel" : "Hotel Operational Clock"}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
              UTC+7 WIB
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Live Indonesian Date & Time */}
            <div className="p-2.5 rounded-lg bg-[#f7f5f0] border border-[#e8e4dc]">
              <p className="text-[10px] text-stone-500 uppercase font-semibold tracking-wider">
                {language === "id" ? "Tanggal Resmi Sistem" : "Official Business Date"}
              </p>
              <p className="text-xs font-bold text-stone-900 mt-0.5">
                {language === "id" ? wibInfo.dateStringId : wibInfo.dateStringEn}
              </p>
              <p className="text-base font-mono font-extrabold text-[#27523d] mt-1">
                {wibInfo.timeString} <span className="text-xs font-normal text-stone-500">Waktu Indonesia Barat</span>
              </p>
            </div>

            {/* Shift Info */}
            <div className={`p-2.5 rounded-lg border ${getShiftBgColor()}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                  {getShiftIcon()}
                  {language === "id" ? wibInfo.shiftShortId : wibInfo.shiftShortEn}
                </span>
                <span className="text-[10px] font-mono font-bold">
                  {wibInfo.shiftProgressPercent}% {language === "id" ? "berjalan" : "elapsed"}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-[#27523d] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${wibInfo.shiftProgressPercent}%` }} 
                />
              </div>

              <div className="mt-2 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-600">{language === "id" ? "Duty Manager Aktif:" : "Active Duty Manager:"}</span>
                  <span className="font-semibold text-stone-900">{wibInfo.dutyManagerName}</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>{language === "id" ? "Pergantian shift berikutnya:" : "Next shift handover in:"}</span>
                  <span className="font-mono font-semibold">{wibInfo.nextShiftInHours} jam / hours</span>
                </div>
              </div>
            </div>

            {/* Night Audit status */}
            <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="text-[11px]">
                <p className="font-semibold text-emerald-950">
                  {language === "id" ? "Sinkronisasi Logika Waktu Otomatis" : "Time Logic Synchronization"}
                </p>
                <p className="text-[10px] text-emerald-700">
                  {language === "id" 
                    ? "Sistem audit malam & posting tarif otomatis berjalan pukul 23:30 WIB."
                    : "Night audit & room revenue auto-posting runs at 23:30 WIB."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
