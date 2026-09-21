export interface Program {
  id: string;
  title: string;
  name?: string;
  tagline: string;
  description: string;
  shortDescription?: string;
  detailedDescription: string;
  benefits: string[];
  schedulePreview: string;
  intensity: 'Medium' | 'High' | 'Very High' | string;
  duration: string;
  image: string;
  category: 'strength' | 'conditioning' | 'specialized' | string;
}

export type FitnessProgram = Program;

export interface Trainer {
  id: string;
  name: string;
  role: string;
  experience: string;
  bio: string;
  certifications: string[];
  image: string;
  instagram: string;
  linkedin: string;
  twitter?: string;
  specialty: string;
  socials?: {
    instagram: string;
    linkedin: string;
    twitter: string;
  };
}

export interface Facility {
  id: string;
  name: string;
  tag: string;
  description: string;
  image: string;
  equipment: string[];
  features?: string[];
}

export type FacilityItem = Facility;

export interface MembershipPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  price?: number;
  annualPrice?: number;
  popular?: boolean;
  features: string[];
  tagline: string;
}

export interface TransformationStory {
  id: string;
  name: string;
  achievement: string;
  timeframe: string;
  quote: string;
  story: string;
  stats: {
    label: string;
    value: string;
  }[];
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  membershipDuration: string;
  avatar: string;
}

export interface ClassSession {
  time: string;
  name: string;
  trainer: string;
  category: 'Strength' | 'HIIT' | 'Mobility' | 'Conditioning' | string;
  duration: string;
  intensity: 'Moderate' | 'High' | 'Extreme' | string;
}

export interface DaySchedule {
  day: string;
  dateLabel?: string;
  classes: ClassSession[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
