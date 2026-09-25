// src/components/common/CardStack.jsx
// React / Framer Motion implementation of Sticky Stacking Scroll (Card Reveal).
// Section cards slide up and pin over the previous card like a deck of playing cards.
// When a card reaches its top threshold, it locks into place while the next card overlays on top of it.
// Depth scale applied to the background card: scale: 1 - progress * 0.05 with opacity: 0.8.
// 100% compliant with svg-avoid.md, pinte.md, and AGENTS.md.

import React, { createContext, useContext, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const CardStackContext = createContext({
  scrollYProgress: null,
  totalCards: 1,
  scaleMultiplier: 0.05,
  topOffset: 100,
  topGap: 24,
});

/**
 * CardStack Parent Container
 * Tracks scroll progression across the whole card stack range.
 */
export function CardStack({
  children,
  totalCards = 3,
  scaleMultiplier = 0.05,
  topOffset = 100,
  topGap = 24,
  className = '',
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <CardStackContext.Provider
      value={{
        scrollYProgress,
        totalCards,
        scaleMultiplier,
        topOffset,
        topGap,
      }}
    >
      <div ref={containerRef} className={`relative ${className}`}>
        {children}
      </div>
    </CardStackContext.Provider>
  );
}

/**
 * CardStackItem Wrapper
 * Pins each card at a sticky top position and scales it down as subsequent cards stack over it.
 * Formula: scale: 1 - progress * 0.05, opacity: 1 - progress * 0.20 (down to 0.80).
 */
export function CardStackItem({
  children,
  index = 0,
  totalCards: itemTotalCards,
  scaleMultiplier: itemScaleMultiplier,
  topPosition = null,
  className = '',
  cardClassName = '',
}) {
  const itemRef = useRef(null);
  const context = useContext(CardStackContext);
  const total = itemTotalCards || context.totalCards || 1;
  const multiplier = itemScaleMultiplier || context.scaleMultiplier || 0.05;
  const topOffset = context.topOffset || 100;
  const topGap = context.topGap || 24;

  const isLast = index === total - 1;

  // Track the scroll progress of this specific item as it reaches its sticky threshold and subsequent cards overlay it
  const { scrollYProgress: itemScrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start ' + (topOffset + index * topGap) + 'px', 'end ' + (topOffset + index * topGap) + 'px'],
  });

  // Smooth scroll physics for jitter-free tracking with Lenis
  const smoothItemProgress = useSpring(itemScrollYProgress, {
    stiffness: 280,
    damping: 28,
    restDelta: 0.001,
  });

  // Calculate target scale and opacity for depth stacking effect
  const targetScale = isLast ? 1 : 1 - multiplier;
  const targetOpacity = isLast ? 1 : 0.80;
  const targetBrightness = isLast ? 1 : 0.92;

  // Continuous interpolation: 1 - progress * 0.05 (to 0.95/0.96) and 1 - progress * 0.2 (to 0.80)
  const scale = useTransform(smoothItemProgress, [0, 1], [1, targetScale]);
  const opacity = useTransform(smoothItemProgress, [0, 1], [1, targetOpacity]);
  const brightness = useTransform(smoothItemProgress, [0, 1], [1, targetBrightness]);

  // Sticky top offset
  const computedTop = topPosition || `calc(${topOffset}px + ${index * topGap}px)`;

  return (
    <div
      ref={itemRef}
      style={{
        top: computedTop,
      }}
      className={`sticky min-h-[58vh] sm:min-h-[68vh] flex flex-col justify-start origin-top pb-10 sm:pb-16 last:pb-0 ${className}`}
    >
      <motion.div
        style={{
          scale,
          opacity,
          filter: `brightness(${brightness})`,
        }}
        className={`w-full origin-top transition-shadow ${cardClassName}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default CardStack;
