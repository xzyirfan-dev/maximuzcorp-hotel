import React, { useState } from "react";
import { 
  Boxes, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  TrendingDown, 
  Package, 
  ArrowUpRight, 
  FileText,
  DollarSign
} from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { InventoryCategory } from "../../types";

export const InventoryView: React.FC = () => {
  const { 
    inventory, 
    updateInventoryQuantity, 
    addInventoryItem 
  } = useHotel();

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);

  // New Item State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<InventoryCategory>("GUEST_AMENITY");
  const [currentStock, setCurrentStock] = useState(100);
  const [parLevel, setParLevel] = useState(200);
  const [reorderThreshold, setReorderThreshold] = useState(50);
  const [unit, setUnit] = useState("pieces");
  const [unitCost, setUnitCost] = useState(15000);
  const [supplier, setSupplier] = useState("PT Hotel Mandiri Supplies");

  const lowStockItems = inventory.filter(i => i.currentStock <= i.reorderThreshold);

  const filteredInventory = inventory.filter(i => {
    if (categoryFilter !== "ALL" && i.category !== categoryFilter) return false;
    return true;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addInventoryItem({
      name,
      category,
      currentStock,
      parLevel,
      reorderThreshold,
      unit,
      unitCost,
      supplier,
      lastRestocked: "2026-08-24",
    });

    setIsNewItemOpen(false);
    setName("");
  };

  const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.currentStock * i.unitCost), 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner & KPI metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs">
          <span className="text-[10px] font-bold uppercase text-stone-500">Total Tracked SKUs</span>
          <p className="text-2xl font-bold font-mono text-stone-900 mt-1">{inventory.length} Items</p>
          <span className="text-[11px] text-stone-500">Across 6 Hotel Departments</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs">
          <span className="text-[10px] font-bold uppercase text-stone-500">Total Asset Value in Stock</span>
          <p className="text-2xl font-bold font-mono text-emerald-950 mt-1">
            Rp {(totalInventoryValue / 1000000).toFixed(1)}M
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold">Audited Cost Basis</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs">
          <span className="text-[10px] font-bold uppercase text-stone-500">Low Stock / Reorder Alerts</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-rose-900">{lowStockItems.length}</span>
            <span className="text-xs text-rose-700 font-semibold">Requires PO</span>
          </div>
          <span className="text-[11px] text-stone-500">Below minimum buffer threshold</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4ded4] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-stone-500">Procurement Action</span>
            <p className="text-xs font-semibold text-stone-800 mt-1">Generate Purchase Order</p>
          </div>
          <button
            onClick={() => setIsNewItemOpen(true)}
            className="p-2.5 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Master Table */}
      <div className="bg-white rounded-xl border border-[#e4ded4] shadow-xs overflow-hidden">
        {/* Controls Header */}
        <div className="p-4 border-b border-[#e8e4dc] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-stone-500 mr-1">Category:</span>
            {(["ALL", "LINEN", "GUEST_AMENITY", "MINIBAR", "CLEANING_CHEMICAL", "ENGINEERING_PARTS", "FNB_DRY_GOODS"] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  categoryFilter === cat ? "bg-[#27523d] text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {(cat || "").replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNewItemOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg font-semibold shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Add Inventory SKU
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fcfbf9] border-b border-[#e4ded4] text-[11px] font-semibold text-stone-500 uppercase">
              <tr>
                <th className="p-3.5">SKU Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Stock vs Par Level</th>
                <th className="p-3.5">Unit Cost</th>
                <th className="p-3.5">Total Value</th>
                <th className="p-3.5">Supplier</th>
                <th className="p-3.5 text-right">Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredInventory.map(item => {
                const threshold = item.reorderThreshold ?? item.reorderPoint ?? 10;
                const isLow = item.currentStock <= threshold;
                const percent = Math.min(100, Math.round((item.currentStock / item.parLevel) * 100));

                return (
                  <tr key={item.id} className={`hover:bg-stone-50/70 ${isLow ? "bg-rose-50/20" : ""}`}>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">{item.name}</span>
                        {isLow && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200">
                            Low Par
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">Ref: {item.id} • Restocked {item.lastRestocked}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                        {(item.category || "").replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="p-3.5 w-48">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-mono font-bold">{item.currentStock} {item.unit}</span>
                          <span className="text-stone-500 font-mono">Par: {item.parLevel}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isLow ? "bg-rose-500" : "bg-[#27523d]"}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-stone-600">
                      Rp {item.unitCost.toLocaleString()}
                    </td>

                    <td className="p-3.5 font-mono font-bold text-stone-900">
                      Rp {(item.currentStock * item.unitCost).toLocaleString()}
                    </td>

                    <td className="p-3.5 text-stone-600">
                      {item.supplier}
                    </td>

                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => updateInventoryQuantity(item.id, item.currentStock - 10)}
                        className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => updateInventoryQuantity(item.id, item.currentStock + 25)}
                        className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-xs font-semibold"
                      >
                        +25
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD SKU */}
      {isNewItemOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#ded8cc] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#e8e4dc] bg-[#faf8f5] flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Register Inventory SKU</h3>
              <button 
                onClick={() => setIsNewItemOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 uppercase">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500ml Sensatia Organic Conditioner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  >
                    <option value="GUEST_AMENITY">Guest Amenity</option>
                    <option value="LINEN">Linen & Towels</option>
                    <option value="MINIBAR">Minibar Consumable</option>
                    <option value="CLEANING_CHEMICAL">Cleaning & Sanitation Chemical</option>
                    <option value="ENGINEERING_PARTS">Engineering Spare Parts</option>
                    <option value="FNB_DRY_GOODS">F&B Dry Goods</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Unit Measurement</label>
                  <input
                    type="text"
                    required
                    placeholder="sets, bottles, pieces, kg"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Initial Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs font-mono text-stone-800 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Target Par Level</label>
                  <input
                    type="number"
                    min={1}
                    value={parLevel}
                    onChange={(e) => setParLevel(Number(e.target.value))}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs font-mono text-stone-800 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Reorder Alert</label>
                  <input
                    type="number"
                    min={1}
                    value={reorderThreshold}
                    onChange={(e) => setReorderThreshold(Number(e.target.value))}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs font-mono text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Unit Cost (IDR)</label>
                  <input
                    type="number"
                    min={100}
                    step={1000}
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs font-mono text-stone-800 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 uppercase">Preferred Supplier</label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full bg-white border border-[#ded8cc] rounded-lg p-2.5 text-xs text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#27523d] hover:bg-[#1d4030] text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Register & Save SKU
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
