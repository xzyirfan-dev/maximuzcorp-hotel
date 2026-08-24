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
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case "EVENING":
        return <Sunset className="w-3.5 h-3.5 text-orange-400" />;
      case "NIGHT":
        return <Moon className="w-3.5 h-3.5 text-indigo-300" />;
    }
  };

  const getShiftBgColor = () => {
    switch (wibInfo.shiftCode) {
      case "MORNING":
        return "bg-amber-950/60 text-amber-300 border-amber-800/50";
      case "EVENING":
        return "bg-orange-950/60 text-orange-300 border-orange-800/50";
      case "NIGHT":
        return "bg-indigo-950/60 text-indigo-300 border-indigo-800/50";
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#142c20] border border-[#234937] text-white text-xs font-mono">
        <Clock className="w-3 h-3 text-[#f1d279]" />
        <span className="font-bold">{wibInfo.timeString}</span>
        <span className="text-[10px] text-emerald-300">WIB</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowShiftDetails(!showShiftDetails)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#142c20] hover:bg-[#1a382b] border border-[#234937] hover:border-[#c5a059]/40 text-white text-xs shadow-inner transition-all cursor-pointer group"
        title="Sistem Waktu Operasional Hotel (WIB - UTC+7)"
      >
        {/* Live Pulse Dot */}
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute opacity-75"></span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 relative"></span>
        </div>

        {/* Digital Time Display */}
        <div className="flex items-center gap-1.5 font-mono">
          <span className="font-bold text-white tracking-tight text-xs">
            {wibInfo.timeString}
          </span>
          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-[#1f4633] text-emerald-200 border border-emerald-700/40 font-sans">
            WIB
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 border-l border-[#1e3c2e] pl-2 text-[11px]">
          {getShiftIcon()}
          <span className="font-medium text-emerald-200">
            {language === "id" ? wibInfo.shiftShortId : wibInfo.shiftShortEn}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-[#f5dc8c] group-hover:text-white transition-transform ${showShiftDetails ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Shift & Time Details */}
      {showShiftDetails && (
        <div className="absolute right-0 mt-2 w-76 bg-[#10241b] rounded-2xl shadow-2xl border border-[#234937] p-3.5 text-xs z-50 animate-in fade-in zoom-in-95 duration-100 text-stone-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e3c2e] mb-2.5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#f1d279]" />
              <span className="font-bold text-white">
                {language === "id" ? "Waktu Operasional Hotel" : "Hotel Operational Clock"}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1f4633] text-emerald-200 border border-emerald-700/40">
              UTC+7 WIB
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Live Indonesian Date & Time */}
            <div className="p-2.5 rounded-xl bg-[#142c20] border border-[#234937]">
              <p className="text-[11px] text-emerald-300/80 font-medium">{wibInfo.formattedDateId}</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-mono font-bold text-white tracking-wider">
                  {wibInfo.timeString}
                </span>
                <span className="text-[11px] font-semibold text-[#f5dc8c]">
                  Waktu Indonesia Barat
                </span>
              </div>
            </div>

            {/* Current Active Shift */}
            <div className={`p-2.5 rounded-xl border ${getShiftBgColor()}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  {getShiftIcon()}
                  <span>{language === "id" ? wibInfo.shiftNameId : wibInfo.shiftNameEn}</span>
                </div>
                <span className="font-mono text-[10px] font-semibold">
                  {wibInfo.shiftStart} - {wibInfo.shiftEnd} WIB
                </span>
              </div>

              {/* Shift Progress Bar */}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] opacity-80">
                  <span>{language === "id" ? "Progres Shift" : "Shift Progress"}</span>
                  <span className="font-mono font-bold">{wibInfo.shiftProgressPercent}%</span>
                </div>
                <div className="w-full bg-[#0c1d15] h-1.5 rounded-full overflow-hidden border border-[#1e3c2e]">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-[#f1d279] h-full rounded-full transition-all duration-300"
                    style={{ width: `${wibInfo.shiftProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Duty Manager on Duty */}
            <div className="p-2 rounded-xl bg-[#142c20] border border-[#234937] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#f1d279]" />
                <div>
                  <p className="text-[10px] text-emerald-300/80">{language === "id" ? "Duty Manager Bertugas" : "Active Duty Manager"}</p>
                  <p className="font-bold text-white text-xs">{wibInfo.dutyManager}</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                ON DUTY
              </span>
            </div>

            {/* Night Audit Schedule Notice */}
            <div className="flex items-center justify-between pt-1 text-[10px] text-emerald-300/70 border-t border-[#1e3c2e]">
              <span>{language === "id" ? "Jadwal Audit Malam Harian:" : "Daily Night Audit Schedule:"}</span>
              <span className="font-mono font-bold text-[#f5dc8c]">23:30 WIB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
