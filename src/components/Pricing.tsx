import React, { useState } from 'react';
import { Check, Flame, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { PRICING_PLANS } from '../data/fitnessData';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="membership" className="py-24 sm:py-32 bg-[#F3F4F1] border-y border-[#E5E7EB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-3">
            <Flame className="w-4 h-4 fill-[#E63946]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              MEMBERSHIP TIERS
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4">
            CHOOSE YOUR MEMBERSHIP
          </h2>

          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl">
            Flexible plans designed to fit your training goals.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#5F6368] hover:text-[#171717]'
              }`}
            >
              MONTHLY BILLING
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-[#E63946] text-white shadow-xs'
                  : 'text-[#5F6368] hover:text-[#171717]'
              }`}
            >
              <span>ANNUAL BILLING</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black uppercase">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {PRICING_PLANS.map((plan) => {
            const isPro = plan.popular;
            const price = (billingCycle === 'annual' ? plan.annualPrice : plan.price) ?? plan.priceMonthly;
            const period = billingCycle === 'annual' ? '/ month (billed yearly)' : '/ month';

            let buttonText = 'GET STARTED';
            if (plan.name === 'PRO') buttonText = 'JOIN PRO';
            if (plan.name === 'ELITE') buttonText = 'GO ELITE';

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
                  isPro
                    ? 'bg-red-50/40 border-2 border-[#E63946] shadow-xl lg:-translate-y-2'
                    : 'bg-white border border-[#E5E7EB] shadow-xs hover:shadow-lg'
                }`}
              >
                {/* Popular Red Badge */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-[#E63946] text-white shadow-md shadow-[#E63946]/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-white" />
                      POPULAR
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="font-display text-3xl font-black uppercase tracking-wide text-[#171717]">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#5F6368] leading-relaxed mb-6">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="pb-6 mb-6 border-b border-[#E5E7EB]">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-5xl font-black tracking-tight text-[#171717]">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-semibold text-[#5F6368]">
                        {period}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 mb-8">
                    <span className="text-[11px] uppercase font-bold text-[#171717] tracking-wider block">
                      WHAT'S INCLUDED:
                    </span>
                    {plan.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isPro ? 'bg-[#E63946] text-white' : 'bg-red-50 text-[#E63946]'
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm text-[#171717] font-medium leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button Action */}
                <div>
                  <button
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
                      isPro
                        ? 'bg-[#E63946] hover:bg-[#d62839] text-white shadow-[#E63946]/25'
                        : 'bg-[#171717] hover:bg-black text-white shadow-neutral-300'
                    }`}
                  >
                    {buttonText}
                  </button>
                  <span className="block text-center text-[11px] text-[#5F6368] mt-2.5">
                    No lock-in contract • Pause anytime
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E63946] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase text-[#171717]">
                14-DAY RISK-FREE SATISFACTION GUARANTEE
              </h4>
              <p className="text-xs text-[#5F6368]">
                If you aren't completely satisfied with the coaching and facilities within two weeks, we will refund your dues.
              </p>
            </div>
          </div>
          <a
            href="#faq"
            className="text-xs font-bold uppercase text-[#E63946] hover:underline underline-offset-4 shrink-0"
          >
            VIEW MEMBERSHIP FAQ
          </a>
        </div>

      </div>
    </section>
  );
};
