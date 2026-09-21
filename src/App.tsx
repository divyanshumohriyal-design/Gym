/**
 * IRONFORGE FITNESS - Modern Premium Gym & Athletic Performance Website
 * Designed as a freelance showcase project for a commercial fitness client.
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsCounter } from './components/StatsCounter';
import { About } from './components/About';
import { Programs } from './components/Programs';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Trainers } from './components/Trainers';
import { Facilities } from './components/Facilities';
import { Pricing } from './components/Pricing';
import { Transformations } from './components/Transformations';
import { Testimonials } from './components/Testimonials';
import { Schedule } from './components/Schedule';
import { FreeTrialCTA } from './components/FreeTrialCTA';
import { FAQ } from './components/FAQ';
import { ContactAndMap } from './components/ContactAndMap';
import { Footer } from './components/Footer';
import { FreeTrialModal } from './components/FreeTrialModal';
import { BackToTop } from './components/BackToTop';

export default function App() {
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [preselectedOption, setPreselectedOption] = useState<string | undefined>(undefined);

  const handleOpenTrialModal = (option?: string) => {
    setPreselectedOption(option);
    setTrialModalOpen(true);
  };

  const handleCloseTrialModal = () => {
    setTrialModalOpen(false);
    setPreselectedOption(undefined);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717] flex flex-col selection:bg-[#E63946] selection:text-white">
      {/* Top Professional Sticky Navigation */}
      <Navbar onOpenTrialModal={handleOpenTrialModal} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenTrialModal={() => handleOpenTrialModal('1-Day All-Access Pass')} />

        {/* Animated Statistics Counter */}
        <StatsCounter />

        {/* About Section */}
        <About />

        {/* Programs & Services Section */}
        <Programs onOpenTrialModal={(goal) => handleOpenTrialModal(goal)} />

        {/* Why IronForge (Key Benefits) */}
        <WhyChooseUs />

        {/* Trainer Showcase */}
        <Trainers onOpenTrialModal={(coach) => handleOpenTrialModal(coach)} />

        {/* Facilities Gallery & Lightbox */}
        <Facilities />

        {/* Membership & Pricing Plans */}
        <Pricing onSelectPlan={(plan) => handleOpenTrialModal(`${plan} Membership`)} />

        {/* Real Transformations & Progress */}
        <Transformations />

        {/* Athlete Testimonials Carousel */}
        <Testimonials />

        {/* Class Schedule Timetable */}
        <Schedule onBookClass={(cls, time) => handleOpenTrialModal(`Class Booking: ${cls} (${time})`)} />

        {/* High-Impact Free Trial CTA */}
        <FreeTrialCTA onOpenTrialModal={() => handleOpenTrialModal('Free Trial Pass')} />

        {/* Frequently Asked Questions */}
        <FAQ />

        {/* Contact Form & Location Map */}
        <ContactAndMap />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Back-to-Top Button */}
      <BackToTop />

      {/* Lead Generation & Free Trial Pass Modal */}
      <FreeTrialModal
        isOpen={trialModalOpen}
        onClose={handleCloseTrialModal}
        preselectedOption={preselectedOption}
      />
    </div>
  );
}
