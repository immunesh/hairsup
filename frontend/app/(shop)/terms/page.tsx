import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, ShieldAlert, FileText, HelpCircle, Eye, ArrowUpRight, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | HairsUp',
  description: 'Read the Terms of Service for HairsUp. Understand our rules, guidelines, policies, and agreement when using our platform and buying premium hair wigs.',
};

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms', icon: Scale },
  { id: 'accounts', title: '2. User Accounts & Registration', icon: FileText },
  { id: 'products', title: '3. Products, Customisations & Sizing', icon: HelpCircle },
  { id: 'pricing', title: '4. Pricing, Payments & Taxes', icon: ShieldAlert },
  { id: 'shipping', title: '5. Shipping, Returns & Exchanges', icon: HelpCircle },
  { id: 'tryon', title: '6. Virtual Try-On Service & Camera Use', icon: Eye },
  { id: 'ip', title: '7. Intellectual Property Rights', icon: FileText },
  { id: 'liability', title: '8. Limitation of Liability', icon: ShieldAlert },
  { id: 'governing-law', title: '9. Governing Law', icon: Scale },
];

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="page-hero py-16 text-center relative overflow-hidden text-ink">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-300 via-brand-950 to-transparent"></div>
        <div className="container-custom max-w-3xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 border border-brand-200 text-brand-800 mb-4">
            Legal Agreement
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">
            Terms of Service
          </h1>
          <p className="text-ink-muted text-lg">
            Last Updated: July 27, 2026. Please read these terms carefully before using our platform.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-custom py-14">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sticky Sidebar Navigation - Hidden on mobile, visible on lg and above */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Table of Contents
              </h2>
              <nav className="flex flex-col space-y-2">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:text-brand-600 hover:bg-brand-50/50 transition-all group"
                    >
                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
                      <span>{sec.title}</span>
                    </a>
                  );
                })}
              </nav>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Have questions about these terms?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline mt-1"
                >
                  Contact Support <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Detailed Content Column */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-12">
            
            <section id="acceptance" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <Scale className="w-6 h-6 text-brand-600" />
                1. Acceptance of Terms
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  Welcome to HairsUp (referred to as &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot; or &quot;user&quot;), and HairsUp Technologies Pvt. Ltd., concerning your access to and use of our website (<Link href="/" className="text-brand-600 hover:underline font-medium">hairsup.com</Link>) as well as any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the &quot;Platform&quot;).
                </p>
                <p>
                  By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these terms, you are expressly prohibited from using the Platform and must discontinue use immediately.
                </p>
              </div>
            </section>

            <section id="accounts" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <FileText className="w-6 h-6 text-brand-600" />
                2. User Accounts & Registration
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  To access certain features of the Platform, including making purchases, saving your wishlist, or using saved settings, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                <p>
                  You are responsible for safeguarding your account password and for any activities or actions under your account. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorised use of your account.
                </p>
                <p>
                  We reserve the right to suspend or terminate your account at our sole discretion if any information provided during the registration process or thereafter proves to be inaccurate, false, or misleading, or if you violate these Terms of Service.
                </p>
              </div>
            </section>

            <section id="products" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <HelpCircle className="w-6 h-6 text-brand-600" />
                3. Products, Customisations & Sizing
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  HairsUp offers a wide range of premium hair wigs (for men and women) and hair systems. We make every effort to display the colours, features, specifications, and details of our products as accurately as possible on the Platform. However, we do not guarantee that the colours, styles, and details will be exactly accurate as your device&apos;s display configuration may alter visual representation.
                </p>
                <p>
                  <strong>Custom Products:</strong> Custom-made wigs, custom-fitted hair systems, or orders modified to customer-specific requirements are non-refundable and cannot be returned or exchanged. Please ensure all measurements and specifications are accurate prior to finalising custom orders.
                </p>
                <p>
                  <strong>Sizing & Fit:</strong> Standard wigs are equipped with adjustable straps that allow for slight size modifications. Average sizing parameters are details on our sizing guides. We recommend checking our measurement tutorials or booking an in-centre appointment if you are unsure of your size.
                </p>
              </div>
            </section>

            <section id="pricing" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <ShieldAlert className="w-6 h-6 text-brand-600" />
                4. Pricing, Payments & Taxes
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  All prices displayed on the Platform are in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST) unless specified otherwise. We reserve the right to adjust prices, correct typographical pricing errors, or change available payment options at any time.
                </p>
                <p>
                  Payments are securely processed through Razorpay or other third-party payment gateways. By submitting your payment information, you authorise us (through our gateway provider) to charge the designated payment method.
                </p>
                <p>
                  We accept major Credit/Debit Cards, UPI, Net Banking, and select EMI options. Cash on Delivery (COD) is available for eligible pin codes in India for orders up to a maximum threshold.
                </p>
              </div>
            </section>

            <section id="shipping" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <HelpCircle className="w-6 h-6 text-brand-600" />
                5. Shipping, Returns & Exchanges
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  <strong>Shipping:</strong> Standard shipping is free on orders above ₹999 within India. Orders below this threshold carry a standard shipping fee of ₹99. Delivery timeframes are estimates and not guaranteed delivery dates.
                </p>
                <p>
                  <strong>Returns & Exchanges:</strong> Standard products can be returned or exchanged within 7 days of delivery, provided the item is completely unworn, unaltered, in its original packaging, and with all tags intact. For hygiene reasons, wigs that have been worn, cut, washed, styled, or modified in any manner cannot be returned.
                </p>
                <p>
                  To request a return, please log in to your account, navigate to &quot;My Orders,&quot; and follow the system instructions, or contact support directly.
                </p>
              </div>
            </section>

            <section id="tryon" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <Eye className="w-6 h-6 text-brand-600" />
                6. Virtual Try-On Service & Camera Use
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  HairsUp provides an AI-powered Virtual Try-On feature that allows you to see how our wigs and hair systems look on your face. This tool requires access to your device&apos;s camera or allows you to upload a photo.
                </p>
                <p>
                  <strong>Privacy Guarantee:</strong> Your camera feed is processed entirely locally in your web browser. No video streams, live camera data, or images from your camera are ever uploaded to HairsUp servers, stored, or shared with third parties.
                </p>
                <p>
                  The Try-On feature is provided on an &quot;as-is&quot; basis for visualization purposes. Variations in lighting, camera angles, and screen resolutions can affect accuracy, and actual products may look slightly different in person.
                </p>
              </div>
            </section>

            <section id="ip" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <FileText className="w-6 h-6 text-brand-600" />
                7. Intellectual Property Rights
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  Unless otherwise indicated, the Platform is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Platform (collectively, the &quot;Content&quot;) and the trademarks, service marks, and logos contained therein (the &quot;Marks&quot;) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                </p>
                <p>
                  Except as expressly provided in these Terms of Service, no part of the Platform and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                </p>
              </div>
            </section>

            <section id="liability" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <ShieldAlert className="w-6 h-6 text-brand-600" />
                8. Limitation of Liability
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  To the maximum extent permitted by applicable law, HairsUp and its affiliates, directors, officers, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Your access to or use of, or inability to access or use, the Platform;</li>
                  <li>Any conduct or content of any third party on the Platform;</li>
                  <li>Any products purchased through the Platform, except as explicitly covered under our limited warranty;</li>
                  <li>Unauthorised access, use, or alteration of your transmissions or content.</li>
                </ul>
              </div>
            </section>

            <section id="governing-law" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <Scale className="w-6 h-6 text-brand-600" />
                9. Governing Law
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  These Terms of Service and your use of the Platform are governed by and construed in accordance with the laws of India. Any legal action or proceeding arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.
                </p>
              </div>
            </section>

            {/* Support section */}
            <div className="mt-12 p-6 rounded-2xl bg-brand-50/50 border border-brand-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Have Questions or Concerns?</h3>
                <p className="text-sm text-gray-600">Our customer support team is happy to help you understand our terms.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a href="tel:+919876543210" className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
                  <Phone className="w-3.5 h-3.5 text-gray-500" /> Call Us
                </a>
                <a href="mailto:support@hairsup.com" className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
                  <Mail className="w-3.5 h-3.5" /> Email Legal
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
