import React, { useState } from "react";
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  X, 
  DollarSign, 
  ShieldAlert,
  Flame,
  Droplets,
  Zap,
  Wifi
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { WorkOrderPriority, WorkOrderStatus, WorkOrderCategory } from "../../types";

export const MaintenanceView: React.FC = () => {
  const { 
    workOrders, 
    updateWorkOrder, 
    createWorkOrder, 
    staff,
    activeRoleProfile
  } = useHotel();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [resolvingTicket, setResolvingTicket] = useState<typeof workOrders[0] | null>(null);

  // New Work Order State
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<WorkOrderCategory>("HVAC_AIR_CONDITIONING");
  const [priority, setPriority] = useState<WorkOrderPriority>("MEDIUM");
  const [assignedTech, setAssignedTech] = useState("Budi Santoso");
  const [description, setDescription] = useState("");

  // Resolve Ticket State
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [partsCost, setPartsCost] = useState(0);

  const engStaff = staff.filter(s => s.department === "Engineering");

  const filteredTickets = workOrders.filter(w => {
    if (statusFilter !== "ALL" && w.status !== statusFilter) return false;
    if (priorityFilter !== "ALL" && w.priority !== priorityFilter) return false;
    return true;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    createWorkOrder({
      title,
      location,
      category,
      priority,
      status: "OPEN",
      reportedBy: activeRoleProfile.name,
      assignedTechnician: assignedTech,
      description,
    });

    setIsNewTicketOpen(false);
    setTitle("");
    setLocation("");
    setDescription("");
  };

  const handleResolveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTicket) return;

    updateWorkOrder(resolvingTicket.id, "RESOLVED", resolutionNotes);
    setResolvingTicket(null);
    setResolutionNotes("");
    setPartsCost(0);
  };

  const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    HVAC_AIR_CONDITIONING: Flame,
    HVAC_AC: Flame,
    PLUMBING: Droplets,
    ELECTRICAL: Zap,
    CARPENTRY: Wrench,
    FURNITURE_FIXTURE: Wrench,
    AV_ELECTRONICS: Wifi,
    ELECTRONICS_SMARTLOCK: Wifi,
    SAFETY: ShieldAlert,
    SPA_POOL: Droplets,
    CIVIL_STRUCTURAL: Wrench,
    KITCHEN_EQUIPMENT: Flame,
  };

  const priorityBadges: Record<WorkOrderPriority, { bg: string; text: string; border: string }> = {
    CRITICAL_URGENT: { bg: "bg-rose-100", text: "text-rose-900 font-bold", border: "border-rose-300" },
    HIGH: { bg: "bg-amber-100", text: "text-amber-900 font-semibold", border: "border-amber-300" },
    MEDIUM: { bg: "bg-blue-50", text: "text-blue-900", border: "border-blue-200" },
    LOW: { bg: "bg-stone-100", text: "text-stone-700", border: "border-stone-200" },
  };

  const statusBadges: Record<string, { bg: string; text: string }> = {
    OPEN: { bg: "bg-amber-100", text: "text-amber-900" },
    IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-900 font-semibold" },
    ON_HOLD: { bg: "bg-purple-100", text: "text-purple-900" },
    WAITING_PARTS: { bg: "bg-purple-100", text: "text-purple-900" },
    RESOLVED: { bg: "bg-emerald-100", text: "text-emerald-950 font-bold" },
    CLOSED: { bg: "bg-stone-200", text: "text-stone-700" },
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-bold uppercase text-stone-500 mr-1">Status:</span>
          {(["ALL", "OPEN", "IN_PROGRESS", "WAITING_PARTS", "RESOLVED"] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === st ? "bg-[#27523d] text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsNewTicketOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Work Order Ticket</span>
        </button>
      </div>

      {/* Work Orders List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map(ticket => {
          const Icon = categoryIcons[ticket.category] || Wrench;
          const p = priorityBadges[ticket.priority];
          const st = statusBadges[ticket.status];
          const isResolved = ticket.status === "RESOLVED";

          return (
            <div 
              key={ticket.id}
              className={`bg-white rounded-xl border p-4 flex flex-col justify-between shadow-xs hover:border-emerald-700/40 transition-colors ${
                ticket.priority === "CRITICAL_URGENT" && !isResolved ? "border-rose-300 bg-rose-50/20" : "border-[#e4ded4]"
              }`}
            >
              <div>
                {/* Header: Ticket Code, Priority */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-stone-500">
                    {ticket.ticketCode}
                  </span>
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full border ${p.bg} ${p.text} ${p.border}`}>
                    {(ticket.priority || "").replace(/_/g, " ")}
                  </span>
                </div>

                {/* Title & Category */}
                <div className="flex items-start gap-2.5 mt-2.5">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 leading-snug">{ticket.title}</h4>
                    <p className="text-[11px] text-stone-500 font-medium">{ticket.location} • {(ticket.category || "").replace(/_/g, " ")}</p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed bg-[#fbf9f5] p-2 rounded-lg border border-stone-100">
                  {ticket.description}
                </p>

                {ticket.resolutionNotes && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Resolution Report</span>
                    <p>{ticket.resolutionNotes}</p>
                    {ticket.partsCost ? (
                      <span className="text-[10px] font-mono text-emerald-800 block mt-0.5">
                        Spare Parts: Rp {ticket.partsCost.toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Footer: Technician & Action */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-600 uppercase block">Tech:</span>
                  <span className="font-semibold text-stone-800">{ticket.assignedTechnician}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${st.bg} ${st.text}`}>
                    {st.text.includes("bold") ? "✓ " : ""}{(ticket.status || "").replace(/_/g, " ")}
                  </span>

                  {!isResolved && (
                    <button
                      onClick={() => setResolvingTicket(ticket)}
                      className="px-2.5 py-1 bg-[#27523d] hover:bg-[#1d4030] text-white rounded text-[11px] font-semibold transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: CREATE NEW WORK ORDER */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#ded8cc] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#e8e4dc] bg-[#faf8f5] flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Log Engineering Work Order</h3>
              <button 
                onClick={() => setIsNewTicketOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bedroom AC Leaking Water"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Location / Room *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 204 or Spa Jacuzzi"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WorkOrderCategory)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  >
                    <option value="HVAC_AC">HVAC & Air Conditioning</option>
                    <option value="PLUMBING">Plumbing & Water Heater</option>
                    <option value="ELECTRICAL">Electrical & Lighting</option>
                    <option value="FURNITURE_FIXTURE">Furniture & Fixture</option>
                    <option value="ELECTRONICS_SMARTLOCK">Smart Locks & IPTV</option>
                    <option value="SPA_POOL">Infinity Pool & Spa</option>
                    <option value="KITCHEN_EQUIPMENT">Commercial Kitchen F&B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as WorkOrderPriority)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs font-semibold text-stone-800 focus:outline-hidden"
                  >
                    <option value="CRITICAL_URGENT">Critical Urgent (Affects Guest)</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low / Preventative</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Assigned Technician</label>
                  <select
                    value={assignedTech}
                    onChange={(e) => setAssignedTech(e.target.value)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  >
                    {engStaff.map(s => (
                      <option key={s.id} value={s.fullName}>{s.fullName} ({s.shift})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the malfunction, symptoms, and tools needed..."
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Submit Work Order Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESOLVE WORK ORDER */}
      {resolvingTicket && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#ded8cc] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#e8e4dc] bg-[#faf8f5] flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Resolve Work Order: {resolvingTicket.ticketCode}</h3>
              <button 
                onClick={() => setResolvingTicket(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveTicket} className="p-5 space-y-4 text-xs">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <p className="font-bold text-stone-900">{resolvingTicket.title}</p>
                <p className="text-stone-600 text-[11px]">{resolvingTicket.location} • Tech: {resolvingTicket.assignedTechnician}</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Technician Resolution Report *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain actions taken (e.g. Replaced thermistor sensor, tested drain line flow)..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Spare Parts / Consumable Cost (IDR)</label>
                <input
                  type="number"
                  min={0}
                  step={25000}
                  value={partsCost}
                  onChange={(e) => setPartsCost(Number(e.target.value))}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs font-mono text-stone-800 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Mark Ticket as Resolved
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
