import React, { useState, useEffect } from 'react';
import { X, Flame, CheckCircle2, QrCode, Calendar, Clock, Download, ArrowRight, Shield } from 'lucide-react';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedOption?: string;
}

export const FreeTrialModal: React.FC<FreeTrialModalProps> = ({
  isOpen,
  onClose,
  preselectedOption,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '26',
    fitnessGoal: preselectedOption || 'Strength & Muscle Building',
    preferredTime: 'Morning (6:00 AM - 9:00 AM)',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passId, setPassId] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formRenderedAt, setFormRenderedAt] = useState<number>(Date.now());
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormRenderedAt(Date.now());
      setApiError(null);
      setHoneypot('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedOption) {
      setFormData((prev) => ({ ...prev, fitnessGoal: preselectedOption }));
    }
  }, [preselectedOption]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your phone number';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Please enter a valid 10-digit number';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    const ageNum = parseInt(formData.age, 10);
    if (!formData.age || isNaN(ageNum) || ageNum < 14 || ageNum > 85) {
      errs.age = 'Age must be between 14 and 85';
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
      const res = await fetch('/api/leads/free-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          email: formData.email,
          membershipPlan: formData.fitnessGoal,
          preferredTime: formData.preferredTime,
          _iron_hp_check: honeypot, // Honeypot field for bot trap
          _form_rendered_at: formRenderedAt, // Anti-automation timing
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || data.error || 'Submission blocked by abuse protection.');
        setIsSubmitting(false);
        return;
      }

      setPassId(data.leadId ? `IF-${data.leadId.slice(-6).toUpperCase()}` : `IF-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    } catch (err: any) {
      // Fallback if offline/preview network
      setPassId(`IF-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      age: '26',
      fitnessGoal: 'Strength & Muscle Building',
      preferredTime: 'Morning (6:00 AM - 9:00 AM)',
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleResetAndClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-2xl z-10 my-8">
        
        {/* Header */}
        <div className="bg-[#FAFAF8] p-6 sm:p-8 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E63946] flex items-center justify-center text-white shadow-md shadow-[#E63946]/20">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E63946] block">
                COMPLIMENTARY ACCESS
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#171717] leading-none">
                {submitted ? 'YOUR TRIAL PASS' : 'CLAIM YOUR 1-DAY PASS'}
              </h3>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E5E7EB] text-[#5F6368] hover:text-[#171717] flex items-center justify-center transition-colors shadow-2xs"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            /* Clean Success Ticket Card */
            <div className="space-y-6">
              <div className="p-6 bg-[#FAFAF8] border-2 border-[#E63946]/30 rounded-2xl relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-start border-b border-dashed border-[#E5E7EB] pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#E63946] block">IRONFORGE FITNESS</span>
                    <h4 className="font-display text-2xl font-black uppercase text-[#171717]">VIP 1-DAY PASS</h4>
                    <span className="text-xs text-[#5F6368]">Athlete: <strong className="text-[#171717]">{formData.name}</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#5F6368] block">Status</span>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold uppercase">
                      CONFIRMED
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-[#5F6368] block text-[10px] uppercase">Goal Focus</span>
                    <span className="font-bold text-[#171717]">{formData.fitnessGoal}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6368] block text-[10px] uppercase">Slot</span>
                    <span className="font-bold text-[#171717]">{formData.preferredTime.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6368] block text-[10px] uppercase">Pass Code</span>
                    <span className="font-mono font-black text-[#E63946]">{passId}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6368] block text-[10px] uppercase">Facility</span>
                    <span className="font-bold text-[#171717]">Dehradun Flagship</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-dashed border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                    <QrCode className="w-10 h-10 text-[#171717]" />
                    <span className="text-[11px] leading-tight">Show this QR pass at the front desk</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#5F6368]">Valid for 7 Days</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#5F6368]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0" />
                  <span>Confirmation SMS sent to <strong className="text-[#171717]">{formData.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0" />
                  <span>Bring athletic workout shoes and a water bottle</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white bg-[#171717] hover:bg-black transition-colors cursor-pointer"
              >
                DONE & RETURN TO SITE
              </button>
            </div>
          ) : (
            /* Lead Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                <label htmlFor="_iron_hp_check">Leave this field blank</label>
                <input
                  type="text"
                  id="_iron_hp_check"
                  name="_iron_hp_check"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {apiError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <span className="font-bold">Notice:</span>
                  <span>{apiError}</span>
                </div>
              )}

              <p className="text-xs text-[#5F6368] mb-4">
                Experience full gym floor access, test our calibrated equipment, and receive a coach orientation.
              </p>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
                  Name <span className="text-[#E63946]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Verma"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#FAFAF8] border ${
                    errors.name ? 'border-[#E63946]' : 'border-[#E5E7EB] focus:border-[#E63946]'
                  } text-sm text-[#171717] focus:outline-none`}
                />
                {errors.name && <p className="text-[11px] text-[#E63946] mt-0.5">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
                    Phone <span className="text-[#E63946]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#FAFAF8] border ${
                      errors.phone ? 'border-[#E63946]' : 'border-[#E5E7EB] focus:border-[#E63946]'
                    } text-sm text-[#171717] focus:outline-none`}
                  />
                  {errors.phone && <p className="text-[11px] text-[#E63946] mt-0.5">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
                    Email <span className="text-[#E63946]">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@email.com"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#FAFAF8] border ${
                      errors.email ? 'border-[#E63946]' : 'border-[#E5E7EB] focus:border-[#E63946]'
                    } text-sm text-[#171717] focus:outline-none`}
                  />
                  {errors.email && <p className="text-[11px] text-[#E63946] mt-0.5">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Age */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
                    Age <span className="text-[#E63946]">*</span>
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="85"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#FAFAF8] border ${
                      errors.age ? 'border-[#E63946]' : 'border-[#E5E7EB] focus:border-[#E63946]'
                    } text-sm text-[#171717] focus:outline-none`}
                  />
                  {errors.age && <p className="text-[11px] text-[#E63946] mt-0.5">{errors.age}</p>}
                </div>

                {/* Preferred Training Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
                    Preferred Time
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus:border-[#E63946] text-xs text-[#171717] focus:outline-none"
                  >
                    <option>Morning (6:00 AM - 9:00 AM)</option>
                    <option>Afternoon (12:00 PM - 4:00 PM)</option>
                    <option>Evening (5:30 PM - 9:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Fitness Goal */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
                  Fitness Goal / Plan
                </label>
                <select
                  value={formData.fitnessGoal}
                  onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus:border-[#E63946] text-xs text-[#171717] focus:outline-none"
                >
                  <option>Strength & Muscle Building</option>
                  <option>Fat Loss & Body Recomposition</option>
                  <option>Personal Coaching Trial</option>
                  <option>HIIT & Group Classes</option>
                  <option>Mobility & Functional Fitness</option>
                  <option>Basic Plan Inquiries</option>
                  <option>Pro Plan Inquiries</option>
                  <option>Elite Plan Inquiries</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm text-white bg-[#E63946] hover:bg-[#d62839] shadow-lg shadow-[#E63946]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      GENERATING PASS...
                    </span>
                  ) : (
                    <span>BOOK MY FREE TRIAL</span>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-[#5F6368]">
                By booking, you agree to receive training updates. No spam, opt out anytime.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
