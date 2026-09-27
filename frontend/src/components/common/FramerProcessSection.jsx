import React from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, MessageSquare, Rocket } from 'lucide-react';
import FramerButton from '../ui/FramerButton';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discover',
    subtitle: 'Smart Syllabus Matrix',
    desc: 'Instant search across 8 semesters, 38+ subjects, and 2,500+ syllabus-mapped study notes verified by top alumni.',
    icon: Search,
    color: 'bg-[#FEF08A] text-[#713F12]',
    borderColor: 'border-[#0F172A]',
    shadowColor: '#0F172A',
    ctaText: 'Explore Catalog',
    link: '/resources',
  },
  {
    step: '02',
    title: 'Practice',
    subtitle: 'Exam Papers & Blueprints',
    desc: 'Tackle real Indus semester examination papers with question-by-question marks distribution, unit breakdowns, and answer keys.',
    icon: BookOpen,
    color: 'bg-[#BAE6FD] text-[#0369A1]',
    borderColor: 'border-[#0F172A]',
    shadowColor: '#0F172A',
    ctaText: 'View PYQ Bank',
    link: '/resources',
  },
  {
    step: '03',
    title: 'Prepare',
    subtitle: 'Universal Viva Engine',
    desc: 'Master tough professor oral questions, lab experiments, and code walk-throughs with verified question-answer modules.',
    icon: MessageSquare,
    color: 'bg-[#BBF7D0] text-[#14532D]',
    borderColor: 'border-[#0F172A]',
    shadowColor: '#0F172A',
    ctaText: 'Start Viva Prep',
    link: '/viva',
  },
  {
    step: '04',
    title: 'Accelerate',
    subtitle: 'Opportunities Radar',
    desc: 'Launch your tech career with hand-curated summer internships, ₹1 Lakh+ prize hackathons, and campus placement drives.',
    icon: Rocket,
    color: 'bg-[#FED7AA] text-[#7C2D12]',
    borderColor: 'border-[#0F172A]',
    shadowColor: '#FF5722',
    ctaText: 'Radar Postings',
    link: '/opportunities',
  },
];

/**
 * FramerProcessSection — Inspired by "Our Process" in Lofty Lab Framer Template
 * Numbered architectural cards with hover elevation, icon pop, and dual-text CTA buttons.
 */
export default function FramerProcessSection({ className = '' }) {
  return (
    <section className={`py-12 sm:py-16 relative overflow-hidden select-none ${className}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-xs font-black uppercase tracking-wider mb-3.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5722]" />
            <span>HOW CAMPUSHUB WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-hub-navy tracking-tight leading-tight mb-3">
            The 4-Step Academic <span className="text-[#FF5722] underline decoration-[#FEF08A] decoration-4 underline-offset-4">Success Blueprint</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-xl mx-auto">
            From your very first lecture to graduation day and campus placement drives — everything is mapped for maximum efficiency.
          </p>
        </div>

        {/* 4 Process Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative bg-white rounded-[26px] p-6 sm:p-7 border-[2.5px] border-[#0F172A] shadow-[5px_5px_0_#0F172A] hover:shadow-[8px_8px_0_#0F172A] transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top Step Number Badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-slate-300 group-hover:text-[#FF5722] transition-colors">
                      {step.step}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 border-[#0F172A] shadow-[2px_2px_0_#0F172A] group-hover:scale-110 group-hover:rotate-6 transition-all ${step.color}`}>
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-hub-navy leading-snug tracking-tight mb-1 group-hover:text-[#FF5722] transition-colors">
                    {step.title}
                  </h3>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    {step.subtitle}
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-4 border-t border-slate-100">
                  <FramerButton
                    to={step.link}
                    text={step.ctaText}
                    variant="outline"
                    size="sm"
                    className="w-full text-center"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
