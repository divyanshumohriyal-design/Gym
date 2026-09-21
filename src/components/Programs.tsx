import React, { useState } from 'react';
import { ArrowRight, Dumbbell, Flame, Sparkles } from 'lucide-react';
import { PROGRAMS_DATA } from '../data/fitnessData';
import { FitnessProgram } from '../types';
import { ProgramModal } from './ProgramModal';

interface ProgramsProps {
  onOpenTrialModal: (programName?: string) => void;
}

export const Programs: React.FC<ProgramsProps> = ({ onOpenTrialModal }) => {
  const [selectedProgram, setSelectedProgram] = useState<FitnessProgram | null>(null);

  return (
    <section id="programs" className="py-24 sm:py-32 bg-[#F3F4F1] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-3">
            <Flame className="w-4 h-4 fill-[#E63946]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              STRUCTURED PATHWAYS
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4">
            TRAIN FOR YOUR GOAL
          </h2>

          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl">
            Choose a training program designed around the results you want.
          </p>
        </div>

        {/* 6 Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS_DATA.map((program) => (
            <div
              key={program.id}
              className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-[#E63946]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={program.image}
                    alt={program.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/95 text-[#171717] border border-[#E5E7EB] shadow-xs">
                      {program.category}
                    </span>
                  </div>

                  {/* Intensity Rating */}
                  <div className="absolute bottom-3 right-4">
                    <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md">
                      {program.intensity}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-[#171717] group-hover:text-[#E63946] transition-colors mb-2">
                    {program.name}
                  </h3>

                  <p className="text-sm text-[#5F6368] leading-relaxed mb-4">
                    {program.shortDescription}
                  </p>

                  <div className="text-xs text-[#5F6368] font-medium flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />
                    <span>{program.duration}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 pb-6 pt-0 border-t border-[#E5E7EB]/60 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="text-xs font-bold uppercase tracking-wider text-[#171717] group-hover:text-[#E63946] flex items-center gap-1.5 pt-4 transition-colors cursor-pointer"
                >
                  <span>LEARN MORE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onOpenTrialModal(program.name)}
                  className="text-xs font-bold uppercase tracking-wider text-[#E63946] hover:underline underline-offset-4 pt-4 cursor-pointer"
                >
                  TRY CLASS
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Program Modal */}
        <ProgramModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onSelectProgram={(progName) => onOpenTrialModal(progName)}
        />
      </div>
    </section>
  );
};
