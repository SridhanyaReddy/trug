'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Vendor } from '@/types';
import { Star, Clock, MapPin, Store } from 'lucide-react';

interface ShopCardProps {
  vendor: Vendor;
}

export default function ShopCard({ vendor }: ShopCardProps) {
  return (
    <Link
      href={`/store/${vendor.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden border border-[#F1E6DC] hover:border-[#D97A5B]/50 hover:shadow-xl transition-all duration-300"
    >
      {/* Cover Image Banner */}
      <div className="relative h-44 w-full bg-[#FAF5F0] overflow-hidden">
        <Image
          src={vendor.coverImage}
          alt={vendor.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        {/* Operating status badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${
              vendor.isOpen
                ? 'bg-emerald-600/90 text-white'
                : 'bg-[#302B28]/90 text-amber-200'
            }`}
          >
            {vendor.isOpen ? 'Open Now' : 'Opens Soon'}
          </span>
        </div>

        {/* Delivery time pill */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs text-[#302B28] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-[#D97A5B]" />
          <span>{vendor.deliveryTime}</span>
        </div>

        {/* Logo overlapping banner */}
        <div className="absolute -bottom-4 left-6 w-14 h-14 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-md">
          <Image
            src={vendor.logo}
            alt={`${vendor.name} logo`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Details Body */}
      <div className="pt-6 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-[#302B28] group-hover:text-[#D97A5B] transition leading-snug">
              {vendor.name}
            </h3>
            <p className="text-xs text-[#6B5145] font-semibold mt-0.5">
              {vendor.category}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 bg-[#FAF5F0] px-2.5 py-1 rounded-xl border border-[#F1E6DC]">
            <Star className="w-3.5 h-3.5 fill-[#D97A5B] text-[#D97A5B]" />
            <span className="text-xs font-bold text-[#302B28]">{vendor.rating}</span>
            <span className="text-[10px] text-[#6B5145] font-medium">({vendor.reviewsCount})</span>
          </div>
        </div>

        <p className="text-xs text-[#6B5145] font-normal line-clamp-2 mt-2 leading-relaxed">
          {vendor.tagline}
        </p>

        {/* Distance & Address */}
        <div className="mt-3.5 flex items-center gap-4 text-xs text-[#6B5145] border-t border-[#F1E6DC]/70 pt-3 font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#D97A5B] shrink-0" />
            <span className="truncate">{vendor.address.locality}</span>
          </div>
          <span className="shrink-0 font-bold text-[#302B28]">{vendor.distance}</span>
        </div>

        {/* Badges / Highlights */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {vendor.featuredBadges.slice(0, 2).map((b) => (
            <span
              key={b}
              className="text-[10px] bg-[#FAF5F0] text-[#6B5145] px-2.5 py-0.5 rounded-md font-semibold border border-[#F1E6DC]"
            >
              {b}
            </span>
          ))}
          {vendor.deliveryFee === 0 && (
            <span className="text-[10px] bg-[#FAF5F0] text-emerald-800 font-bold px-2.5 py-0.5 rounded-md border border-emerald-200">
              Free Delivery
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
