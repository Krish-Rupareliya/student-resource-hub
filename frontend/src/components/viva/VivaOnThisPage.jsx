// frontend/src/components/viva/VivaOnThisPage.jsx
import React, { useState, useEffect } from 'react';

/**
 * Right-side "On This Page" Table of Contents
 * Displays clickable question headings that automatically track scroll position.
 */
export default function VivaOnThisPage({ items = [] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    items.forEach((item, idx) => {
      const elementId = item.id || `q-${idx + 1}`;
      const el = document.getElementById(elementId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToElement = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -90; // account for sticky header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(targetId);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto p-4 pl-6 border-l border-gray-100 text-xs">
      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-gray-400 text-[11px] mb-3 select-none">
        <span className="material-symbols-outlined text-[15px]">toc</span>
        On This Page
      </div>

      <nav className="space-y-1">
        {items.map((item, idx) => {
          const elementId = item.id || `q-${idx + 1}`;
          const label = item.questionNumber
            ? `${item.questionNumber}: ${item.question}`
            : item.title
            ? `Exp ${item.experimentNumber || idx + 1}: ${item.title}`
            : `Q.${idx + 1}: ${item.question}`;

          const isActive = activeId === elementId;

          return (
            <a
              key={elementId}
              href={`#${elementId}`}
              onClick={(e) => scrollToElement(e, elementId)}
              className={`block py-1.5 px-2 rounded-md transition-all leading-snug line-clamp-2 ${
                isActive
                  ? 'text-blue-600 font-bold bg-blue-50/80 border-l-2 border-blue-600 pl-2'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 font-medium'
              }`}
              title={item.question || item.title}
            >
              {label}
            </a>
          );
        })}
      </nav>

      <div className="mt-8 pt-4 border-t border-gray-200/70">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-[11px] text-gray-400 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          Back to top
        </button>
      </div>
    </aside>
  );
}
