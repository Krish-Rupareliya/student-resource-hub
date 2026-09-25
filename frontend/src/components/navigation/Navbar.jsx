import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Compass, X, Menu } from 'lucide-react';

function Navbar({ onOpenCommandPalette }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Community', path: '/community' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header 
      className={`w-full sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-[#FDFBF7]/90 backdrop-blur-md shadow-sm border-amber-200/50' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        {/* Left Section: Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] text-amber-400 font-black text-xl flex items-center justify-center border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#FACC15] group-hover:scale-105 group-hover:rotate-[-3deg] transition-all">
              CH
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl text-hub-navy leading-none tracking-tight">
                Campus<span className="text-amber-500">Hub</span>
              </span>
              <span className="text-[10px] text-gray-500 font-bold tracking-wide">
                Your Learning Companion
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Nav Links - Apple Dock Hover Effect */}
        <div 
          className="hidden lg:flex items-center gap-8"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onMouseEnter={() => setHoveredPath(link.path)}
              className={({ isActive }) =>
                `text-sm relative py-1 font-black transition-colors duration-200 select-none ${
                  isActive ? 'text-hub-navy' : 'text-gray-600 hover:text-hub-navy'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  className="flex flex-col items-center justify-center relative"
                  whileHover={{ scale: 1.15, y: -2 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                >
                  <span>{link.name}</span>

                  {/* Apple Dock Hover Sliding Underline */}
                  {hoveredPath === link.path && (
                    <motion.div
                      layoutId="dock-hover-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[3px] bg-amber-400 rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* macOS Dock Active Dot Indicator when not hovering */}
                  {isActive && hoveredPath !== link.path && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-xs"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right Section: Single Unified Command Palette Trigger */}
        <div className="flex items-center gap-2.5">
          {/* Desktop & Tablet Unified Search Pill */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-white/95 hover:bg-white border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] hover:shadow-[4px_4px_0px_#111111] hover:-translate-y-0.5 transition-all duration-200 w-48 md:w-56 lg:w-64 text-left cursor-pointer group"
            title="Quick Search across all Semesters & Subjects (Ctrl+K)"
          >
            <div className="flex items-center gap-2 min-w-0 text-slate-600 group-hover:text-slate-900 transition-colors">
              <Search className="w-4 h-4 text-amber-500 stroke-[2.5] shrink-0" />
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 truncate">Search subjects, notes...</span>
            </div>
            <kbd className="shrink-0 px-1.5 py-0.5 bg-amber-100 text-[#111111] font-mono text-[10px] font-black rounded-lg border border-[#111111] shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Search Icon */}
          <button
            onClick={onOpenCommandPalette}
            className="sm:hidden w-10 h-10 rounded-2xl bg-amber-100 border-2 border-[#111111] flex items-center justify-center text-[#111111] shadow-[2.5px_2.5px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            aria-label="Open Quick Search"
            title="Search"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-hub-navy focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
          </button>
        </div>

      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-b-2 border-[#111111] px-4 py-4 shadow-lg animate-fade-in z-40 space-y-3">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-2xl text-sm font-black border-2 transition-all ${isActive
                    ? 'bg-amber-400 text-slate-950 border-[#111111] shadow-[2.5px_2.5px_0px_#111111]'
                    : 'bg-white text-slate-700 border-transparent hover:border-slate-200'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-2 border-t border-amber-200">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenCommandPalette?.();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-100 border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] text-[#111111] text-xs font-black cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600 stroke-[2.5]" />
                <span>Search Semesters &amp; Notes</span>
              </div>
              <span className="px-1.5 py-0.5 bg-white rounded border border-[#111111] font-mono text-[10px]">⌘K</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

