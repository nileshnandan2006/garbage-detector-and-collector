import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, Eye, AlertCircle, CheckCircle2, ChevronRight, Scale, Award, HeartHandshake } from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms';
  navigate: (page: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy', navigate }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-3xl overflow-hidden shadow-lg border-2 border-emerald-500/30">
          <img src="/logo.png" alt="CleanSight Mascot" className="w-full h-full object-cover" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>CleanSight Civic Trust & Legal Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Official policies governing civic garbage reporting, computer vision analysis, non-penalization safeguards, and reward credits under Pune Smart City guidelines.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shadow-inner">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms & Conditions
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 text-xs leading-relaxed text-slate-600">
        {/* ===================== PRIVACY POLICY ===================== */}
        {activeTab === 'privacy' ? (
          <div className="space-y-8">
            {/* Effective date badge */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <span className="font-semibold">Last Updated: October 2026 • Version 2.4</span>
              <span className="font-bold">Applicable to all CleanSight Web & Mobile Users</span>
            </div>

            {/* 1. Introduction */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center">1</span>
                Introduction & Civic Mission
              </h2>
              <p>
                CleanSight ("we", "our", or "the Platform") is a civic cleanliness technology initiative designed to bridge proactive citizens, artificial intelligence, and municipal sanitation authorities. We respect your privacy and are committed to protecting the personal data you share when identifying public waste and keeping your city clean.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center">2</span>
                Information We Collect
              </h2>
              <p>When you interact with CleanSight, we collect the following categories of information:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>
                  <b>Account & Authentication Information:</b> Your name, email address, password hash, and profile image (when authenticating via Firebase Email or Google 1-Click Sign-In).
                </li>
                <li>
                  <b>Civic Incident Photographs:</b> Images of public waste submitted via your device camera or file upload for the express purpose of sanitation verification.
                </li>
                <li>
                  <b>Geolocation Data:</b> Latitude, longitude, street landmark, and ward information captured when you click <i>"Use My Location"</i> or select a position on our interactive Leaflet map.
                </li>
                <li>
                  <b>Reward & Engagement Data:</b> Earned points balance, unlocked achievement badges, and redemption transactions for partner coupons and transit discounts.
                </li>
              </ul>
            </section>

            {/* 3. AI Computer Vision Data Processing */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center">3</span>
                AI Computer Vision Processing & Ethics
              </h2>
              <p>
                When you upload a photograph to CleanSight, our Computer Vision engine processes the image to identify material classification (e.g., Plastic Waste, Food Waste, Construction Debris, E-Waste), estimate physical severity, and calculate approximate refuse weight in kilograms.
              </p>
              <p>
                <b>Face and License Plate Safeguard:</b> Our automated processing isolates environmental waste contours. Personal identifiers such as human faces or vehicle license plates are not indexed or used for profiling.
              </p>
            </section>

            {/* 4. Anti-Fraud Shield & Integrity */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center">4</span>
                Anti-Fraud Shield & Spam Prevention
              </h2>
              <p>
                To maintain program integrity and preserve civic rewards for authentic community contributors:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>We generate cryptographic MD5 image checksums to detect duplicate uploads of identical images.</li>
                <li>We enforce a 25-meter geo-proximity check to group repeated reports of the same incident within 4 hours.</li>
                <li>Accounts exhibiting automated submission velocity are flagged for manual municipal review without rewards credit until verified.</li>
              </ul>
            </section>

            {/* 5. Citizen Protection: Non-Penalization */}
            <section className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-2">
              <h2 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                Citizen Protection: Strict Non-Penalization Safeguard
              </h2>
              <p className="text-emerald-900 font-medium">
                CleanSight operates on a strict civic protection principle: <b>citizens reporting garbage in public spaces will never be fined, penalized, or investigated based on an uploaded photograph.</b>
              </p>
              <p className="text-emerald-800 text-[11px]">
                Penalties and legal violation notices are exclusively enforced against verified repeat commercial entities, unlawful construction dumpers, and defaulting contractors following formal administrative investigation and municipal commissioner sign-off.
              </p>
            </section>

            {/* 6. How Information is Shared */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center">5</span>
                Information Sharing & Municipal Dispatch
              </h2>
              <p>
                We share incident locations, garbage categories, and uploaded photographs strictly with authorized municipal cleaning squads (Collectors) and Sanitation Inspectors to facilitate rapid cleanup. We do not sell or rent personal information to third-party commercial marketing entities.
              </p>
            </section>

            {/* 7. Data Security */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center">6</span>
                Security & Data Retention
              </h2>
              <p>
                All account sessions are secured using industry-standard JSON Web Tokens (JWT) and Firebase Authentication HTTPS encryption. Uploaded images are stored in secure static storage and retained for audit and Sebelum/Sesudah (Before/After) public cleanliness verification.
              </p>
            </section>

            {/* 8. Contact */}
            <section className="space-y-2 pt-2 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Contact Civic Data Privacy Officer</h2>
              <p>
                If you have questions regarding data retention or wish to delete your citizen profile, please contact our privacy desk at: <b className="text-slate-800">privacy@cleansight.org</b> or call our municipal toll-free line: <b className="text-slate-800">1800-CLEAN-PUNE</b>.
              </p>
            </section>
          </div>
        ) : (
          /* ===================== TERMS AND CONDITIONS ===================== */
          <div className="space-y-8">
            {/* Effective date badge */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
              <span className="font-semibold">Civic Terms of Service • Valid 2026–2027</span>
              <span className="font-bold">Administered under Smart City Guidelines</span>
            </div>

            {/* 1. Acceptance */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-mono text-xs flex items-center justify-center">1</span>
                Acceptance of Terms
              </h2>
              <p>
                By registering an account, submitting garbage reports, or accessing the CleanSight platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, you must not use the platform.
              </p>
            </section>

            {/* 2. Authentication Requirement */}
            <section className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                Mandatory Authentication for Waste Submissions
              </h2>
              <p className="text-slate-700 font-medium">
                To prevent malicious spam, automated scraping, and fraudulent reward claims, <b>no user may upload photographs, activate live camera scanning, or submit waste incident reports without active authentication</b>.
              </p>
              <p className="text-[11px] text-slate-500">
                You may authenticate using your Google Account or Email/Password via Firebase. Unauthenticated guests may browse the city map, cleanliness scores, and impact statistics.
              </p>
            </section>

            {/* 3. Acceptable Use Policy */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-mono text-xs flex items-center justify-center">2</span>
                Acceptable Use & Genuine Reporting Standards
              </h2>
              <p>You agree to submit only genuine, unmanipulated photographs of public garbage and waste found within city limits. You explicitly agree NOT to:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Upload stock images, downloaded internet photographs, or digitally altered pictures of garbage.</li>
                <li>Intentionally dump waste to fabricate reports for the sole purpose of claiming reward points.</li>
                <li>Submit photographs of private residential interiors without lawful public interest.</li>
                <li>Harass, obstruct, or interfere with municipal sanitation collectors during field operations.</li>
              </ul>
            </section>

            {/* 4. Rewards Program Rules */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-mono text-xs flex items-center justify-center">3</span>
                CleanSight Reward Points & Voucher Rules
              </h2>
              <p>
                CleanSight points (+10 to +100 base points plus +20 Before/After bonus) are civic incentive units credited after AI detection and municipal review:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Points possess no direct cash surrender value and cannot be exchanged for fiat currency.</li>
                <li>Points are redeemable exclusively for digital badges, transit vouchers (Metro passes), and authorized eco-partner grocery discounts.</li>
                <li>CleanSight reserves the right to adjust point valuations or revoke points derived from duplicate or fraudulent reports.</li>
              </ul>
            </section>

            {/* 5. Collector Obligations & Before/After Proof */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-mono text-xs flex items-center justify-center">4</span>
                Cleaning Staff Protocol: Mandatory Photographic Proof
              </h2>
              <p>
                Cleaning staff and collection contractors must adhere to the 4-stage collection lifecycle: <i>Accept Task → Start Cleaning → Upload "After Cleaning" Photo → Mark Completed</i>.
              </p>
              <p>
                <b>Strict Proof Policy:</b> Tasks cannot be marked completed without uploading an authentic photograph of the cleaned and disinfected ground. Fabricated or blurred completion photos will result in administrative inquiry and task reassignment.
              </p>
            </section>

            {/* 6. Responsible Penalty Due Process */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-mono text-xs flex items-center justify-center">5</span>
                Commercial Violations & Penalty Due Process
              </h2>
              <p>
                Municipal authorities utilize CleanSight's verification system to track persistent illegal dumpers. In full accordance with municipal law:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>First-time violations result in formal municipal warnings.</li>
                <li>Repeat violations by identified commercial establishments or construction builders incur tiered administrative fines (₹2,000 to ₹15,000).</li>
                <li>All penalties require official verification and authorized sign-off by the Municipal Commissioner or designated Sanitation Officer.</li>
              </ul>
            </section>

            {/* 7. Limitation of Liability */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-mono text-xs flex items-center justify-center">6</span>
                Limitation of Liability
              </h2>
              <p>
                CleanSight provides technology tools to facilitate civic cleanliness. While we prioritize rapid collection, turnaround times may vary depending on weather events, traffic conditions, and municipal heavy equipment availability.
              </p>
            </section>

            {/* 8. Jurisdiction */}
            <section className="space-y-2 pt-2 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Governing Law</h2>
              <p>
                These terms are governed by the municipal regulations of Pune Municipal Corporation (PMC) and the Smart Cities Cleanliness Framework of India.
              </p>
            </section>
          </div>
        )}

        {/* Footer actions inside card */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] text-slate-400">
            Questions? Contact <b className="text-slate-700">support@cleansight.org</b>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('report')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Go to Report Garbage
            </button>
            <button
              onClick={() => navigate('home')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
