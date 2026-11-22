import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Bell, CheckCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | TRUG by Focsera',
  description: 'Learn how TRUG by Focsera protects and handles user privacy, personal data, and neighbourhood interactions.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 22, 2026';

  return (
    <div className="min-h-screen bg-[#FAF5F0] text-[#302B28] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6B5145] hover:text-[#D97A5B] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 text-[#D97A5B] text-xs font-bold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Legal & Privacy Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#302B28]">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-[#6B5145]">
            Effective Date: <span className="font-semibold text-[#302B28]">{lastUpdated}</span> | TRUG by Focsera Technologies
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="bg-[#F1E6DC]/70 border border-[#6B5145]/20 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-3 text-[#302B28]">
            <Lock className="w-5 h-5 text-[#D97A5B] shrink-0" />
            <h2 className="font-bold text-base sm:text-lg">Our Commitment to Your Privacy</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B5145] leading-relaxed">
            At <strong>TRUG</strong> (operated by <strong>Focsera</strong>), we believe in utmost transparency and data minimization. We do not sell your personal data, conduct intrusive behavioral tracking, or monetize your neighbourhood preferences to third-party ad networks.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 bg-white border border-[#F1E6DC] rounded-3xl p-6 sm:p-10 shadow-xs text-xs sm:text-sm text-[#6B5145] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-[#302B28] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FAF5F0] text-[#D97A5B] border border-[#F1E6DC] text-xs font-extrabold flex items-center justify-center">1</span>
              Information We Collect
            </h3>
            <p>
              When you explore TRUG to discover local neighbourhood stores and product catalogues, we collect only minimal information necessary to deliver a seamless browsing experience:
            </p>
            <ul className="list-disc pl-5 space-y-2 pt-1 text-[#302B28]/80">
              <li>
                <strong>Locality & Neighbourhood Selection:</strong> General locality preferences (e.g., Jubilee Hills, Bengaluru Core, Bellandur) chosen by you to display accurate nearby merchants. We do not track your fine-grained real-time GPS coordinates without your explicit consent.
              </li>
              <li>
                <strong>Device & Technical Data:</strong> Standard browser type, device specifications, operating system, and IP address collected automatically to ensure platform reliability and security.
              </li>
              <li>
                <strong>Merchant Inquiries & Feedback:</strong> Any voluntary communications or direct inquiries submitted through contact forms or customer channels.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-4 border-t border-[#F1E6DC]">
            <h3 className="text-base sm:text-lg font-bold text-[#302B28] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FAF5F0] text-[#D97A5B] border border-[#F1E6DC] text-xs font-extrabold flex items-center justify-center">2</span>
              How We Use Your Information
            </h3>
            <p>We use the data collected strictly for the following operational purposes:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-[#FAF5F0] rounded-2xl border border-[#F1E6DC]">
                <h4 className="font-bold text-[#302B28] text-xs mb-1">Local Store Display</h4>
                <p className="text-[11px] text-[#6B5145]">Filtering verified merchants, artisanal bakeries, and organic farms within your selected area.</p>
              </div>
              <div className="p-3.5 bg-[#FAF5F0] rounded-2xl border border-[#F1E6DC]">
                <h4 className="font-bold text-[#302B28] text-xs mb-1">Platform Reliability</h4>
                <p className="text-[11px] text-[#6B5145]">Diagnosing server performance, caching regional catalogues, and maintaining high availability.</p>
              </div>
              <div className="p-3.5 bg-[#FAF5F0] rounded-2xl border border-[#F1E6DC]">
                <h4 className="font-bold text-[#302B28] text-xs mb-1">Merchant Verification</h4>
                <p className="text-[11px] text-[#6B5145]">Preventing spam and authenticating merchant credibility across our digital directory.</p>
              </div>
              <div className="p-3.5 bg-[#FAF5F0] rounded-2xl border border-[#F1E6DC]">
                <h4 className="font-bold text-[#302B28] text-xs mb-1">Security & Integrity</h4>
                <p className="text-[11px] text-[#6B5145]">Protecting our infrastructure against malicious attacks, scraping, and abusive automated activity.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-4 border-t border-[#F1E6DC]">
            <h3 className="text-base sm:text-lg font-bold text-[#302B28] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FAF5F0] text-[#D97A5B] border border-[#F1E6DC] text-xs font-extrabold flex items-center justify-center">3</span>
              Data Sharing & Third-Party Services
            </h3>
            <p>
              TRUG operates under a strict privacy-first model. We do not sell, rent, or trade your personal data. Limited technical data may be processed by trusted infrastructure providers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-[#302B28]/80">
              <li>
                <strong>Cloud & Database Hosting:</strong> Secure database infrastructure (PostgreSQL & storage engines managed by Focsera) encrypted both in transit (TLS 1.3) and at rest (AES-256).
              </li>
              <li>
                <strong>Legal Requirements:</strong> If mandated by law enforcement or regulatory authorities pursuant to valid legal process under applicable Indian and international regulations.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-4 border-t border-[#F1E6DC]">
            <h3 className="text-base sm:text-lg font-bold text-[#302B28] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FAF5F0] text-[#D97A5B] border border-[#F1E6DC] text-xs font-extrabold flex items-center justify-center">4</span>
              Cookies & Local Storage
            </h3>
            <p>
              We utilize essential browser cookies and local storage exclusively to remember your preferred neighbourhood selection so you do not have to reselect your locality every time you visit. We do not employ third-party advertising cookies or cross-site tracking pixels.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-4 border-t border-[#F1E6DC]">
            <h3 className="text-base sm:text-lg font-bold text-[#302B28] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FAF5F0] text-[#D97A5B] border border-[#F1E6DC] text-xs font-extrabold flex items-center justify-center">5</span>
              Your Rights & Data Choices
            </h3>
            <p>
              Depending on your jurisdiction, you have the right to request access to the data we retain, request correction of any inaccuracies, or request the deletion of any submitted feedback or contact details.
            </p>
            <p>
              To exercise any of these rights, you may reach out to our privacy compliance desk at <a href="mailto:privacy@focsera.com" className="text-[#D97A5B] font-bold hover:underline">privacy@focsera.com</a>.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-[#F1E6DC]">
            <h3 className="text-base sm:text-lg font-bold text-[#302B28] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FAF5F0] text-[#D97A5B] border border-[#F1E6DC] text-xs font-extrabold flex items-center justify-center">6</span>
              Updates to This Policy
            </h3>
            <p>
              We may update this Privacy Policy from time to time to reflect evolving service enhancements or regulatory requirements. Any modifications will be posted directly on this page with an updated Effective Date.
            </p>
          </section>

          {/* Section 7 - Contact */}
          <section className="space-y-3 pt-4 border-t border-[#F1E6DC]">
            <h3 className="text-base sm:text-lg font-bold text-[#302B28] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FAF5F0] text-[#D97A5B] border border-[#F1E6DC] text-xs font-extrabold flex items-center justify-center">7</span>
              Contact Our Privacy Officer
            </h3>
            <div className="bg-[#FAF5F0] p-4 rounded-2xl border border-[#F1E6DC] space-y-1">
              <p className="font-bold text-[#302B28]">Focsera Technologies Private Limited</p>
              <p className="text-xs text-[#6B5145]">Attn: Data Protection & Compliance Office</p>
              <p className="text-xs text-[#6B5145]">Email: <a href="mailto:support@withtrug.com" className="text-[#D97A5B] font-semibold hover:underline">support@withtrug.com</a> / <a href="mailto:privacy@focsera.com" className="text-[#D97A5B] font-semibold hover:underline">privacy@focsera.com</a></p>
              <p className="text-xs text-[#6B5145]">Website: <a href="https://withtrug.com" className="text-[#D97A5B] font-semibold hover:underline">https://withtrug.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
