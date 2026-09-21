import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Flame } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/fitnessData';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section
      id="testimonials"
      className="py-24 sm:py-32 bg-[#F3F4F1] border-y border-[#E5E7EB] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-3">
            <Flame className="w-4 h-4 fill-[#E63946]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              MEMBER EXPERIENCES
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4">
            WHAT OUR MEMBERS SAY
          </h2>

          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl">
            Real feedback from members who show up week after week and experience the coaching firsthand.
          </p>
        </div>

        {/* Testimonial Feature Card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-12 shadow-md">
            {/* Top decorative quote mark */}
            <div className="absolute top-6 right-8 text-neutral-100 pointer-events-none">
              <Quote className="w-16 h-16 opacity-60" />
            </div>

            {/* Stars Rating: Using Orange Accent (#F97316) */}
            <div className="flex items-center gap-1.5 mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#F97316] text-[#F97316]" />
              ))}
            </div>

            {/* Quote Text */}
            <blockquote className="text-lg sm:text-2xl font-normal text-[#171717] leading-relaxed mb-8">
              "{current.quote}"
            </blockquote>

            {/* Member Profile Info */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-4">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#E63946]"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-display text-xl font-bold text-[#171717] tracking-wide">
                    {current.name}
                  </h4>
                  <div className="text-xs text-[#5F6368] font-medium">
                    {current.role} • <span className="text-[#E63946] font-semibold">{current.membershipDuration}</span>
                  </div>
                </div>
              </div>

              {/* Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-[#FAFAF8] hover:bg-neutral-200 border border-[#E5E7EB] text-[#171717] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-[#FAFAF8] hover:bg-neutral-200 border border-[#E5E7EB] text-[#171717] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {TESTIMONIALS_DATA.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index ? 'w-8 bg-[#E63946]' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
