import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useHotel } from "../context/HotelContext";
import { LANGUAGE_OPTIONS, Language } from "../i18n/translations";

interface LanguageSelectorProps {
  variant?: "header" | "sidebar" | "compact";
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = "header" }) => {
  const { language, setLanguage, t } = useHotel();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = LANGUAGE_OPTIONS.find(opt => opt.code === language) || LANGUAGE_OPTIONS[0];

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === "sidebar") {
    return (
      <div className="bg-[#142c20] rounded-xl p-2.5 border border-[#234937] shadow-inner text-stone-200">
        <label className="text-[10px] font-semibold text-[#f5dc8c] uppercase tracking-wider block mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#f1d279]" />
            {t.switchLanguage || "Pilihan Bahasa"}
          </span>
          <span className="font-mono text-[9px] text-emerald-300/70">ID / EN-US</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          {LANGUAGE_OPTIONS.map(opt => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelectLanguage(opt.code)}
                className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1f4633] text-white border border-[#f1d279] shadow-xs"
                    : "bg-[#0d1f17] hover:bg-[#183629] text-emerald-200 hover:text-white border border-[#234937]"
                }`}
                title={opt.label}
              >
                <span className="text-sm">{opt.flag}</span>
                <span className="truncate">{opt.code === "id" ? "Indonesia" : "English"}</span>
                {isSelected && <Check className="w-3 h-3 ml-0.5 text-[#f1d279]" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#142c20] hover:bg-[#1a382b] text-emerald-100 rounded-xl text-xs font-semibold border border-[#234937] hover:border-[#c5a059]/40 transition-all cursor-pointer shadow-xs"
        aria-label="Select Language"
        title="Ganti Bahasa / Switch Language"
      >
        <span className="text-sm leading-none">{currentOption.flag}</span>
        <span className="hidden sm:inline font-mono font-bold uppercase text-[11px] text-[#f5dc8c]">
          {currentOption.code === "id" ? "ID" : "EN-US"}
        </span>
        <span className="hidden xl:inline text-xs font-medium text-emerald-200/90">
          {currentOption.code === "id" ? "Indonesia" : "English (US)"}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#f5dc8c] transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 bg-[#10241b] rounded-2xl shadow-2xl border border-[#234937] p-2 text-xs z-50 animate-in fade-in zoom-in-95 duration-100 text-stone-200">
          <div className="px-2.5 py-1.5 border-b border-[#1e3c2e] mb-1 flex items-center justify-between">
            <span className="font-bold text-[11px] text-white flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#f1d279]" />
              {language === "id" ? "Pilihan Bahasa" : "Language Settings"}
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#1f4633] text-emerald-200 border border-emerald-700/40">
              {LANGUAGE_OPTIONS.length} Options
            </span>
          </div>

          <div className="space-y-1">
            {LANGUAGE_OPTIONS.map((opt) => {
              const isSelected = language === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelectLanguage(opt.code)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#1d4130] text-white font-bold border border-[#f1d279]"
                      : "hover:bg-[#142c20] text-emerald-100/90 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl p-1 bg-[#0c1d15] rounded-lg border border-[#1e3c2e] shadow-2xs">
                      {opt.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">
                          {opt.label}
                        </span>
                        <span className="font-mono text-[10px] text-[#f5dc8c] uppercase px-1 py-0.2 rounded bg-[#163325]">
                          {opt.code === "id" ? "ID" : "EN-US"}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-300/70 mt-0.5">
                        {opt.sublabel}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#c5a059] text-stone-950 flex items-center justify-center font-bold">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-1.5 border-t border-[#1e3c2e] px-2 py-1 text-[10px] text-emerald-300/70 flex items-center justify-between">
            <span>MaximuzCorp - Grub System</span>
            <span className="font-mono text-[#f5dc8c] font-bold">Live Auto-Save</span>
          </div>
        </div>
      )}
    </div>
  );
};
