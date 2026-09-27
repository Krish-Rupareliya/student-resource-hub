import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * FramerButton — Signature Dual-Text Slide-Up Animated Button
 * Inspired by premium Framer agency templates (Lofty Lab).
 * Features dual-layer text sliding up on hover with smooth cubic-bezier easing,
 * neo-brutalist solid ink borders, and tactile tactile micro-elevation.
 */
export default function FramerButton({
  children,
  text,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  disabled = false,
  type = 'button',
  target,
  rel,
  ariaLabel,
  ...props
}) {
  const contentText = text || (typeof children === 'string' ? children : null);

  // Variant styling
  const variantStyles = {
    primary:
      'bg-[#FF5722] hover:bg-[#E64A19] text-white border-[2px] border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] hover:shadow-[4px_4px_0_#0F172A]',
    secondary:
      'bg-[#FEF08A] hover:bg-yellow-300 text-[#0F172A] border-[2px] border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] hover:shadow-[4px_4px_0_#0F172A]',
    navy:
      'bg-[#0F172A] hover:bg-[#1E293B] text-white border-[2px] border-[#0F172A] shadow-[2.5px_2.5px_0_#FF5722] hover:shadow-[4px_4px_0_#FF5722]',
    sky:
      'bg-[#BAE6FD] hover:bg-sky-300 text-[#0369A1] border-[2px] border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] hover:shadow-[4px_4px_0_#0F172A]',
    outline:
      'bg-white hover:bg-amber-50 text-[#0F172A] border-[2px] border-[#0F172A] shadow-[2px_2px_0_#0F172A] hover:shadow-[3.5px_3.5px_0_#0F172A]',
    ghost:
      'bg-transparent hover:bg-amber-100/60 text-[#0F172A] border border-transparent hover:border-[#0F172A]',
  };

  // Size styling
  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-xl gap-1.5',
    md: 'text-xs sm:text-sm px-5 py-2.5 rounded-xl gap-2',
    lg: 'text-sm sm:text-base px-7 py-3 rounded-2xl gap-2.5',
    pill: 'text-xs sm:text-sm px-6 py-2.5 rounded-full gap-2',
  };

  const baseClasses = `group relative inline-flex items-center justify-center font-black uppercase tracking-wider transition-all duration-200 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 ${
    variantStyles[variant] || variantStyles.primary
  } ${sizeStyles[size] || sizeStyles.md} ${className}`;

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    if (typeof Icon === 'string') {
      return (
        <span className="material-symbols-outlined text-lg leading-none shrink-0">
          {Icon}
        </span>
      );
    }
    if (
      typeof Icon === 'function' ||
      (typeof Icon === 'object' && Icon !== null && (Icon.$$typeof || Icon.render))
    ) {
      const IconComp = Icon;
      return <IconComp className="w-4 h-4 shrink-0" />;
    }
    return null;
  };

  const renderContent = () => (
    <>
      {Icon && iconPosition === 'left' && (
        <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
          {renderIcon()}
        </span>
      )}

      {contentText ? (
        <span className="relative inline-block overflow-hidden leading-tight py-0.5">
          <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(.44,0,.56,1)] group-hover:-translate-y-full">
            {contentText}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 inline-block translate-y-full transition-transform duration-300 ease-[cubic-bezier(.44,0,.56,1)] group-hover:translate-y-0 text-inherit"
          >
            {contentText}
          </span>
        </span>
      ) : (
        children
      )}

      {Icon && iconPosition === 'right' && (
        <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:scale-110">
          {renderIcon()}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses} aria-label={ariaLabel || contentText} {...props}>
        {renderContent()}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={target || '_blank'}
        rel={rel || 'noopener noreferrer'}
        className={baseClasses}
        aria-label={ariaLabel || contentText}
        {...props}
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      aria-label={ariaLabel || contentText}
      {...props}
    >
      {renderContent()}
    </button>
  );
}
