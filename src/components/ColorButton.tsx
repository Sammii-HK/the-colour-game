'use client';

import React from 'react';

interface ColorButtonProps {
  color?: string;
  variant?: 'primary' | 'easy' | 'medium' | 'hard' | 'neutral';
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const VARIANT_COLORS = {
  easy: { bg: '#10b981', hover: '#059669' }, // Green
  medium: { bg: '#f59e0b', hover: '#d97706' }, // Orange
  hard: { bg: '#ef4444', hover: '#dc2626' }, // Red
  neutral: { bg: '#6b7280', hover: '#4b5563' }, // Gray
};

export default function ColorButton({ 
  color, 
  variant = 'primary', 
  children, 
  onClick, 
  href, 
  disabled, 
  className = '', 
  type = 'button' 
}: ColorButtonProps) {
  
  // Calculate if color is light for text contrast
  const isLightColor = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 128;
  };

  // Get the background color
  const getBackgroundColor = () => {
    if (color) return color;
    if (variant !== 'primary') return VARIANT_COLORS[variant].bg;
    return VARIANT_COLORS.neutral.bg;
  };

  const backgroundColor = getBackgroundColor();
  const isLight = isLightColor(backgroundColor);
  const textColor = isLight ? '#1f2937' : '#ffffff';

  const baseClasses = `
    inline-flex items-center justify-center px-6 py-3 
    border border-transparent rounded-lg shadow-sm 
    font-medium transition-all duration-200 
    hover:opacity-90 focus:outline-none focus:ring-2 
    focus:ring-offset-2 focus:ring-gray-400 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const buttonStyle = {
    backgroundColor,
    color: textColor,
    boxShadow: `0 4px 15px ${backgroundColor}40`,
  };

  // If it's a link
  if (href) {
    const LinkComponent = require('next/link').default;
    return (
      <LinkComponent
        href={href}
        className={baseClasses}
        style={buttonStyle}
      >
        {children}
      </LinkComponent>
    );
  }

  // Regular button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      style={buttonStyle}
    >
      {children}
    </button>
  );
}
