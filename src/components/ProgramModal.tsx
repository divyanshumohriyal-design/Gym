import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { Program } from '../types';

interface ProgramModalProps {
  program: Program | null;
  onClose: () => void;
  onSelectProgram: (programName: string) => void;
}

export const ProgramModal: React.FC<ProgramModalProps> = ({
  program,
  onClose,
  onSelectProgram,
}) => {
  if (!program) return null;

  const displayName = program.name || program.title;
  const benefitsList = program.benefits || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-2xl z-10 my-8">
        {/* Modal Image Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-100">
          <img
            src={program.image}
            alt={displayName}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-[#171717] hover:bg-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Program Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#E63946] text-white inline-block mb-2">
              {program.category} Program
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
              {displayName}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm sm:text-base text-[#5F6368] leading-relaxed">
            {program.detailedDescription || program.description}
          </p>

          {/* Highlights / Inclusions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#171717] mb-3">
              WHAT YOU WILL ACHIEVE
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {benefitsList.map((highlight: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F3F4F1] border border-[#E5E7EB] text-xs text-[#171717] font-semibold"
                >
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#E63946] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E5E7EB] text-center">
            <div className="p-3 rounded-xl bg-[#F3F4F1] border border-[#E5E7EB]">
              <span className="text-[10px] uppercase font-bold text-[#5F6368] block">Intensity</span>
              <span className="text-xs sm:text-sm font-black text-[#E63946] mt-0.5 block">
                {program.intensity}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F3F4F1] border border-[#E5E7EB]">
              <span className="text-[10px] uppercase font-bold text-[#5F6368] block">Schedule</span>
              <span className="text-xs sm:text-sm font-bold text-[#171717] mt-0.5 block">
                {program.duration}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F3F4F1] border border-[#E5E7EB]">
              <span className="text-[10px] uppercase font-bold text-[#5F6368] block">Coaching</span>
              <span className="text-xs sm:text-sm font-bold text-[#171717] mt-0.5 block">
                Included
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onSelectProgram(displayName);
                onClose();
              }}
              className="w-full sm:flex-1 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm text-white bg-[#E63946] hover:bg-[#d62839] transition-colors shadow-md shadow-[#E63946]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>TRY THIS PROGRAM FOR FREE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs text-[#171717] hover:bg-[#F3F4F1] border border-[#E5E7EB] transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
