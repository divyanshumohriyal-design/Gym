import React, { useState } from 'react';
import { Flame, Instagram, Facebook, Youtube, Phone, Mail, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && /\S+@\S+\.\S+/.test(newsletterEmail)) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#171717] text-neutral-300 pt-16 pb-12 relative text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-neutral-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#hero" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E63946] flex items-center justify-center text-white shadow-md shadow-[#E63946]/20">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <span className="font-display text-2xl font-black tracking-wider text-white">
                IRONFORGE <span className="text-[#E63946]">FITNESS</span>
              </span>
            </a>

            <p className="font-display uppercase text-sm font-bold tracking-wider text-red-400">
              "BUILD STRENGTH. BUILD DISCIPLINE."
            </p>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              A premier strength, conditioning, and personal training sanctuary engineered for those who demand
              measurable progress and a professional training environment.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-[#E63946] hover:text-white text-neutral-300 flex items-center justify-center transition-colors"
                aria-label="IronForge on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-[#E63946] hover:text-white text-neutral-300 flex items-center justify-center transition-colors"
                aria-label="IronForge on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-[#E63946] hover:text-white text-neutral-300 flex items-center justify-center transition-colors"
                aria-label="IronForge on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {['Home', 'About', 'Programs', 'Trainers', 'Membership', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="hover:text-[#E63946] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Programs
            </h4>
            <ul className="space-y-2.5">
              {[
                'Strength Training',
                'Personal Training',
                'Fat Loss',
                'Muscle Building',
                'Functional Fitness',
              ].map((prog) => (
                <li key={prog}>
                  <a href="#programs" className="hover:text-[#E63946] transition-colors">
                    {prog}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              IronForge Newsletter
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Get fitness tips, updates and gym news delivered straight to your inbox weekly.
            </p>

            {subscribed ? (
              <div className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex rounded-xl overflow-hidden border border-neutral-700 focus-within:border-[#E63946] bg-neutral-900">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-[#E63946] hover:bg-[#d62839] text-white font-bold uppercase transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-neutral-400 block">
                  Strictly no spam. 1-click unsubscribe anytime.
                </span>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>
            © 2026 IronForge Fitness. All rights reserved. Professional Freelance Portfolio Project.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>
        </div>

      </div>

      {/* Legal Dialog Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full p-6 space-y-4 text-[#171717] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="font-display text-xl font-bold uppercase text-[#171717]">
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="text-[#5F6368] hover:text-[#171717] text-xs uppercase font-bold"
              >
                Close
              </button>
            </div>
            <div className="text-xs text-[#5F6368] space-y-2 leading-relaxed max-h-64 overflow-y-auto">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    IronForge Fitness respects your personal data. Any contact information, biometrics, or preferences submitted through our consultation and free trial forms are strictly used to schedule training sessions and manage your membership.
                  </p>
                  <p>
                    We do not sell, rent, or lease customer data to third-party advertisers. All records are securely encrypted and access is restricted to certified IronForge staff.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    All members and guests at IronForge Fitness agree to adhere to facility safety regulations, including wearing suitable closed-toe athletic footwear, reracking weights, and following coach instructions on lifting platforms.
                  </p>
                  <p>
                    Memberships can be cancelled or frozen with 14 days written notice. Free 1-Day Trial passes are valid for first-time visitors over the age of 14 with legal guardian authorization where applicable.
                  </p>
                </>
              )}
            </div>
            <button
              onClick={() => setLegalModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#171717] hover:bg-black text-white font-bold text-xs uppercase transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
