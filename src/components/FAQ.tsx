import React, { useState } from 'react';
import { ChevronDown, Flame, HelpCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/fitnessData';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-3">
            <HelpCircle className="w-4 h-4 text-[#E63946]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              FREQUENT QUESTIONS
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <p className="text-base text-[#5F6368] max-w-xl">
            Everything you need to know about memberships, coaching, equipment, and starting your fitness journey at IronForge.
          </p>
        </div>

        {/* Accordion List with Subtle Borders */}
        <div className="space-y-3.5">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl overflow-hidden transition-all hover:border-[#E63946]/40 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946] cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg sm:text-xl font-bold uppercase tracking-wide text-[#171717]">
                    {index + 1}. {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-[#E63946] text-white shadow-xs'
                        : 'bg-white border border-[#E5E7EB] text-[#5F6368]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-[#5F6368] text-sm sm:text-base leading-relaxed border-t border-[#E5E7EB] mt-1">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 text-center text-xs text-[#5F6368]">
          Have a question not listed here?{' '}
          <a
            href="#contact"
            className="text-[#E63946] font-bold uppercase tracking-wider hover:underline underline-offset-4"
          >
            Contact our front desk team
          </a>
        </div>

      </div>
    </section>
  );
};
