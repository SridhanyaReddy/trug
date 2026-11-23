'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck, Truck, Store, CreditCard, RotateCcw } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'delivery' | 'orders' | 'stores' | 'payments';
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'delivery',
    question: 'Is there really zero delivery fee on all orders?',
    answer: 'Yes! TRUG’s signature commitment is ₹0 delivery fees on every single order. There are no surge prices, hidden platform fees, or sudden delivery charges at checkout.',
  },
  {
    id: 'faq-2',
    category: 'delivery',
    question: 'How do you deliver items so fresh?',
    answer: 'Unlike quick-commerce dark stores that warehouse packaged produce for days, TRUG connects you directly with verified neighbourhood shops, local organic grocers, dairy farms, and artisanal bakeries right around your street. Orders are fulfilled and dispatched directly from their fresh daily shelves.',
  },
  {
    id: 'faq-3',
    category: 'delivery',
    question: 'How does live location detection work on TRUG?',
    answer: 'TRUG integrates real Google Maps and GPS geolocation. You can tap "Detect GPS" for instant satellite coordinate detection, search any landmark, street or apartment, or toggle the real Google Map view to fine-tune the delivery pin directly to your exact doorstep.',
  },
  {
    id: 'faq-4',
    category: 'orders',
    question: 'How do I place an order on TRUG?',
    answer: 'Simply browse verified nearby stores or search for your required grocery items, select your variant, add to your basket, confirm your delivery address, and click "Place Order". Your order commits immediately into the live merchant inventory system.',
  },
  {
    id: 'faq-5',
    category: 'payments',
    question: 'What payment methods are supported?',
    answer: 'We support both Cash on Delivery (COD) and instant UPI / QR code payments upon delivery. You can choose your preferred mode directly inside your basket drawer.',
  },
  {
    id: 'faq-6',
    category: 'stores',
    question: 'Can I order from multiple neighbourhood stores?',
    answer: 'Yes! You can explore separate stores across categories—such as getting fresh morning milk from a local dairy farm and fresh sourdough from an artisanal bakery. Each store’s items are clearly organized in your basket for transparent fulfillment.',
  },
  {
    id: 'faq-7',
    category: 'orders',
    question: 'Can I set up recurring daily subscriptions?',
    answer: 'Absolutely. TRUG offers Daily Subscriptions for everyday staples like fresh milk, curd, farm eggs, and sourdough. You can pause, resume, or modify your recurring delivery days at any time from your profile.',
  },
  {
    id: 'faq-8',
    category: 'stores',
    question: 'How do local merchants get verified on TRUG?',
    answer: 'Every vendor is strictly vetted for quality, hygienic handling, authentic sourcing, and live stock transparency before being onboarded into the TRUG merchant ecosystem.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [activeTab, setActiveTab] = useState<'all' | 'delivery' | 'orders' | 'payments' | 'stores'>('all');

  const filteredFaqs = activeTab === 'all' ? FAQS : FAQS.filter((f) => f.category === activeTab);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAF5F0] border-t border-[#F1E6DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 bg-[#F1E6DC] text-[#6B5145] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#D97A5B]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#302B28] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5145] max-w-xl mx-auto font-medium">
            Everything you need to know about TRUG neighbourhood delivery, ₹0 fees, real-time Google Maps ordering, and local store verification.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All FAQs' },
            { id: 'delivery', label: 'Delivery & ₹0 Fee' },
            { id: 'orders', label: 'Ordering & Subscriptions' },
            { id: 'payments', label: 'Payments' },
            { id: 'stores', label: 'Stores & Quality' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer ${
                  isActive
                    ? 'bg-[#302B28] text-white shadow-xs'
                    : 'bg-white text-[#6B5145] hover:bg-[#F1E6DC] border border-[#F1E6DC]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#F1E6DC] overflow-hidden transition shadow-xs hover:border-[#D97A5B]/30"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-extrabold text-sm sm:text-base text-[#302B28] leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#D97A5B] text-white rotate-180'
                        : 'bg-[#FAF5F0] text-[#6B5145]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6B5145] leading-relaxed border-t border-[#FAF5F0] animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 p-6 bg-white rounded-3xl border border-[#F1E6DC] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97A5B]/15 text-[#D97A5B] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#D97A5B]" />
            </div>
            <div>
              <h4 className="font-black text-sm text-[#302B28]">Still have questions?</h4>
              <p className="text-xs text-[#6B5145] font-medium">Reach out directly to TRUG customer care on WhatsApp.</p>
            </div>
          </div>
          <a
            href="https://wa.me/919515803954?text=Hi%20TRUG%20Team,%20I%20have%20a%20question%20about%20an%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#302B28] hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
