import React from 'react';
import { Flame, TrendingUp, Check, Quote } from 'lucide-react';
import { TRANSFORMATIONS_DATA } from '../data/fitnessData';

export const Transformations: React.FC = () => {
  return (
    <section id="transformations" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-3">
            <Flame className="w-4 h-4 fill-[#E63946]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              AUTHENTIC RESULTS
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4">
            REAL PEOPLE. REAL PROGRESS.
          </h2>

          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl">
            Transformation is not about overnight gimmicks or extreme diets. It is the steady outcome
            of honest training sessions, intelligent coaching, and relentless consistency.
          </p>
        </div>

        {/* 3 Transformation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRANSFORMATIONS_DATA.map((story) => (
            <div
              key={story.id}
              className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#E63946]/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Image & Achievement Highlight */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-100">
                <img
                  src={story.image}
                  alt={`${story.name} fitness journey`}
                  className="w-full h-full object-cover object-top filter brightness-[1.01] hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Timeline Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white text-[#171717] border border-[#E5E7EB] shadow-xs">
                    {story.timeframe} Protocol
                  </span>
                </div>

                {/* Achievement Highlight */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="p-3 bg-white/95 backdrop-blur-md rounded-xl border border-[#E5E7EB] flex items-center gap-2.5 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E63946] flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#5F6368] block leading-none mb-0.5">
                        Achieved
                      </span>
                      <span className="text-sm font-extrabold text-[#171717] tracking-wide block leading-tight">
                        {story.achievement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story & Member Quote */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase text-[#171717] mb-2">
                    {story.name}
                  </h3>

                  <div className="relative mb-4 pl-4 border-l-2 border-[#E63946]">
                    <p className="text-sm font-semibold italic text-[#171717] leading-snug">
                      "{story.quote}"
                    </p>
                  </div>

                  <p className="text-xs text-[#5F6368] leading-relaxed mb-6">
                    {story.story}
                  </p>
                </div>

                {/* Stat Metrics Pill Row */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E5E7EB] text-center">
                  {story.stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-[#E5E7EB]">
                      <span className="text-[10px] uppercase font-bold text-[#5F6368] block mb-0.5 truncate">
                        {stat.label}
                      </span>
                      <span className="text-xs font-black text-[#E63946]">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
