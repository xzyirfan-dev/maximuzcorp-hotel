import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  Calendar, 
  CalendarDays, 
  TrendingUp, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Layers, 
  Users, 
  DollarSign, 
  Megaphone, 
  PartyPopper, 
  Clock, 
  Flame, 
  CheckSquare, 
  Tag, 
  Search, 
  Sliders, 
  ShieldCheck, 
  UtensilsCrossed, 
  Wrench, 
  RefreshCw, 
  ArrowRight,
  Printer,
  ChevronRight,
  Lightbulb,
  ExternalLink,
  Plus,
  Send,
  Zap,
  BedDouble,
  FileText
} from "lucide-react";
import { useHotel } from "../../../context/HotelContext";
import { 
  INDONESIAN_CALENDAR_EVENTS, 
  IndonesianCalendarEvent, 
  TARGET_SEGMENT_OPTIONS 
} from "../../../data/indonesianCalendarData";

export const EventPromoBoosterView: React.FC = () => {
  const { rooms, showToast, createHousekeepingTask, createWorkOrder, sendDepartmentMessage } = useHotel();

  // Calendar filtering & selection state
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<IndonesianCalendarEvent>(INDONESIAN_CALENDAR_EVENTS[0]);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Form Generator Parameters
  const [customEventName, setCustomEventName] = useState<string>("");
  const [customEventDate, setCustomEventDate] = useState<string>("2026-08-17");
  const [customEventType, setCustomEventType] = useState<string>("HARI_LIBUR_NASIONAL");
  const [targetAudience, setTargetAudience] = useState<string>(TARGET_SEGMENT_OPTIONS[0]);
  const [customGoals, setCustomGoals] = useState<string>(
    "Maksimalkan Direct Booking via WhatsApp, dongkrak F&B Dinner Buffet, dan capai okupansi di atas 95%."
  );
  const [baseAdr, setBaseAdr] = useState<number>(1450000);

  // AI Output state
  const [loading, setLoading] = useState<boolean>(false);
  const [strategyData, setStrategyData] = useState<any>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<"CHECKLIST" | "SALES_STRATEGY" | "FNB_EVENT" | "COPYWRITING">("CHECKLIST");
  const [completedChecklistItems, setCompletedChecklistItems] = useState<Record<string, boolean>>({});

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return INDONESIAN_CALENDAR_EVENTS.filter(evt => {
      const matchCategory = 
        selectedCategory === "ALL" ||
        (selectedCategory === "LIBUR_NASIONAL" && (evt.type === "HARI_LIBUR_NASIONAL" || evt.type === "CUTI_BERSAMA")) ||
        (selectedCategory === "FESTIVAL" && evt.type === "FESTIVAL_BUDAYA") ||
        (selectedCategory === "SHOPPING" && evt.type === "SHOPPING_FESTIVAL") ||
        (selectedCategory === "LIBUR_SEKOLAH" && (evt.type === "LIBUR_SEKOLAH" || evt.category === "FAMILY_HOLIDAY"));

      const matchSearch = 
        evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.date.includes(searchQuery);

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle Event Selection
  const handleSelectEvent = (evt: IndonesianCalendarEvent) => {
    setSelectedEvent(evt);
    setIsCustomMode(false);
    setCustomEventName(evt.name);
    setCustomEventDate(evt.date);
    setCustomEventType(evt.type);
    setTargetAudience(evt.bestTargetSegment);
    
    // Smooth scroll down to generator panel
    const genEl = document.getElementById("ai-generator-panel");
    if (genEl) {
      genEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Toggle Custom Mode
  const handleEnableCustomMode = () => {
    setIsCustomMode(true);
    setCustomEventName("Konser Musik Akbar & Food Festival Nusantara 2026");
    setCustomEventDate("2026-09-19");
    setCustomEventType("FESTIVAL_BUDAYA");
    setTargetAudience("Gen Z & Millennial Staycationers (Trendy & Viral)");
  };

  // Run AI Generator
  const handleGenerateStrategy = async () => {
    setLoading(true);
    setStrategyData(null);
    setCompletedChecklistItems({});

    const eventToProcessName = isCustomMode ? customEventName : (selectedEvent?.name || "Hari Libur Nasional Indonesia");
    const eventToProcessDate = isCustomMode ? customEventDate : (selectedEvent?.date || "2026-08-17");
    const eventToProcessType = isCustomMode ? customEventType : (selectedEvent?.type || "HARI_LIBUR_NASIONAL");

    try {
      const res = await fetch("/api/ai/event-promo-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: eventToProcessName,
          eventDate: eventToProcessDate,
          eventType: eventToProcessType,
          targetAudience: targetAudience,
          hotelLocation: "Nusa Dua & Downtown Resort, Bali",
          currentBaseAdr: baseAdr,
          customGoals: customGoals,
        }),
      });

      if (!res.ok) throw new Error("Gagal memanggil AI service");
      const data = await res.json();
      setStrategyData(data);
      
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      showToast(`Strategi Penjualan untuk "${eventToProcessName}" berhasil disusun!`, "success");
    } catch (err: any) {
      console.error("Error generating promo strategy:", err);
      showToast("Gagal menghasilkan strategi AI, menggunakan fallback rekomendasi cerdas.", "warning");
    } finally {
      setLoading(false);
    }
  };

  // Toggle checklist checkbox
  const toggleChecklist = (key: string) => {
    setCompletedChecklistItems(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Copy to clipboard
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} berhasil disalin ke clipboard!`, "success");
  };

  // Deploy Operational Checklist to PMS (Housekeeping Tasks & Work Orders)
  const handleDeployToPMS = () => {
    if (!strategyData) return;

    let hkCount = 0;
    let woCount = 0;

    // Create Housekeeping Tasks for theme prep
    if (strategyData.departmentPreparationChecklists?.housekeeping) {
      strategyData.departmentPreparationChecklists.housekeeping.forEach((taskDesc: string, idx: number) => {
        if (idx < 2) {
          createHousekeepingTask({
            roomNumber: `Room 10${idx + 1}`,
            taskType: "DEEP_CLEAN",
            assignedTo: "Siti Rahmawati",
            status: "PENDING",
            priority: "HIGH",
            dueTime: "14:00",
            notes: `[Event: ${strategyData.eventName}] ${taskDesc}`,
            checklist: [
              { id: `c-evt-${idx}-1`, item: taskDesc, isDone: false },
              { id: `c-evt-${idx}-2`, item: "Inspeksi dekorasi tematik & kelengkapan festive amenities", isDone: false }
            ]
          });
          hkCount++;
        }
      });
    }

    // Create Engineering Work Order
    if (strategyData.departmentPreparationChecklists?.engineering) {
      const engDesc = strategyData.departmentPreparationChecklists.engineering[0] || "Pengecekan fasilitas event & sound lighting";
      createWorkOrder({
        roomNumber: "Grand Ballroom & Public Area",
        location: "Public Facility",
        title: `Persiapan Event: ${strategyData.eventName}`,
        category: "ELECTRICAL",
        priority: "HIGH",
        status: "OPEN",
        reportedBy: "Maximuz AI Intelligence Auto-Scheduler",
        description: engDesc,
      });
      woCount++;
    }

    // Send notification to Ops Channel
    sendDepartmentMessage({
      senderName: "Maximuz AI Event Bot",
      senderRole: "REVENUE_OPTIMIZER",
      channel: "ch-ops",
      message: `🚀 Operational Blueprint untuk event "${strategyData.eventName}" telah didistribusikan! ${hkCount} Task Housekeeping & ${woCount} Work Order Engineering telah aktif.`,
      isUrgent: true
    });

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    } catch (e) {}

    showToast(`Berhasil deploy checklist ke ${hkCount} HK Tasks & ${woCount} Maintenance Work Order!`, "success");
  };

  // Calculate completion progress
  const totalTasks = strategyData?.departmentPreparationChecklists
    ? Object.values(strategyData.departmentPreparationChecklists).flat().length
    : 0;
  const completedCount = Object.values(completedChecklistItems).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Hero Banner with Youthful & Modern Energy */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2d1e] via-[#1a4a33] to-[#27523d] text-white p-6 shadow-xl border border-emerald-500/20">
        {/* Subtle decorative background glowing orbs */}
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-10 -top-10 w-40 h-40 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-300 p-0.5 shadow-lg shadow-emerald-950/40">
                <div className="w-full h-full bg-[#133826] rounded-[10px] flex items-center justify-center text-amber-300">
                  <PartyPopper className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                    Event & Promo Sales Intelligence
                  </h2>
                  <span className="text-[10px] font-bold font-mono uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Indonesian Calendar AI
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  Rekomendasi strategi promosi, kalender libur nasional Indonesia, checklist persiapan operasional & copywriting otomatis
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs">
              <div className="text-right pr-3 border-r border-white/15">
                <span className="text-[10px] text-emerald-200 uppercase font-semibold block">Hari Libur Terlacak</span>
                <span className="font-mono font-bold text-amber-300">18 Event Nasional</span>
              </div>
              <div className="text-left pl-1">
                <span className="text-[10px] text-emerald-200 uppercase font-semibold block">Avg. ADR Surge</span>
                <span className="font-mono font-bold text-emerald-300">+28.4% Lift</span>
              </div>
            </div>
          </div>

          {/* Indonesian Upcoming Ticker */}
          <div className="bg-emerald-950/60 backdrop-blur-md rounded-xl p-3 border border-emerald-600/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-mono font-bold text-[11px] border border-amber-400/30 animate-pulse">
                <Flame className="w-3 h-3 text-amber-400" /> EVENT TERDEKAT
              </span>
              <span className="font-bold text-white">
                HUT Kemerdekaan RI Ke-81 (17 Agustus 2026) • Long Weekend Staycation
              </span>
            </div>
            <button
              onClick={() => {
                const hutEvt = INDONESIAN_CALENDAR_EVENTS.find(e => e.id === "id-cal-12");
                if (hutEvt) handleSelectEvent(hutEvt);
              }}
              className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 transition-colors underline underline-offset-2"
            >
              Langsung Buat Promo 17-an <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: KALENDER ACARA & HARI BESAR INDONESIA */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              Kalender Acara, Hari Libur & Festival Indonesia 2026 - 2027
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Pilih salah satu acara sebagai acuan untuk otomatis membuat strategi paket promosi, checklist persiapan, dan materi penjualan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEnableCustomMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isCustomMode 
                  ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-400" 
                  : "bg-stone-100 hover:bg-stone-200 text-stone-700"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Event Kustom Sendiri</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "ALL", label: "✨ Semua Acara" },
              { id: "LIBUR_NASIONAL", label: "🇮🇩 Hari Libur & Cuti Bersama" },
              { id: "FESTIVAL", label: "🎭 Festival Budaya & Musik" },
              { id: "SHOPPING", label: "🛍️ Harbolnas (10.10, 11.11, 12.12)" },
              { id: "LIBUR_SEKOLAH", label: "🏖️ Liburan Sekolah & Family" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === tab.id
                    ? "bg-[#27523d] text-white shadow-xs"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari event (Lebaran, Waisak, Nyepi...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#faf8f5] border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredEvents.map(evt => {
            const isSelected = !isCustomMode && selectedEvent?.id === evt.id;
            return (
              <div
                key={evt.id}
                onClick={() => handleSelectEvent(evt)}
                className={`cursor-pointer group relative p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "bg-gradient-to-br from-emerald-50 to-[#faf8f5] border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-[#fcfbf9] hover:bg-white border-stone-200 hover:border-emerald-400 hover:shadow-sm"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl p-1.5 bg-white rounded-lg shadow-xs border border-stone-100">
                        {evt.icon}
                      </span>
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${evt.badgeColor.bg} ${evt.badgeColor.text} ${evt.badgeColor.border}`}>
                          {evt.type.replace(/_/g, " ")}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                          {evt.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-stone-600">
                    <span className="flex items-center gap-1 font-mono font-semibold text-stone-800">
                      <CalendarDays className="w-3 h-3 text-emerald-700" />
                      {evt.date} {evt.endDate ? `s/d ${evt.endDate}` : ""}
                    </span>
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {evt.historicalOccupancyLift}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-500 truncate max-w-[150px]">
                      🎯 {evt.bestTargetSegment}
                    </span>
                    <span className={`text-[10px] font-bold flex items-center gap-0.5 ${isSelected ? "text-emerald-800" : "text-stone-500 group-hover:text-emerald-700"}`}>
                      {isSelected ? "Terpilih ✓" : "Pilih Event →"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: AI CAMPAIGN GENERATOR & CUSTOMIZER PANEL */}
      <div id="ai-generator-panel" className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                Konfigurasi Parameter AI Sales Booster
                {isCustomMode && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                    Mode Event Kustom
                  </span>
                )}
              </h3>
              <p className="text-xs text-stone-500">
                Sesuaikan target pasar, baseline harga kamar, dan tujuan bisnis khusus untuk menghasilkan blueprint promosi terlengkap
              </p>
            </div>
          </div>

          <div className="text-xs text-stone-600 hidden sm:block">
            Acara Terpilih: <strong className="text-stone-900">{isCustomMode ? customEventName : selectedEvent.name}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Parameter 1: Nama Acara */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 uppercase flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-700" /> Nama Acara / Promo
            </label>
            <input
              type="text"
              value={isCustomMode ? customEventName : selectedEvent.name}
              onChange={(e) => {
                setIsCustomMode(true);
                setCustomEventName(e.target.value);
              }}
              className="w-full bg-[#fbf9f5] border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600 font-medium"
            />
          </div>

          {/* Parameter 2: Tanggal Acara */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-700" /> Tanggal Pelaksanaan
            </label>
            <input
              type="date"
              value={isCustomMode ? customEventDate : selectedEvent.date}
              onChange={(e) => {
                setIsCustomMode(true);
                setCustomEventDate(e.target.value);
              }}
              className="w-full bg-[#fbf9f5] border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600 font-mono"
            />
          </div>

          {/* Parameter 3: Target Audiens */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 uppercase flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-700" /> Target Audiens Utama
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-[#fbf9f5] border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600"
            >
              {TARGET_SEGMENT_OPTIONS.map((seg, idx) => (
                <option key={idx} value={seg}>{seg}</option>
              ))}
            </select>
          </div>

          {/* Parameter 4: Base Rate ADR */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-600 uppercase flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-700" /> Base ADR Standar (IDR)
            </label>
            <input
              type="number"
              step={50000}
              value={baseAdr}
              onChange={(e) => setBaseAdr(Number(e.target.value))}
              className="w-full bg-[#fbf9f5] border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600 font-mono"
            />
          </div>
        </div>

        {/* Custom Goals & AI Directives */}
        <div className="space-y-1 text-xs">
          <label className="text-[10px] font-bold text-stone-600 uppercase flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-600" /> Goals & Arahan Khusus untuk AI
          </label>
          <textarea
            rows={2}
            value={customGoals}
            onChange={(e) => setCustomGoals(e.target.value)}
            placeholder="Contoh: Fokus pada paket staycation 3D2N keluarga, sertakan voucher spa 20%, tingkatkan penjualan buffet malam..."
            className="w-full bg-[#fbf9f5] border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600 leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            AI akan menyusun: <strong>Checklist 6 Departemen</strong>, <strong>Paket Kamar</strong>, <strong>Timeline H-30</strong>, & <strong>Copywriting Siap Pakai</strong>.
          </div>

          <button
            onClick={handleGenerateStrategy}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#1d4432] via-[#27523d] to-[#1f4a35] hover:from-[#153325] hover:to-[#173a2a] disabled:bg-stone-300 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/20 hover:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>AI Sedang Merancang Blueprint & Strategi...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>🚀 Generate AI Sales Strategy & Event Blueprint</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 3: AI GENERATED BLUEPRINT OUTPUT */}
      {strategyData && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Executive Summary Hero Card */}
          <div className="bg-gradient-to-r from-[#133022] via-[#1c4430] to-[#173727] text-white p-5 rounded-2xl shadow-md space-y-4 border border-emerald-600/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-700/50 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-400 text-stone-950">
                    {strategyData.eventCategory || "EVENT STRATEGY"}
                  </span>
                  <span className="text-xs text-emerald-200 font-mono">
                    🗓️ {strategyData.eventDate}
                  </span>
                </div>
                <h3 className="text-base lg:text-lg font-black text-white tracking-tight">
                  {strategyData.themeConcept || strategyData.eventName}
                </h3>
                <p className="text-xs text-emerald-200/90 max-w-3xl leading-relaxed">
                  {strategyData.targetMarketInsight}
                </p>
              </div>

              {/* Projections Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-black/30 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] uppercase text-emerald-200 block">Target Okupansi</span>
                  <span className="font-mono font-black text-sm text-emerald-300">
                    {strategyData.projectedOutcome?.expectedOccupancyRate || "95%+"}
                  </span>
                </div>
                <div className="bg-black/30 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] uppercase text-emerald-200 block">ADR Lift</span>
                  <span className="font-mono font-black text-sm text-amber-300">
                    {strategyData.projectedOutcome?.projectedAdrLift || "+20%"}
                  </span>
                </div>
                <div className="bg-black/30 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] uppercase text-emerald-200 block">Estimasi Revenue</span>
                  <span className="font-mono font-black text-xs text-white truncate block">
                    {strategyData.projectedOutcome?.estimatedTotalRevenue?.split("(")[0] || "Rp 180M+"}
                  </span>
                </div>
                <div className="bg-black/30 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] uppercase text-emerald-200 block">AI Score Index</span>
                  <span className="font-mono font-black text-sm text-teal-300">
                    {strategyData.projectedOutcome?.roiScore || 94}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Key Objectives Bullet Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-amber-300 uppercase">Key Objectives:</span>
              {strategyData.keyObjectives?.map((obj: string, idx: number) => (
                <span key={idx} className="text-[11px] bg-emerald-950/70 border border-emerald-600/40 text-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" /> {obj}
                </span>
              ))}
            </div>
          </div>

          {/* Tab Selector for Output Breakdown */}
          <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
            {[
              { id: "CHECKLIST", label: `📋 Checklist Persiapan (${completedCount}/${totalTasks} Selesai)`, icon: CheckSquare },
              { id: "SALES_STRATEGY", label: "🎯 Strategi Paket & Kanal Penjualan", icon: TrendingUp },
              { id: "FNB_EVENT", label: "🍽️ Sajian Kuliner & Event Spesial", icon: UtensilsCrossed },
              { id: "COPYWRITING", label: "📢 Copywriting & Materi Promosi Siap Pakai", icon: Megaphone },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveOutputTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeOutputTab === tab.id
                      ? "bg-[#27523d] text-white shadow-sm"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: CHECKLIST PERSIAPAN PER DEPARTEMEN */}
          {activeOutputTab === "CHECKLIST" && (
            <div className="space-y-4">
              {/* Progress & Deploy Bar */}
              <div className="bg-[#faf8f5] p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      Progress Kesiapan Operasional Acara
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {progressPercent}% Complete ({completedCount}/{totalTasks})
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full sm:w-64 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#27523d] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleDeployToPMS}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>⚡ Deploy Checklist ke Task System PMS</span>
                </button>
              </div>

              {/* Department Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategyData.departmentPreparationChecklists && Object.entries(strategyData.departmentPreparationChecklists).map(([deptKey, tasks]: [string, any]) => {
                  const deptTitles: Record<string, { label: string; icon: string; bg: string }> = {
                    frontOffice: { label: "Front Office & Welcoming", icon: "🛎️", bg: "bg-blue-50 border-blue-200 text-blue-900" },
                    housekeeping: { label: "Housekeeping & Linen", icon: "🧹", bg: "bg-emerald-50 border-emerald-200 text-emerald-900" },
                    foodAndBeverage: { label: "F&B, Kitchen & Buffet", icon: "🍳", bg: "bg-amber-50 border-amber-200 text-amber-900" },
                    engineering: { label: "Engineering & Sound/Light", icon: "⚡", bg: "bg-orange-50 border-orange-200 text-orange-900" },
                    salesAndMarketing: { label: "Sales, Marketing & OTA", icon: "📈", bg: "bg-purple-50 border-purple-200 text-purple-900" },
                    securityAndGuestSafety: { label: "Security & Valet Parking", icon: "🛡️", bg: "bg-stone-100 border-stone-300 text-stone-900" },
                  };

                  const config = deptTitles[deptKey] || { label: deptKey, icon: "📋", bg: "bg-stone-50 border-stone-200 text-stone-800" };

                  return (
                    <div key={deptKey} className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                          <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                            <span>{config.icon}</span> {config.label}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">
                            {tasks.length} item
                          </span>
                        </div>

                        <div className="space-y-2">
                          {tasks.map((taskItem: string, idx: number) => {
                            const itemKey = `${deptKey}-${idx}`;
                            const isChecked = !!completedChecklistItems[itemKey];

                            return (
                              <label
                                key={idx}
                                onClick={() => toggleChecklist(itemKey)}
                                className={`flex items-start gap-2 p-2 rounded-lg text-xs cursor-pointer transition-all ${
                                  isChecked
                                    ? "bg-emerald-50 text-stone-500 line-through"
                                    : "bg-[#faf8f5] hover:bg-stone-100 text-stone-800"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="mt-0.5 text-emerald-700 rounded focus:ring-0 cursor-pointer"
                                />
                                <span className="text-[11px] leading-relaxed select-none">
                                  {taskItem}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span>Departemen: {config.label.split(" ")[0]}</span>
                        <span className="font-mono text-emerald-800 font-bold">
                          {tasks.filter((_: any, i: number) => completedChecklistItems[`${deptKey}-${i}`]).length}/{tasks.length} Selesai
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: STRATEGI PAKET & KANAL PENJUALAN */}
          {activeOutputTab === "SALES_STRATEGY" && (
            <div className="space-y-5 text-xs">
              {/* Signature Room Package Box */}
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                      Rekomendasi Paket Kamar Unggulan
                    </span>
                    <h4 className="text-base font-bold text-stone-900 mt-1">
                      {strategyData.recommendedStrategy?.pricingAndPackaging?.packageName}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block uppercase">Rekomendasi Harga Jual</span>
                    <span className="font-mono font-black text-emerald-800 text-base">
                      {strategyData.recommendedStrategy?.pricingAndPackaging?.rateRecommendation}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">
                      Benefit & Fasilitas Termasuk (Inclusions):
                    </span>
                    <div className="space-y-1.5">
                      {strategyData.recommendedStrategy?.pricingAndPackaging?.inclusions?.map((inc: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#faf8f5] text-[11px] text-stone-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">
                        Struktur Diskon & Mekanisme Promosi:
                      </span>
                      <p className="text-xs font-semibold text-stone-800 bg-white p-3 rounded-lg border border-stone-200">
                        🎁 {strategyData.recommendedStrategy?.pricingAndPackaging?.discountType}
                      </p>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        Tipe Kamar Rekomendasi: <strong>{strategyData.recommendedStrategy?.pricingAndPackaging?.roomType}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyText(JSON.stringify(strategyData.recommendedStrategy?.pricingAndPackaging, null, 2), "Rincian Paket Kamar")}
                      className="w-full py-2 bg-[#27523d] text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#1f4231] transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" /> Salin Rincian Paket Kamar
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-Channel Distribution Matrix & Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Sales Channels Table */}
                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3">
                  <span className="font-bold text-xs text-stone-900 block border-b border-stone-100 pb-2">
                    Distribusi Kanal Penjualan & Alokasi Budget
                  </span>

                  <div className="space-y-2.5">
                    {strategyData.recommendedStrategy?.salesChannels?.map((ch: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[#faf8f5] border border-stone-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900">{ch.channel}</span>
                          <span className="font-mono font-bold text-emerald-800 text-[11px] bg-emerald-100 px-2 py-0.5 rounded">
                            Alokasi: {ch.budgetAllocation}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600">{ch.tactic}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Promotional Timeline (H-30 -> Hari H) */}
                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3">
                  <span className="font-bold text-xs text-stone-900 block border-b border-stone-100 pb-2">
                    Timeline Eksekusi Promosi (H-30 s/d Hari H)
                  </span>

                  <div className="space-y-2.5">
                    {strategyData.recommendedStrategy?.promotionalTimeline?.map((time: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[#faf8f5] border border-stone-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#27523d] text-white flex items-center justify-center text-[10px] font-mono font-bold">
                              {i + 1}
                            </span>
                            {time.phase}
                          </span>
                          <span className="font-mono text-[10px] text-stone-500 font-semibold">
                            ⏱ {time.timing}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 pl-6.5 leading-relaxed">
                          {time.keyAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: F&B & SPECIAL EVENT OFFERINGS */}
          {activeOutputTab === "FNB_EVENT" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {strategyData.specialFnbAndEventOfferings?.map((fnb: any, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {fnb.type}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900">{fnb.name}</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {fnb.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-500">Estimasi Harga:</span>
                    <span className="font-mono font-bold text-emerald-800 text-xs">
                      {fnb.estimatedPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: READY-TO-USE MARKETING COPYWRITING */}
          {activeOutputTab === "COPYWRITING" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
              {/* Instagram & TikTok Caption */}
              <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span>📸</span> Caption Instagram & TikTok Viral
                    </span>
                    <button
                      onClick={() => handleCopyText(strategyData.readyToUseCopywriting?.instagramPost, "Caption Instagram")}
                      className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <Copy className="w-3 h-3" /> Salin
                    </button>
                  </div>

                  <div className="p-3 bg-[#faf8f5] rounded-lg border border-stone-200 whitespace-pre-line text-[11px] leading-relaxed text-stone-800 max-h-60 overflow-y-auto font-sans">
                    {strategyData.readyToUseCopywriting?.instagramPost}
                  </div>
                </div>

                {/* Viral Hooks */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Viral Hooks Rekomendasi AI:</span>
                  {strategyData.recommendedStrategy?.socialMediaAndMarketing?.hooks?.map((h: string, idx: number) => (
                    <p key={idx} className="text-[11px] text-emerald-950 bg-emerald-50 p-1.5 rounded border border-emerald-200 font-medium">
                      💡 {h}
                    </p>
                  ))}
                </div>
              </div>

              {/* WhatsApp VIP Broadcast & OTA Title */}
              <div className="space-y-4">
                {/* WhatsApp Broadcast Script */}
                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span>💬</span> WhatsApp VIP Broadcast CRM Script
                    </span>
                    <button
                      onClick={() => handleCopyText(strategyData.readyToUseCopywriting?.whatsappBroadcast, "Template WhatsApp")}
                      className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <Copy className="w-3 h-3" /> Salin
                    </button>
                  </div>

                  <div className="p-3 bg-[#faf8f5] rounded-lg border border-stone-200 whitespace-pre-line text-[11px] leading-relaxed text-stone-800 max-h-48 overflow-y-auto font-sans">
                    {strategyData.readyToUseCopywriting?.whatsappBroadcast}
                  </div>
                </div>

                {/* Best Posting Guide */}
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3.5 space-y-1.5 text-emerald-950">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] uppercase flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" /> Jam Posting Paling Efektif
                    </span>
                    <span className="font-mono font-bold text-xs">
                      {strategyData.recommendedStrategy?.socialMediaAndMarketing?.bestPostingTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Tema Visual: {strategyData.recommendedStrategy?.socialMediaAndMarketing?.visualTheme}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
            <div className="flex items-center gap-2 text-stone-600">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Blueprint strategi siap dieksekusi oleh tim Revenue, Sales, & Operasional Hotel.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Briefing
              </button>

              <button
                onClick={() => handleCopyText(JSON.stringify(strategyData, null, 2), "Seluruh Rencana AI")}
                className="px-3.5 py-1.5 rounded-lg bg-[#27523d] hover:bg-[#1d4230] text-white font-semibold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Salin Seluruh Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
