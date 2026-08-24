import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hotel: "Maximuz Hotel Management System",
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(ai),
  });
});

// AI 1: Dynamic Revenue & Pricing Optimizer
app.post("/api/ai/pricing-optimizer", async (req, res) => {
  try {
    const { roomType, currentOccupancy, currentADR, competitorAvg, localEvents, daysAhead } = req.body;

    if (!ai) {
      // Fallback realistic heuristic response if API key is not yet set
      const recommendedMultiplier = currentOccupancy > 80 ? 1.18 : currentOccupancy > 60 ? 1.08 : 0.95;
      const recommendedADR = Math.round(Number(currentADR || 1200000) * recommendedMultiplier);
      return res.json({
        recommendedADR,
        rateDeltaPercent: Math.round((recommendedMultiplier - 1) * 100),
        demandLevel: currentOccupancy > 75 ? "High Demand" : "Moderate Demand",
        confidenceScore: 89,
        action: recommendedMultiplier > 1 ? "INCREASE_RATE" : "STIMULATE_PROMO",
        strategySummary: `Current occupancy stands at ${currentOccupancy}%. With local market benchmark at Rp ${Number(competitorAvg).toLocaleString()}, an adjusted rate of Rp ${recommendedADR.toLocaleString()} captures higher yield without sacrificing volume.`,
        keyDrivers: [
          `Local market occupancy trend (+${Math.round(Math.random() * 10 + 5)}% vs last week)`,
          `Upcoming regional demand factor: ${localEvents || "Weekend Leisure Surge"}`,
          `Competitor average pricing indexed at Rp ${Number(competitorAvg || 1350000).toLocaleString()}`,
        ],
        projectedRevPARLift: `+${Math.round(Math.abs(recommendedMultiplier - 1) * 120)}%`,
        generatedAt: new Date().toISOString(),
      });
    }

    const prompt = `You are the Chief Revenue Officer and AI Yield Optimization Specialist for Maximuz Grand Heritage Hotel.
Analyze the following market condition and formulate dynamic room rate recommendations:
- Room Type: ${roomType || "Deluxe King Suite"}
- Current Occupancy: ${currentOccupancy}%
- Current ADR: Rp ${Number(currentADR).toLocaleString()}
- Competitor Average Rate: Rp ${Number(competitorAvg).toLocaleString()}
- Local Events / Context: ${localEvents || "Concerts & Business Conventions in central district"}
- Forecast Window: ${daysAhead || 7} days ahead

Provide output in JSON adhering strictly to:
- recommendedADR: number (the recommended rate in IDR integer)
- rateDeltaPercent: number (percentage change e.g. +12 or -5)
- demandLevel: string (e.g. "Surge Peak", "High Demand", "Moderate", "Low Elasticity")
- confidenceScore: number (0-100)
- action: string ("INCREASE_RATE", "MAINTAIN_YIELD", "STIMULATE_PROMO", "RESTRICT_LOS")
- strategySummary: string (detailed executive rationale)
- keyDrivers: array of strings (3 bullet points)
- projectedRevPARLift: string (e.g. "+14.8%")`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedADR: { type: Type.NUMBER },
            rateDeltaPercent: { type: Type.NUMBER },
            demandLevel: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            action: { type: Type.STRING },
            strategySummary: { type: Type.STRING },
            keyDrivers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            projectedRevPARLift: { type: Type.STRING },
          },
          required: ["recommendedADR", "rateDeltaPercent", "demandLevel", "confidenceScore", "action", "strategySummary", "keyDrivers", "projectedRevPARLift"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("AI Pricing Optimizer Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate dynamic pricing" });
  }
});

// AI 2: Guest Sentiment & Feedback Analyzer
app.post("/api/ai/sentiment-analyzer", async (req, res) => {
  try {
    const { guestName, roomNumber, stayDuration, reviewText, rating } = req.body;

    if (!ai) {
      return res.json({
        sentiment: rating >= 4 ? "POSITIVE" : rating === 3 ? "NEUTRAL" : "NEGATIVE",
        sentimentScore: rating * 20,
        aspectBreakdown: {
          cleanliness: rating >= 4 ? "Excellent" : "Needs Attention",
          staffService: "Courteous & Responsive",
          amenities: "Met Expectations",
          foodAndBeverage: "Well Received",
        },
        keyIssuesIdentified: rating < 4 ? ["Check-in wait time slightly prolonged", "AC temperature calibration"] : ["Smooth check-in", "Exceptional turndown service"],
        executiveDraftReply: `Dear ${guestName || "Valued Guest"},\n\nThank you for choosing Maximuz Grand Heritage for your ${stayDuration || "recent"} stay in Suite ${roomNumber || "301"}. We deeply appreciate your honest feedback. Our leadership team has shared your comments with our Front Office and Executive Housekeeper to ensure our hospitality standards remain unparalleled. We look forward to welcoming you back soon.\n\nWarm regards,\nGeneral Manager, Maximuz Hotel Management`,
        recommendedServiceRecovery: rating <= 3 ? "Offer complimentary High Tea voucher & Room Upgrade on next stay" : "Send VIP loyalty point bonus",
      });
    }

    const prompt = `You are the Director of Guest Experience and Quality Assurance at Maximuz Luxury Hotels.
Analyze the following guest review and formulate a professional, high-touch executive response and diagnostic:
- Guest Name: ${guestName}
- Room: ${roomNumber}
- Stay: ${stayDuration}
- Rating: ${rating} / 5
- Review Text: "${reviewText}"

Return JSON adhering strictly to:
- sentiment: string ("POSITIVE", "NEUTRAL", "NEGATIVE")
- sentimentScore: number (0-100)
- aspectBreakdown: object with cleanliness (string), staffService (string), amenities (string), foodAndBeverage (string)
- keyIssuesIdentified: array of strings
- executiveDraftReply: string (customized, warm, elegant letter from General Manager)
- recommendedServiceRecovery: string (actionable VIP recovery or gratitude gesture)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            sentimentScore: { type: Type.NUMBER },
            aspectBreakdown: {
              type: Type.OBJECT,
              properties: {
                cleanliness: { type: Type.STRING },
                staffService: { type: Type.STRING },
                amenities: { type: Type.STRING },
                foodAndBeverage: { type: Type.STRING },
              },
              required: ["cleanliness", "staffService", "amenities", "foodAndBeverage"],
            },
            keyIssuesIdentified: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            executiveDraftReply: { type: Type.STRING },
            recommendedServiceRecovery: { type: Type.STRING },
          },
          required: ["sentiment", "sentimentScore", "aspectBreakdown", "keyIssuesIdentified", "executiveDraftReply", "recommendedServiceRecovery"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("AI Sentiment Analyzer Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze feedback" });
  }
});

// AI 3: Automated Shift Handover & Operational Briefing Generator
app.post("/api/ai/shift-handover-summary", async (req, res) => {
  try {
    const { outgoingShift, incomingShift, occupancy, vipArrivals, maintenanceItems, pendingTasks, financialSnapshot } = req.body;

    if (!ai) {
      return res.json({
        briefingTitle: `Daily Operational Handover (${outgoingShift || "Morning"} -> ${incomingShift || "Evening"} Shift)`,
        executiveSummary: `Occupancy remains robust at ${occupancy || "84.2"}%. All morning check-outs cleared with zero billing discrepancies. Total ${vipArrivals?.length || 2} VIP guests scheduled for afternoon arrival.`,
        criticalPriorities: [
          `VIP In-Room Amenities check for Penthouse 401 (Arrival ~16:00)`,
          `Engineering team completing AC refrigerant recharge in Room 208 before 15:30`,
          `F&B Banquet setup for Corporate Gala Dinner in Grand Ballroom starting 18:30`,
        ],
        departmentalChecklist: {
          frontOffice: "Ensure express keycards prepared for Group Check-in (8 rooms at 17:00).",
          housekeeping: "4 dirty stayover rooms assigned on Floor 3; linen restock arriving at 16:00.",
          engineering: "Room 208 work order in progress, target sign-off by 15:30.",
          fAndB: "Dinner reservation book at 88% capacity; promote Chef's Special Wine Pairing.",
        },
        financialHighlights: financialSnapshot || "Gross Today: Rp 64,800,000 | ADR: Rp 1,450,000 | Pending Folios: 3",
        generatedTimestamp: new Date().toISOString(),
      });
    }

    const prompt = `You are the Hotel Duty Manager creating an official Shift Handover Briefing in Maximuz PMS.
Details:
- Outgoing Shift: ${outgoingShift}
- Incoming Shift: ${incomingShift}
- Current Occupancy: ${occupancy}%
- VIP Arrivals: ${JSON.stringify(vipArrivals || [])}
- Active Maintenance Items: ${JSON.stringify(maintenanceItems || [])}
- Pending Tasks: ${JSON.stringify(pendingTasks || [])}
- Financials: ${financialSnapshot || "N/A"}

Generate a structured operational handover briefing in JSON:
- briefingTitle: string
- executiveSummary: string (concise 2-3 sentences)
- criticalPriorities: array of strings (top 3 actionable items)
- departmentalChecklist: object with frontOffice (string), housekeeping (string), engineering (string), fAndB (string)
- financialHighlights: string`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            briefingTitle: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            criticalPriorities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            departmentalChecklist: {
              type: Type.OBJECT,
              properties: {
                frontOffice: { type: Type.STRING },
                housekeeping: { type: Type.STRING },
                engineering: { type: Type.STRING },
                fAndB: { type: Type.STRING },
              },
              required: ["frontOffice", "housekeeping", "engineering", "fAndB"],
            },
            financialHighlights: { type: Type.STRING },
          },
          required: ["briefingTitle", "executiveSummary", "criticalPriorities", "departmentalChecklist", "financialHighlights"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("AI Handover Summary Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate handover summary" });
  }
});

// AI 4: Strategic Hotel Executive Forecaster & Capex Advisor (High Reasoning)
app.post("/api/ai/strategic-forecast", async (req, res) => {
  try {
    const { currentYearRevenue, avgOccupancy, targetGrowthPercent, marketSegment, budgetCapex } = req.body;

    if (!ai) {
      return res.json({
        forecastPeriod: "Next 4 Quarters (Q1 - Q4)",
        projectedRevenueGrowth: `+${targetGrowthPercent || 15}%`,
        strategicPillars: [
          {
            pillar: "Direct Booking Channel Expansion",
            rationale: "Reduce OTA commission bleed (currently 18%) by deploying localized loyalty perks and member-only room upgrades.",
            estimatedImpact: "+Rp 420,000,000 annualized margin improvement",
          },
          {
            pillar: "Corporate & MICE Package Bundling",
            rationale: "Leverage Grand Ballroom on weekday low-occupancy periods (Tue-Thu) with premium culinary catering.",
            estimatedImpact: "+12.4% weekday occupancy lift",
          },
          {
            pillar: "Capex Allocation: Smart Guest Automation",
            rationale: "Upgrade door locks to Mobile RFID/Keyless and install smart climate control to cut energy costs by 16%.",
            estimatedImpact: "Payback period: 11.2 months",
          },
        ],
        quarterlyForecast: [
          { quarter: "Q1", projectedOccupancy: "78%", projectedADR: "Rp 1,380,000", targetRevenue: "Rp 1,820,000,000" },
          { quarter: "Q2", projectedOccupancy: "82%", projectedADR: "Rp 1,460,000", targetRevenue: "Rp 2,150,000,000" },
          { quarter: "Q3", projectedOccupancy: "89%", projectedADR: "Rp 1,620,000", targetRevenue: "Rp 2,580,000,000" },
          { quarter: "Q4", projectedOccupancy: "93%", projectedADR: "Rp 1,750,000", targetRevenue: "Rp 2,910,000,000" },
        ],
        riskMitigation: [
          "Maintain strict Par 3 linen stock to avoid supplier cost spikes.",
          "Implement dynamic staff scheduling tied directly to forward 14-day reservation pacing.",
        ],
        executiveVerdict: "Recommended aggressive direct booking push while selectively elevating weekend suite rates.",
      });
    }

    const prompt = `You are the Executive Vice President of Hotel Asset Management and Strategy for Maximuz Hospitality.
Conduct a deep strategic analysis and financial forecast for the hotel asset:
- Current Annual Revenue: Rp ${Number(currentYearRevenue || 7800000000).toLocaleString()}
- Average Occupancy: ${avgOccupancy || 82}%
- Target Growth: ${targetGrowthPercent || 15}%
- Primary Market: ${marketSegment || "Upper-Upscale Leisure & Executive Corporate"}
- Available Capex Budget: Rp ${Number(budgetCapex || 500000000).toLocaleString()}

Provide strategic planning in JSON:
- forecastPeriod: string
- projectedRevenueGrowth: string
- strategicPillars: array of objects { pillar: string, rationale: string, estimatedImpact: string }
- quarterlyForecast: array of objects { quarter: string, projectedOccupancy: string, projectedADR: string, targetRevenue: string }
- riskMitigation: array of strings
- executiveVerdict: string`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            forecastPeriod: { type: Type.STRING },
            projectedRevenueGrowth: { type: Type.STRING },
            strategicPillars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pillar: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  estimatedImpact: { type: Type.STRING },
                },
                required: ["pillar", "rationale", "estimatedImpact"],
              },
            },
            quarterlyForecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  quarter: { type: Type.STRING },
                  projectedOccupancy: { type: Type.STRING },
                  projectedADR: { type: Type.STRING },
                  targetRevenue: { type: Type.STRING },
                },
                required: ["quarter", "projectedOccupancy", "projectedADR", "targetRevenue"],
              },
            },
            riskMitigation: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            executiveVerdict: { type: Type.STRING },
          },
          required: ["forecastPeriod", "projectedRevenueGrowth", "strategicPillars", "quarterlyForecast", "riskMitigation", "executiveVerdict"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("AI Strategic Forecast Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate strategic forecast" });
  }
});

// AI 5: Event & Promo Sales Booster Strategy Generator (Indonesian Calendar & Hospitality Market)
app.post("/api/ai/event-promo-strategy", async (req, res) => {
  try {
    const { eventName, eventDate, eventType, targetAudience, hotelLocation, currentBaseAdr, customGoals } = req.body;

    if (!ai) {
      // Heuristic fallback rich response tailored for Indonesian Hospitality
      const eventTitle = eventName || "Libur Nasional & Festive Long Weekend";
      return res.json({
        eventName: eventTitle,
        eventDate: eventDate || "2026-08-17",
        eventCategory: eventType || "HARI_BESAR_NASIONAL",
        themeConcept: `Grand Celebration & Exclusive Getaway - ${eventTitle}`,
        keyObjectives: [
          "Meningkatkan Occupancy Rate mencapai minimal 92% selama periode event",
          "Mendongkrak Average Daily Rate (ADR) sebesar +18% melalui bundling kamar premium & F&B",
          "Memaksimalkan Direct Booking (Website & WhatsApp) untuk menghemat komisi OTA hingga 15%",
          "Menciptakan viral shareable moments untuk brand awareness di TikTok & Instagram",
        ],
        targetMarketInsight: `Segmen ${targetAudience || "Keluarga & Wisatawan Domestik"} mencari kenyamanan total, pengalaman kuliner autentik, kemudahan check-in, dan aktivitas anak/rekreasi tanpa harus keluar hotel.`,
        recommendedStrategy: {
          pricingAndPackaging: {
            packageName: `Exclusive ${eventTitle} Staycation Experience`,
            roomType: "Deluxe King & Executive Family Suite",
            rateRecommendation: `Rp ${Number(currentBaseAdr ? currentBaseAdr * 1.25 : 1850000).toLocaleString()}/malam (Min. Stay 2 Malam)`,
            inclusions: [
              "Welcome signature Indonesian artisan drinks & festive amenities",
              "Daily Gourmet Breakfast Buffet untuk 2 Dewasa + 2 Anak di bawah 12 tahun",
              "1x Special Festive Themed Dinner Buffet / Set Menu Nusantara",
              "Late check-out hingga pukul 15:00 (subject to room availability)",
              "Complimentary kids activities workshop & afternoon high tea",
              "Diskon 20% untuk Spa Treatment & Laundry Service",
            ],
            discountType: "Early Bird 15% (Booking H-14) & Member Extra 5%",
          },
          salesChannels: [
            { channel: "Direct WhatsApp & VIP CRM", tactic: "Broadcast personal blast ke tamu repeater dengan promo early access", budgetAllocation: "15%" },
            { channel: "Instagram & TikTok Ads", tactic: "Video carousel & influencer short-form video review fasilitas hotel", budgetAllocation: "45%" },
            { channel: "OTA Flash Sale (Agoda / Traveloka / Booking)", tactic: "Campaign badge 'Special Event Promo' dengan inventory allotment terkontrol (35%)", budgetAllocation: "30%" },
            { channel: "Local Corporate & Community Partnerships", tactic: "Voucher potongan harga untuk member bank partner & komunitas lokal", budgetAllocation: "10%" },
          ],
          promotionalTimeline: [
            { phase: "Teaser & Early Bird Launch", timing: "H-30 hingga H-21", keyAction: "Rilis poster visual promosi, buka slot Early Bird kuota terbatas (25 kamar), blast WhatsApp VIP." },
            { phase: "Main Campaign & Social Push", timing: "H-20 hingga H-7", keyAction: "Jalankan Meta Ads, kolaborasi food vlogger lokal untuk review menu event, promosi di OTA." },
            { phase: "Last Minute Surge & Urgency", timing: "H-6 hingga Hari H", keyAction: "Push 'Hanya Tersisa 5 Kamar Terakhir' di Instagram Story & WA status, broadcast reminder." },
            { phase: "Event Execution & Post-Event", timing: "Hari H s/d H+3", keyAction: "Live posting keseruan acara, survey kepuasan tamu via QR code, kirim voucher cashback menginap berikutnya." },
          ],
          socialMediaAndMarketing: {
            hooks: [
              `"Mau liburan ${eventTitle} tanpa macet dan ribet? Staycation mewah di Maximuz Hotel jawabannya!"`,
              `"Rayakan momen istimewa ${eventTitle} bareng keluarga tercinta dengan paket all-inclusive terbaik!"`,
              `"Diskon Early Bird cuma minggu ini! Nikmati dinner eksklusif & suite room bernuansa estetik."`,
            ],
            bestPostingTime: "Pukul 11:30 - 13:00 (Lunch Break) & 19:00 - 21:00 (Evening Leisure)",
            hashtagSuggestions: [`#${eventTitle.replace(/[^a-zA-Z0-9]/g, "")}`, "#StaycationSeru", "#HotelPromoIndonesia", "#LiburanKeluarga", "#LuxuryStaycation", "#HotelDeals"],
            visualTheme: "Warm Festive Tone dengan ornamen elegan, visual makanan menggugah selera, dan foto kamar bernuansa rileks & premium.",
          },
        },
        departmentPreparationChecklists: {
          frontOffice: [
            "Siapkan welcome drink khas & signature cold towel dengan aroma aromaterapi melati/citrus.",
            "Cetak keycard khusus dengan branding event & leaflet jadwal aktivitas tamu selama menginap.",
            "Briefing tim FO mengenai alur Fast Track Check-in & penanganan antrean koper jam sibuk (13:00-15:00).",
            "Koordinasi dengan Guest Relation Officer untuk menyapa tamu VIP & member loyalitas secara personal.",
          ],
          housekeeping: [
            "Pastikan Par 3 stok linen, handuk, dan bath amenity mewah siap 100% tanpa kekurangan.",
            "Pasang hiasan/dekorasi tematik di lobby utama, lift, dan koridor lantai tamu.",
            "Sediakan extra bed dan baby cot cadangan dalam kondisi bersih dan siap pasang.",
            "Lakukan deep cleaning & audit aroma di seluruh kamar yang akan di-check in kan.",
          ],
          foodAndBeverage: [
            "Finalisasi resep dan food cost untuk menu buffet/set menu tematik bersama Executive Chef.",
            "Pemesanan bahan baku segar H-5 untuk mengantisipasi kelangkaan pasar saat musim liburan.",
            "Dekorasi area restoran & live cooking station dengan properti tematik yang eye-catching.",
            "Siapkan signature mocktail/cocktail spesial bertema event untuk menyambut tamu makan malam.",
          ],
          engineering: [
            "Lakukan preventive maintenance menyeluruh pada unit AC di seluruh kamar dan public area.",
            "Periksa audio system, sound mic, dan lighting ambient di lobby, restoran, dan swimming pool.",
            "Uji coba genset cadangan (backup generator) dan pompa air utama untuk antisipasi beban puncak.",
            "Pastikan koneksi Wi-Fi publik dan kamar berkecepatan tinggi tanpa hambatan latency.",
          ],
          salesAndMarketing: [
            "Finalisasi banner website, pop-up promosi, dan materi promosi cetak/digital di standee lobby.",
            "Monitor harian pick-up rate kamar dan sesuaikan alokasi kuota kamar di setiap channel penjualan.",
            "Briefing tim Sales untuk follow-up grup keluarga besar dan pemesanan meja restoran.",
          ],
          securityAndGuestSafety: [
            "Pengaturan alur parkir mobil & valet service untuk mengantisipasi lonjakan kendaraan tamu lokal.",
            "Peningkatan patroli keamanan berkala di area parkir, lobby, kolam renang, dan lift tamu.",
            "Pengecekan perlengkapan P3K, emergency exit, dan kesiapan tim keselamatan kolam renang (Lifeguard).",
          ],
        },
        specialFnbAndEventOfferings: [
          {
            name: `Gourmet ${eventTitle} Feast Buffet`,
            type: "Dinner Buffet / Family Set",
            description: "Hidangan prasmanan istimewa dengan live grill station, artisan dessert bar, dan masakan khas nusantara pilihan chef.",
            estimatedPrice: "Rp 325,000 net / pax (Buy 4 Get 5)",
          },
          {
            name: "Sunset Acoustic Live & Mocktail Lounge",
            type: "Entertainment & Beverage",
            description: "Pertunjukan live music akustik di tepi kolam renang ditemani sajian mocktail segar dan canape bites.",
            estimatedPrice: "Free Entry untuk Tamu In-House / Rp 120,000 per drink",
          },
          {
            name: "Little Explorer Kids Fun Activity",
            type: "Kids & Family Fun",
            description: "Aktivitas mewarnai, fun cooking class membuat pizza/cupcake mini, dan mini treasure hunt berhadiah merchandise.",
            estimatedPrice: "Complimentary untuk paket kamar",
          },
        ],
        projectedOutcome: {
          expectedOccupancyRate: "94% - 98%",
          projectedAdrLift: "+22.5%",
          estimatedTotalRevenue: "Rp 185,000,000 - Rp 240,000,000 (Selama Periode Event)",
          roiScore: 92,
        },
        readyToUseCopywriting: {
          instagramPost: `✨ RAYAKAN MOMEN SPESIAL ${eventTitle.toUpperCase()} DI MAXIMUZ GRAND HERITAGE! ✨\n\nManjakan diri dan keluarga tercinta dengan paket staycation eksklusif all-inclusive:\n🛌 Kamar Deluxe / Suite mewah dengan view memukau\n🍳 Sarapan buffet melimpah & hidangan dinner spesial\n🎉 Akses kolam renang, kids fun workshop & late check-out\n\n🔥 PROMO EARLY BIRD DISKON HINGGA 20% (Slot Terbatas!)\n\n📲 Pesan sekarang via WhatsApp kami: +62 811-2345-6789 atau klik link di bio! Liburan berkesan tanpa repot dimulai di sini. 🏨🌿\n\n#MaximuzHotel #PromoHotel #${eventTitle.replace(/[^a-zA-Z0-9]/g, "")} #StaycationIndonesia #LiburanKeluarga #HotelIndonesia`,
          whatsappBroadcast: `Halo Kak [Nama Tamu]! 👋\n\nSudah ada rencana untuk menyambut *${eventTitle}* nanti? 🌟\n\nMaximuz Grand Heritage menghadirkan *Special Festive Staycation Package* khusus untuk tamu loyal kami:\n\n✨ Menginap di Kamar Deluxe King / Suite\n✨ Gratis Sarapan & Dinner Spesial untuk 2-4 orang\n✨ Late Check-Out hingga 15:00\n✨ Free Kids Fun Activities & Welcome Drink\n\n🎁 *PROMO KHUSUS HARI INI:* Dapatkan diskon tambahan 15% dengan kode promo *FESTIVE${new Date().getFullYear()}*!\n\nKamar sangat terbatas! Balas pesan ini untuk klaim voucher dan reservasi langsung bersama tim kami. Sampai jumpa di Maximuz! 🏨✨`,
          emailNewsletter: `Subjek: [Spesial ${eventTitle}] Nikmati Liburan Berkesan & Penawaran Eksklusif di Maximuz Grand Heritage!\n\nDear Tamu Terhormat,\n\nMomen ${eventTitle} telah tiba! Ini saat yang tepat untuk beristirahat sejenak dan menikmati liburan berkualitas bersama orang terkasih.\n\nNikmati paket istimewa kami yang dirancang khusus untuk kenyamanan dan kebahagiaan Anda, mulai dari sajian kuliner istimewa hingga fasilitas relaksasi kelas dunia.\n\nKlik tombol di bawah ini untuk melihat ketersediaan kamar dan dapatkan jaminan harga terbaik dengan berbagai benefit tambahan.\n\n[BOOK NOW WITH SPECIAL RATE]`,
          otaPromoTitle: `${eventTitle} Special Staycation Package - Incl. Breakfast & Dinner Buffet`,
        },
      });
    }

    const prompt = `Anda adalah Chief Marketing Officer (CMO), Director of Sales & Revenue, dan Event Strategist kelas dunia untuk Hotel Mewah Bintang 4-5 di Indonesia (Maximuz Grand Heritage Hotel).

Tugas Anda adalah merancang BLUEPRINT STRATEGI PENJUALAN, EVENT PROMOSI, DAN CHECKLIST OPERASIONAL LENGKAP untuk menyambut acara/hari libur/hari besar berikut ini:
- Nama Acara: ${eventName || "Hari Libur Nasional Indonesia"}
- Tanggal Acara: ${eventDate || "2026-08-17"}
- Kategori Acara: ${eventType || "PUBLIC_HOLIDAY"}
- Target Audiens Utama: ${targetAudience || "Keluarga, Pasangan Muda & Leisure Travelers"}
- Lokasi Hotel: ${hotelLocation || "Kawasan Wisata & Pusat Kota Premium"}
- Estimasi Base ADR: Rp ${Number(currentBaseAdr || 1450000).toLocaleString()}
- Goals Khusus Hotel: ${customGoals || "Maksimalkan okupansi hingga 95%, tingkatkan spending F&B & spa, ciptakan viralitas media sosial"}

Buat strategi yang sangat mendalam, kreatif, realistis, aplikatif, berjiwa muda penuh energi, dan menguntungkan dalam format JSON terstruktur:

1. eventName: string
2. eventDate: string
3. eventCategory: string
4. themeConcept: string (konsep kreatif & tema promosi yang catchy & viral)
5. keyObjectives: array of strings (3-4 KPI terukur)
6. targetMarketInsight: string (analisis psikologi & preferensi segmen tamu)
7. recommendedStrategy: object {
   pricingAndPackaging: object {
     packageName: string,
     roomType: string,
     rateRecommendation: string,
     inclusions: array of strings (5-6 poin fasilitas/benefit lengkap),
     discountType: string
   },
   salesChannels: array of objects { channel: string, tactic: string, budgetAllocation: string },
   promotionalTimeline: array of objects { phase: string, timing: string, keyAction: string },
   socialMediaAndMarketing: object {
     hooks: array of strings (3 hook viral untuk video/caption),
     bestPostingTime: string,
     hashtagSuggestions: array of strings,
     visualTheme: string
   }
}
8. departmentPreparationChecklists: object {
   frontOffice: array of strings (3-5 checklist persiapan detail),
   housekeeping: array of strings (3-5 checklist persiapan detail),
   foodAndBeverage: array of strings (3-5 checklist persiapan detail),
   engineering: array of strings (3-5 checklist persiapan detail),
   salesAndMarketing: array of strings (3-5 checklist persiapan detail),
   securityAndGuestSafety: array of strings (3-5 checklist persiapan detail)
}
9. specialFnbAndEventOfferings: array of objects {
   name: string,
   type: string,
   description: string,
   estimatedPrice: string
}
10. projectedOutcome: object {
    expectedOccupancyRate: string,
    projectedAdrLift: string,
    estimatedTotalRevenue: string,
    roiScore: number
}
11. readyToUseCopywriting: object {
    instagramPost: string (caption Instagram lengkap dengan emoji & CTA),
    whatsappBroadcast: string (template WA blast siap kirim dengan format bold/italic),
    emailNewsletter: string,
    otaPromoTitle: string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eventName: { type: Type.STRING },
            eventDate: { type: Type.STRING },
            eventCategory: { type: Type.STRING },
            themeConcept: { type: Type.STRING },
            keyObjectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            targetMarketInsight: { type: Type.STRING },
            recommendedStrategy: {
              type: Type.OBJECT,
              properties: {
                pricingAndPackaging: {
                  type: Type.OBJECT,
                  properties: {
                    packageName: { type: Type.STRING },
                    roomType: { type: Type.STRING },
                    rateRecommendation: { type: Type.STRING },
                    inclusions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    discountType: { type: Type.STRING },
                  },
                  required: ["packageName", "roomType", "rateRecommendation", "inclusions", "discountType"],
                },
                salesChannels: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      channel: { type: Type.STRING },
                      tactic: { type: Type.STRING },
                      budgetAllocation: { type: Type.STRING },
                    },
                    required: ["channel", "tactic", "budgetAllocation"],
                  },
                },
                promotionalTimeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phase: { type: Type.STRING },
                      timing: { type: Type.STRING },
                      keyAction: { type: Type.STRING },
                    },
                    required: ["phase", "timing", "keyAction"],
                  },
                },
                socialMediaAndMarketing: {
                  type: Type.OBJECT,
                  properties: {
                    hooks: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    bestPostingTime: { type: Type.STRING },
                    hashtagSuggestions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    visualTheme: { type: Type.STRING },
                  },
                  required: ["hooks", "bestPostingTime", "hashtagSuggestions", "visualTheme"],
                },
              },
              required: ["pricingAndPackaging", "salesChannels", "promotionalTimeline", "socialMediaAndMarketing"],
            },
            departmentPreparationChecklists: {
              type: Type.OBJECT,
              properties: {
                frontOffice: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                housekeeping: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                foodAndBeverage: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                engineering: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                salesAndMarketing: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                securityAndGuestSafety: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["frontOffice", "housekeeping", "foodAndBeverage", "engineering", "salesAndMarketing", "securityAndGuestSafety"],
            },
            specialFnbAndEventOfferings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedPrice: { type: Type.STRING },
                },
                required: ["name", "type", "description", "estimatedPrice"],
              },
            },
            projectedOutcome: {
              type: Type.OBJECT,
              properties: {
                expectedOccupancyRate: { type: Type.STRING },
                projectedAdrLift: { type: Type.STRING },
                estimatedTotalRevenue: { type: Type.STRING },
                roiScore: { type: Type.NUMBER },
              },
              required: ["expectedOccupancyRate", "projectedAdrLift", "estimatedTotalRevenue", "roiScore"],
            },
            readyToUseCopywriting: {
              type: Type.OBJECT,
              properties: {
                instagramPost: { type: Type.STRING },
                whatsappBroadcast: { type: Type.STRING },
                emailNewsletter: { type: Type.STRING },
                otaPromoTitle: { type: Type.STRING },
              },
              required: ["instagramPost", "whatsappBroadcast", "emailNewsletter", "otaPromoTitle"],
            },
          },
          required: [
            "eventName",
            "eventDate",
            "eventCategory",
            "themeConcept",
            "keyObjectives",
            "targetMarketInsight",
            "recommendedStrategy",
            "departmentPreparationChecklists",
            "specialFnbAndEventOfferings",
            "projectedOutcome",
            "readyToUseCopywriting",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("AI Event Promo Strategy Error:", error);
    res.status(500).json({ error: error.message || "Gagal menghasilkan strategi promosi event" });
  }
});

// Vite Middleware for Full-stack Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Maximuz Hotel Management Server running on port ${PORT}`);
  });
}

startServer();
