import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import ScrollProgressBar from '../components/common/ScrollProgressBar';
import CommandPalette from '../components/common/CommandPalette';
import StudyBuddyWidget from '../components/common/StudyBuddyWidget';
import UploadResourceModal from '../components/resources/UploadResourceModal';

function AppLayout() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // Global Ctrl+K / Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-clip relative">
      {/* ─── Global Reading Progress Bar ─── */}
      <ScrollProgressBar />

      {/* ─── Global Scroll To Top on Route Change ─── */}
      <ScrollToTop />

      {/* ─── Global Navigation Bar with Search & Quick Launch ─── */}
      <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* ─── Main Page Outlet ─── */}
      <main className="flex-grow -mt-20 w-full">
        <Outlet />
      </main>

      {/* ─── Global Footer ─── */}
      <Footer />

      {/* ─── Global Command Palette (Ctrl+K) ─── */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* ─── Global Floating Productivity Suite (Pomodoro, Stash, Quick Request) ─── */}
      <StudyBuddyWidget
        onOpenRequestModal={() => setIsUploadModalOpen(true)}
      />

      {/* ─── Global Resource Submission / Request Modal ─── */}
      {isUploadModalOpen && (
        <UploadResourceModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </div>
  );
}

export default AppLayout;
