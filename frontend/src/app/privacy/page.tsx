import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | TRUG by Focsera',
  description: 'Privacy Policy for TRUG by Focsera.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: November 2026</p>
        </div>

        <p className="text-base text-gray-600 leading-relaxed">
          At TRUG (by Focsera), accessible from withtrug.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by TRUG and how we use it.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed">
            We only collect information that is necessary to provide you with neighbourhood store availability and browsing experience:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li><strong>Location Data:</strong> General locality selection (such as neighbourhood or pin code) chosen by you to show nearby stores.</li>
            <li><strong>Usage Data:</strong> Information on pages visited, device information, and browser details to maintain site functionality.</li>
            <li><strong>Inquiries & Contact:</strong> Information you voluntarily provide when contacting our team or requesting store information.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use the information we collect in the following ways:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
            <li>To display verified independent neighbourhood shops in your area.</li>
            <li>To improve, personalize, and expand our website.</li>
            <li>To understand and analyze how visitors interact with our pages.</li>
            <li>To protect against fraud, unauthorized activity, and ensure website security.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">3. Data Sharing</h2>
          <p className="text-gray-600 leading-relaxed">
            We do not sell, trade, or rent your personal data to any third parties or advertising brokers. Data is only accessible to essential cloud infrastructure services strictly needed to run the website securely, or when required by law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">4. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            TRUG uses standard basic cookies to store user preferences such as your chosen neighbourhood locality. You can choose to disable cookies through your individual browser options.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">5. Third-Party Links</h2>
          <p className="text-gray-600 leading-relaxed">
            Our website may contain links to external sites or local store portals. We are not responsible for the privacy practices of external websites and encourage you to read their privacy statements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">6. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions or require more information about our Privacy Policy, do not hesitate to contact us at{' '}
            <a href="mailto:support@withtrug.com" className="text-[#D97A5B] underline hover:opacity-80">
              support@withtrug.com
            </a>{' '}
            or{' '}
            <a href="mailto:privacy@focsera.com" className="text-[#D97A5B] underline hover:opacity-80">
              privacy@focsera.com
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
