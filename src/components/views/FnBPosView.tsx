import React, { useState } from "react";
import { 
  UtensilsCrossed, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  CreditCard, 
  Building, 
  ShoppingBag,
  Coffee,
  Sparkles,
  Receipt
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { FnbMenuItem } from "../../types";

export const FnBPosView: React.FC = () => {
  const { 
    fnbMenu, 
    fnbOrders, 
    createFnbOrder, 
    updateFnbOrderStatus, 
    rooms, 
    activeRoleProfile 
  } = useHotel();

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [cart, setCart] = useState<{ item: FnbMenuItem; quantity: number }[]>([]);
  const [orderType, setOrderType] = useState<"ROOM_DELIVERY" | "RESTAURANT_TABLE" | "POOL_BAR">("ROOM_DELIVERY");
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(rooms.find(r => r.status === "OCCUPIED")?.roomNumber || "101");
  const [tableNumber, setTableNumber] = useState("Table 04");
  const [paymentOption, setPaymentOption] = useState<"ROOM_FOLIO" | "PAY_NOW">("ROOM_FOLIO");
  const [orderNotes, setOrderNotes] = useState("");

  const occupiedRooms = rooms.filter(r => r.status === "OCCUPIED");

  const categories = [
    { id: "ALL", label: "All Items" },
    { id: "APPETIZER", label: "Appetizers & Tapas" },
    { id: "MAIN_COURSE", label: "Main Courses" },
    { id: "DESSERT", label: "Pastry & Desserts" },
    { id: "BEVERAGE", label: "Coffee & Refreshments" },
    { id: "COCKTAIL_WINE", label: "Cocktails & Cellar" },
  ];

  const filteredMenu = fnbMenu.filter(item => {
    if (categoryFilter !== "ALL" && item.category !== categoryFilter) return false;
    return true;
  });

  const addToCart = (item: FnbMenuItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.item.id === item.id);
      if (existing) {
        return prev.map(p => p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(p => {
          if (p.item.id === itemId) {
            const newQty = p.quantity + delta;
            return newQty > 0 ? { ...p, quantity: newQty } : null;
          }
          return p;
        })
        .filter(Boolean) as { item: FnbMenuItem; quantity: number }[];
    });
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
  const taxAndService = Math.round(subtotal * 0.21); // 10% Service + 11% Tax
  const grandTotal = subtotal + taxAndService;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    createFnbOrder({
      orderType,
      roomNumber: orderType === "ROOM_DELIVERY" ? selectedRoomNumber : undefined,
      tableNumber: orderType !== "ROOM_DELIVERY" ? tableNumber : undefined,
      guestName: orderType === "ROOM_DELIVERY" 
        ? rooms.find(r => r.roomNumber === selectedRoomNumber)?.currentGuestName || "Room Guest"
        : "Restaurant Walk-In",
      items: cart.map(c => ({
        menuItemId: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
        subtotal: c.item.price * c.quantity,
      })),
      subtotal,
      taxAndService,
      totalAmount: grandTotal,
      status: "PLACED",
      chargedToFolio: paymentOption === "ROOM_FOLIO",
      serverStaff: activeRoleProfile.name,
      notes: orderNotes,
    });

    clearCart();
    setOrderNotes("");
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#27523d] text-white flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Maximuz Culinary & In-Room Dining POS</h2>
            <p className="text-xs text-stone-500">Live order builder with instant guest folio billing</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                categoryFilter === c.id ? "bg-[#27523d] text-white font-semibold" : "bg-[#f5f2ea] text-stone-700 hover:bg-[#eae5da]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: 2 Cols Menu / Active Orders + 1 Col Live Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Menu Items Grid & Active Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Menu Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredMenu.map(item => (
              <div 
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white p-3.5 rounded-xl border border-[#e4ded4] shadow-xs hover:border-emerald-700/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                      {(item.category || "").replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      ⏱ {item.prepTimeMinutes}m
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-stone-900 mt-2">{item.name}</h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-snug">{item.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-stone-900">
                    Rp {item.price.toLocaleString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="p-1 rounded-md bg-emerald-50 text-emerald-800 hover:bg-[#27523d] hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Active Kitchen & Service Queue */}
          <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Active Kitchen & In-Room Orders ({fnbOrders.length})
              </h3>
              <span className="text-[10px] font-mono text-stone-400">Live POS Dispatch</span>
            </div>

            <div className="space-y-2">
              {fnbOrders.map(order => {
                const statusColors: Record<string, string> = {
                  PLACED: "bg-amber-100 text-amber-900",
                  PREPARING: "bg-blue-100 text-blue-900 font-semibold",
                  IN_DELIVERY: "bg-purple-100 text-purple-900",
                  SERVED: "bg-emerald-100 text-emerald-950 font-bold",
                  CANCELLED: "bg-rose-100 text-rose-900",
                };

                return (
                  <div key={order.id} className="p-3 rounded-lg bg-[#faf8f5] border border-[#e8e4dc] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-900">{order.orderCode}</span>
                        <span className="font-semibold text-stone-900">
                          {order.orderType === "ROOM_DELIVERY" ? `Room #${order.roomNumber}` : order.tableNumber}
                        </span>
                        <span className="text-stone-500">({order.guestName})</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="font-mono font-bold text-stone-800">
                        Rp {order.totalAmount.toLocaleString()}
                      </span>
                      <select
                        aria-label="Order Status"
                        value={order.status}
                        onChange={(e) => updateFnbOrderStatus(order.id, e.target.value as any)}
                        className={`text-[10px] font-mono uppercase font-bold px-2 py-1 rounded border-0 cursor-pointer focus:outline-hidden ${statusColors[order.status]}`}
                      >
                        <option value="PLACED">Placed</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="IN_DELIVERY">In Delivery</option>
                        <option value="SERVED">Served</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live POS Order Cart */}
        <div className="bg-white rounded-xl border border-[#e4ded4] shadow-xs p-4 flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-800" />
                <h3 className="text-xs font-bold text-stone-900">Current Order Ticket</h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] text-rose-600 hover:underline flex items-center gap-0.5"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Destination Selector */}
            <div className="space-y-2 mb-3 bg-[#faf8f5] p-2.5 rounded-lg border border-[#ded8cc] text-xs">
              <label className="text-[10px] font-bold text-stone-600 uppercase block">Order Destination</label>
              <div className="flex gap-1.5">
                {(["ROOM_DELIVERY", "RESTAURANT_TABLE", "POOL_BAR"] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`flex-1 py-1 rounded text-[10px] font-semibold border ${
                      orderType === type ? "bg-[#27523d] text-white border-[#1d4030]" : "bg-white text-stone-700 border-stone-200"
                    }`}
                  >
                    {type === "ROOM_DELIVERY" ? "Room" : type === "RESTAURANT_TABLE" ? "Table" : "Bar"}
                  </button>
                ))}
              </div>

              {orderType === "ROOM_DELIVERY" ? (
                <div className="space-y-1 mt-2">
                  <span className="text-[10px] text-stone-500">Deliver to Occupied Room:</span>
                  <select
                    aria-label="Deliver to Occupied Room"
                    value={selectedRoomNumber}
                    onChange={(e) => setSelectedRoomNumber(e.target.value)}
                    className="w-full bg-white border border-[#ded8cc] rounded p-1.5 text-xs font-bold text-stone-900 focus:outline-hidden"
                  >
                    {occupiedRooms.map(r => (
                      <option key={r.id} value={r.roomNumber}>
                        Room #{r.roomNumber} - {r.currentGuestName} ({r.category})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Table 12 / Sunbed 04"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded p-1.5 text-xs text-stone-800 focus:outline-hidden mt-1"
                />
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 divide-y divide-stone-100 text-xs">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-stone-400">
                  <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Order ticket is empty</p>
                  <p className="text-[10px]">Click any item on menu to add</p>
                </div>
              ) : (
                cart.map(c => (
                  <div key={c.item.id} className="pt-2 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-stone-800">{c.item.name}</p>
                      <p className="text-[10px] font-mono text-stone-500">
                        Rp {c.item.price.toLocaleString()} × {c.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(c.item.id, -1)}
                        className="w-5 h-5 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center font-mono font-bold">{c.quantity}</span>
                      <button
                        onClick={() => updateQuantity(c.item.id, 1)}
                        className="w-5 h-5 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart Bottom Financials & Dispatch Button */}
          <div className="mt-4 pt-3 border-t border-stone-200 space-y-2 text-xs">
            <div className="space-y-1 font-mono text-[11px] text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Service (21%):</span>
                <span>Rp {taxAndService.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-sm pt-1 border-t border-stone-100">
                <span>Grand Total:</span>
                <span>Rp {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Billing Method */}
            <div className="pt-1">
              <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">Billing Destination</label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentOption("ROOM_FOLIO")}
                  className={`flex-1 py-1.5 rounded text-[10px] font-semibold border ${
                    paymentOption === "ROOM_FOLIO" ? "bg-[#27523d] text-white border-[#1d4030]" : "bg-stone-100 text-stone-700 border-stone-200"
                  }`}
                >
                  Post to Room Folio
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentOption("PAY_NOW")}
                  className={`flex-1 py-1.5 rounded text-[10px] font-semibold border ${
                    paymentOption === "PAY_NOW" ? "bg-[#27523d] text-white border-[#1d4030]" : "bg-stone-100 text-stone-700 border-stone-200"
                  }`}
                >
                  Pay Direct
                </button>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
              className="w-full py-2.5 bg-[#27523d] hover:bg-[#1d4030] disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
            >
              Dispatch Order to Kitchen (Rp {grandTotal.toLocaleString()})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
