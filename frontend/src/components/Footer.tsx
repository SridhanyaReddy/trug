import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#302B28] text-[#FAF5F0] pt-16 pb-12 mt-20 border-t border-[#6B5145]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#6B5145]/40 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#D97A5B]/20 flex items-center justify-center shrink-0 text-[#D97A5B]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FAF5F0]">15-30 Min Neighbourhood Deliveries</h4>
              <p className="text-xs text-[#FAF5F0]/70 mt-0.5">Sourced from stores right around your corner.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#D97A5B]/20 flex items-center justify-center shrink-0 text-[#D97A5B]">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FAF5F0]">Empowering Local Store Owners</h4>
              <p className="text-xs text-[#FAF5F0]/70 mt-0.5">Support independent dairies, grocers & bakers.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#D97A5B]/20 flex items-center justify-center shrink-0 text-[#D97A5B]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FAF5F0]">Flexible Daily Subscriptions</h4>
              <p className="text-xs text-[#FAF5F0]/70 mt-0.5">Pause or modify fresh milk and eggs anytime.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-[#6B5145]/40 shrink-0">
                <Image
                  src="/logo.png"
                  alt="TRUG by Focsera"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#FAF5F0] leading-none">
                  <span className="text-[#D97A5B]">trug</span>.
                </span>
                <span className="text-[11px] tracking-wider lowercase font-semibold text-[#F1E6DC]/80 leading-tight mt-0.5">
                  by focsera
                </span>
              </div>
            </div>
            <p className="text-xs text-[#FAF5F0]/70 leading-relaxed">
              TRUG is a hyperlocal neighbourhood-commerce platform connecting urban households with genuine, local independent merchants.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#D97A5B] mb-4">
              Explore Essentials
            </h5>
            <ul className="space-y-2.5 text-xs text-[#FAF5F0]/80">
              <li>
                <Link href="/categories/milk-and-dairy" className="hover:text-[#D97A5B] transition">
                  Milk & Farm Dairy
                </Link>
              </li>
              <li>
                <Link href="/categories/eggs" className="hover:text-[#D97A5B] transition">
                  Pasture Raised Eggs
                </Link>
              </li>
              <li>
                <Link href="/categories/vegetables-and-fruits" className="hover:text-[#D97A5B] transition">
                  Farm Greens & Fruits
                </Link>
              </li>
              <li>
                <Link href="/categories/groceries" className="hover:text-[#D97A5B] transition">
                  Staples, Flours & Cold Oils
                </Link>
              </li>
              <li>
                <Link href="/categories/meat-and-other-essentials" className="hover:text-[#D97A5B] transition">
                  Fresh Meats & Cuts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#D97A5B] mb-4">
              Instant Ordering
            </h5>
            <ul className="space-y-2.5 text-xs text-[#FAF5F0]/80">
              <li>
                <Link href="/shops" className="hover:text-[#D97A5B] transition">
                  Browse Neighbourhood Shops
                </Link>
              </li>
              <li>
                <Link href="/recurring" className="hover:text-[#D97A5B] transition">
                  Manage Morning Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#D97A5B] transition">
                  Active Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#D97A5B] mb-4">
              Neighbourhoods Served
            </h5>
            <p className="text-xs text-[#FAF5F0]/70 leading-relaxed mb-3">
              Bellandur, Indiranagar, Koramangala, HSR Layout, Whitefield, Jayanagar & Richmond Town.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#FAF5F0]/60">
              <ShieldCheck className="w-4 h-4 text-[#D97A5B]" />
              <span>100% verified independent stores</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#6B5145]/30 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FAF5F0]/60 gap-4">
          <p>© 2026 TRUG by Focsera. Built for local neighbourhoods. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-[#FAF5F0] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#FAF5F0] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#FAF5F0] cursor-pointer">Local Store Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

