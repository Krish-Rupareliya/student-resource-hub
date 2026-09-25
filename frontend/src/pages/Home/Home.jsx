import React from 'react';
import TickerTape from './components/TickerTape';
import BackgroundDecorations from './components/BackgroundDecorations';
import HeroSection from './components/HeroSection';
import CategoryMarquee from './components/CategoryMarquee';
import ExamCountdownAndCalculator from './components/ExamCountdownAndCalculator';
import TrendingPacksSection from './components/TrendingPacksSection';
import LearningPlatformsSection from './components/Free Courses Platforms Section';
import VideoSection from './components/VideoSection';
import FeatureStrip from './components/FeatureStrip';
import TestimonialsSection from './components/TestimonialsSection';

function Home() {
  return (
    <div className="pt-20 bg-[#FDFBF7] text-hub-navy font-poppins min-h-screen relative overflow-hidden selection:bg-amber-300 selection:text-hub-navy">
      {/* ─── 1. Top Ticker Tape Marquee Banner ─── */}
      <TickerTape />

      {/* Background Decor SVG Vector Layers */}
      <BackgroundDecorations />

      {/* Main Page Sections */}
      <div className="relative z-10">
        {/* 2. Hero Section with student visual & quick actions */}
        <HeroSection />

        {/* 3. Category Marquee (Bouncy Category Cards) */}
        <CategoryMarquee />

        {/* 4. Live Semester Clock & SGPA Predictor */}
        <ExamCountdownAndCalculator />

        {/* 5. Trending High-Demand Study Packs */}
        <TrendingPacksSection />

        {/* 6. Free Courses & Learning Platforms */}
        <LearningPlatformsSection />

        {/* 7. Video Walkthrough & Tour */}
        <VideoSection />

        {/* 8. Key Feature Strip */}
        <FeatureStrip />

        {/* 9. Student Testimonials */}
        <TestimonialsSection />
      </div>
    </div>
  );
}

export default Home;
