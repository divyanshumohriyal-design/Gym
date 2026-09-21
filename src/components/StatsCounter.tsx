import React, { useEffect, useRef, useState } from 'react';
import { Users, Award, Calendar, Flame } from 'lucide-react';

interface StatItem {
  id: string;
  target: number;
  suffix: string;
  label: string;
  subLabel: string;
  icon: React.ElementType;
}

const STATS: StatItem[] = [
  {
    id: 'members',
    target: 500,
    suffix: '+',
    label: 'Active Members',
    subLabel: 'Dedicated Athletes',
    icon: Users,
  },
  {
    id: 'trainers',
    target: 15,
    suffix: '+',
    label: 'Expert Trainers',
    subLabel: 'Certified Specialists',
    icon: Award,
  },
  {
    id: 'experience',
    target: 8,
    suffix: '+',
    label: 'Years of Experience',
    subLabel: 'Consistent Excellence',
    icon: Flame,
  },
  {
    id: 'classes',
    target: 25,
    suffix: '+',
    label: 'Weekly Classes',
    subLabel: 'Strength & Conditioning',
    icon: Calendar,
  },
];

export const StatsCounter: React.FC = () => {
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    members: 0,
    trainers: 0,
    experience: 0,
    classes: 0,
  });

  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          STATS.forEach((stat) => {
            const duration = 1800; // ms
            const steps = 40;
            const stepTime = duration / steps;
            const increment = stat.target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.target) {
                current = stat.target;
                clearInterval(timer);
              }
              setCounts((prev) => ({
                ...prev,
                [stat.id]: Math.floor(current),
              }));
            }, stepTime);
          });
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="py-16 sm:py-20 bg-[#F3F4F1] border-y border-[#E5E7EB] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-[#E5E7EB]">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`flex flex-col items-center sm:items-start text-center sm:text-left px-4 sm:px-8 ${
                  idx > 0 ? 'pt-6 sm:pt-0' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#E63946] shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#5F6368]">
                    {stat.subLabel}
                  </span>
                </div>

                <div className="flex items-baseline gap-0.5">
                  <span className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#171717] tracking-tight">
                    {counts[stat.id]}
                  </span>
                  <span className="font-display text-3xl sm:text-4xl font-black text-[#E63946]">
                    {stat.suffix}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold text-[#171717] mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
