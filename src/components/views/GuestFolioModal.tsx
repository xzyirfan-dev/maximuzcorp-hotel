import React, { useState } from "react";
import { 
  X, 
  DollarSign, 
  Plus, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  Printer, 
  User, 
  BedDouble, 
  Receipt,
  Sparkles
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { Folio, FolioCategory, PaymentMethod } from "../../types";

export const GuestFolioModal: React.FC<{ folio: Folio; onClose: () => void }> = ({ folio, onClose }) => {
  const { addFolioItem, addFolioPayment, closeFolio, activeRoleProfile } = useHotel();

  const [activeTab, setActiveTab] = useState<"ITEMS" | "ADD_CHARGE" | "PAYMENT">("ITEMS");

  // Add Charge Form State
  const [chargeDesc, setChargeDesc] = useState("");
  const [chargeCategory, setChargeCategory] = useState<FolioCategory>("FNB");
  const [chargeAmount, setChargeAmount] = useState<number>(150000);

  // Payment Form State
  const [payAmount, setPayAmount] = useState<number>(folio.balance > 0 ? folio.balance : 0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("CREDIT_CARD");
  const [payRef, setPayRef] = useState(`TX-${Math.floor(10000 + Math.random() * 90000)}`);

  const handlePostCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chargeDesc || chargeAmount <= 0) return;
    addFolioItem(folio.id, {
      description: chargeDesc,
      category: chargeCategory,
      amount: chargeAmount,
      postedBy: activeRoleProfile.name,
    });
    setChargeDesc("");
    setChargeAmount(150000);
    setActiveTab("ITEMS");
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    addFolioPayment(folio.id, {
      method: payMethod,
      amount: payAmount,
      referenceNo: payRef,
      processedBy: activeRoleProfile.name,
    });
    setActiveTab("ITEMS");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#ded8cc] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Folio Modal Header */}
        <div className="p-4 border-b border-[#e8e4dc] bg-[#faf8f5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27523d] text-white flex items-center justify-center font-mono font-bold">
              {folio.roomNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">{folio.guestName}</h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  folio.isClosed ? "bg-stone-200 text-stone-700" : folio.balance <= 0 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {folio.isClosed ? "CLOSED" : folio.balance <= 0 ? "SETTLED" : "OPEN BALANCE"}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono">Folio ID: {folio.id} • Room {folio.roomNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReceipt}
              className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 border-b border-[#e8e4dc] bg-[#f7f5f0] flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("ITEMS")}
            className={`py-2.5 px-3 border-b-2 transition-all ${
              activeTab === "ITEMS" ? "border-[#27523d] text-[#27523d] font-bold" : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            Itemized Folio Ledger ({folio.items.length})
          </button>
          <button
            onClick={() => setActiveTab("ADD_CHARGE")}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
              activeTab === "ADD_CHARGE" ? "border-[#27523d] text-[#27523d] font-bold" : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Post New Charge
          </button>
          <button
            onClick={() => setActiveTab("PAYMENT")}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
              activeTab === "PAYMENT" ? "border-[#27523d] text-[#27523d] font-bold" : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Settle Payment
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          {/* TAB 1: ITEMIZED FOLIO LEDGER */}
          {activeTab === "ITEMS" && (
            <div className="space-y-4">
              {/* Itemized Table */}
              <div className="rounded-xl border border-[#e4ded4] overflow-hidden bg-white">
                <table className="w-full text-left">
                  <thead className="bg-[#faf8f5] border-b border-[#e4ded4] text-[11px] font-semibold text-stone-500 uppercase">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Posted By</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {folio.items.map((it) => (
                      <tr key={it.id} className="hover:bg-stone-50/70">
                        <td className="p-2.5 font-mono text-stone-500">{it.date}</td>
                        <td className="p-2.5 font-medium">{it.description}</td>
                        <td className="p-2.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                            {it.category}
                          </span>
                        </td>
                        <td className="p-2.5 text-stone-500">{it.postedBy}</td>
                        <td className="p-2.5 text-right font-mono font-semibold">
                          Rp {it.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payments Recorded */}
              {folio.payments.length > 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-900 block">
                    Recorded Payments
                  </span>
                  <div className="divide-y divide-emerald-100">
                    {folio.payments.map((p) => (
                      <div key={p.id} className="py-1.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-emerald-950">{(p.method || "").replace(/_/g, " ")}</span>
                          <span className="text-[10px] font-mono text-emerald-800">Ref: {p.referenceNo}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-900">
                          - Rp {p.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Totals Breakdown */}
              <div className="bg-[#faf8f5] p-4 rounded-xl border border-[#ded8cc] space-y-1.5 font-mono">
                <div className="flex justify-between text-stone-600 text-xs">
                  <span>Subtotal Net:</span>
                  <span>Rp {folio.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600 text-xs">
                  <span>Service Charge (10%):</span>
                  <span>Rp {folio.serviceCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600 text-xs">
                  <span>Government Tax (11%):</span>
                  <span>Rp {folio.tax.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Grand Total:</span>
                  <span>Rp {folio.grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-800 font-semibold">
                  <span>Total Paid / Deposit:</span>
                  <span>- Rp {folio.totalPaid.toLocaleString()}</span>
                </div>
                <div className={`pt-1 border-t border-stone-200 flex justify-between text-sm font-bold ${folio.balance > 0 ? "text-amber-800" : "text-emerald-900"}`}>
                  <span>Balance Due:</span>
                  <span>Rp {folio.balance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD NEW CHARGE */}
          {activeTab === "ADD_CHARGE" && (
            <form onSubmit={handlePostCharge} className="space-y-4">
              <div className="bg-[#faf8f5] p-3 rounded-lg border border-[#e4ded4] space-y-1">
                <p className="font-semibold text-stone-800">Post Room Charge or Incidentals</p>
                <p className="text-stone-500 text-[11px]">Charges will be added to the guest folio and calculated with standard tax & service.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Charge Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. In-Room Dining Dinner, 90m Balinese Spa, Minibar 2x Beer"
                  value={chargeDesc}
                  onChange={(e) => setChargeDesc(e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Department Category</label>
                  <select
                    value={chargeCategory}
                    onChange={(e) => setChargeCategory(e.target.value as FolioCategory)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  >
                    <option value="ROOM_CHARGE">Room Charge</option>
                    <option value="FNB">Food & Beverage</option>
                    <option value="SPA">Spa & Wellness</option>
                    <option value="MINIBAR">Minibar Consumable</option>
                    <option value="LAUNDRY">Laundry & Dry Cleaning</option>
                    <option value="TRANSPORT">Airport Transfer</option>
                    <option value="MISC">Miscellaneous</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Amount (IDR)</label>
                  <input
                    type="number"
                    min={1000}
                    step={5000}
                    required
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(Number(e.target.value))}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs font-mono text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#27523d] hover:bg-[#1e4030] text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Post Charge to Folio (+Rp {chargeAmount.toLocaleString()})
              </button>
            </form>
          )}

          {/* TAB 3: SETTLE PAYMENT */}
          {activeTab === "PAYMENT" && (
            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-emerald-950">Outstanding Balance</span>
                  <span className="font-mono font-bold text-base text-emerald-900">
                    Rp {folio.balance.toLocaleString()}
                  </span>
                </div>
                <p className="text-emerald-800 text-[11px]">Select payment method and issue payment receipt.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  >
                    <option value="CREDIT_CARD">Credit Card (Visa / Mastercard / Amex)</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="QRIS">QRIS Dynamic</option>
                    <option value="BANK_TRANSFER">Bank Virtual Account</option>
                    <option value="CASH">Cash Reception</option>
                    <option value="CITY_LEDGER">City Ledger Corporate</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Payment Amount</label>
                  <input
                    type="number"
                    min={1}
                    max={folio.balance > 0 ? folio.balance : 999999999}
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs font-mono text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Reference / Auth Code</label>
                <input
                  type="text"
                  required
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs font-mono text-stone-800 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#27523d] hover:bg-[#1e4030] text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Process Payment of Rp {payAmount.toLocaleString()}
              </button>
            </form>
          )}
        </div>

        {/* Folio Modal Footer */}
        <div className="p-4 border-t border-[#e8e4dc] bg-[#faf8f5] flex items-center justify-between">
          {!folio.isClosed && folio.balance <= 0 ? (
            <button
              onClick={() => closeFolio(folio.id)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Close & Settle Folio
            </button>
          ) : (
            <span className="text-stone-500 text-xs">
              {folio.isClosed ? `Closed on ${folio.closedAt || "today"}` : `Pending Balance: Rp ${folio.balance.toLocaleString()}`}
            </span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
