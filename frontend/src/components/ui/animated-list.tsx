'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  /**
   * If true, reveals items sequentially with `delay` ms intervals.
   * If false, renders all items with a staggered entrance.
   */
  progressive?: boolean;
}

export interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  className = '',
  index = 0,
}) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.94, opacity: 0, y: 14 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{
        scale: 0.92,
        opacity: 0,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        transition: {
          height: { duration: 0.25, ease: 'easeOut' },
          opacity: { duration: 0.2 },
        },
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        delay: index * 0.08,
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedList: React.FC<AnimatedListProps> = ({
  className = '',
  children,
  delay = 800,
  progressive = false,
}) => {
  const childrenArray = useMemo(
    () => React.Children.toArray(children),
    [children]
  );

  const [visibleCount, setVisibleCount] = useState(
    progressive ? 1 : childrenArray.length
  );

  useEffect(() => {
    if (!progressive) {
      setVisibleCount(childrenArray.length);
      return undefined;
    }

    if (visibleCount < childrenArray.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 1, childrenArray.length));
      }, delay);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [visibleCount, childrenArray.length, delay, progressive]);

  const itemsToRender = progressive
    ? childrenArray.slice(0, visibleCount)
    : childrenArray;

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      <AnimatePresence mode="popLayout" initial={true}>
        {itemsToRender.map((child, i) => (
          <AnimatedListItem
            key={(child as React.ReactElement)?.key || i}
            index={i}
          >
            {child}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedList;
