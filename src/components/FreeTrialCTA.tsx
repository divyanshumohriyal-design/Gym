import React from 'react';
import { Flame, ArrowRight, PhoneCall, CheckCircle2 } from 'lucide-react';

interface FreeTrialCTAProps {
  onOpenTrialModal: () => void;
}

export const FreeTrialCTA: React.FC<FreeTrialCTAProps> = ({ onOpenTrialModal }) => {
  return (
    <section className="py-20 sm:py-28 bg-[#F3F4F1] border-y border-[#E5E7EB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card Container */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Column: CTA Content */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-4">
              <Flame className="w-4 h-4 fill-[#E63946]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                NO COMMITMENT REQUIRED
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4 leading-tight">
              READY TO START?
            </h2>

            <p className="text-base sm:text-xl text-[#5F6368] font-normal leading-relaxed mb-8 max-w-xl">
              "Your first step doesn't need to be perfect. It just needs to happen."
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <button
                onClick={onOpenTrialModal}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm sm:text-base font-bold uppercase tracking-wider text-white bg-[#E63946] hover:bg-[#d62839] rounded-xl shadow-lg shadow-[#E63946]/25 hover:shadow-xl hover:shadow-[#E63946]/35 transition-all duration-200 cursor-pointer"
              >
                <span>BOOK YOUR FREE TRIAL</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm sm:text-base font-bold uppercase tracking-wider text-[#171717] bg-white hover:bg-[#F3F4F1] border border-[#E5E7EB] rounded-xl transition-colors shadow-2xs"
              >
                <PhoneCall className="w-4 h-4 text-[#E63946]" />
                <span>CONTACT US</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#5F6368] font-medium pt-4 border-t border-[#E5E7EB] w-full">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E63946]" />
                Instant Confirmation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E63946]" />
                Full Facility Access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E63946]" />
                Coach Orientation Included
              </span>
            </div>
          </div>

          {/* Right Column: Large Premium Gym Image */}
          <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full min-h-[380px] relative overflow-hidden bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop"
              alt="Athlete focused on training"
              className="w-full h-full object-cover object-center filter brightness-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent hidden lg:block" />
          </div>

        </div>

      </div>
    </section>
  );
};
