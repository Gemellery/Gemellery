import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AdvancedFooter from "@/components/AdvancedFooter";
import {
  ChevronRight,
  Shield,
  FileText,
  Scale,
  Lock,
  Globe,
  AlertTriangle,
  RefreshCw,
  Mail,
  ArrowUp,
} from "lucide-react";

// ─── Terms metadata — only edit here when Terms change ───────────────────────
const TERMS = {
  effectiveDate: "18th March 2026",
  lastUpdated:   "18th March 2026",
  version:       "1.0",
  officialEmail:  "gemellery.official@gmail.com",
  address:       "Colombo, Sri Lanka",
};

// ─── Section definitions ─────────────────────────────────────────────────────
const SECTIONS = [
  { id: "acceptance",   icon: FileText,      title: "Acceptance of Terms"       },
  { id: "eligibility",  icon: Shield,        title: "Eligibility & Registration" },
  { id: "marketplace",  icon: Globe,         title: "Marketplace Rules"          },
  { id: "verification", icon: Shield,        title: "Gem Verification & NGJA"    },
  { id: "payments",     icon: Scale,         title: "Payments & Escrow"          },
  { id: "intellectual", icon: Lock,          title: "Intellectual Property"      },
  { id: "prohibited",   icon: AlertTriangle, title: "Prohibited Activities"      },
  { id: "liability",    icon: Scale,         title: "Limitation of Liability"    },
  { id: "privacy",      icon: Lock,          title: "Privacy & Data"             },
  { id: "termination",  icon: AlertTriangle, title: "Termination"                },
  { id: "amendments",   icon: RefreshCw,     title: "Amendments"                 },
  { id: "contact",      icon: Mail,          title: "Contact Us"                 },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TermsAndConditions() {
  const navigate = useNavigate();
  const [activeSection,  setActiveSection]  = useState("acceptance");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop,  setShowBackToTop]  = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top on first mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll progress bar + active section tracker + back-to-top
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
      setShowBackToTop(window.scrollY > 400);

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to a section with navbar offset
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  
  // Back to top
  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className="min-h-screen bg-[#FAFAF8]"
      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
    >
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 z-[100] transition-all duration-75"
        style={{
          width: `${scrollProgress}%`,
          background: "linear-gradient(to right, #D4AF37, #F5D061)",
        }}
      />

      <Navbar />

      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1128] via-[#1a2444] to-[#0d1832] pt-16 pb-20 px-6">
        {/* Decorative gem-diamond shapes */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.04]">
          <div className="absolute top-8   left-12  w-32 h-32 border border-[#D4AF37] rotate-45" />
          <div className="absolute top-16  left-20  w-16 h-16 border border-[#D4AF37] rotate-45" />
          <div className="absolute bottom-8  right-16 w-40 h-40 border border-[#D4AF37] rotate-45" />
          <div className="absolute bottom-20 right-28 w-20 h-20 border border-[#D4AF37] rotate-45" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-[#D4AF37] rotate-12" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Breadcrumb — navigates to Home */}
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8">
            <button
              onClick={() => navigate("/")}
              className="hover:text-[#D4AF37] transition-colors duration-200"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-[#D4AF37]">Terms of Service</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-6">
            <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">
              Legal Agreement
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Terms of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F5D061]">
              Service
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Please read these terms carefully before using the Gemellery platform. By
            accessing our services, you agree to be bound by this agreement.
          </p>

         
        </div>
      </div>

      {/* ── Main two-column layout ────────────────────────────────────────────── */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Sticky sidebar ────────────────────────────────────────────────── */}
          <aside className="lg:w-72 shrink-0 print:hidden">
            <div className="sticky top-28">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#0A1128] to-[#1a2444] px-5 py-4">
                  <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase">
                    Table of Contents
                  </p>
                </div>

                {/* Section links */}
                <nav className="p-3">
                  {SECTIONS.map((section, index) => {
                    const Icon     = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-200 group mb-0.5 ${
                          isActive
                            ? "bg-[#D4AF37]/10 text-[#B8960A] font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span
                          className={`text-xs font-bold w-5 shrink-0 ${
                            isActive
                              ? "text-[#D4AF37]"
                              : "text-gray-300 group-hover:text-gray-400"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? "text-[#D4AF37]" : "text-gray-400"
                          }`}
                        />
                        <span className="leading-tight">{section.title}</span>
                        {isActive && (
                          <div className="ml-auto w-1 h-4 rounded-full bg-[#D4AF37]" />
                        )}
                      </button>
                    );
                  })}
                </nav>

              </div>
            </div>
          </aside>

          {/* ── Content ───────────────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Important notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">Important Notice</p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  These Terms of Service govern your use of the Gemellery platform — an
                  AI-powered marketplace for authentic Sri Lankan gemstones. By creating an
                  account or using our services, you confirm that you have read, understood,
                  and agree to these terms. Effective from{" "}
                  <strong>{TERMS.effectiveDate}</strong>.
                </p>
              </div>
            </div>

            {/* ── Section 01 ── */}
            <Section id="acceptance" number="01" title="Acceptance of Terms" icon={FileText}>
              <P>
                Welcome to <Strong>Gemellery</Strong>, an AI-powered digital marketplace
                connecting Sri Lankan gem sellers with buyers worldwide. These Terms of
                Service ("Terms") constitute a legally binding agreement between you
                ("User," "you," or "your") and Gemellery ("we," "us," or "our").
              </P>
              <P>
                By accessing or using Gemellery — whether as a buyer, seller, or guest —
                you acknowledge that you have read, understood, and agree to be bound by
                these Terms and our Privacy Policy. If you do not agree with any part of
                these Terms, you must not access or use our platform.
              </P>
              <Callout>
                Your continued use of Gemellery after any changes to these Terms
                constitutes acceptance of the revised Terms. We recommend reviewing this
                page periodically.
              </Callout>
            </Section>

            {/* ── Section 02 ── */}
            <Section id="eligibility" number="02" title="Eligibility & Registration" icon={Shield}>
              <P>To use Gemellery, you must meet all of the following eligibility criteria:</P>
              <Bullets items={[
                "Be at least 18 years of age or the age of majority in your jurisdiction.",
                "Have the legal capacity to enter into a binding contract.",
                "Not be prohibited from using the platform under applicable laws.",
                "Provide accurate, complete, and current registration information.",
                "Maintain the security of your account credentials at all times.",
              ]} />
              <P>
                <Strong>Seller Registration:</Strong> Sellers must additionally undergo a
                dual-layer verification process administered by the National Gem and
                Jewellery Authority (NGJA) of Sri Lanka. This includes business registration
                verification, gem dealer licence validation, and compliance with Export
                Development Board (EDB) regulations where applicable.
              </P>
              <P>
                <Strong>Account Responsibility:</Strong> You are solely responsible for all
                activities conducted through your account. Gemellery reserves the right to
                suspend or terminate accounts that provide false information or violate these
                Terms.
              </P>
            </Section>

            {/* ── Section 03 ── */}
            <Section id="marketplace" number="03" title="Marketplace Rules" icon={Globe}>
              <P>
                Gemellery operates as a B2B and B2C marketplace. The following rules apply
                to all users engaging in transactions on the platform:
              </P>
              <Sub>For Sellers</Sub>
              <Bullets items={[
                "All gemstones listed must be authentic and certified by the NGJA.",
                "Product descriptions, images, and certifications must be accurate and not misleading.",
                "Sellers may not list gemstones that have been illegally mined, traded, or exported.",
                "Pricing must reflect fair market value; price manipulation is strictly prohibited.",
                "Sellers must fulfil orders within the agreed timeframe or notify buyers of delays.",
                "Gem Passport blockchain records must be accurately maintained for each listed item.",
              ]} />
              <Sub>For Buyers</Sub>
              <Bullets items={[
                "Buyers must not engage in fraudulent purchase attempts or chargeback abuse.",
                "All purchases are subject to Gemellery's escrow payment system.",
                "Buyers are encouraged to verify NGJA certification before completing a purchase.",
                "Disputes must be raised within 7 days of receiving an order.",
              ]} />
              <Callout variant="info">
                Gemellery acts as an intermediary platform only. We do not take possession
                of gems at any point. Physical delivery is handled by approved third-party
                logistics partners.
              </Callout>
            </Section>

            {/* ── Section 04 ── */}
            <Section id="verification" number="04" title="Gem Verification & NGJA" icon={Shield}>
              <P>
                Gemellery is integrated with the{" "}
                <Strong>National Gem and Jewellery Authority (NGJA)</Strong> of Sri Lanka to
                ensure the authenticity and legitimacy of all gemstones traded on the
                platform.
              </P>
              <Bullets items={[
                "All gemstones must hold a valid NGJA certificate before being listed.",
                "Gemellery performs dual-layer verification: seller verification and individual gem certification.",
                "A blockchain-powered Gem Passport is issued for each verified gemstone, providing an immutable digital ownership and certification record.",
                "NGJA certification data is stored via IPFS-backed metadata and referenced on-chain.",
                "Gemellery does not issue gemstone certifications — we only validate existing NGJA-issued certificates.",
                "Any attempt to submit forged or expired certificates will result in immediate account termination and may be reported to relevant authorities.",
              ]} />
              <P>
                For export transactions, sellers must additionally comply with EDB-registered
                exporter requirements. Gemellery facilitates this workflow but bears no legal
                responsibility for export compliance failures attributable to the seller.
              </P>
            </Section>

            {/* ── Section 05 ── */}
            <Section id="payments" number="05" title="Payments & Escrow" icon={Scale}>
              <P>
                All transactions on Gemellery are processed through our secure escrow-based
                payment system to protect both buyers and sellers.
              </P>
              <Sub>How Escrow Works</Sub>
              <Bullets items={[
                "Upon purchase, payment is held securely in escrow.",
                "Funds are released to the seller only after the buyer confirms receipt and satisfaction.",
                "If no dispute is raised within 7 days of delivery confirmation, funds are automatically released.",
                "Our payment gateway is PCI-DSS compliant and supports multiple currencies.",
              ]} />
              <Sub>Fees</Sub>
              <Bullets items={[
                "Gemellery charges a commission on B2B and B2C transactions. Exact rates are displayed at checkout.",
                "AI Design Studio services may incur separate service fees.",
                "Featured seller listings and promotional placements are charged as per our pricing schedule.",
                "Currency conversion fees may apply for international transactions.",
              ]} />
              <Sub>Refunds & Disputes</Sub>
              <Bullets items={[
                "Disputes must be raised within 7 days of delivery.",
                "Gemellery's dispute resolution team will investigate and mediate all claims.",
                "Refunds are processed within 10–14 business days upon resolution.",
                "Gemellery's decision in disputes is final and binding.",
              ]} />
            </Section>

            {/* ── Section 06 ── */}
            <Section id="intellectual" number="06" title="Intellectual Property" icon={Lock}>
              <P>
                All content on the Gemellery platform — including but not limited to the
                website design, logo, graphics, AI-generated imagery, text, software, and
                blockchain architecture — is the intellectual property of Gemellery or its
                licensors and is protected under applicable copyright, trademark, and
                intellectual property laws.
              </P>
              <Bullets items={[
                "You may not reproduce, distribute, modify, or create derivative works from Gemellery's content without express written permission.",
                "AI-generated jewellery designs created via the Gemellery Design Studio are provided for personal reference only. Commercial use requires independent legal review for potential IP conflicts.",
                "Sellers retain ownership of their original content (images, descriptions) but grant Gemellery a non-exclusive licence to display such content on the platform.",
                "The Gemellery name, logo, and branding may not be used without prior written consent.",
              ]} />
              <Callout variant="warning">
                AI-generated jewellery designs may inadvertently resemble existing patented
                designs. Users are advised to consult a legal expert before using
                AI-generated designs for commercial purposes.
              </Callout>
            </Section>

            {/* ── Section 07 ── */}
            <Section id="prohibited" number="07" title="Prohibited Activities" icon={AlertTriangle}>
              <P>The following activities are strictly prohibited on the Gemellery platform:</P>
              <Bullets items={[
                "Listing, trading, or exporting illegally sourced or conflict gemstones.",
                "Submitting fraudulent, forged, or expired NGJA certifications.",
                "Misrepresenting the quality, origin, or characteristics of any gemstone.",
                "Engaging in market manipulation, price fixing, or fraudulent bidding.",
                "Attempting to circumvent the escrow payment system.",
                "Using the platform for money laundering or other illegal financial activities.",
                "Hacking, reverse engineering, or attempting to compromise platform security.",
                "Creating fake accounts, impersonating others, or engaging in identity fraud.",
                "Scraping, data mining, or automated access without written consent.",
                "Uploading malware, viruses, or any malicious code.",
                "Harassing, threatening, or abusing other platform users.",
                "Using the AI Design Studio to infringe upon existing intellectual property.",
              ]} />
              <P>
                Violation of any prohibited activity may result in immediate account
                suspension, permanent banning, reporting to law enforcement, and/or legal
                action. Gemellery cooperates fully with relevant authorities including the
                NGJA, EDB, and Sri Lanka Police.
              </P>
            </Section>

            {/* ── Section 08 ── */}
            <Section id="liability" number="08" title="Limitation of Liability" icon={Scale}>
              <P>
                To the fullest extent permitted by applicable law, Gemellery and its
                officers, directors, employees, agents, and affiliates shall not be liable
                for:
              </P>
              <Bullets items={[
                "Any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.",
                "Loss of profits, revenue, data, or business opportunities.",
                "Disputes between buyers and sellers regarding gemstone quality or authenticity.",
                "Delays or failures in export processes attributable to third-party partners or regulatory bodies.",
                "Service interruptions, technical failures, or data breaches resulting from circumstances beyond our reasonable control.",
                "The accuracy or completeness of NGJA certification data provided by sellers.",
                "AI-generated design recommendations that may infringe third-party intellectual property.",
              ]} />
              <Callout>
                Gemellery's total liability to you for any claim arising from these Terms
                shall not exceed the total fees paid by you to Gemellery in the six (6)
                months preceding the claim.
              </Callout>
              <P>
                Gemellery provides the platform on an "as is" and "as available" basis
                without warranties of any kind, whether express or implied, including but
                not limited to implied warranties of merchantability or fitness for a
                particular purpose.
              </P>
            </Section>

            {/* ── Section 09 ── */}
            <Section id="privacy" number="09" title="Privacy & Data" icon={Lock}>
              <P>
                Gemellery is committed to protecting your personal information in accordance
                with applicable data protection laws, including GDPR where applicable to
                international users.
              </P>
              <Bullets items={[
                "Personal data is collected solely for the purpose of operating and improving the platform.",
                "We employ data minimisation principles — only necessary data is collected.",
                "All data is encrypted in transit (TLS) and at rest within our managed database infrastructure.",
                "Blockchain records (Gem Passports) store only IPFS hashes, not personally identifiable information.",
                "You have the right to access, export, or request deletion of your personal data.",
                "We do not sell your personal data to third parties.",
                "Cookies and analytics are used to improve user experience, with clear consent mechanisms.",
              ]} />
              <P>
                For full details, please refer to our{" "}
                <button
                  onClick={() => navigate("/privacy-policy")}
                  className="text-[#D4AF37] hover:underline font-semibold"
                >
                  Privacy Policy
                </button>
                .
              </P>
            </Section>

            {/* ── Section 10 ── */}
            <Section id="termination" number="10" title="Termination" icon={AlertTriangle}>
              <P>
                Gemellery reserves the right to suspend or permanently terminate your
                account, with or without notice, for any of the following reasons:
              </P>
              <Bullets items={[
                "Violation of any provision of these Terms of Service.",
                "Submission of fraudulent information during registration or verification.",
                "Engagement in prohibited activities as outlined in Section 07.",
                "Failure to comply with NGJA regulations or EDB export requirements.",
                "At our sole discretion if we determine your account poses a risk to the platform or its users.",
              ]} />
              <P>
                Upon termination, your access to the platform will be revoked immediately.
                Any pending escrow funds will be handled in accordance with our dispute
                resolution policy. Blockchain Gem Passport records may be preserved for
                regulatory compliance purposes.
              </P>
              <P>
                You may also voluntarily close your account at any time by contacting our
                support team. Account closure does not automatically delete data that we are
                legally required to retain.
              </P>
            </Section>

            {/* ── Section 11 ── */}
            <Section id="amendments" number="11" title="Amendments" icon={RefreshCw}>
              <P>
                Gemellery reserves the right to modify, update, or replace these Terms of
                Service at any time at our sole discretion. We are committed to keeping you
                informed of material changes:
              </P>
              <Bullets items={[
                "Material changes will be communicated via email to registered users at least 14 days before taking effect.",
                "Minor updates (e.g., grammatical corrections, clarifications) may be made without prior notice.",
                "Continued use of the platform after the effective date constitutes acceptance of revised Terms.",
              ]} />
              <P>
                These Terms are governed by the laws of Sri Lanka. Any disputes arising from
                these Terms shall be subject to the exclusive jurisdiction of the courts of
                Sri Lanka, without prejudice to mandatory consumer protection provisions
                applicable in your country of residence.
              </P>
            </Section>

            {/* ── Section 12 ── */}
            <Section id="contact" number="12" title="Contact Us" icon={Mail}>
              <P>
                If you have any questions, concerns, or requests regarding these Terms of
                Service, please do not hesitate to reach out to our team:
              </P>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <ContactCard label="General Inquiries">
                  <a
                    href={`mailto:${TERMS.officialEmail}`}
                    className="text-sm font-semibold text-[#D4AF37] hover:underline break-all"
                  >
                    {TERMS.officialEmail}
                  </a>
                </ContactCard>

               

                <ContactCard label="Support">
                  <button
                    onClick={() => navigate("/contact")}
                    className="text-sm font-semibold text-[#D4AF37] hover:underline text-left"
                  >
                    Visit Contact us →
                  </button>
                </ContactCard>

                <ContactCard label="FAQ">
                  <button
                    onClick={() => navigate("/faq")}
                    className="text-sm font-semibold text-[#D4AF37] hover:underline text-left"
                  >
                    View Frequently Asked Questions →
                  </button>
                </ContactCard>

                <ContactCard label="Registered Address">
                  <p className="text-sm font-semibold text-gray-800">{TERMS.address}</p>
                </ContactCard>

                <ContactCard label="Response Time">
                  <p className="text-sm font-semibold text-gray-800">Within 2 business days</p>
                  <p className="text-xs text-gray-500 mt-1">
                    For urgent legal matters use subject:{" "}
                    <em>URGENT – LEGAL</em>
                  </p>
                </ContactCard>
              </div>
            </Section>

            {/* ── Agreement footer card ── */}
            <div className="mt-12 bg-gradient-to-br from-[#0A1128] to-[#1a2444] rounded-2xl p-8 text-center print:hidden">
              <Scale className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-white text-lg font-bold mb-2">You Agree to These Terms</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto mb-6">
                By using the Gemellery platform, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service and our Privacy
                Policy. Last updated:{" "}
                <span className="text-gray-300">{TERMS.lastUpdated}</span>.
              </p>
            <div className="flex flex-wrap gap-3 justify-center">
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2.5 bg-[#D4AF37] text-[#0A1128] text-sm font-semibold rounded-full hover:bg-[#F5D061] transition-colors duration-200"
                >
                    Return to Home
                </button>
                </div>
            </div>

          </main>
        </div>
      </div>

      {/* ── Back to top button ─────────────────────────────────────────────────── */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-[#D4AF37] text-[#0A1128] flex items-center justify-center shadow-lg hover:bg-[#F5D061] transition-all duration-200 print:hidden"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <AdvancedFooter />

      {/* Print styles — hides nav, sidebar, buttons when user prints */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Reusable sub-components ─────────────────────────────────────────────────

function Section({
  id, number, title, icon: Icon, children,
}: {
  id: string;
  number: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10 scroll-mt-36">
      <div className="flex items-start gap-4 mb-5">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
          <Icon style={{ width: 18, height: 18, color: "#D4AF37" }} />
        </div>
        <div>
          <p className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase mb-0.5">
            Section {number}
          </p>
          <h2 className="text-xl font-bold text-[#0A1128]">{title}</h2>
        </div>
      </div>
      <div className="ml-14 space-y-4 text-gray-600 text-sm leading-relaxed">
        {children}
      </div>
      <div className="mt-8 border-b border-gray-100" />
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600 leading-relaxed">{children}</p>;
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-gray-800">{children}</strong>;
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider mt-5 mb-2 border-l-2 border-[#D4AF37] pl-3">
      {children}
    </h3>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 my-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
          <div className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "info" | "warning";
}) {
  const styles = {
    default: { borderColor: "rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.06)", color: "#78350f" },
    info:    { borderColor: "#bfdbfe",               background: "#eff6ff",               color: "#1e40af" },
    warning: { borderColor: "#fed7aa",               background: "#fff7ed",               color: "#9a3412" },
  };
  return (
    <div
      className="rounded-xl p-4 my-4 text-sm leading-relaxed border"
      style={styles[variant]}
    >
      {children}
    </div>
  );
}

function ContactCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      {children}
    </div>
  );
}