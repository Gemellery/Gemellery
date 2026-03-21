import { Gem, ShoppingBag, Store, Sparkles, Truck, UserCircle } from "lucide-react";
import type { ElementType } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  category: string;
  icon: ElementType;
  items: FAQItem[];
}

export const faqData: FAQCategory[] = [
  {
    category: "About Gemellery",
    icon: Gem,
    items: [
      {
        question: "What is Gemellery?",
        answer: "Gemellery is a pioneering digital platform connecting Sri Lankan gemstone sellers directly with global buyers, eliminating intermediaries and ensuring authenticity.",
      },
      {
        question: "Is Gemellery a trusted platform?",
        answer: "Yes. All sellers go through a strict verification process. Each gemstone listing is reviewed before it goes live on the marketplace.",
      },
      {
        question: "What makes Gemellery different from other gem platforms?",
        answer: "We combine AI-powered jewelry design tools, verified Sri Lankan sellers, blockchain-backed authenticity, and a seamless buyer experience — all in one place.",
      },
    ],
  },
  {
    category: "Buying Gemstones",
    icon: ShoppingBag,
    items: [
      {
        question: "How do I purchase a gemstone?",
        answer: "Browse our marketplace, select a gemstone, add it to your cart, and proceed to checkout. You will need to create or sign into your buyer account.",
      },
      {
        question: "Are the gemstones authentic?",
        answer: "All gemstones on Gemellery are verified by our team before listing. We ensure authenticity through seller verification and gem certification documents.",
      },
      {
        question: "Can I return a gemstone?",
        answer: "Yes. We have a return policy in place. Please refer to our Terms of Service or contact our support team for specific return conditions.",
      },
      {
        question: "What payment methods are accepted?",
        answer: "We accept major credit/debit cards, and we are continuously expanding our payment options for international buyers.",
      },
    ],
  },
  {
    category: "Selling on Gemellery",
    icon: Store,
    items: [
      {
        question: "How do I become a seller on Gemellery?",
        answer: "Register as a seller, complete the verification process, and once approved, you can start listing your gemstones on the marketplace.",
      },
      {
        question: "Is there a fee to sell on Gemellery?",
        answer: "Please refer to our seller agreement or contact our team for the latest information on seller fees and commissions.",
      },
      {
        question: "How long does seller verification take?",
        answer: "The verification process typically takes 2 to 5 business days. You will receive an email notification once your account is approved.",
      },
    ],
  },
  {
    category: "AI Design Studio",
    icon: Sparkles,
    items: [
      {
        question: "What is the AI Design Studio?",
        answer: "Our AI Design Studio lets you create custom jewelry designs using artificial intelligence. You describe your vision, and the AI generates design options for you.",
      },
      {
        question: "Is the AI Design Studio free to use?",
        answer: "Yes, the AI Design Studio is available to all registered users on Gemellery.",
      },
      {
        question: "Can I save my jewelry designs?",
        answer: "Yes! Your design history is saved automatically. You can revisit, refine, and share your designs anytime from your account.",
      },
    ],
  },
  {
    category: "Shipping & Orders",
    icon: Truck,
    items: [
      {
        question: "How long does shipping take?",
        answer: "Shipping times vary by location. Domestic orders typically arrive within 3 to 5 business days. International orders may take 7 to 14 business days.",
      },
      {
        question: "Can I track my order?",
        answer: "Yes. Once your order is shipped, you will receive a tracking number via email to monitor your delivery status.",
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, Gemellery ships to many countries worldwide. Shipping fees and delivery times vary by destination.",
      },
    ],
  },
  {
    category: "Account & Support",
    icon: UserCircle,
    items: [
      {
        question: "How do I reset my password?",
        answer: "Click Forgot Password on the Sign In page, enter your email address, and follow the instructions sent to your inbox.",
      },
      {
        question: "How can I contact Gemellery support?",
        answer: "You can reach our support team through the Contact Us page, or email us directly. We aim to respond within 24 hours.",
      },
    ],
  },
];