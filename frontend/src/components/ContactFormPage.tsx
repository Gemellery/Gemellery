import React, { useState } from 'react';
import { Phone, FileText, ChevronDown } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  inquiryType: string;
  message: string;
  subscribe: boolean;
}

const ConciergeContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    inquiryType: 'General Inquiry',
    message: '',
    subscribe: false
  });

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I verify the authenticity of a gemstone?',
      answer: 'We provide comprehensive certification and authentication services through our expert gemologists. Each gemstone can be verified through detailed documentation and laboratory testing.'
    },
    {
      question: 'What is the process for Bespoke Design?',
      answer: 'Our bespoke design process begins with a consultation to understand your vision, followed by design proposals, material selection, and expert craftsmanship to create your unique piece.'
    },
    {
      question: 'Do you offer international shipping and insurance?',
      answer: 'Yes, we offer secure international shipping with full insurance coverage. All items are carefully packaged and tracked throughout delivery.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 text-white py-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-800/20 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
            ✦ CONCIERGE SERVICE
          </div>
          <h1 className="text-5xl font-serif font-bold mb-6">
            How can we assist you today?
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Whether you're seeking a rare sapphire, require valuation, expert talk, or need help with an order, our dedicated team and AI Gemologist are at your service.
          </p>
        </div>
      </div>

      {/* Service Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* AI Gemologist */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-teal-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 7V12C4 16.97 7.58 21.29 12 22C16.42 21.29 20 16.97 20 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8L9 11L10.5 13L12 15L13.5 13L15 11L12 8Z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Gemologist</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Get instant expert knowledge on quality, cuts, valuation, and origin with Gembot 24/7.
            </p>
            <button className="text-teal-700 font-medium text-sm hover:text-teal-800 flex items-center gap-2">
              Start Chat →
            </button>
          </div>

          {/* Private Client Line */}
          <div className="bg-gradient-to-br from-teal-50 to-white rounded-lg shadow-lg p-8 border border-teal-100">
            <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Private Client Line</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Speak directly with our senior gemologist for high-value transactions and bespoke requests.
            </p>
            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
              <div className="font-semibold text-gray-900">+94 11 234 5678</div>
              <div className="text-sm text-gray-500">Mon-Fri, 9AM - 6PM IST</div>
            </div>
          </div>

          {/* Knowledge Base */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Knowledge Base</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Browse our tutorials on pricing, gemstone care, investment guides, and certification details.
            </p>
            <button className="text-teal-700 font-medium text-sm hover:text-teal-800 flex items-center gap-2">
              View FAQs →
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Info */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-10">
            <h2 className="text-3xl font-serif font-bold mb-6">Send us a Message</h2>
            <p className="text-gray-700 mb-8">
              For specific inquiries regarding orders, customization, or partnerships, please fill out the form. Our consultants (locally sourced) will respond within 24 hours.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">Secure & Encrypted Communication</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700">Guaranteed response within 24 hours</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="bg-gradient-to-br from-teal-800 to-teal-900 rounded-lg p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    
                    <span className="text-xs uppercase tracking-wide opacity-90">Headquarters</span>
                  </div>
                  <div className="text-base font-semibold">Colombo, Sri Lanka</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-2xl shadow-lg p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="e.g. Alexander"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Hamilton"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inquiry Type
                </label>
                <div className="relative">
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition appearance-none bg-white"
                  >
                    <option>General Inquiry</option>
                    <option>Gemstone Authentication</option>
                    <option>Bespoke Design</option>
                    <option>Valuation Request</option>
                    <option>Partnership Opportunity</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can we help you create something timeless?"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none"
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="subscribe"
                  checked={formData.subscribe}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                />
                <label className="text-sm text-gray-600">
                  Subscribe to our journal for market insights and rare collection alerts
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Send Message →
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-5 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="text-teal-700 font-medium hover:text-teal-800">
              View Help Center →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConciergeContactPage;