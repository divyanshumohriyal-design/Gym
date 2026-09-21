import React, { useState } from 'react';
import { Flame, Maximize2, X, Check, Dumbbell } from 'lucide-react';
import { FACILITIES_DATA } from '../data/fitnessData';
import { FacilityItem } from '../types';

export const Facilities: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxFacility, setLightboxFacility] = useState<FacilityItem | null>(null);

  const categories = ['All', 'Lifting', 'Conditioning', 'Recovery & Wellness'];

  const filtered = FACILITIES_DATA.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Lifting') {
      return ['Strength Training Zone', 'Free Weights Area', 'Personal Training Studio'].includes(item.name);
    }
    if (activeFilter === 'Conditioning') {
      return ['Cardio Zone', 'Functional Training Area'].includes(item.name);
    }
    if (activeFilter === 'Recovery & Wellness') {
      return ['Recovery Area', 'Locker Rooms'].includes(item.name);
    }
    return true;
  });

  return (
    <section id="facilities" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-3">
            <Flame className="w-4 h-4 fill-[#E63946]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              FACILITY & EQUIPMENT
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4">
            BUILT FOR BETTER TRAINING
          </h2>

          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl">
            A purpose-engineered 10,000 square foot training facility equipped with competition-grade barbells,
            dedicated lifting platforms, and dedicated recovery suites.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#E63946] text-white shadow-md shadow-[#E63946]/25'
                  : 'bg-[#F3F4F1] hover:bg-[#E5E7EB] text-[#171717] border border-[#E5E7EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Modern Masonry / Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, index) => {
            const isFeatured = index === 0 || index === 3;
            return (
              <div
                key={item.id}
                onClick={() => setLightboxFacility(item)}
                className={`group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-[#E5E7EB] cursor-pointer transition-all duration-300 ${
                  isFeatured ? 'sm:col-span-2 lg:col-span-2' : 'col-span-1'
                }`}
              >
                {/* Image */}
                <div className={`w-full overflow-hidden bg-neutral-100 ${isFeatured ? 'h-80 sm:h-96' : 'h-72 sm:h-80'}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[1.01]"
                    loading="lazy"
                  />
                </div>

                {/* Subtle white hover overlay with facility name (Exact Requirement!) */}
                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 sm:p-8 backdrop-blur-xs">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E63946] block mb-1">
                      {item.tag}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide text-[#171717] mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5F6368] line-clamp-2 mb-4">
                      {item.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E63946]">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>VIEW SPECS & GALLERY</span>
                    </div>
                  </div>
                </div>

                {/* Default Bottom Name Tag when not hovering */}
                <div className="absolute bottom-4 left-4 group-hover:opacity-0 transition-opacity">
                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide bg-white/95 text-[#171717] border border-[#E5E7EB] shadow-sm">
                    {item.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox Inspection Modal */}
        {lightboxFacility && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setLightboxFacility(null)}
            />
            <div className="relative w-full max-w-3xl bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-2xl z-10 my-8">
              <div className="relative h-72 sm:h-96 w-full">
                <img
                  src={lightboxFacility.image}
                  alt={lightboxFacility.name}
                  className="w-full h-full object-cover object-center"
                />
                <button
                  onClick={() => setLightboxFacility(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-[#171717] flex items-center justify-center shadow-lg"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-display text-3xl font-black uppercase text-[#171717]">
                    {lightboxFacility.name}
                  </h3>
                  <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-50 text-[#E63946] border border-red-200">
                    {lightboxFacility.tag}
                  </span>
                </div>

                <p className="text-sm text-[#5F6368] leading-relaxed">
                  {lightboxFacility.description}
                </p>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#171717] mb-3">
                    EQUIPMENT & STANDARDS
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(lightboxFacility.features || lightboxFacility.equipment || []).map((feat: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F3F4F1] text-xs text-[#171717] font-semibold border border-[#E5E7EB]"
                      >
                        <Check className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setLightboxFacility(null)}
                    className="px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs bg-[#171717] text-white hover:bg-black transition-colors"
                  >
                    CLOSE INSPECTION
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
