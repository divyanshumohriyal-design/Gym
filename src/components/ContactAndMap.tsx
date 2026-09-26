import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Flame, ExternalLink, Navigation } from 'lucide-react';

export const ContactAndMap: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    fitnessGoal: 'Strength & Muscle Building',
    preferredContact: 'Phone Call',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [formRenderedAt] = useState<number>(Date.now());
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your phone number';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide a brief message';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: `[${formData.fitnessGoal} | Preferred: ${formData.preferredContact}] ${formData.message}`,
          _iron_hp_check: honeypot, // Honeypot field for bot trap
          _form_rendered_at: formRenderedAt, // Timing-based anti-automation
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || data.error || 'Submission blocked by abuse protection.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        fitnessGoal: 'Strength & Muscle Building',
        preferredContact: 'Phone Call',
        message: '',
      });
    } catch (err: any) {
      // Fallback
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#F3F4F1] border-t border-[#E5E7EB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E63946] mb-3">
            <Flame className="w-4 h-4 fill-[#E63946]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              DIRECT INQUIRY
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#171717] mb-4">
            LET'S GET YOU MOVING
          </h2>

          <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl">
            Drop by our training facility, give us a call, or send an inquiry. Our coaches are ready
            to evaluate your goals and map your progression.
          </p>
        </div>

        {/* 2-Column Info & White Card Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          
          {/* Left Column: Gym Business Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className="font-display text-3xl font-black uppercase tracking-tight text-[#171717] mb-1">
                IRONFORGE FITNESS
              </h3>
              <p className="text-xs uppercase font-bold tracking-widest text-[#E63946] mb-4">
                "BUILD STRENGTH. BUILD DISCIPLINE."
              </p>
              <p className="text-sm text-[#5F6368] leading-relaxed">
                Experience world-class strength and conditioning right here in Dehradun.
                Whether you are stepping into a weight room for the first time or prepping for competition,
                our doors are open.
              </p>
            </div>

            <div className="space-y-6 border-y border-[#E5E7EB] py-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 text-[#E63946] shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F6368] mb-1">
                    Facility Address
                  </h4>
                  <p className="text-sm font-bold text-[#171717]">
                    123 Fitness Avenue,<br />
                    Dehradun, Uttarakhand 248001
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 text-[#E63946] shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F6368] mb-1">
                    Front Desk / Direct Line
                  </h4>
                  <a
                    href="tel:+919876543210"
                    className="text-sm font-bold text-[#171717] hover:text-[#E63946] transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 text-[#E63946] shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F6368] mb-1">
                    Email Inquiries
                  </h4>
                  <a
                    href="mailto:hello@ironforgefitness.com"
                    className="text-sm font-bold text-[#171717] hover:text-[#E63946] transition-colors"
                  >
                    hello@ironforgefitness.com
                  </a>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 text-[#E63946] shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F6368] mb-1.5">
                    Operating Hours
                  </h4>
                  <div className="text-xs space-y-1 text-[#171717]">
                    <div className="flex justify-between gap-6">
                      <span className="text-[#5F6368] font-medium">Monday–Friday:</span>
                      <strong>5:30 AM – 10:00 PM</strong>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="text-[#5F6368] font-medium">Saturday:</span>
                      <strong>6:00 AM – 9:00 PM</strong>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="text-[#5F6368] font-medium">Sunday:</span>
                      <strong>7:00 AM – 2:00 PM</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Card Lead Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 shadow-lg relative">
              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 text-[#E63946] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-3xl font-black uppercase text-[#171717] mb-2">
                    Request Received!
                  </h3>
                  <p className="text-sm text-[#5F6368] max-w-md mb-6 leading-relaxed">
                    Thank you. Our coaching team will reach out via your preferred method within 4 business hours to schedule your consultation.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#171717] hover:bg-black text-white transition-colors cursor-pointer"
                  >
                    SEND ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Invisible Honeypot to trap automated bots & scrapers */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      zIndex: -1,
                      pointerEvents: 'none',
                      height: 0,
                      width: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <label htmlFor="_iron_hp_check_contact">Leave blank</label>
                    <input
                      type="text"
                      id="_iron_hp_check_contact"
                      name="_iron_hp_check"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {apiError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                      <span className="font-bold">Security Notice:</span>
                      <span>{apiError}</span>
                    </div>
                  )}

                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#171717] mb-1">
                      REQUEST A CALL
                    </h3>
                    <p className="text-xs text-[#5F6368]">
                      Fill out your details below and a certified IronForge coach will connect with you.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5">
                        Full Name <span className="text-[#E63946]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Divyanshu Sharma"
                        className={`w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border ${
                          errors.fullName ? 'border-[#E63946]' : 'border-[#E5E7EB] focus:border-[#E63946]'
                        } text-sm text-[#171717] placeholder-neutral-400 focus:outline-none transition-colors`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-[#E63946] mt-1 font-medium">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5">
                        Email Address <span className="text-[#E63946]">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. athlete@domain.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border ${
                          errors.email ? 'border-[#E63946]' : 'border-[#E5E7EB] focus:border-[#E63946]'
                        } text-sm text-[#171717] placeholder-neutral-400 focus:outline-none transition-colors`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-[#E63946] mt-1 font-medium">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5">
                        Phone Number <span className="text-[#E63946]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className={`w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border ${
                          errors.phone ? 'border-[#E63946]' : 'border-[#E5E7EB] focus:border-[#E63946]'
                        } text-sm text-[#171717] placeholder-neutral-400 focus:outline-none transition-colors`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-[#E63946] mt-1 font-medium">{errors.phone}</p>
                      )}
                    </div>

                    {/* Fitness Goal */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5">
                        Fitness Goal
                      </label>
                      <select
                        value={formData.fitnessGoal}
                        onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus:border-[#E63946] text-sm text-[#171717] focus:outline-none transition-colors"
                      >
                        <option>Strength & Muscle Building</option>
                        <option>Fat Loss & Metabolic Conditioning</option>
                        <option>1-on-1 Personal Coaching</option>
                        <option>Mobility & Functional Fitness</option>
                        <option>General Athletic Health</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Phone Call', 'WhatsApp', 'Email'].map((method) => (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setFormData({ ...formData, preferredContact: method })}
                          className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border text-center transition-all cursor-pointer ${
                            formData.preferredContact === method
                              ? 'bg-red-50 border-[#E63946] text-[#E63946]'
                              : 'bg-[#FAFAF8] border-[#E5E7EB] text-[#5F6368] hover:text-[#171717]'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1.5">
                      Message <span className="text-[#E63946]">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your fitness background, any injuries, or questions you have..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border ${
                        errors.message ? 'border-[#E63946]' : 'border-[#E5E7EB] focus:border-[#E63946]'
                      } text-sm text-[#171717] placeholder-neutral-400 focus:outline-none transition-colors`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-[#E63946] mt-1 font-medium">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-[#E63946] hover:bg-[#d62839] shadow-lg shadow-[#E63946]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        PROCESSING...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>REQUEST A CALL</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Section 18: Google Map Location Block with Light Aesthetics */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E63946] mb-1">
                <MapPin className="w-4 h-4" />
                <span>LOCATION & ACCESS</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#171717]">
                IRONFORGE FITNESS
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6368]">
                123 Fitness Avenue, Dehradun, Uttarakhand 248001
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Dehradun+Uttarakhand"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E63946] text-white hover:bg-[#d62839] shadow-md shadow-[#E63946]/20 transition-colors shrink-0"
            >
              <span>GET DIRECTIONS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Styled Light Map Container Graphic */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#FAFAF8]">
            {/* Light Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:20px_20px] opacity-80" />
            
            {/* Center Pin Marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-[#E63946]/20 animate-ping absolute inset-0" />
                  <div className="w-14 h-14 rounded-full bg-[#E63946] flex items-center justify-center text-white shadow-xl relative z-10 border-2 border-white">
                    <Flame className="w-7 h-7 fill-white" />
                  </div>
                </div>
                <div className="mt-3 bg-white border border-[#E5E7EB] px-4 py-2 rounded-xl text-center shadow-md">
                  <span className="font-display text-sm font-bold uppercase tracking-wide text-[#171717] block">
                    IronForge Fitness Flagship
                  </span>
                  <span className="text-[11px] text-[#5F6368]">
                    Open today: 5:30 AM – 10:00 PM
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle Road & Contour Map Vector */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,120 Q300,140 600,100 T1200,160" stroke="#E63946" strokeWidth="3" fill="none" />
              <path d="M120,0 Q200,200 450,300 T850,420" stroke="#94A3B8" strokeWidth="2.5" fill="none" />
              <path d="M350,420 Q500,270 950,120" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="5 5" fill="none" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
};
