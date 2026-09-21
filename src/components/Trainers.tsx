import React from 'react';
import { Instagram, Linkedin, Twitter, Flame, Award, Calendar, ChevronRight } from 'lucide-react';
import { TRAINERS_DATA } from '../data/fitnessData';

interface TrainersProps {
  onOpenTrialModal: (coachName: string) => void;
}

export const Trainers: React.FC<TrainersProps> = ({ onOpenTrialModal }) => {
  return (
    <section id="trainers" className="py-24 sm:py-32 bg-[#F3F4F1] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-3">
            <Flame className="w-4 h-4 fill-[#E63946]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              CERTIFIED EXPERTISE
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4">
            MEET YOUR COACHES
          </h2>

          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl">
            Our team comprises competitive powerlifters, Olympic lifting certified coaches, and physical therapy
            graduates dedicated to coaching you safely and effectively.
          </p>
        </div>

        {/* 4 Trainer Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRAINERS_DATA.map((trainer) => (
            <div
              key={trainer.id}
              className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#E63946]/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Social Overlay Container */}
              <div className="relative h-80 w-full overflow-hidden bg-neutral-100">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-[1.01]"
                  loading="lazy"
                />

                {/* Experience Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/95 text-[#171717] border border-[#E5E7EB] shadow-xs">
                    {trainer.experience}
                  </span>
                </div>

                {/* Social Media Links: Reveal on hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                    Connect
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={trainer.socials?.instagram || trainer.instagram || 'https://instagram.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/90 text-[#171717] hover:bg-[#E63946] hover:text-white flex items-center justify-center transition-colors shadow-xs"
                      aria-label={`${trainer.name} on Instagram`}
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href={trainer.socials?.linkedin || trainer.linkedin || 'https://linkedin.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/90 text-[#171717] hover:bg-[#E63946] hover:text-white flex items-center justify-center transition-colors shadow-xs"
                      aria-label={`${trainer.name} on LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={trainer.socials?.twitter || trainer.twitter || 'https://twitter.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/90 text-[#171717] hover:bg-[#E63946] hover:text-white flex items-center justify-center transition-colors shadow-xs"
                      aria-label={`${trainer.name} on Twitter`}
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Trainer Info */}
              <div className="p-6">
                <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-[#171717] group-hover:text-[#E63946] transition-colors">
                  {trainer.name}
                </h3>
                <div className="text-xs font-bold uppercase text-[#E63946] tracking-wider mt-0.5 mb-2">
                  {trainer.role}
                </div>
                <p className="text-xs text-[#5F6368] leading-relaxed mb-4">
                  {trainer.bio}
                </p>

                {/* Consultation Trigger */}
                <button
                  onClick={() => onOpenTrialModal(`1-on-1 Consultation with ${trainer.name}`)}
                  className="w-full py-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#E63946] hover:bg-[#E63946] hover:text-white text-xs font-bold uppercase tracking-wider text-[#171717] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>BOOK 1-ON-1</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
