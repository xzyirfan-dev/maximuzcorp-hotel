import React, { useState } from "react";
import { 
  FileCode2, 
  Layers, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Palette, 
  Workflow, 
  CheckCircle2, 
  Building2, 
  Bot,
  Zap,
  Lock,
  Boxes,
  Globe
} from "lucide-react";

export const BlueprintView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "VISION" | "MODULES" | "RBAC" | "ARCHITECTURE" | "DB_SCHEMA" | "DESIGN_SYSTEM" | "AI_STRATEGY"
  >("VISION");

  const sections = [
    { id: "VISION", label: "Product Vision & Core Pillars", icon: Building2 },
    { id: "MODULES", label: "ERP Scope & Modules", icon: Workflow },
    { id: "RBAC", label: "RBAC Access Matrix", icon: ShieldCheck },
    { id: "ARCHITECTURE", label: "Full-Stack Architecture", icon: Cpu },
    { id: "DB_SCHEMA", label: "Data Schemas & APIs", icon: Database },
    { id: "DESIGN_SYSTEM", label: "Natural Office UI System", icon: Palette },
    { id: "AI_STRATEGY", label: "Gemini AI Strategy", icon: Bot },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-[#27523d] text-white p-6 rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs text-emerald-200 font-mono">
          <FileCode2 className="w-4 h-4" />
          <span>MAXIMUZ-PMS-SPEC-v2026.4 • ENTERPRISE BLUEPRINT</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Maximuz Hotel Management System: Technical & UX Blueprint
        </h1>
        <p className="text-xs text-emerald-100/90 max-w-3xl leading-relaxed">
          Comprehensive product specifications, architectural definitions, user experience design system, data models, and enterprise scalability guidelines for full-cycle 5-star hotel hospitality operations.
        </p>

        {/* Section Navigation Tabs */}
        <div className="pt-4 flex flex-wrap gap-2 text-xs">
          {sections.map(s => {
            const Icon = s.icon;
            const isActive = activeTab === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  isActive ? "bg-white text-[#27523d] shadow-sm" : "bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DOCUMENT BODY */}
      <div className="bg-white rounded-2xl border border-[#e4ded4] shadow-xs p-6 text-stone-800 space-y-6">
        {/* TAB 1: PRODUCT VISION */}
        {activeTab === "VISION" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
                1. Executive Product Vision & Core Architecture
              </h2>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Maximuz Hotel Management System is engineered as a unified Enterprise Resource Planning (ERP) and Property Management System (PMS) designed for luxury hotels, boutique resorts, and multi-property hospitality groups. It eliminates fragmented software silos by consolidating front office, housekeeping, engineering, culinary POS, financial night audit, and staff human resources into a cohesive single-pane-of-glass workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e4dc] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#27523d] text-white flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="font-bold text-stone-900">Zero-Friction Front Desk</h3>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  Sub-15-second guest check-ins with automated keycard provisioning, real-time room rack status synchronization, and multi-channel OTA inventory sync.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e4dc] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#27523d] text-white flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="font-bold text-stone-900">Synchronous Multi-Department Mesh</h3>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  Real-time event dispatching between Housekeeping, Engineering, and Front Desk to ensure pristine room turnaround and rapid facility incident resolution.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e4dc] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#27523d] text-white flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="font-bold text-stone-900">Autonomous Machine Intelligence</h3>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  Native integration with Gemini 3.7 Flash & 3.1 Pro Preview for dynamic revenue rate optimization, guest sentiment recovery, and strategic executive forecasting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MODULES */}
        {activeTab === "MODULES" && (
          <div className="space-y-5 text-xs">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              2. Hotel ERP Functional Modules Specification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#e4ded4] space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span> Property Management & Room Rack
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Interactive visual rack with floor-by-floor filtering and 7-day chronological tape chart. Real-time state machine: Vacant Clean, Vacant Inspected, Vacant Dirty, In Progress, Occupied, Due Out, Out of Order.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#e4ded4] space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span> Reservations & Guest 360 CRM
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Multi-channel booking management (Direct Web, Booking.com, Agoda, Expedia, Corporate MICE). Complete guest billing folios with itemized charge ledger, 10% service charge, 11% PB1 tax, and integrated payment gateway.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#e4ded4] space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span> Housekeeping & Turnaround SOP
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Mobile-responsive task dispatcher with interactive 5-star sanitization checklists, supervisor verification workflows, and real-time floor linen pantry par stock monitoring.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#e4ded4] space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span> Engineering & Work Orders
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Facility ticket dispatching categorized into HVAC, Plumbing, Electrical, Smart Locks, and Pool equipment with priority escalation (Critical Urgent to Preventative) and spare parts cost logging.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#e4ded4] space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span> F&B POS & In-Room Dining
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Full culinary order builder with direct guest room folio posting, kitchen prep queue dispatching, and dynamic tax & service calculations.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#e4ded4] space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-700"></span> Finance & Automated Night Audit
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Daily flash revenue reporting (Room, F&B, Spa), RevPAR & ADR yields, business date roll-forward, trial balance validation, and automated tax ledger generation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RBAC */}
        {activeTab === "RBAC" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              3. Role-Based Access Control (RBAC) Matrix
            </h2>
            <p className="text-stone-600">
              Strict access segregation enforces least-privilege principles across 6 core operational roles:
            </p>

            <div className="overflow-x-auto rounded-xl border border-[#e4ded4]">
              <table className="w-full text-left">
                <thead className="bg-[#faf8f5] text-[11px] font-semibold text-stone-600 border-b border-[#e4ded4]">
                  <tr>
                    <th className="p-2.5">User Role</th>
                    <th className="p-2.5">Room Rack</th>
                    <th className="p-2.5">Reservations / Folio</th>
                    <th className="p-2.5">Housekeeping</th>
                    <th className="p-2.5">Engineering</th>
                    <th className="p-2.5">F&B POS</th>
                    <th className="p-2.5">Night Audit / Finance</th>
                    <th className="p-2.5">AI Strategic Hub</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">General Manager</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">Front Office Manager</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-blue-700">View Only</td>
                    <td className="p-2.5 text-blue-700">Log Ticket</td>
                    <td className="p-2.5 text-blue-700">Post Charge</td>
                    <td className="p-2.5 text-blue-700">Run Audit</td>
                    <td className="p-2.5 text-blue-700">Pricing / Sentiment</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">Executive Housekeeper</td>
                    <td className="p-2.5 text-emerald-700">Status Update</td>
                    <td className="p-2.5 text-stone-400">Restricted</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-blue-700">Log Ticket</td>
                    <td className="p-2.5 text-stone-400">Restricted</td>
                    <td className="p-2.5 text-stone-400">Restricted</td>
                    <td className="p-2.5 text-blue-700">Handover Briefing</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">Chief Engineer</td>
                    <td className="p-2.5 text-emerald-700">Set OOO</td>
                    <td className="p-2.5 text-stone-400">Restricted</td>
                    <td className="p-2.5 text-stone-400">Restricted</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-stone-400">Restricted</td>
                    <td className="p-2.5 text-stone-400">Restricted</td>
                    <td className="p-2.5 text-stone-400">Restricted</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">Financial Controller</td>
                    <td className="p-2.5 text-blue-700">View Only</td>
                    <td className="p-2.5 text-emerald-700">Folio Audit</td>
                    <td className="p-2.5 text-stone-400">Restricted</td>
                    <td className="p-2.5 text-stone-400">Restricted</td>
                    <td className="p-2.5 text-blue-700">Revenue View</td>
                    <td className="p-2.5 text-emerald-700">Full Access</td>
                    <td className="p-2.5 text-emerald-700">Strategic Forecast</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ARCHITECTURE */}
        {activeTab === "ARCHITECTURE" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              4. Full-Stack Architecture & Cloud Ingress
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e4dc] space-y-2">
                <h3 className="font-bold text-stone-900">Frontend Presentation Tier</h3>
                <ul className="text-stone-600 space-y-1">
                  <li>• <strong>Framework:</strong> React 19 + TypeScript with Vite HMR</li>
                  <li>• <strong>Styling Engine:</strong> Tailwind CSS v4 Natural Office Theme</li>
                  <li>• <strong>Component Architecture:</strong> Modular, memoized state providers</li>
                  <li>• <strong>Interactive Motion:</strong> Smooth view layout transitions via Motion</li>
                  <li>• <strong>Offline-Resilient:</strong> Client optimistic updates with localStorage fallback</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e4dc] space-y-2">
                <h3 className="font-bold text-stone-900">Server & Machine Intelligence Tier</h3>
                <ul className="text-stone-600 space-y-1">
                  <li>• <strong>Server:</strong> Express 4 Node.js runtime binding to 0.0.0.0:3000</li>
                  <li>• <strong>Build Bundler:</strong> esbuild single-file production compilation</li>
                  <li>• <strong>AI Engine:</strong> @google/genai TypeScript SDK integration</li>
                  <li>• <strong>Security Guard:</strong> Zero client exposure of GEMINI_API_KEY</li>
                  <li>• <strong>Database Ready:</strong> Cloud Firestore & PostgreSQL schemas</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DB SCHEMA */}
        {activeTab === "DB_SCHEMA" && (
          <div className="space-y-4 text-xs font-mono">
            <h2 className="text-base font-bold text-stone-900 font-sans border-b border-stone-100 pb-2">
              5. Database Domain Models & REST API Specifications
            </h2>

            <div className="bg-stone-900 text-emerald-400 p-4 rounded-xl overflow-x-auto space-y-2 text-[11px]">
              <p className="text-stone-400">// Core Hotel Domain Collections (Firestore / Relational Schema)</p>
              <p className="text-stone-300">COLLECTION: <span className="text-emerald-300">rooms</span></p>
              <p className="text-stone-400 pl-4">{`{ id, roomNumber: string, floor: number, category: RoomCategory, status: RoomStatus, currentRate: number, currentGuestName?: string, assignedHousekeeper?: string }`}</p>
              
              <p className="text-stone-300 pt-2">COLLECTION: <span className="text-emerald-300">reservations</span></p>
              <p className="text-stone-400 pl-4">{`{ id, bookingCode: string, guestId: string, roomId: string, checkInDate: string, checkOutDate: string, channel: ChannelSource, status: ReservationStatus, totalAmount: number, depositPaid: number }`}</p>

              <p className="text-stone-300 pt-2">COLLECTION: <span className="text-emerald-300">guest_folios</span></p>
              <p className="text-stone-400 pl-4">{`{ id, reservationId: string, roomNumber: string, items: FolioItem[], payments: PaymentRecord[], subtotal: number, serviceCharge: number, tax: number, grandTotal: number, balance: number }`}</p>

              <p className="text-stone-300 pt-2">COLLECTION: <span className="text-emerald-300">work_orders</span></p>
              <p className="text-stone-400 pl-4">{`{ id, ticketCode: string, title: string, category: WorkOrderCategory, priority: WorkOrderPriority, status: WorkOrderStatus, assignedTechnician: string, partsCost?: number }`}</p>
            </div>
          </div>
        )}

        {/* TAB 6: DESIGN SYSTEM */}
        {activeTab === "DESIGN_SYSTEM" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              6. "Natural Office Elegant" Design System
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#f9f8f5] border border-[#e8e4dc] space-y-1">
                <div className="w-6 h-6 rounded bg-[#f9f8f5] border border-stone-300 mb-1"></div>
                <span className="font-bold text-stone-900 block">Linen Background</span>
                <span className="font-mono text-stone-500 text-[10px]">#f9f8f5</span>
              </div>

              <div className="p-3 rounded-lg bg-[#27523d] text-white border border-[#1e4030] space-y-1">
                <div className="w-6 h-6 rounded bg-[#27523d] border border-emerald-700 mb-1"></div>
                <span className="font-bold text-white block">Deep Sage / Emerald</span>
                <span className="font-mono text-emerald-200 text-[10px]">#27523d</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-[#e4ded4] space-y-1">
                <div className="w-6 h-6 rounded bg-white border border-stone-200 mb-1"></div>
                <span className="font-bold text-stone-900 block">Clean Workspace Surface</span>
                <span className="font-mono text-stone-500 text-[10px]">#ffffff</span>
              </div>

              <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#e8e4dc] space-y-1">
                <div className="w-6 h-6 rounded bg-[#e8e4dc] mb-1"></div>
                <span className="font-bold text-stone-900 block">Muted Structure Border</span>
                <span className="font-mono text-stone-500 text-[10px]">#e8e4dc</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AI STRATEGY */}
        {activeTab === "AI_STRATEGY" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              7. Gemini AI Intelligence Strategy
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <h3 className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-700" /> Gemini 3.7 Flash (High Speed & Structured)
                </h3>
                <p className="text-emerald-900 leading-relaxed">
                  Used for real-time dynamic pricing computations, review sentiment classification, friction-point extraction, and automated shift handover digest generation.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <h3 className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-700" /> Gemini 3.1 Pro Preview (Deep Machine Reasoning)
                </h3>
                <p className="text-emerald-900 leading-relaxed">
                  Applied for complex strategic forecasting, 90-day RevPAR yield simulation, competitor barrier analysis, and multi-year cap-ex asset allocation for hotel ownership.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
