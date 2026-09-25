import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How do purchases work?',
    answer: 'Browse our catalog, select a book, and click "Buy Now." You\'ll be directed to a secure Paystack payment page. After successful payment, you\'ll receive instant access to download your book.',
  },
  {
    question: 'What payment methods are supported?',
    answer: 'We use Paystack for secure payments. You can pay using debit/credit cards (Visa, Mastercard, Verve), bank transfers, USSD, and other supported methods.',
  },
  {
    question: 'How do I download my purchased books?',
    answer: 'After payment, you\'ll be taken to an order confirmation page with a download button. If you have an account, you can also access your books anytime from your "My Library" dashboard.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No, you can purchase as a guest. However, creating an account lets you access your books anytime from your dashboard without needing to save download links.',
  },
  {
    question: 'What happens after payment?',
    answer: 'Once payment is confirmed, you\'ll immediately get access to download your book. You\'ll also receive a confirmation email with your order details and download access.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Due to the digital nature of our products, refunds are handled on a case-by-case basis. If you experience issues with a purchased book (corrupted file, wrong book delivered), please contact our support team.',
  },
  {
    question: 'I\'m having trouble downloading my book. What do I do?',
    answer: 'First, try using a different browser or clearing your cache. If the issue persists, contact us at support@bookvault.ng with your order number and we\'ll help resolve it.',
  },
  {
    question: 'Are the book files safe and virus-free?',
    answer: 'Yes. All our books are thoroughly checked before being made available. Files are delivered securely through our protected download system.',
  },
  {
    question: 'How long do I have access to my purchased books?',
    answer: 'If you have an account, your books are available in your library indefinitely. Guest purchasers should save their download link from the confirmation email.',
  },
  {
    question: 'Can I contact support?',
    answer: 'Absolutely! You can reach us via the contact form on our Contact page, by email at support@bookvault.ng, or through WhatsApp.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <SEOHead title="FAQ — BookVault" description="Frequently asked questions about purchasing, downloading, and using books from BookVault." />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="mt-3 text-gray-600">Find answers to common questions about BookVault.</p>

        <div className="mt-10 space-y-3">
          {faqData.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-6 bg-gray-50 rounded-xl">
          <p className="text-gray-600">Still have questions?</p>
          <a href="/contact" className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800">
            Contact our support team →
          </a>
        </div>
      </div>
    </>
  );
};

export default FAQ;
