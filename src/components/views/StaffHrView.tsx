import React, { useState } from "react";
import { 
  Users, 
  Clock, 
  Award, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Search,
  Plus
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";

export const StaffHrView: React.FC = () => {
  const { staff } = useHotel();

  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const departments = [
    "ALL",
    "Executive Management",
    "Front Office",
    "Housekeeping",
    "Engineering",
    "Food & Beverage",
    "Finance & Accounting",
    "Sales & Marketing",
    "Human Resources"
  ];

  const filteredStaff = staff.filter(s => {
    const matchesDept = deptFilter === "ALL" || s.department === deptFilter;
    const matchesSearch = !searchQuery || s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase">
              Human Capital Module
            </span>
            <span className="text-xs text-stone-500 font-mono">Headcount: {staff.length} Active</span>
          </div>
          <h2 className="text-sm font-bold text-stone-900 mt-1">Staff Directory, Duty Rosters & Performance</h2>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f9f8f5] border border-[#ded8cc] rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 text-xs">
        {departments.map(d => (
          <button
            key={d}
            onClick={() => setDeptFilter(d)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              deptFilter === d ? "bg-[#27523d] text-white font-semibold" : "bg-white border border-[#e4ded4] text-stone-700 hover:bg-stone-100"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(member => (
          <div 
            key={member.id}
            className="bg-white rounded-xl border border-[#e4ded4] shadow-xs p-4 flex flex-col justify-between space-y-3 hover:border-emerald-700/40 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#f4f1ea] border border-[#e2ded4] flex items-center justify-center font-bold text-stone-800 text-sm">
                    {member.fullName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">{member.fullName}</h3>
                    <p className="text-[11px] text-stone-600 font-medium">{member.title}</p>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                      {member.department}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                  member.status === "ACTIVE_ON_DUTY" ? "bg-emerald-100 text-emerald-900" : "bg-stone-100 text-stone-600"
                }`}>
                  {member.status === "ACTIVE_ON_DUTY" ? "On Duty" : "Off Duty"}
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 space-y-1 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>

            {/* Performance Rating & Shift */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-emerald-800" /> {member.shift} Shift
              </span>
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600" /> {member.performanceRating} / 5.0
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
