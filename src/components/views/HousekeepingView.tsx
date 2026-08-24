import React, { useState } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Plus, 
  Layers, 
  CheckSquare, 
  Square,
  Bed,
  Bath,
  Coffee
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { HousekeepingTaskStatus, HousekeepingTaskType } from "../../types";

export const HousekeepingView: React.FC = () => {
  const { 
    housekeepingTasks, 
    updateHousekeepingTask, 
    createHousekeepingTask, 
    rooms, 
    staff 
  } = useHotel();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedTask, setSelectedTask] = useState<typeof housekeepingTasks[0] | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // New task form state
  const [targetRoomId, setTargetRoomId] = useState(rooms[0]?.id || "");
  const [taskType, setTaskType] = useState<HousekeepingTaskType>("CHECKOUT_TURNOVER");
  const [assignedStaff, setAssignedStaff] = useState(staff.find(s => s.department === "Housekeeping")?.fullName || "Wayan Sujana");
  const [priority, setPriority] = useState<"NORMAL" | "HIGH" | "URGENT">("NORMAL");
  const [notes, setNotes] = useState("");

  const hkStaff = staff.filter(s => s.department === "Housekeeping");
  const dirtyRooms = rooms.filter(r => r.status === "VACANT_DIRTY" || r.status === "IN_PROGRESS");
  const cleanRooms = rooms.filter(r => r.status === "VACANT_CLEAN");
  const inspectedRooms = rooms.filter(r => r.status === "VACANT_INSPECTED");

  const filteredTasks = housekeepingTasks.filter(t => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const r = rooms.find(room => room.id === targetRoomId);
    if (!r) return;

    createHousekeepingTask({
      roomId: r.id,
      roomNumber: r.roomNumber,
      taskType: taskType,
      status: "PENDING",
      assignedTo: assignedStaff,
      priority: priority === "URGENT" ? "URGENT" : priority === "HIGH" ? "HIGH" : "NORMAL",
      notes: notes || `${taskType.replace(/_/g, " ")} scheduled`,
      checklist: [
        { item: "Strip soiled bed linens and pillowcases", completed: false },
        { item: "Fit fresh 400TC Egyptian cotton bed set", completed: false },
        { item: "Scrub shower glass, disinfect toilet & bathtub", completed: false },
        { item: "Restock luxury bath amenities & fresh towels", completed: false },
        { item: "Vacuum carpet, dust surfaces & wipe glass", completed: false },
        { item: "Replenish complimentary Nespresso pods & minibar", completed: false },
        { item: "Check AC setting to standard 22°C", completed: false },
      ],
    });

    setIsNewTaskOpen(false);
    setNotes("");
  };

  const handleToggleChecklist = (taskIndex: number, itemIndex: number) => {
    const task = housekeepingTasks[taskIndex];
    if (!task) return;

    const newChecklist = [...task.checklist];
    newChecklist[itemIndex].completed = !newChecklist[itemIndex].completed;

    const allDone = newChecklist.every(c => c.completed);
    const newStatus: HousekeepingTaskStatus = allDone ? "COMPLETED" : "IN_PROGRESS";

    updateHousekeepingTask(task.id, newStatus, newChecklist);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header & Turnaround Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs">
          <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">Rooms Needing Turnaround</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-amber-900">{dirtyRooms.length}</span>
            <span className="text-xs text-stone-500">Avg Turnover: 32 min</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs">
          <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">Clean & Pending Inspection</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-800">{cleanRooms.length}</span>
            <span className="text-xs text-stone-500">Supervisor queue</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs">
          <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">Inspected & Ready</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-950">{inspectedRooms.length}</span>
            <span className="text-xs text-emerald-700 font-semibold">Ready for Check-In</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">On-Duty Housekeepers</span>
            <p className="text-base font-bold font-mono text-stone-900 mt-1">{hkStaff.length} Staff</p>
          </div>
          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="p-2.5 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg transition-colors shadow-xs"
            title="Dispatch Task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main HK Task Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Task Cards & Filter */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase text-stone-500 mr-1">Status:</span>
              {(["ALL", "PENDING", "IN_PROGRESS", "COMPLETED", "VERIFIED"] as const).map((st) => (
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
              onClick={() => setIsNewTaskOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Dispatch Task
            </button>
          </div>

          <div className="space-y-3">
            {filteredTasks.map((task, idx) => {
              const completedCount = task.checklist.filter(c => c.completed).length;
              const totalItems = task.checklist.length;
              const percent = Math.round((completedCount / totalItems) * 100);

              const statusStyles: Record<HousekeepingTaskStatus, { bg: string; text: string }> = {
                PENDING: { bg: "bg-stone-100", text: "text-stone-700" },
                IN_PROGRESS: { bg: "bg-amber-100", text: "text-amber-900" },
                COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-900" },
                VERIFIED: { bg: "bg-emerald-200", text: "text-emerald-950 font-bold" },
              };

              return (
                <div 
                  key={task.id}
                  className="bg-white rounded-xl border border-[#e4ded4] shadow-xs p-4 space-y-3 hover:border-emerald-700/40 transition-colors"
                >
                  {/* Task Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold bg-stone-100 px-2 py-0.5 rounded text-stone-900">
                        Room #{task.roomNumber}
                      </span>
                      <span className="font-semibold text-xs text-stone-900">
                        {(task.taskType || (task as any).type || "").replace(/_/g, " ")}
                      </span>
                      {task.priority === "URGENT" && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                          Urgent VIP
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${statusStyles[task.status].bg} ${statusStyles[task.status].text}`}>
                        {task.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 italic">"{task.notes}"</p>

                  {/* Checklist Items */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-100">
                    <div className="flex justify-between items-center text-[11px] text-stone-500 font-medium">
                      <span>Inspection Protocol Checklist</span>
                      <span className="font-mono">{completedCount}/{totalItems} ({percent}%)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {task.checklist.map((item, itemIdx) => (
                        <button
                          key={itemIdx}
                          type="button"
                          onClick={() => handleToggleChecklist(idx, itemIdx)}
                          className={`flex items-center gap-2 p-1.5 rounded text-left transition-colors text-xs ${
                            item.completed ? "bg-emerald-50 text-emerald-900 line-through opacity-80" : "bg-stone-50 text-stone-800 hover:bg-stone-100"
                          }`}
                        >
                          {item.completed ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          )}
                          <span className="truncate">{item.item || (item as any).label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Task Card Footer */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-stone-400" /> Assigned: <strong className="text-stone-800">{task.assignedTo}</strong>
                    </span>

                    {task.status === "COMPLETED" && (
                      <button
                        onClick={() => updateHousekeepingTask(task.id, "VERIFIED", task.checklist)}
                        className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Verify & Mark Ready
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Turnaround SOP & Linen Par Stock */}
        <div className="space-y-4">
          <div className="bg-[#faf8f5] p-4 rounded-xl border border-[#ded8cc] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              5-Star Housekeeping Standard SOP
            </h3>
            <ul className="text-xs text-stone-600 space-y-2">
              <li className="flex items-start gap-2">
                <Bed className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <span><strong>Triple Sheeting:</strong> Bed linen must be taut with hospital corners; duvet centered.</span>
              </li>
              <li className="flex items-start gap-2">
                <Bath className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <span><strong>Sanitization:</strong> All chrome fixtures polished with micro-fiber; seals sanitized.</span>
              </li>
              <li className="flex items-start gap-2">
                <Coffee className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <span><strong>VIP Setup:</strong> 2x Acqua Panna water bottles, welcome fruit basket, turndown chocolate.</span>
              </li>
            </ul>
          </div>

          {/* Quick Linen & Amenities Status */}
          <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-stone-900">Floor Linen Pantry Par Levels</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>King Bed Linen (400TC)</span>
                  <span className="font-mono font-bold text-emerald-900">85% (170/200 sets)</span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#27523d] h-full" style={{ width: "85%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Bath Towels & Robes</span>
                  <span className="font-mono font-bold text-emerald-900">92% (230/250 sets)</span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#27523d] h-full" style={{ width: "92%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Sensatia Botanicals Amenity Kits</span>
                  <span className="font-mono font-bold text-amber-800">45% (90/200 sets - Reorder)</span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: "45%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: DISPATCH NEW HK TASK */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#ded8cc] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#e8e4dc] bg-[#faf8f5] flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Dispatch Housekeeping Task</h3>
              <button 
                onClick={() => setIsNewTaskOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Target Room</label>
                <select
                  value={targetRoomId}
                  onChange={(e) => setTargetRoomId(e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs font-semibold text-stone-800 focus:outline-hidden"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      Room #{r.roomNumber} - {r.category} ({r.status.replace(/_/g, " ")})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as HousekeepingTaskType)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  >
                    <option value="FULL_TURNOVER">Full Turnover (Check-Out)</option>
                    <option value="STAYOVER_CLEAN">Daily Stayover Clean</option>
                    <option value="TURNDOWN_SERVICE">VIP Evening Turndown</option>
                    <option value="DEEP_CLEAN">Quarterly Deep Clean</option>
                    <option value="INSPECTION">Supervisor Pre-Arrival Inspection</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Assigned Housekeeper</label>
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  >
                    {hkStaff.map(s => (
                      <option key={s.id} value={s.fullName}>{s.fullName} ({s.shift})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Priority Level</label>
                <div className="flex gap-2">
                  {(["NORMAL", "HIGH", "URGENT"] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 rounded text-xs font-semibold border ${
                        priority === p ? "bg-[#27523d] text-white border-[#1d4030]" : "bg-white text-stone-700 border-stone-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Notes & Special Instructions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. VIP guest checking in at 2 PM, prepare extra feather pillows..."
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs text-stone-800 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Dispatch Task to Housekeeper
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
