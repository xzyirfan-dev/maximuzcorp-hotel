import React, { useState } from "react";
import { 
  CalendarCheck, 
  Search, 
  Plus, 
  User, 
  CheckCircle, 
  LogOut, 
  FileText, 
  DollarSign, 
  X, 
  Clock, 
  Globe, 
  Smartphone, 
  Building
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { ChannelSource, ReservationStatus, VIPLevel, RoomCategory } from "../../types";

export const ReservationsView: React.FC<{ 
  isNewBookingOpen: boolean; 
  setIsNewBookingOpen: (open: boolean) => void 
}> = ({ isNewBookingOpen, setIsNewBookingOpen }) => {
  const { 
    reservations, 
    rooms, 
    folios, 
    setSelectedFolio, 
    checkInReservation, 
    checkOutReservation, 
    createReservation 
  } = useHotel();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");

  // New Reservation Form State
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("+62 ");
  const [vipLevel, setVipLevel] = useState<VIPLevel>("STANDARD");
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || "");
  const [checkInDate, setCheckInDate] = useState("2026-08-24");
  const [checkOutDate, setCheckOutDate] = useState("2026-08-26");
  const [adults, setAdults] = useState(2);
  const [channel, setChannel] = useState<ChannelSource>("DIRECT_WEB");
  const [deposit, setDeposit] = useState(1000000);
  const [specialRequests, setSpecialRequests] = useState("");

  const targetRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  // Calculate nights
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffDays = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
  const calculatedTotal = (targetRoom?.currentRate || 1450000) * diffDays;

  const handleSubmitNewReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !targetRoom) return;

    createReservation({
      guestId: `gst-${Date.now()}`,
      guestName,
      guestEmail: guestEmail || "guest@hotel-maximuz.com",
      guestPhone,
      vipLevel,
      roomId: targetRoom.id,
      roomNumber: targetRoom.roomNumber,
      category: targetRoom.category,
      checkInDate,
      checkOutDate,
      nights: diffDays,
      adults,
      children: 0,
      channel,
      status: "CONFIRMED",
      totalAmount: calculatedTotal,
      depositPaid: deposit,
      balanceDue: calculatedTotal - deposit,
      specialRequests,
    });

    setIsNewBookingOpen(false);
    // Reset form
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("+62 ");
    setSpecialRequests("");
  };

  const filteredReservations = reservations.filter((res) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || res.guestName.toLowerCase().includes(q) || res.bookingCode.toLowerCase().includes(q) || res.roomNumber.includes(q);
    const matchesStatus = statusFilter === "ALL" || res.status === statusFilter;
    const matchesChannel = channelFilter === "ALL" || res.channel === channelFilter;
    return matchesSearch && matchesStatus && matchesChannel;
  });

  const channelBadges: Record<ChannelSource, { label: string; icon: React.FC<{ className?: string }>; color: string }> = {
    DIRECT_WEB: { label: "Direct Web", icon: Globe, color: "bg-emerald-100 text-emerald-800" },
    BOOKING_COM: { label: "Booking.com", icon: Smartphone, color: "bg-blue-100 text-blue-800" },
    AGODA: { label: "Agoda", icon: Globe, color: "bg-red-100 text-red-800" },
    EXPEDIA: { label: "Expedia", icon: Globe, color: "bg-amber-100 text-amber-800" },
    CORPORATE_MICE: { label: "Corporate MICE", icon: Building, color: "bg-purple-100 text-purple-800" },
    WALK_IN: { label: "Walk-In Direct", icon: User, color: "bg-stone-200 text-stone-800" },
    PHONE_RESERVATION: { label: "Phone Desk", icon: Smartphone, color: "bg-teal-100 text-teal-800" },
  };

  const statusBadges: Record<ReservationStatus, { label: string; bg: string; text: string }> = {
    CONFIRMED: { label: "Confirmed / Due", bg: "bg-amber-100", text: "text-amber-900" },
    CHECKED_IN: { label: "In-House (Checked In)", bg: "bg-emerald-100", text: "text-emerald-950 font-bold" },
    CHECKED_OUT: { label: "Checked Out", bg: "bg-stone-200", text: "text-stone-700" },
    CANCELLED: { label: "Cancelled", bg: "bg-rose-100", text: "text-rose-900" },
    NO_SHOW: { label: "No Show", bg: "bg-rose-200", text: "text-rose-950" },
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Guest Name, Booking Code, Room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f9f8f5] border border-[#ded8cc] rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
            />
          </div>

          {/* Action Trigger */}
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Reservation</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase text-stone-600 mr-1">Status:</span>
            {(["ALL", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === st ? "bg-[#27523d] text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {st === "ALL" ? `All (${reservations.length})` : st.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase text-stone-600">Channel:</span>
            <select
              aria-label="Filter by Channel"
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-[#f5f2ea] border border-[#ded8cc] rounded-md px-2 py-1 text-xs font-medium text-stone-800 focus:outline-hidden"
            >
              <option value="ALL">All OTA & Direct Channels</option>
              <option value="DIRECT_WEB">Direct Web</option>
              <option value="BOOKING_COM">Booking.com</option>
              <option value="AGODA">Agoda</option>
              <option value="EXPEDIA">Expedia</option>
              <option value="CORPORATE_MICE">Corporate MICE</option>
              <option value="WALK_IN">Walk-In</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Master Table */}
      <div className="bg-white rounded-xl border border-[#e4ded4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] border-b border-[#e4ded4] text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Booking / Code</th>
                <th className="p-3.5">Guest & VIP Tier</th>
                <th className="p-3.5">Room Assigned</th>
                <th className="p-3.5">Stay Dates</th>
                <th className="p-3.5">Channel Source</th>
                <th className="p-3.5">Total & Balance</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredReservations.map((res) => {
                const isCheckedIn = res.status === "CHECKED_IN";
                const isConfirmed = res.status === "CONFIRMED";
                const ch = channelBadges[res.channel] || channelBadges.DIRECT_WEB;
                const st = statusBadges[res.status] || statusBadges.CONFIRMED;
                const Icon = ch.icon;
                const folio = folios.find(f => f.reservationId === res.id || f.roomNumber === res.roomNumber);

                return (
                  <tr key={res.id} className="hover:bg-stone-50/80 transition-colors">
                    {/* Booking Code & Date */}
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-emerald-900 block">{res.bookingCode}</span>
                      <span className="text-[10px] text-stone-600 font-mono">{res.createdAt}</span>
                    </td>

                    {/* Guest Name & VIP */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">{res.guestName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                          {res.vipLevel}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-600 block">{res.guestPhone}</span>
                    </td>

                    {/* Room */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-900">
                          #{res.roomNumber}
                        </span>
                        <span className="text-stone-700">{res.category}</span>
                      </div>
                    </td>

                    {/* Stay Dates */}
                    <td className="p-3.5 font-mono text-[11px]">
                      <span className="text-stone-900 block">{res.checkInDate} → {res.checkOutDate}</span>
                      <span className="text-[10px] text-stone-600">{res.nights} Nights • {res.adults} Adults</span>
                    </td>

                    {/* Channel */}
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${ch.color}`}>
                        <Icon className="w-3 h-3" />
                        {ch.label}
                      </span>
                    </td>

                    {/* Amount & Balance */}
                    <td className="p-3.5 font-mono">
                      <span className="font-bold text-stone-900 block">Rp {res.totalAmount.toLocaleString()}</span>
                      {folio ? (
                        <span className={`text-[10px] ${folio.balance > 0 ? "text-amber-800 font-semibold" : "text-emerald-800"}`}>
                          Bal: Rp {folio.balance.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-600">Dep: Rp {res.depositPaid.toLocaleString()}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {folio && (
                        <button
                          onClick={() => setSelectedFolio(folio)}
                          className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors"
                        >
                          Folio
                        </button>
                      )}

                      {isConfirmed && (
                        <button
                          onClick={() => checkInReservation(res.id)}
                          className="px-2.5 py-1 rounded bg-[#27523d] hover:bg-[#1d4030] text-white text-[11px] font-semibold transition-colors"
                        >
                          Check In
                        </button>
                      )}

                      {isCheckedIn && (
                        <button
                          onClick={() => checkOutReservation(res.id)}
                          className="px-2.5 py-1 rounded bg-stone-800 hover:bg-black text-white text-[11px] font-semibold transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE NEW RESERVATION */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#ded8cc] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-[#e8e4dc] bg-[#faf8f5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#27523d] text-white flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">New Guest Reservation</h3>
                  <p className="text-xs text-stone-500">Book room inventory and issue reservation folio</p>
                </div>
              </div>

              <button
                onClick={() => setIsNewBookingOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitNewReservation} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Guest Profile Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  1. Guest Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">Guest Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ir. Budi Wicaksono"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs text-stone-800 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">VIP Tier Status</label>
                    <select
                      value={vipLevel}
                      onChange={(e) => setVipLevel(e.target.value as VIPLevel)}
                      className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs font-semibold text-stone-800 focus:outline-hidden"
                    >
                      <option value="STANDARD">Standard Guest</option>
                      <option value="SILVER">Silver VIP</option>
                      <option value="GOLD">Gold VIP</option>
                      <option value="PLATINUM">Platinum VIP</option>
                      <option value="VVIP">VVIP / Owner Guest</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">Email Address</label>
                    <input
                      type="email"
                      placeholder="budi.w@corporation.id"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs text-stone-800 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">Phone / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs text-stone-800 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Room & Stay Details */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  2. Room & Stay Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">Select Available Room *</label>
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs font-semibold text-stone-800 focus:outline-hidden"
                    >
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          Room #{r.roomNumber} - {r.category} (Fl {r.floor}) • Rp {r.currentRate.toLocaleString()}/night [{r.status.replace(/_/g, " ")}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">Check-In Date</label>
                    <input
                      type="date"
                      required
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs font-mono text-stone-800 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">Check-Out Date</label>
                    <input
                      type="date"
                      required
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs font-mono text-stone-800 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">Booking Channel</label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value as ChannelSource)}
                      className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs text-stone-800 focus:outline-hidden"
                    >
                      <option value="DIRECT_WEB">Direct Hotel Website</option>
                      <option value="BOOKING_COM">Booking.com</option>
                      <option value="AGODA">Agoda</option>
                      <option value="EXPEDIA">Expedia</option>
                      <option value="CORPORATE_MICE">Corporate / MICE Contract</option>
                      <option value="WALK_IN">Walk-In Front Desk</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 uppercase">Deposit Collected (IDR)</label>
                    <input
                      type="number"
                      min={0}
                      step={500000}
                      value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs font-mono text-stone-800 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1 pt-2 border-t border-stone-200">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Special Guest Requests</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Non-smoking room, high floor, anniversary cake setup..."
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2 text-xs text-stone-800 focus:outline-hidden"
                />
              </div>

              {/* Rate Summary Calculation Box */}
              <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ded8cc] font-mono flex items-center justify-between">
                <div>
                  <span className="text-stone-500 text-[11px] block">{diffDays} Night(s) × Rp {(targetRoom?.currentRate || 0).toLocaleString()}</span>
                  <span className="text-stone-900 font-bold text-sm">Total: Rp {calculatedTotal.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-800 text-[11px] block">Deposit: Rp {deposit.toLocaleString()}</span>
                  <span className="text-stone-600 font-semibold text-xs">Bal Due: Rp {(calculatedTotal - deposit).toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Confirm & Create Booking ({diffDays} Nights)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
