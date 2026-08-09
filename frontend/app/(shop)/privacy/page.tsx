import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Eye, EyeOff, FileText, HelpCircle, Lock, Server, Trash2, ArrowUpRight, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | HairsUp',
  description: 'Read the Privacy Policy for HairsUp. Learn how we collect, use, store, and protect your personal information, including Google Sign-In and Virtual Try-On data.',
};

const SECTIONS = [
  { id: 'collect', title: '1. Information We Collect', icon: FileText },
  { id: 'tryon', title: '2. Virtual Try-On Privacy', icon: Eye },
  { id: 'use', title: '3. How We Use Information', icon: Server },
  { id: 'share', title: '4. Sharing Your Information', icon: HelpCircle },
  { id: 'cookies', title: '5. Cookies & Tracking', icon: EyeOff },
  { id: 'security', title: '6. Security & Encryption', icon: Lock },
  { id: 'retention', title: '7. Data Retention', icon: Server },
  { id: 'rights', title: '8. Your Choices & Rights', icon: Trash2 },
  { id: 'thirdparty', title: '9. Third-Party Links', icon: HelpCircle },
  { id: 'contact', title: '10. How to Contact Us', icon: ShieldCheck },
];

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="page-hero py-16 text-center relative overflow-hidden text-ink">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-300 via-brand-950 to-transparent"></div>
        <div className="container-custom max-w-3xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 border border-brand-200 text-brand-800 mb-4">
            Data Protection
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">
            Privacy Policy
          </h1>
          <p className="text-ink-muted text-lg">
            Last Updated: July 27, 2026. Your privacy is our highest priority. Learn how we handle your data.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-custom py-14">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sticky Sidebar Navigation */}
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
                  Have questions about your data privacy?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline mt-1"
                >
                  Contact DPO <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Detailed Content Column */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-12">
            
            <section id="collect" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <FileText className="w-6 h-6 text-brand-600" />
                1. Information We Collect
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  We collect information that you directly provide to us, as well as data that is automatically collected when you visit and interact with our Platform.
                </p>
                <p>
                  <strong>Personal Data:</strong> This includes information such as your name, email address, physical shipping address, telephone number, billing address, and account preferences when you create an account, purchase products, or subscribe to our newsletter.
                </p>
                <p>
                  <strong>Google Sign-In:</strong> If you choose to log in or register using your Google account, we retrieve basic profile information (such as your name, email address, profile picture, and language preferences) from Google as permitted by your Google privacy settings. This information is used strictly to establish and access your HairsUp account.
                </p>
                <p>
                  <strong>Transactional Info:</strong> When you purchase products, we collect details about the transaction, including ordered items, delivery status, and order values. Payment credentials (card numbers, UPI pins) are processed directly by our PCI-DSS compliant partner Razorpay and are never stored on our servers.
                </p>
              </div>
            </section>

            <section id="tryon" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <Eye className="w-6 h-6 text-brand-600" />
                2. Virtual Try-On Privacy Guarantee
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed bg-brand-50/40 p-6 rounded-2xl border border-brand-100">
                <p className="font-semibold text-brand-950">
                  Your face and camera feed never leave your device.
                </p>
                <p className="text-sm">
                  Our Virtual Try-On tool allows you to visualize how various wig styles and hair systems look on your face. To use this feature, you grant the Platform permission to access your device&apos;s camera feed, or you upload a photograph.
                </p>
                <p className="text-sm">
                  This technology is designed to operate <strong>entirely in your web browser</strong> using client-side WebGL/AI processing. No video streams, live camera data, or images from your camera are ever uploaded to HairsUp servers, stored, processed by our systems, or shared with third parties. Once you close the try-on tool or navigate away, camera access is immediately terminated.
                </p>
              </div>
            </section>

            <section id="use" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <Server className="w-6 h-6 text-brand-600" />
                3. How We Use Your Information
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  We use the information we collect for various business purposes, including:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Processing, fulfilling, and shipping your orders;</li>
                  <li>Managing your user account and verifying your identity;</li>
                  <li>Providing customer support and responding to your enquiries;</li>
                  <li>Sending transaction updates, shipping notifications, and billing details;</li>
                  <li>Sending marketing communications and promotional offers (which you can opt-out of at any time);</li>
                  <li>Analyzing platform performance, diagnostic debugging, and improving website design.</li>
                </ul>
              </div>
            </section>

            <section id="share" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <HelpCircle className="w-6 h-6 text-brand-600" />
                4. Sharing Your Information
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  <strong>We do not sell, rent, or trade your personal information to third parties.</strong>
                </p>
                <p>
                  We share your data only with trusted third-party service providers who assist us in operating our Platform, conducting our business, or servicing you, so long as those parties agree to keep this information confidential:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Payment Processors:</strong> We use Razorpay to process payments. Razorpay uses and stores your billing info according to their privacy policies.</li>
                  <li><strong>Logistics & Courier Partners:</strong> We share your name, phone number, and shipping address with courier partners (e.g., Delhivery, Blue Dart) to deliver your orders.</li>
                  <li><strong>Cloud Infrastructure:</strong> Your non-video user data is securely hosted on our cloud databases.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities.</li>
                </ul>
              </div>
            </section>

            <section id="cookies" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <EyeOff className="w-6 h-6 text-brand-600" />
                5. Cookies & Tracking
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  We use cookies and similar tracking technologies to track activity on our Platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                </p>
                <p>
                  We use cookies to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Keep track of items in your shopping cart;</li>
                  <li>Save your preferences for future visits;</li>
                  <li>Understand and analyze site traffic and user patterns;</li>
                  <li>Identify log-in sessions and authenticate users.</li>
                </ul>
                <p>
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Platform (e.g., maintaining your cart items or account sessions).
                </p>
              </div>
            </section>

            <section id="security" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <Lock className="w-6 h-6 text-brand-600" />
                6. Security & Encryption
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  The security of your personal information is important to us. We implement a variety of security measures to maintain the safety of your personal information:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Encryption:</strong> All transaction and transmission of sensitive data is protected using Secure Socket Layer (SSL) technology.</li>
                  <li><strong>Payment Security:</strong> Payment information is processed under industry standard PCI-DSS specifications via secure APIs of certified gateways.</li>
                  <li><strong>Access Controls:</strong> We restrict access to personal information to HairsUp employees, contractors, and agents who need to know that information to process it for us.</li>
                </ul>
                <p>
                  Please note that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </div>
            </section>

            <section id="retention" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <Server className="w-6 h-6 text-brand-600" />
                7. Data Retention
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.
                </p>
                <p>
                  We will retain and use your personal information to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with tax or financial laws), resolve disputes, and enforce our agreements.
                </p>
              </div>
            </section>

            <section id="rights" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <Trash2 className="w-6 h-6 text-brand-600" />
                8. Your Choices & Rights
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  You have control over how your personal information is collected, used, and shared. Your rights include:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Access & Portability:</strong> You may request a copy of the personal information we hold about you.</li>
                  <li><strong>Correction:</strong> You can update or correct your profile information at any time from your account settings.</li>
                  <li><strong>Deletion:</strong> You can request that we delete your account and associated personal data. Note that certain legal, tax, or transaction data must be retained for compliance purposes.</li>
                  <li><strong>Opt-Out of Marketing:</strong> You can unsubscribe from our marketing emails by clicking the &quot;unsubscribe&quot; link in any marketing email, or by adjusting your notifications preferences.</li>
                </ul>
              </div>
            </section>

            <section id="thirdparty" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <HelpCircle className="w-6 h-6 text-brand-600" />
                9. Third-Party Links
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  Our Platform may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party&apos;s site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                </p>
              </div>
            </section>

            <section id="contact" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3 pb-2 border-b border-gray-100">
                <ShieldCheck className="w-6 h-6 text-brand-600" />
                10. How to Contact Us
              </h2>
              <div className="text-gray-600 space-y-3 leading-relaxed">
                <p>
                  If you have any questions or complaints about this Privacy Policy or our privacy practices, please contact our Data Protection Officer (DPO):
                </p>
                <div className="mt-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">HairsUp Technologies Pvt. Ltd.</p>
                    <p className="text-sm">Attn: Privacy Office & Data Protection Officer</p>
                    <p className="text-sm">Bandra Kurla Complex, Bandra East, Mumbai - 400051</p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <a href="mailto:privacy@hairsup.com" className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
                      <Mail className="w-3.5 h-3.5" /> Email DPO
                    </a>
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
