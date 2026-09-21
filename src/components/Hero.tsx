import React from 'react';
import { ArrowRight, ChevronDown, Flame, ShieldCheck, Sparkles, Trophy, Users, Award } from 'lucide-react';

interface HeroProps {
  onOpenTrialModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTrialModal }) => {
  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-[#FAFAF8] overflow-hidden"
    >
      {/* Subtle geometric light ambient background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Clean Light Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-6">
              <Flame className="w-4 h-4 fill-[#E63946]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                PREMIUM FITNESS EXPERIENCE
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-[#171717] leading-[0.92] mb-6">
              BUILD THE <span className="text-[#E63946]">BODY</span>.<br />
              BUILD THE <span className="text-[#171717] underline decoration-[#E63946]/30 decoration-wavy decoration-2">MIND</span>.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg lg:text-xl text-[#5F6368] font-normal leading-relaxed max-w-xl mb-8">
              Train smarter, get stronger, and become the strongest version of yourself with expert coaching,
              premium equipment, and a community built around results.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                id="hero-primary-cta"
                onClick={onOpenTrialModal}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold uppercase tracking-wider text-white bg-[#E63946] hover:bg-[#d62839] rounded-xl shadow-lg shadow-[#E63946]/25 hover:shadow-xl hover:shadow-[#E63946]/35 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>START YOUR JOURNEY</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                id="hero-secondary-cta"
                href="#programs"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold uppercase tracking-wider text-[#171717] bg-white hover:bg-neutral-50 border border-[#E5E7EB] hover:border-neutral-300 rounded-xl shadow-xs transition-all duration-200"
              >
                <span>EXPLORE PROGRAMS</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-[#E5E7EB] w-full grid grid-cols-3 gap-4 sm:gap-6">
              <div>
                <div className="font-display text-3xl sm:text-4xl font-black text-[#171717] leading-none">
                  500<span className="text-[#E63946]">+</span>
                </div>
                <div className="text-[11px] sm:text-xs uppercase font-bold text-[#5F6368] mt-1 tracking-wider">
                  Active Members
                </div>
              </div>

              <div className="border-l border-[#E5E7EB] pl-4 sm:pl-6">
                <div className="font-display text-3xl sm:text-4xl font-black text-[#171717] leading-none">
                  15<span className="text-[#E63946]">+</span>
                </div>
                <div className="text-[11px] sm:text-xs uppercase font-bold text-[#5F6368] mt-1 tracking-wider">
                  Expert Trainers
                </div>
              </div>

              <div className="border-l border-[#E5E7EB] pl-4 sm:pl-6">
                <div className="font-display text-3xl sm:text-4xl font-black text-[#171717] leading-none">
                  8<span className="text-[#E63946]">+</span>
                </div>
                <div className="text-[11px] sm:text-xs uppercase font-bold text-[#5F6368] mt-1 tracking-wider">
                  Years Experience
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Quality Large Rounded Image Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Decorative Glow/Border */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#E63946]/10 to-orange-200/30 rounded-3xl -rotate-1 pointer-events-none" />
              
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-[#E5E7EB]">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
                  alt="Athlete training at IronForge Fitness with barbell"
                  className="w-full h-[450px] sm:h-[520px] lg:h-[580px] object-cover object-center filter brightness-[1.02] contrast-[1.03]"
                  loading="eager"
                />
                
                {/* Subtle soft gradient at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Member Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E7EB] shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E63946] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#E63946]/20">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                        Dehradun's Elite Facility
                      </div>
                      <div className="text-[11px] text-[#5F6368] font-medium">
                        World-Class Strength & Conditioning
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wide">
                      Open Today
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Experience Badge */}
              <div className="absolute -top-4 -left-4 sm:-left-6 p-3 sm:p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] border border-orange-200 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display text-xl font-black text-[#171717] leading-none">
                    8+ YEARS
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#5F6368] mt-0.5 tracking-wider">
                    Proven Results
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Subtle Scroll Down Indicator */}
        <div className="mt-14 lg:mt-16 flex flex-col items-center justify-center text-center">
          <a
            href="#stats"
            className="group flex flex-col items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#5F6368] hover:text-[#E63946] transition-colors"
            aria-label="Scroll down to statistics"
          >
            <span>DISCOVER IRONFORGE</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#E63946]" />
          </a>
        </div>
      </div>
    </section>
  );
};
