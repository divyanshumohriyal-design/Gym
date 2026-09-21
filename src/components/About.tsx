import React from 'react';
import { Check, Flame, ArrowRight, ShieldCheck, Dumbbell, Award } from 'lucide-react';

export const About: React.FC = () => {
  const features = [
    'Expert Personal Training',
    'Premium Equipment',
    'Customized Training Programs',
    'Supportive Fitness Community',
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#FAFAF8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative grid grid-cols-12 gap-4 items-center">
              {/* Main Primary Image */}
              <div className="col-span-8 rounded-3xl overflow-hidden shadow-xl bg-white border border-[#E5E7EB]">
                <img
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=900&auto=format&fit=crop"
                  alt="IronForge barbell training area"
                  className="w-full h-80 sm:h-96 object-cover object-center hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Secondary Supporting Image */}
              <div className="col-span-4 space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg bg-white border border-[#E5E7EB]">
                  <img
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop"
                    alt="IronForge dumbbells and free weights"
                    className="w-full h-44 sm:h-52 object-cover object-center hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="rounded-2xl overflow-hidden shadow-lg bg-white border border-[#E5E7EB] hidden sm:block">
                  <img
                    src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop"
                    alt="Athlete kettlebell training"
                    className="w-full h-36 object-cover object-center hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-6 left-6 sm:left-8 bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-xl flex items-center gap-3.5 z-20">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#E63946] border border-red-200/80 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-display text-2xl sm:text-3xl font-black text-[#171717] leading-none block">
                    8+ YEARS
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#5F6368] block mt-0.5">
                    OF TRANSFORMING LIVES
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-6 flex flex-col items-start pt-6 lg:pt-0">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/70 text-[#E63946] mb-4">
              <Flame className="w-3.5 h-3.5 fill-[#E63946]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                ABOUT IRONFORGE
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] leading-tight mb-6">
              MORE THAN A GYM.<br />
              IT'S YOUR <span className="text-[#E63946]">TRAINING GROUND</span>.
            </h2>

            {/* Content Paragraphs */}
            <p className="text-base text-[#5F6368] leading-relaxed mb-4">
              Founded on the belief that real physical transformation requires discipline, intelligent coaching,
              and purposeful programming, IronForge Fitness is built for individuals who take their progress seriously.
            </p>

            <p className="text-sm sm:text-base text-[#5F6368] leading-relaxed mb-8">
              We cut through the noise of trendy fads. Whether your priority is lifting heavier, dropping stubborn fat,
              rebuilding joint durability, or unlocking athletic endurance, our coaches build structured pathways around your lifestyle.
            </p>

            {/* 4 Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs hover:border-[#E63946]/40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#E63946] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#171717] tracking-wide">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#facilities"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white bg-[#E63946] hover:bg-[#d62839] rounded-xl shadow-md shadow-[#E63946]/20 transition-all duration-200"
            >
              <span>MEET IRONFORGE</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
