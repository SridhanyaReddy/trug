'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useVendor } from '@/context/VendorContext';
import { InventoryLog } from '@/types/vendor';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  History,
  CheckCircle,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function VendorInventoryPage() {
  const { products, inventoryLogs, updateVariantStock } = useVendor();

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');

  // Quick edit modal
  const [selectedItem, setSelectedItem] = useState<{
    productId: string;
    productName: string;
    variantId: string;
    variantName: string;
    currentStock: number;
  } | null>(null);

  const [adjustmentValue, setAdjustmentValue] = useState<number>(10);
  const [reason, setReason] = useState<InventoryLog['reason']>('Restock');

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const newStock = Math.max(0, selectedItem.currentStock + adjustmentValue);
    updateVariantStock(selectedItem.productId, selectedItem.variantId, newStock, reason);
    setSelectedItem(null);
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const hasLow = p.variants.some((v) => v.stockQty <= 10 && v.stockQty > 0);
    const hasOut = p.variants.some((v) => v.stockQty === 0);

    if (filterMode === 'low') return matchSearch && hasLow;
    if (filterMode === 'out') return matchSearch && hasOut;
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-[#6B5145] mt-0.5">
            Real-time stock monitoring, quick batch restocks, and complete audit history.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#F1E6DC] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items by name..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5F0] text-xs font-medium text-[#302B28] rounded-xl border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B]"
          />
          <Search className="w-4 h-4 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'low', 'out'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition ${
                filterMode === mode
                  ? 'bg-[#302B28] text-white shadow-xs'
                  : 'bg-[#FAF5F0] text-[#6B5145] hover:bg-[#F1E6DC]'
              }`}
            >
              {mode === 'all' ? 'All Stock' : mode === 'low' ? 'Low Stock (≤10)' : 'Out of Stock (0)'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Stock Table */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5F0] border-b border-[#F1E6DC] text-[#6B5145] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Variant</th>
                <th className="py-3.5 px-4">Available Units</th>
                <th className="py-3.5 px-4">Status Indicator</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E6DC]/70">
              {filteredProducts.map((p) =>
                p.variants.map((v) => (
                  <tr key={`${p.id}-${v.id}`} className="hover:bg-[#FAF5F0]/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#FAF5F0] border border-[#F1E6DC] shrink-0">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-[#302B28] block">{p.name}</span>
                          <span className="text-[10px] text-[#6B5145]">{p.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#6B5145]">
                      {v.name} • ₹{v.price}
                    </td>

                    <td className="py-3.5 px-4 font-black text-sm text-[#302B28]">
                      {v.stockQty}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                          v.stockQty > 15
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.stockQty > 0
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {v.stockQty > 15 ? 'Healthy Stock' : v.stockQty > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem({
                              productId: p.id,
                              productName: p.name,
                              variantId: v.id,
                              variantName: v.name,
                              currentStock: v.stockQty,
                            });
                            setAdjustmentValue(20);
                            setReason('Restock');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] font-bold text-xs border border-[#F1E6DC] transition"
                        >
                          Adjust Units
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock History Audit Log */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#D97A5B]" />
          <h2 className="text-base font-extrabold text-[#302B28]">Inventory Adjustment History</h2>
        </div>

        <div className="divide-y divide-[#F1E6DC]/70 text-xs">
          {inventoryLogs.map((log) => (
            <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#302B28]">{log.productName}</span>
                <span className="text-[#6B5145] ml-1.5">({log.variantName})</span>
                <div className="text-[11px] text-[#6B5145] mt-0.5">
                  Reason: <strong className="text-[#302B28]">{log.reason}</strong> • {log.timestamp}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-black text-xs ${
                    log.change >= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {log.change >= 0 ? `+${log.change}` : log.change} units
                </span>
                <span className="text-[10px] text-[#6B5145] block">
                  New Total: {log.newStock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Adjust Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleApplyAdjustment}
            className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#F1E6DC] shadow-2xl space-y-4"
          >
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-[#302B28]">
                Adjust Inventory Units
              </h3>
              <p className="text-xs text-[#6B5145]">
                {selectedItem.productName} ({selectedItem.variantName})
              </p>
            </div>

            <div className="bg-[#FAF5F0] p-3 rounded-2xl border border-[#F1E6DC] text-xs flex justify-between">
              <span>Current Stock on Shelf:</span>
              <strong className="text-sm text-[#302B28]">{selectedItem.currentStock} units</strong>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B5145] font-bold mb-1">
                  Stock Change (use negative for damage/loss):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentValue((v) => v - 5)}
                    className="w-8 h-8 rounded-xl bg-[#FAF5F0] border border-[#F1E6DC] font-black text-sm text-[#302B28]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    required
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                    className="w-full text-center p-2 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustmentValue((v) => v + 5)}
                    className="w-8 h-8 rounded-xl bg-[#FAF5F0] border border-[#F1E6DC] font-black text-sm text-[#302B28]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Reason for Adjustment</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-medium"
                >
                  <option value="Restock">Morning / Evening Mandi Restock</option>
                  <option value="Manual Correction">Manual Physical Stock Count</option>
                  <option value="Damaged / Expired">Damaged / Expired Bottles</option>
                  <option value="Sale">Direct Walk-in Counter Sale</option>
                </select>
              </div>

              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                Resulting stock after update: {Math.max(0, selectedItem.currentStock + adjustmentValue)} units
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B5145]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold shadow-xs"
              >
                Confirm Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

