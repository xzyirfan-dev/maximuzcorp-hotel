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
      <div className="bg-white rounded-lg p-2 border border-[#e2ded6] shadow-xs">
        <label className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider block mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#27523d]" />
            {t.switchLanguage || "Pilihan Bahasa"}
          </span>
          <span className="font-mono text-[9px] text-stone-400">ID / EN-US</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          {LANGUAGE_OPTIONS.map(opt => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelectLanguage(opt.code)}
                className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#27523d] text-white shadow-xs"
                    : "bg-[#f5f3ee] hover:bg-[#eae6dc] text-stone-700 hover:text-stone-900 border border-stone-200"
                }`}
                title={opt.label}
              >
                <span className="text-sm">{opt.flag}</span>
                <span className="truncate">{opt.code === "id" ? "Indonesia" : "English"}</span>
                {isSelected && <Check className="w-3 h-3 ml-0.5" />}
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
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f0ede4] hover:bg-[#e7e3da] text-stone-800 rounded-lg text-xs font-semibold border border-[#ded8cc] transition-all cursor-pointer shadow-xs"
        aria-label="Select Language"
        title="Ganti Bahasa / Switch Language"
      >
        <span className="text-sm leading-none">{currentOption.flag}</span>
        <span className="hidden sm:inline font-mono font-bold uppercase text-[11px] text-stone-800">
          {currentOption.code === "id" ? "ID" : "EN-US"}
        </span>
        <span className="hidden xl:inline text-xs font-medium text-stone-600">
          {currentOption.code === "id" ? "Indonesia" : "English (US)"}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-[#ded9cf] p-1.5 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 border-b border-stone-100 mb-1 flex items-center justify-between">
            <span className="font-bold text-[11px] text-stone-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-800" />
              {language === "id" ? "Pilihan Bahasa" : "Language Settings"}
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
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
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200"
                      : "hover:bg-stone-100 text-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl p-1 bg-stone-50 rounded border border-stone-200 shadow-2xs">
                      {opt.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-900">
                          {opt.label}
                        </span>
                        <span className="font-mono text-[10px] text-stone-500 uppercase px-1 py-0.2 rounded bg-stone-100">
                          {opt.code === "id" ? "ID" : "EN-US"}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {opt.sublabel}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-1.5 border-t border-stone-100 px-2 py-1 text-[10px] text-stone-600 flex items-center justify-between">
            <span>MaximuzCorp - Grub Localization</span>
            <span className="font-mono text-emerald-800 font-bold">Live Auto-Save</span>
          </div>
        </div>
      )}
    </div>
  );
};
