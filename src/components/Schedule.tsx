import React, { useState } from 'react';
import { Calendar, Clock, User, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SCHEDULE_DATA } from '../data/fitnessData';

interface ScheduleProps {
  onBookClass: (className: string, time: string) => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ onBookClass }) => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const days = SCHEDULE_DATA.map((d) => d.day);
  const currentDayData = SCHEDULE_DATA.find((d) => d.day === selectedDay) || SCHEDULE_DATA[0];

  const filteredClasses = currentDayData.classes.filter((item) => {
    if (categoryFilter === 'All') return true;
    return item.category === categoryFilter;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Strength':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'HIIT':
        return 'bg-red-50 text-[#E63946] border-red-200';
      case 'Mobility':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <section id="schedule" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-3">
            <Calendar className="w-4 h-4 text-[#E63946]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              TIMETABLE & PROGRAMMING
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4">
            THIS WEEK AT IRONFORGE
          </h2>

          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl">
            Coach-led group training sessions and workshops. Drop in with your Pro/Elite pass or reserve with a 1-Day Trial.
          </p>
        </div>

        {/* Schedule Day Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer ${
                selectedDay === day
                  ? 'bg-[#E63946] text-white shadow-md shadow-[#E63946]/25'
                  : 'bg-[#F3F4F1] hover:bg-[#E5E7EB] text-[#171717] border border-[#E5E7EB]'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 p-4 bg-[#FAFAF8] rounded-2xl border border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-[#171717] tracking-wider">
              {currentDayData.day} Focus:
            </span>
            <span className="text-xs font-semibold text-[#E63946]">
              {currentDayData.dateLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Strength', 'HIIT', 'Mobility', 'Conditioning'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#171717] text-white'
                    : 'text-[#5F6368] hover:text-[#171717]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Classes Table / White Cards with Red Class Times */}
        <div className="space-y-3.5">
          {filteredClasses.length === 0 ? (
            <div className="text-center py-12 bg-[#FAFAF8] rounded-2xl border border-[#E5E7EB] text-[#5F6368] text-sm">
              No classes in this category for {selectedDay}. Open gym floor available.
            </div>
          ) : (
            filteredClasses.map((cls, idx) => (
              <div
                key={idx}
                className="bg-white hover:bg-neutral-50/70 border border-[#E5E7EB] hover:border-[#E63946]/40 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-2xs hover:shadow-md"
              >
                {/* Time with Red Accent & Class Name */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-24 sm:w-28 shrink-0 text-left">
                    <span className="font-display text-2xl font-black text-[#E63946] block">
                      {cls.time}
                    </span>
                    <span className="text-[11px] text-[#5F6368] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {cls.duration}
                    </span>
                  </div>

                  <div className="border-l border-[#E5E7EB] pl-4">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#171717]">
                        {cls.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadge(cls.category)}`}>
                        {cls.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#5F6368]">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#5F6368]" />
                        Coach: <strong className="text-[#171717]">{cls.trainer}</strong>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">
                        Intensity: <span className="text-[#E63946] font-semibold">{cls.intensity}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Button */}
                <div className="flex items-center justify-end sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E7EB]">
                  <button
                    onClick={() => onBookClass(cls.name, `${selectedDay}, ${cls.time}`)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FAFAF8] hover:bg-[#E63946] hover:text-white text-[#171717] border border-[#E5E7EB] hover:border-[#E63946] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>RESERVE SPOT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Schedule note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#5F6368]">
          <CheckCircle2 className="w-4 h-4 text-[#E63946]" />
          <span>All class reservations are covered under Pro and Elite passes or via your 1-Day Trial.</span>
        </div>

      </div>
    </section>
  );
};
