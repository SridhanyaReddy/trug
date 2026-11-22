import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | TRUG by Focsera',
  description: 'Terms of Service for TRUG by Focsera.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: November 2026</p>
        </div>

        <p className="text-base text-gray-600 leading-relaxed">
          Welcome to TRUG (operated by Focsera Technologies). By accessing or using our website at withtrug.com, you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, please do not use this website.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By browsing or interacting with TRUG, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service, along with our Privacy Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">2. Platform & Services Provided</h2>
          <p className="text-gray-600 leading-relaxed">
            TRUG is a hyperlocal neighbourhood showcase and directory designed to connect urban households with independent local grocers, farms, artisanal bakeries, and neighbourhood stores. We provide information, verified listings, and product catalogues for convenience and community awareness.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">3. Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed">
            All content on withtrug.com—including text, graphics, logos, brand assets, images, and software design—is the property of Focsera Technologies and TRUG or their respective content owners. Unauthorized copying, reproduction, or distribution without prior written consent is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">4. User Responsibilities & Conduct</h2>
          <p className="text-gray-600 leading-relaxed">
            When using our platform, you agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>Engage in any automated scraping, data extraction, or denial-of-service attempts.</li>
            <li>Misrepresent your identity or submit fraudulent communications.</li>
            <li>Attempt to interfere with or disrupt the security and network infrastructure of the platform.</li>
            <li>Violate any applicable local, national, or international laws or regulations.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">5. Store Listings & Information Accuracy</h2>
          <p className="text-gray-600 leading-relaxed">
            While we strive to keep store operational hours, product catalogues, and pricing as accurate and up-to-date as possible from connected merchant sources, individual item availability is subject to physical inventory at the respective local shops.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">6. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            TRUG and Focsera Technologies shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website, or for uninterrupted availability of the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">7. Changes to Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to revise these Terms of Service at any time. Changes will take effect immediately upon being posted to this page with an updated revision date.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">8. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions or feedback regarding these Terms, please contact us at{' '}
            <a href="mailto:focseraoff@gmail.com" className="text-[#D97A5B] underline hover:opacity-80">
              focseraoff@gmail.com
            </a>.
          </p>
        </section>

        <div className="pt-6 border-t border-gray-200">
          <Link href="/" className="text-sm font-medium text-[#D97A5B] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

