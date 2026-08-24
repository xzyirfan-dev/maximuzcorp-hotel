import React, { useState } from "react";
import { 
  MessageSquare, 
  Send, 
  AlertCircle, 
  Hash, 
  Users, 
  BookOpen, 
  Plus, 
  Clock, 
  CheckCircle, 
  X,
  FileText
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { DepartmentChannel, ShiftType } from "../../types";

export const DepartmentCommsView: React.FC = () => {
  const { 
    departmentMessages, 
    sendDepartmentMessage, 
    shiftLogs, 
    addShiftLog, 
    activeRoleProfile 
  } = useHotel();

  const [activeTab, setActiveTab] = useState<"CHAT" | "HANDOVER">("CHAT");
  const [activeChannel, setActiveChannel] = useState<string>("GENERAL_OPS");
  const [messageInput, setMessageInput] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  // New Handover State
  const [isNewHandoverOpen, setIsNewHandoverOpen] = useState(false);
  const [shiftType, setShiftType] = useState<string>("Evening (15:00-23:00)");
  const [keyNotes, setKeyNotes] = useState("");
  const [pending1, setPending1] = useState("");
  const [pending2, setPending2] = useState("");

  const channels: { id: string; name: string; desc: string }[] = [
    { id: "GENERAL_OPS", name: "general-ops", desc: "Hotel-wide operational announcements & daily briefing" },
    { id: "FRONT_OFFICE", name: "front-office", desc: "Arrivals, departures, VIPs, keycard & room transfers" },
    { id: "HOUSEKEEPING", name: "housekeeping", desc: "Turnaround priorities, linen requisitions & inspections" },
    { id: "ENGINEERING", name: "engineering", desc: "Emergency maintenance, HVAC, water & facility repairs" },
    { id: "F_AND_B", name: "f-and-b", desc: "Restaurant seating, in-room dining rush & banquet prep" },
    { id: "EXECUTIVE_MGMT", name: "executive-mgmt", desc: "GM directives, ADR targets, VIP protocol & financials" },
  ];

  const currentChannelInfo = channels.find(c => c.id === activeChannel) || channels[0];
  const channelMessages = departmentMessages.filter(m => m.channel === activeChannel);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendDepartmentMessage({
      senderName: activeRoleProfile.name,
      senderRole: activeRoleProfile.title,
      channel: activeChannel,
      message: messageInput.trim(),
      isUrgent,
    });

    setMessageInput("");
    setIsUrgent(false);
  };

  const handleCreateHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyNotes) return;

    const pendingList: string[] = [];
    if (pending1) pendingList.push(pending1);
    if (pending2) pendingList.push(pending2);

    addShiftLog({
      shift: shiftType as any,
      dutyManager: activeRoleProfile.name,
      department: activeRoleProfile.department,
      keyNotes,
      pendingActions: pendingList.length > 0 ? pendingList : ["Monitor late arrivals and VIP turndown service"],
    });

    setIsNewHandoverOpen(false);
    setKeyNotes("");
    setPending1("");
    setPending2("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Tab Switcher */}
      <div className="bg-white p-3 rounded-xl border border-[#e4ded4] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("CHAT")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "CHAT" ? "bg-[#27523d] text-white shadow-xs" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Department Channels (Slack-Style)
          </button>
          <button
            onClick={() => setActiveTab("HANDOVER")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "HANDOVER" ? "bg-[#27523d] text-white shadow-xs" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Shift Handover Digital Logbook ({shiftLogs.length})
          </button>
        </div>

        {activeTab === "HANDOVER" && (
          <button
            onClick={() => setIsNewHandoverOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Log Shift Handover
          </button>
        )}
      </div>

      {/* TAB 1: SLACK-LIKE CHAT HUBS */}
      {activeTab === "CHAT" && (
        <div className="bg-white rounded-xl border border-[#e4ded4] shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[550px]">
          {/* Channels Sidebar */}
          <div className="p-3 border-r border-[#e8e4dc] bg-[#faf8f5] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-2 block mb-2">
              Department Feeds
            </span>
            {channels.map((ch) => {
              const count = departmentMessages.filter(m => m.channel === ch.id).length;
              const isActive = activeChannel === ch.id;

              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive ? "bg-[#27523d] text-white font-semibold shadow-xs" : "text-stone-700 hover:bg-[#ece8df]"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Hash className={`w-3.5 h-3.5 ${isActive ? "text-emerald-200" : "text-stone-400"}`} />
                    <span className="truncate">{ch.name}</span>
                  </div>
                  {count > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-emerald-900 text-emerald-100" : "bg-stone-200 text-stone-700"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Chat Messages Feed & Input (3 Cols) */}
          <div className="md:col-span-3 flex flex-col justify-between h-full bg-white">
            {/* Channel Top Header */}
            <div className="p-3.5 border-b border-[#e8e4dc] bg-[#fdfcfb] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-800" />
                <div>
                  <h3 className="text-xs font-bold text-stone-900">#{currentChannelInfo.name}</h3>
                  <p className="text-[11px] text-stone-500">{currentChannelInfo.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                {channelMessages.length} Messages
              </span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
              {channelMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                    msg.isUrgent
                      ? "bg-rose-50/80 border-rose-200"
                      : "bg-[#faf8f5] border-[#e8e4dc]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{msg.senderName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 font-medium">
                        {msg.senderRole}
                      </span>
                      {msg.isUrgent && (
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-rose-600 text-white animate-pulse">
                          Urgent Broadcast
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-stone-800 leading-relaxed pt-0.5">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#e8e4dc] bg-[#faf8f5] space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Message #${currentChannelInfo.name} as ${activeRoleProfile.name}...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-white border border-[#ded8cc] rounded-lg px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden"
                />

                <button
                  type="button"
                  onClick={() => setIsUrgent(!isUrgent)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 ${
                    isUrgent ? "bg-rose-600 text-white border-rose-700" : "bg-white text-stone-600 border-stone-300 hover:bg-stone-100"
                  }`}
                  title="Flag as urgent broadcast"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Urgent</span>
                </button>

                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SHIFT HANDOVER LOGBOOK */}
      {activeTab === "HANDOVER" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shiftLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl border border-[#e4ded4] shadow-xs p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                      {(log.shift || "").replace(/_/g, " ")}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 mt-1">Duty Manager: {log.dutyManager} ({log.department || "Hotel Ops"})</h4>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">{log.date}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#faf8f5] p-2.5 rounded-lg text-center text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block">Department</span>
                    <span className="font-bold font-mono text-stone-900 truncate block">{log.department || "Operations"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block">Log Status</span>
                    <span className={`font-bold font-mono text-[11px] ${log.isAcknowledged ? "text-emerald-800" : "text-amber-800"}`}>
                      {log.isAcknowledged ? "✓ Signed Off" : "Pending Signoff"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block">Signed By</span>
                    <span className="font-bold font-mono text-stone-700 text-[11px] truncate block">{log.acknowledgedBy || "On Duty GM"}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase text-stone-500">Executive Notes & Briefing:</span>
                  <p className="text-stone-700 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-100 italic">
                    "{log.keyNotes}"
                  </p>
                </div>

                <div className="space-y-1 text-xs pt-1 border-t border-stone-100">
                  <span className="text-[10px] font-bold uppercase text-stone-500">Action Items for Next Shift:</span>
                  {log.pendingActions.map((act, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-stone-800 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE SHIFT HANDOVER */}
      {isNewHandoverOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#ded8cc] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#e8e4dc] bg-[#faf8f5] flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Sign Off & Submit Shift Handover</h3>
              <button 
                onClick={() => setIsNewHandoverOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHandover} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Shift Timing</label>
                  <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value as ShiftType)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  >
                    <option value="MORNING_SHIFT">Morning Shift (07:00 - 15:30)</option>
                    <option value="EVENING_SHIFT">Evening Shift (15:00 - 23:30)</option>
                    <option value="NIGHT_SHIFT">Night Shift (23:00 - 07:30)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Signing Duty Manager</label>
                  <input
                    type="text"
                    disabled
                    value={activeRoleProfile.name}
                    className="w-full bg-stone-100 border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Executive Handover Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize key events, VIP movements, incidents, and hotel status..."
                  value={keyNotes}
                  onChange={(e) => setKeyNotes(e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Follow-up Tasks for Next Shift</label>
                <input
                  type="text"
                  placeholder="Task 1: e.g. Inspect Suite 402 for Minister arrival at 8 PM"
                  value={pending1}
                  onChange={(e) => setPending1(e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs text-stone-800 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="Task 2: e.g. Follow up on HVAC chiller spare parts delivery"
                  value={pending2}
                  onChange={(e) => setPending2(e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs text-stone-800 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Sign Off & Record Handover
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
