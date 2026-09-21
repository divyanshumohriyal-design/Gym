import React from 'react';
import { Check, Flame, Shield, Zap, HeartHandshake, Dumbbell } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      number: '01',
      title: 'RESULT-DRIVEN TRAINING',
      description: 'Every program is designed around measurable progress.',
      subtext: 'Weekly load tracking, body recomposition analysis, and progressive overload protocols.',
      icon: Zap,
    },
    {
      number: '02',
      title: 'EXPERT COACHING',
      description: 'Train with experienced professionals who understand your goals.',
      subtext: 'All staff hold certified NSCA, CSCS, or equivalent strength credentials.',
      icon: Shield,
    },
    {
      number: '03',
      title: 'PREMIUM EQUIPMENT',
      description: 'Access modern strength, cardio, and functional training equipment.',
      subtext: 'Calibrated Eleiko powerlifting plates, Rogue power racks, Concept2 rowers, and specialty bars.',
      icon: Dumbbell,
    },
    {
      number: '04',
      title: 'COMMUNITY & ACCOUNTABILITY',
      description: 'Stay consistent with a community that keeps you motivated.',
      subtext: 'A high-energy, ego-free sanctuary where beginners and competitive lifters support one another.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="why-us" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-3">
            <Flame className="w-4 h-4 fill-[#E63946]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              THE IRONFORGE STANDARD
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4">
            WHY IRONFORGE?
          </h2>

          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl">
            We don't sell gym memberships. We build environments where commitment turns into undeniable results.
          </p>
        </div>

        {/* 2-Column: Points + Large Premium Gym Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: 4 Key Benefits with Red Numbers */}
          <div className="lg:col-span-6 space-y-6">
            {points.map((pt) => {
              const Icon = pt.icon;
              return (
                <div
                  key={pt.number}
                  className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-[#E63946]/40 hover:shadow-md transition-all flex items-start gap-5"
                >
                  <div className="font-display text-3xl sm:text-4xl font-black text-[#E63946] leading-none shrink-0 pt-0.5">
                    {pt.number}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#171717]">
                      {pt.title}
                    </h3>
                    <p className="text-sm font-semibold text-[#171717]">
                      {pt.description}
                    </p>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      {pt.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Large Premium Gym Image Container */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-100 border border-[#E5E7EB]">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop"
                alt="Modern premium gym floor at IronForge"
                className="w-full h-[520px] object-cover object-center filter brightness-[1.01]"
                loading="lazy"
              />
              
              {/* Subtle overlay pill */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E7EB] shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E63946] block mb-1">
                    FACILITY SPECIFICATION
                  </span>
                  <span className="font-display text-xl font-black uppercase text-[#171717]">
                    10,000 SQ. FT. TRAINING SANCTUARY
                  </span>
                </div>
                <div className="hidden sm:block">
                  <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-50 text-[#E63946] border border-red-200">
                    Rogue Certified
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
