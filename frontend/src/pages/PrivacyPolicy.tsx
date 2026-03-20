import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ChevronRight, ArrowUp, Eye, Lock, Database, Share2, UserCheck, RefreshCw, Mail, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import AdvancedFooter from "@/components/AdvancedFooter";

const sections = [
  { id: "introduction", title: "Introduction", icon: Globe },
  { id: "information-we-collect", title: "Information We Collect", icon: Database },
  { id: "how-we-use", title: "How We Use Your Information", icon: Eye },
  { id: "information-sharing", title: "Information Sharing", icon: Share2 },
  { id: "data-security", title: "Data Security", icon: Lock },
  { id: "your-rights", title: "Your Rights", icon: UserCheck },
  { id: "cookies", title: "Cookies & Tracking", icon: RefreshCw },
  { id: "contact", title: "Contact Us", icon: Mail },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("introduction");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sectionEls = sections.map((s) => document.getElementById(s.id));
      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i];
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-white">
      <Navbar />

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6">
        {/* decorative blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-6">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[13px] font-semibold text-[#B8942E] tracking-wide uppercase">
              Legal &amp; Privacy
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Privacy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8942E]">
              Policy
            </span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            At Gemellery, your privacy is not a feature — it is a foundation. This
            policy explains exactly how we handle your personal data with
            transparency and care.
          </p>

          {/* meta pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
             // ✅ REPLACE WITH THIS — dynamic date
                { label: "Effective Date", value: "January 1, 2025" },
                { label: "Last Updated", value: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                { label: "Jurisdiction", value: "Sri Lanka & Global" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur rounded-full border border-gray-200/60 shadow-sm"
              >
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  {item.label}:
                </span>
                <span className="text-[13px] font-semibold text-gray-700">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Layout ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-12 pb-24">
        <div className="flex flex-col xl:flex-row gap-10">

          {/* ── Sticky TOC Sidebar ── */}
          <aside className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-32 bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-lg p-6">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                Table of Contents
              </p>
              <nav className="flex flex-col gap-1">
                {sections.map((s) => {
                  const Icon = s.icon;
                  const active = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] font-medium transition-all duration-200 group ${
                        active
                          ? "bg-gradient-to-r from-[#D4AF37]/15 to-[#F5D061]/10 text-[#B8942E] border border-[#D4AF37]/20"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active ? "text-[#D4AF37]" : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      {s.title}
                      {active && <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Questions about this policy?{" "}
                  <button
                    onClick={() => navigate("/contact")}
                    className="text-[#B8942E] hover:underline font-semibold"
                  >
                    Contact our team →
                  </button>
                </p>
              </div>
            </div>
          </aside>

          {/* ── Content ── */}
          <main className="flex-1 min-w-0">
            <div className="space-y-10">

              {/* ── 1. Introduction ── */}
              <PolicySection id="introduction" title="1. Introduction" icon={Globe}>
                <p>
                  Welcome to <strong>Gemellery</strong> — Sri Lanka's
                  premier Blockchain-based AI-powered gemstone marketplace. We are committed to protecting
                  your personal information and your right to privacy.
                </p>
                <p>
                  This Privacy Policy applies to all information collected through our
                  platform at <span className="text-[#B8942E] font-semibold">gemellery.lk</span>
                 
                </p>
                <p>
                  By accessing or using the Platform, you agree to the terms of this
                  Privacy Policy. If you do not agree, please discontinue use of our
                  services immediately. We encourage you to read this policy carefully
                  so you understand what we do with the information we collect.
                </p>
                <InfoBox>
                  Gemellery operates in full compliance with Sri Lankan data protection
                  laws, the Personal Data Protection Act (PDPA), and international best
                  practices including GDPR principles for our global user base.
                </InfoBox>
              </PolicySection>

              {/* ── 2. Information We Collect ── */}
              <PolicySection id="information-we-collect" title="2. Information We Collect" icon={Database}>
                <p>
                  We collect information you provide directly to us, information collected
                  automatically through your use of the Platform, and information from
                  third-party sources. Below is a detailed breakdown.
                </p>

                <SubHeading>2.1 Information You Provide to Us</SubHeading>
                <DataTable
                  rows={[
                    ["Account Registration", "Full name, email address, phone number, password, and profile photo."],
                    ["Seller Onboarding", "Business name, NIC/BRC number, gem dealer license details, NGJA certification documents, and bank account information for payment processing."],
                    ["Buyer Profiles", "Shipping address, billing address, purchase preferences, and saved payment methods (tokenised — we do not store raw card data)."],
                    ["AI Design Studio", "Design preferences, gem type selections, style inputs, and AI-generated design history linked to your account."],
                    ["Communications", "Messages sent via our live chat, emails to support, and feedback or reviews submitted on the platform."],
                    ["KYC Verification", "Government-issued identity documents required for NGJA-verified seller status and export transactions."],
                  ]}
                />

                <SubHeading>2.2 Information Collected Automatically</SubHeading>
                <DataTable
                  rows={[
                    ["Device Information", "IP address, browser type and version, operating system, device identifiers, and screen resolution."],
                    ["Usage Data", "Pages visited, time spent on pages, links clicked, search queries, and feature interactions within the Platform."],
                    ["Transaction Logs", "Order history, payment timestamps, escrow release events, and blockchain transaction hashes linked to Gem Passports."],
                    ["Location Data", "Approximate location inferred from IP address; precise GPS location only with explicit consent for relevant features."],
                    ["Cookies & Trackers", "Session cookies, authentication tokens, preference cookies, and analytics identifiers. See Section 7 for full details."],
                  ]}
                />

                <SubHeading>2.3 Information from Third Parties</SubHeading>
                <ul className="space-y-2 text-gray-700 text-[15px] leading-relaxed list-none">
                  {[
                    "NGJA (National Gem and Jewellery Authority) — seller and gemstone verification status.",
                    "EDB (Export Development Board) — registered exporter status for international transactions.",
                    "Payment Processors — transaction confirmation and fraud signals (no raw card data is shared with us).",
                    "Social Login Providers (Google OAuth) — your public profile name and email address only.",
                    "Blockchain Networks — public transaction records associated with Gem Passport NFTs.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </PolicySection>

              {/* ── 3. How We Use ── */}
              <PolicySection id="how-we-use" title="3. How We Use Your Information" icon={Eye}>
                <p>
                  We use the information we collect for the following purposes, each
                  grounded in a lawful basis under applicable data protection law.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {[
                    {
                      title: "Platform Operation",
                      desc: "To create and manage your account, process transactions, facilitate buyer-seller communications, and operate the escrow payment system.",
                    },
                    {
                      title: "NGJA Verification",
                      desc: "To verify gem seller credentials and gemstone certificates with the National Gem and Jewellery Authority on your behalf.",
                    },
                    {
                      title: "Blockchain Gem Passport",
                      desc: "To mint immutable digital ownership records for verified gemstones on the Ethereum blockchain, ensuring traceability from mine to owner.",
                    },
                    {
                      title: "AI Design Services",
                      desc: "To generate personalised jewellery designs using Gemini API based on your gem selections and style preferences.",
                    },
                    {
                      title: "Security & Fraud Prevention",
                      desc: "To detect, investigate, and prevent fraudulent transactions, unauthorised access, and other illegal activities on the Platform.",
                    },
                    {
                      title: "Legal Compliance",
                      desc: "To comply with Sri Lankan export regulations, anti-money laundering (AML) requirements, and international trade laws governing gemstone exports.",
                    },
                    {
                      title: "Customer Support",
                      desc: "To respond to your inquiries, resolve disputes, process refunds, and improve our support experience.",
                    },
                    {
                      title: "Analytics & Improvement",
                      desc: "To understand how users interact with the Platform and to continuously improve our features, interface, and performance.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-200/70 rounded-xl p-5"
                    >
                      <h4 className="text-[14px] font-bold text-gray-900 mb-1.5">
                        {item.title}
                      </h4>
                      <p className="text-[13px] text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <InfoBox variant="warning">
                  We do <strong>not</strong> sell your personal data to third parties for
                  their marketing purposes. We do not engage in data brokering. Your
                  information is used solely to deliver and improve the Gemellery service.
                </InfoBox>
              </PolicySection>

              {/* ── 4. Information Sharing ── */}
              <PolicySection id="information-sharing" title="4. Information Sharing & Disclosure" icon={Share2}>
                <p>
                  We do not share, sell, rent, or trade your personal information with
                  third parties for their commercial purposes. We may share your
                  information in the following limited circumstances:
                </p>

                <SubHeading>4.1 Service Providers</SubHeading>
                <p>
                  We work with carefully selected third-party service providers who
                  assist us in operating the Platform. These providers are contractually
                  obligated to protect your data and may only use it to perform services
                  on our behalf:
                </p>
                <DataTable
                  rows={[
                    ["Cloud Infrastructure", "Vercel (frontend hosting), Railway (backend), Aiven MySQL (database)"],
                    ["Blockchain Services", "Alchemy (Ethereum node provider), Sepolia / Polygon testnet"],
                    ["AI Services", "Google Gemini API for jewellery design generation"],
                    ["Payment Processing", "PCI-DSS compliant payment gateway providers for escrow transactions"],
                    ["Storage", "Web3.Storage / IPFS for decentralised Gem Passport metadata"],
                    ["Communication", "Email service providers for transactional notifications"],
                  ]}
                />

                <SubHeading>4.2 Regulatory &amp; Government Authorities</SubHeading>
                <p>
                  We may disclose your information to the NGJA, EDB, Sri Lanka Customs,
                  or other competent authorities when required by law, court order, or
                  to comply with gemstone export regulations. We will notify you of such
                  disclosures where legally permissible.
                </p>

                <SubHeading>4.3 Marketplace Participants</SubHeading>
                <p>
                  To facilitate transactions, certain information is shared between
                  buyers and sellers:
                </p>
                <ul className="space-y-2 text-gray-700 text-[15px] leading-relaxed list-none">
                  {[
                    "Buyers see seller display name, business location (city/region), NGJA verification badge, and public ratings.",
                    "Sellers see buyer's first name, order details, and shipping destination country — never full personal address until payment is confirmed.",
                    "Blockchain Gem Passport records (transaction hashes) are publicly verifiable on the blockchain by design.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <SubHeading>4.4 Business Transfers</SubHeading>
                <p>
                  If Gemellery is involved in a merger, acquisition, or asset sale, your
                  personal information may be transferred. We will notify you before your
                  data becomes subject to a different privacy policy and provide you with
                  choices at that time.
                </p>
              </PolicySection>

              {/* ── 5. Data Security ── */}
              <PolicySection id="data-security" title="5. Data Security" icon={Lock}>
                <p>
                  Protecting your data is a top engineering priority at Gemellery. We
                  implement a defence-in-depth security architecture with multiple layers
                  of protection.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {[
                    {
                      title: "Encryption",
                      detail:
                        "All data is encrypted in transit via TLS 1.3 and at rest using AES-256 encryption (FIPS 197 compliant). Payment data uses tokenisation.",
                    },
                    {
                      title: "Access Control",
                      detail:
                        "Role-based access control (RBAC) ensures that platform staff can only access data necessary for their specific job function.",
                    },
                    {
                      title: "Blockchain Integrity",
                      detail:
                        "Gem Passport data stored on the Ethereum blockchain is immutable by design. Smart contracts are audited using OpenZeppelin standards.",
                    },
                    {
                      title: "Fraud Detection",
                      detail:
                        "Real-time monitoring for suspicious activity, DDoS protection via Cloudflare, and a Web Application Firewall (WAF) filter malicious traffic.",
                    },
                    {
                      title: "Vulnerability Management",
                      detail:
                        "Smart contracts are tested on Sepolia testnet before mainnet deployment and audited using Slither and Mythril automated tools.",
                    },
                    {
                      title: "Incident Response",
                      detail:
                        "We maintain a tested cybersecurity incident response plan with defined escalation paths and breach notification procedures.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center mb-3">
                        <Lock className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <h4 className="text-[14px] font-bold text-white mb-1.5">{item.title}</h4>
                      <p className="text-[12px] text-slate-300 leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>

                <InfoBox>
                  While we implement industry-leading security measures, no system is
                  100% impenetrable. We encourage you to use a strong, unique password
                  and to report any suspicious activity to{" "}
                  <a
                  
                        href="mailto:gemellery.official@gmail.com"
                        >
                            gemellery.official@gmail.com
                  </a>
                  .
                </InfoBox>
              </PolicySection>

              {/* ── 6. Your Rights ── */}
              <PolicySection id="your-rights" title="6. Your Rights" icon={UserCheck}>
                <p>
                  Depending on your location and applicable law, you have the following
                  rights regarding your personal data. We honour these rights for all
                  users globally, not only those in specific jurisdictions.
                </p>

                <div className="space-y-3 mt-4">
                  {[
                    {
                      right: "Right to Access",
                      desc: "You may request a copy of all personal data we hold about you. We will respond within 30 days.",
                    },
                    {
                      right: "Right to Rectification",
                      desc: "You can update or correct inaccurate personal information directly in your account settings or by contacting us.",
                    },
                    {
                      right: "Right to Erasure",
                      desc: "You may request deletion of your account and personal data. Note: blockchain Gem Passport records are immutable by design and cannot be deleted. Regulatory records may also be retained as required by law.",
                    },
                    {
                      right: "Right to Data Portability",
                      desc: "You may request your personal data in a structured, machine-readable format (JSON/CSV) for transfer to another service.",
                    },
                    {
                      right: "Right to Restriction",
                      desc: "You may ask us to restrict processing of your data while a dispute or review is pending.",
                    },
                    {
                      right: "Right to Object",
                      desc: "You may object to processing based on our legitimate interests, including direct marketing communications.",
                    },
                    {
                      right: "Right to Withdraw Consent",
                      desc: "Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of prior processing.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 bg-white border border-gray-200/70 rounded-xl shadow-sm"
                    >
                      <span className="mt-0.5 w-6 h-6 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#B8942E] text-[11px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="text-[14px] font-bold text-gray-900 mb-0.5">{item.right}</h4>
                        <p className="text-[13px] text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-gray-700 text-[15px]">
                  To exercise any of these rights, please email us at{" "}
                  <a href="mailto:privacy@gemellery.lk" className="text-[#B8942E] font-semibold hover:underline">
                    privacy@gemellery.lk
                  </a>{" "}
                  or use the Data Request form in your account settings. We may require
                  identity verification before fulfilling your request.
                </p>
              </PolicySection>

              {/* ── 7. Cookies ── */}
              <PolicySection id="cookies" title="7. Cookies & Tracking Technologies" icon={RefreshCw}>
                <p>
                  We use cookies and similar tracking technologies to operate the
                  Platform, remember your preferences, and understand usage patterns.
                </p>

                <DataTable
                  headers={["Cookie Type", "Purpose", "Duration"]}
                  rows={[
                    ["Strictly Necessary", "Authentication tokens, session management, CSRF protection, and security features. Cannot be disabled.", "Session / 30 days"],
                    ["Functional", "Remembering your language preference, currency, theme settings, and saved design preferences.", "1 year"],
                    ["Analytics", "Understanding how users navigate the Platform to improve features (anonymised data only via privacy-preserving analytics).", "90 days"],
                    ["Payment Security", "Fraud prevention signals required by our payment gateway partners to protect transactions.", "Session"],
                  ]}
                />

                <SubHeading>Managing Your Cookie Preferences</SubHeading>
                <p>
                  You can manage non-essential cookies through our Cookie Preference
                  Centre accessible from the footer of every page. You may also
                  configure your browser to block or delete cookies; however, this may
                  impact Platform functionality. We do not currently respond to "Do Not
                  Track" browser signals as there is no industry-standard interpretation.
                </p>

                <InfoBox>
                  We do <strong>not</strong> use third-party advertising cookies or
                  cross-site tracking technologies. Our analytics are privacy-preserving
                  and do not build individual user profiles for advertising purposes.
                </InfoBox>
              </PolicySection>

              {/* ── 8. Contact ── */}
              <PolicySection id="contact" title="8. Contact Us" icon={Mail}>
                <p>
                  If you have questions, concerns, or requests regarding this Privacy
                  Policy or our data practices, please contact us through any of the
                  following channels:
                </p>

               <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {[
                        { label: "General Inquiries", value: "gemellery.official@gmail.com", href: "mailto:gemellery.official@gmail.com" },
                        { label: "Contact Form", value: "gemellery.lk/contact", href: "/contact" },

                    ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 p-4 bg-white border border-gray-200/70 rounded-xl shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-[14px] font-semibold text-[#B8942E] hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-[14px] font-semibold text-gray-700">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-5 bg-gradient-to-r from-[#D4AF37]/10 to-[#F5D061]/5 border border-[#D4AF37]/20 rounded-xl">
                  <h4 className="text-[14px] font-bold text-gray-900 mb-2">
                    Policy Updates
                  </h4>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    We may update this Privacy Policy from time to time. When we make
                    material changes, we will notify you via email and a prominent
                    notice on the Platform at least 14 days before the change takes
                    effect. Continued use of the Platform after the effective date
                    constitutes acceptance of the updated policy. The "Last Updated"
                    date at the top of this page reflects the most recent revision.
                  </p>
                </div>
              </PolicySection>

            </div>
          </main>
        </div>
      </div>

      {/* ── Scroll-to-top ── */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8942E] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <AdvancedFooter />
    </div>
  );
}

/* ─── Reusable sub-components ─── */

function PolicySection({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
        {/* section header */}
        <div className="flex items-center gap-4 px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#F5D061]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h2 className="text-[18px] md:text-[20px] font-bold text-gray-900">{title}</h2>
        </div>
        {/* section body */}
        <div className="px-8 py-7 prose-custom space-y-4 text-gray-700 text-[15px] leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[15px] font-bold text-gray-900 mt-6 mb-2 border-l-4 border-[#D4AF37] pl-3">
      {children}
    </h3>
  );
}

function InfoBox({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "warning";
}) {
  const styles =
    variant === "warning"
      ? "bg-amber-50 border-amber-200 text-amber-900"
      : "bg-blue-50/60 border-blue-200/60 text-blue-900";
  return (
    <div className={`mt-4 p-4 rounded-xl border text-[13px] leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

function DataTable({
  rows,
  headers,
}: {
  rows: string[][];
  headers?: string[];
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200/70 shadow-sm">
      <table className="w-full text-[13px]">
        {headers && (
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200/70">
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[11px]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-gray-100 last:border-0 ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <td className="px-5 py-3.5 font-semibold text-gray-800 align-top whitespace-nowrap">
                {row[0]}
              </td>
              <td className="px-5 py-3.5 text-gray-600 leading-relaxed">
                {row[1]}
              </td>
              {row[2] && (
                <td className="px-5 py-3.5 text-gray-500 align-top whitespace-nowrap">
                  {row[2]}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}