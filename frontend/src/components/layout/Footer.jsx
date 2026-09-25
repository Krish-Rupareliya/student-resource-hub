import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import {
  WhatsAppIcon,
  TelegramIcon,
  SocialStickerButton,
} from '../common/BrandIcons';
import { subscribeNewsletter } from '../../services/subscribers/subscribersApi';
import { getPublicHomepageSettings } from '../../services/settings/settingsApi';
import { ToastContainer, useToast } from '../ui/Toast';

function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const [communityLinks, setCommunityLinks] = useState({
    whatsapp: 'https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB',
    telegram: 'https://t.me/+fP4hKU69AQIwZjI1',
  });

  useEffect(() => {
    let isMounted = true;
    getPublicHomepageSettings()
      .then((settings) => {
        if (isMounted && settings?.communityGroups) {
          const groups = settings.communityGroups;
          setCommunityLinks({
            whatsapp: groups.whatsappSem1_4 || groups.whatsappSem5_8 || 'https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB',
            telegram: groups.telegramMain || 'https://t.me/+fP4hKU69AQIwZjI1',
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus('error');
      setMessage('Email address cannot be empty.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setStatus('error');
      setMessage('Please enter a valid email address (e.g., user@example.com).');
      return;
    }

    if (status === 'loading') return;

    setStatus('loading');
    setMessage('');

    const res = await subscribeNewsletter({ email: trimmedEmail });
    if (res.success) {
      if (res.isDuplicate || res.message === 'You are already subscribed.') {
        setStatus('info');
        setMessage('You are already subscribed.');
      } else {
        setStatus('success');
        setMessage('Thanks for subscribing!');
        addToast({ message: 'Thanks for subscribing!', type: 'success' });
      }
      setEmail('');
    } else {
      setStatus('error');
      setMessage(res.error || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="w-full bg-[#0D1527] text-white pt-16 pb-8 relative z-10 border-t-2 border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info & Pinterest Neo-Brutalist Sticker Socials */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#111111] font-black text-lg flex items-center justify-center border-2 border-[#111111] shadow-[3px_3px_0px_#FACC15] rotate-[-2deg]">
                CH
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-tight">
                  Campus<span className="text-amber-400">Hub</span>
                </span>
                <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                  Your Learning Companion
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Everything a student needs to learn, grow, and succeed — in one unified campus repository.
            </p>

            {/* Pinterest Neo-Brutalist Sticker Social Badges */}
            <div className="flex items-center gap-2.5 pt-3 flex-wrap">
              <SocialStickerButton
                href={communityLinks.whatsapp}
                icon={WhatsAppIcon}
                label="WhatsApp Community"
                bgColor="bg-[#25D366]"
                hoverBg="hover:bg-[#1faa4e]"
                textColor="text-slate-950"
                rotate="rotate-[-3deg]"
              />
              <SocialStickerButton
                href={communityLinks.telegram}
                icon={TelegramIcon}
                label="Telegram Channel"
                bgColor="bg-[#229ED9]"
                hoverBg="hover:bg-[#1a84b8]"
                textColor="text-white"
                rotate="rotate-[2.5deg]"
              />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/resources" className="hover:text-amber-400 transition-colors">Resources</Link></li>
              <li><Link to="/courses" className="hover:text-amber-400 transition-colors">Courses</Link></li>
              <li><Link to="/opportunities" className="hover:text-amber-400 transition-colors">Opportunities</Link></li>
              <li><Link to="/community" className="hover:text-amber-400 transition-colors">Community</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Popular Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Popular</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/resources" className="hover:text-amber-400 transition-colors">Notes</Link></li>
              <li><Link to="/resources" className="hover:text-amber-400 transition-colors">PYQs</Link></li>
              <li><Link to="/resources" className="hover:text-amber-400 transition-colors">Practicals</Link></li>
              <li><Link to="/courses" className="hover:text-amber-400 transition-colors">Free Courses</Link></li>
              <li><Link to="/opportunities" className="hover:text-amber-400 transition-colors">Internships</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Stay Updated</h4>
            <p className="text-sm text-gray-400">
              Subscribe to get the latest resources and opportunities.
            </p>

            <form onSubmit={handleSubscribe} noValidate className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') {
                    setStatus('idle');
                    setMessage('');
                  }
                }}
                placeholder="Enter your email"
                className="bg-slate-900 border border-slate-700 text-white placeholder:text-gray-500 rounded-full px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 flex-1"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-amber-400 hover:bg-amber-500 text-hub-navy font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 min-w-[115px]"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-hub-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
            {message && (
              <p className={`text-xs pt-1 ${status === 'success' ? 'text-amber-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} CampusHub. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms &amp; Conditions</a>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-10 h-10 rounded-2xl bg-amber-400 text-[#111111] hover:bg-amber-300 font-bold flex items-center justify-center border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

      </div>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </footer>
  );
}

export default Footer;
