'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useVendor } from '@/context/VendorContext';
import { Order, OrderStatus } from '@/types';
import {
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  Search,
  Filter,
} from 'lucide-react';

export default function VendorOrdersPage() {
  const { vendorOrders, updateOrderStatus } = useVendor();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const orderStatuses: (OrderStatus | 'All')[] = [
    'All',
    'Placed',
    'Accepted',
    'Preparing',
    'Ready / Dispatched',
    'Delivered',
    'Cancelled',
  ];

  const filteredOrders = vendorOrders.filter((o) => {
    const matchStatus = activeTab === 'All' || o.status === activeTab;
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.deliveryAddress.name.toLowerCase().includes(search.toLowerCase()) ||
      o.deliveryAddress.phone.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
            Order Fulfillment Center
          </h1>
          <p className="text-xs text-[#6B5145] mt-0.5">
            Accept incoming orders, assign staff for packing, and dispatch with neighbourhood partners.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#F1E6DC] scrollbar-none">
        {orderStatuses.map((st) => {
          const count = st === 'All' ? vendorOrders.length : vendorOrders.filter((o) => o.status === st).length;
          const isActive = activeTab === st;
          return (
            <button
              key={st}
              onClick={() => setActiveTab(st)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                isActive
                  ? 'bg-[#302B28] text-white shadow-xs'
                  : 'bg-white text-[#6B5145] hover:bg-[#F1E6DC] border border-[#F1E6DC]'
              }`}
            >
              <span>{st}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#FAF5F0] text-[#6B5145]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Cards List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const isPlaced = ord.status === 'Placed';
            const isAccepted = ord.status === 'Accepted';
            const isPreparing = ord.status === 'Preparing';
            const isReady = ord.status === 'Ready / Dispatched';
            const isDelivered = ord.status === 'Delivered';
            const isCancelled = ord.status === 'Cancelled';

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-[#F1E6DC] p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1E6DC]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-base text-[#302B28]">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCancelled
                            ? 'bg-red-100 text-red-800'
                            : isPlaced
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                            : 'bg-[#FAF5F0] text-[#D97A5B] border border-[#D97A5B]/30'
                        }`}
                      >
                        {ord.status}
                      </span>
                      <span className="text-xs text-[#6B5145] font-semibold">
                        ({ord.fulfillmentType === 'pickup' ? 'Counter Pickup' : 'Delivery'})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#6B5145] mt-1 font-medium">
                      <span>Placed at: {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>Delivery Slot: <strong className="text-[#302B28]">{ord.deliverySlot}</strong></span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="font-black text-lg text-[#302B28]">₹{ord.total}</span>
                    <span className="text-[11px] text-[#6B5145] block">
                      Paid via {ord.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Customer & Items Split */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Items List */}
                  <div className="md:col-span-7 space-y-2">
                    <h4 className="text-xs font-bold text-[#302B28] uppercase tracking-wider">
                      Ordered Products ({ord.items.length})
                    </h4>
                    <div className="divide-y divide-[#F1E6DC]/60 text-xs">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="py-2 first:pt-0 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#FAF5F0] border border-[#F1E6DC] shrink-0">
                              <Image
                                src={item.image}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-[#302B28]">{item.productName}</span>
                              <span className="text-[11px] text-[#6B5145] block">
                                {item.variantName} • ₹{item.unitPrice} each
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-[#302B28] block">Qty: {item.quantity}</span>
                            <span className="text-[11px] text-[#6B5145]">₹{item.totalPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer and Delivery Address Details */}
                  <div className="md:col-span-5 bg-[#FAF5F0] p-4 rounded-2xl border border-[#F1E6DC] space-y-2 text-xs">
                    <h4 className="font-bold text-[#302B28] uppercase tracking-wider text-[11px]">
                      Customer & Dropoff Info
                    </h4>
                    <div className="space-y-1 text-[#6B5145]">
                      <p className="font-bold text-[#302B28]">{ord.deliveryAddress.name} ({ord.deliveryAddress.tag})</p>
                      <p className="flex items-center gap-1.5 font-medium">
                        <Phone className="w-3.5 h-3.5 text-[#D97A5B]" />
                        <span>{ord.deliveryAddress.phone}</span>
                      </p>
                      <p className="flex items-start gap-1.5 leading-relaxed pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D97A5B] shrink-0 mt-0.5" />
                        <span>{ord.deliveryAddress.addressLine}</span>
                      </p>
                      {ord.deliveryAddress.landmark && (
                        <p className="text-[11px] text-[#6B5145]/80">
                          Landmark: {ord.deliveryAddress.landmark}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Functional Actions Row */}
                <div className="pt-3 border-t border-[#F1E6DC] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-[#6B5145]">
                    Status updates synchronize directly with customer's live tracking screen.
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Action flow based on state */}
                    {isPlaced && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'Cancelled')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 transition"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'Accepted')}
                          className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#D97A5B] hover:bg-[#c2694d] shadow-xs transition"
                        >
                          Accept Order
                        </button>
                      </>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#302B28] hover:bg-black transition flex items-center gap-1.5"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Mark Preparing</span>
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Ready / Dispatched')}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#D97A5B] hover:bg-[#c2694d] transition flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Mark Ready / Dispatched</span>
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Delivered')}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Delivered</span>
                      </button>
                    )}

                    {isDelivered && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        Completed & Settled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#F1E6DC] p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-[#302B28]">No orders under &quot;{activeTab}&quot; status.</p>
          <button
            onClick={() => setActiveTab('All')}
            className="text-xs text-[#D97A5B] font-bold underline"
          >
            Show All Orders
          </button>
        </div>
      )}
    </div>
  );
}

