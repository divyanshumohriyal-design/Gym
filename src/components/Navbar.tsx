import React, { useState, useEffect } from 'react';
import { Menu, X, Flame, ChevronRight, Phone, User, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenTrialModal: (plan?: string) => void;
  onOpenAuthModal: (tab?: 'signin' | 'register' | 'forgot' | 'verify') => void;
  onOpenMemberPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTrialModal,
  onOpenAuthModal,
  onOpenMemberPortal,
}) => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Active section detection
      const sections = ['hero', 'about', 'programs', 'why-us', 'trainers', 'facilities', 'membership', 'schedule', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Programs', href: '#programs', id: 'programs' },
    { label: 'Trainers', href: '#trainers', id: 'trainers' },
    { label: 'Facilities', href: '#facilities', id: 'facilities' },
    { label: 'Membership', href: '#membership', id: 'membership' },
    { label: 'Schedule', href: '#schedule', id: 'schedule' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-3.5 border-b border-[#E5E7EB] shadow-sm'
            : 'bg-white/80 backdrop-blur-sm py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946] rounded-lg p-1"
            aria-label="IronForge Fitness Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E63946] flex items-center justify-center shadow-md shadow-[#E63946]/20 group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-wider leading-none text-[#171717] flex items-center gap-1.5">
                IRONFORGE
                <span className="text-[#E63946]">FITNESS</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#5F6368] font-semibold mt-0.5">
                Strength & Discipline
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors duration-200 relative py-1 ${
                    isActive ? 'text-[#E63946]' : 'text-[#171717] hover:text-[#E63946]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E63946] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="hidden xl:flex items-center gap-2 text-xs font-semibold text-[#5F6368] hover:text-[#171717] transition-colors"
              title="Call gym reception"
            >
              <Phone className="w-3.5 h-3.5 text-[#E63946]" />
              <span>+91 98765 43210</span>
            </a>

            {user ? (
              <button
                id="navbar-member-portal-btn"
                onClick={onOpenMemberPortal}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#F3F4F1] hover:bg-[#E5E7EB] text-[#171717] rounded-xl border border-[#E5E7EB] transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#E63946] text-white flex items-center justify-center text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <span className="text-[10px] bg-[#E63946]/10 text-[#E63946] px-1.5 py-0.2 rounded font-semibold uppercase">
                  {user.membershipTier}
                </span>
              </button>
            ) : (
              <button
                id="navbar-signin-btn"
                onClick={() => onOpenAuthModal('signin')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#171717] hover:text-[#E63946] rounded-xl hover:bg-[#F3F4F1] transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#E63946]" />
                <span>SIGN IN</span>
              </button>
            )}

            <button
              id="navbar-join-btn"
              onClick={() => onOpenTrialModal()}
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#E63946] hover:bg-[#d62839] rounded-xl shadow-md shadow-[#E63946]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#E63946]/30 active:scale-[0.98] cursor-pointer"
            >
              FREE 1-DAY PASS
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            {user ? (
              <button
                onClick={onOpenMemberPortal}
                className="px-2.5 py-1.5 text-xs font-bold text-[#171717] bg-[#F3F4F1] rounded-lg flex items-center gap-1"
              >
                <User className="w-3 h-3 text-[#E63946]" />
                <span>Portal</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal('signin')}
                className="px-2.5 py-1.5 text-xs font-bold text-white bg-[#171717] rounded-lg"
              >
                Sign In
              </button>
            )}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#171717] hover:bg-[#F3F4F1] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside
          className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white border-l border-[#E5E7EB] p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E63946] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="font-display text-xl font-bold tracking-wider text-[#171717]">
                  IRONFORGE <span className="text-[#E63946]">FITNESS</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#5F6368] hover:text-[#171717] rounded-md"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col gap-1.5" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-red-50 text-[#E63946] font-bold border-l-3 border-[#E63946]'
                        : 'text-[#171717] hover:bg-[#F3F4F1]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-[#E5E7EB] space-y-3">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMemberPortal();
                }}
                className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-[#171717] bg-[#F3F4F1] border border-[#E5E7EB] rounded-xl flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-[#E63946]" />
                <span>MEMBER PORTAL ({user.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('signin');
                }}
                className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-[#171717] bg-[#F3F4F1] border border-[#E5E7EB] rounded-xl flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#E63946]" />
                <span>SIGN IN / MEMBER PORTAL</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrialModal();
              }}
              className="w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white bg-[#E63946] hover:bg-[#d62839] rounded-xl shadow-md shadow-[#E63946]/20"
            >
              CLAIM FREE 1-DAY PASS
            </button>
            <div className="text-center text-xs text-[#5F6368] flex items-center justify-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#E63946]" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};
