import React from 'react';

interface FlowerIconProps {
  id: string;
  size?: number;
  className?: string;
  color?: string;
}

export const FlowerIcon: React.FC<FlowerIconProps> = ({ id, size = 40, className = '', color = 'currentColor' }) => {
  switch (id) {
    case 'rose':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 7.5a4.5 4.5 0 0 0-4.5 4.5c0 3 4.5 6 4.5 6s4.5-3 4.5-6a4.5 4.5 0 0 0-4.5-4.5Z" />
          <path d="M12 7.5a2.5 2.5 0 0 1 2.5-2.5c1.5 0 2.5 1 2.5 2.5" />
          <path d="M9.5 9.5C9 8 10 6 12 6" />
          <path d="M12 18v4" />
          <path d="M12 19.5c-1.5 0-3-1-3-2.5" />
          <path d="M12 21c1.5 0 3-.8 3-2" />
        </svg>
      );

    case 'sunflower':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <path d="m4.93 4.93 2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
          <circle cx="12" cy="12" r="1.5" strokeDasharray="1 1" />
        </svg>
      );

    case 'tulip':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 15a6 6 0 0 1-6-6c0-4 6-6 6-6s6 2 6 6a6 6 0 0 1-6 6Z" />
          <path d="M12 3v12" />
          <path d="M12 15v7" />
          <path d="M12 18c-2.5 0-4.5-1.5-5.5-4" />
          <path d="M12 20c2.5 0 4.5-1.5 5.5-4" />
        </svg>
      );

    case 'lotus':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 4c-1.5 3-2 7 0 12 2-5 1.5-9 0-12Z" />
          <path d="M12 16C7 16 3 13 3 9c3 0 6 3 9 7Z" />
          <path d="M12 16c5 0 9-3 9-7-3 0-6 3-9 7Z" />
          <path d="M5 19c3.5 1 10.5 1 14 0" />
        </svg>
      );

    case 'cherry-blossom':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="2" />
          <path d="M12 10C12 7 9 5 9 3c3 0 4.5 3 3 7Z" />
          <path d="M14 12c3 0 5-3 7-3 0 3-3 4.5-7 3Z" />
          <path d="M12 14c0 3 3 5 3 7-3 0-4.5-3-3-7Z" />
          <path d="M10 12c-3 0-5 3-7 3 0-3 3-4.5 7-3Z" />
          <path d="M11 11 8 8c1-1 3-1 4 1" />
        </svg>
      );

    case 'dandelion':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="9" r="2" />
          <path d="M12 11v11" />
          <path d="M12 7V3M9 8 5 5M15 8l4-3M8 10H4M16 10h4M9 11l-3 4M15 11l3 4" />
          <circle cx="12" cy="3" r=".75" fill="currentColor" />
          <circle cx="5" cy="5" r=".75" fill="currentColor" />
          <circle cx="19" cy="5" r=".75" fill="currentColor" />
          <circle cx="4" cy="10" r=".75" fill="currentColor" />
          <circle cx="20" cy="10" r=".75" fill="currentColor" />
        </svg>
      );

    case 'lavender':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 22V5" />
          <ellipse cx="10" cy="5" rx="1.5" ry="2" />
          <ellipse cx="14" cy="7" rx="1.5" ry="2" />
          <ellipse cx="10" cy="9" rx="1.5" ry="2" />
          <ellipse cx="14" cy="11" rx="1.5" ry="2" />
          <ellipse cx="10" cy="13" rx="1.5" ry="2" />
          <path d="M12 18c-2 0-4-1-5-3M12 19c2 0 4-1 5-3" />
        </svg>
      );

    case 'cactus':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3a3 3 0 0 0-3 3v15h6V6a3 3 0 0 0-3-3Z" />
          <path d="M9 11H6a2 2 0 0 1-2-2V7" />
          <path d="M15 13h3a2 2 0 0 0 2-2V9" />
          <path d="M6 21h12" />
          <circle cx="12" cy="2.5" r="1" fill={color} />
        </svg>
      );

    case 'clover':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="7" r="3" />
          <circle cx="7" cy="12" r="3" />
          <circle cx="17" cy="12" r="3" />
          <path d="M12 12v9c0 .5-.5 1-1 1" />
        </svg>
      );

    case 'morning-glory':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 6c2-3 12-3 14 0 2 3-2 8-7 10-5-2-9-7-7-10Z" />
          <path d="M12 16v6" />
          <path d="M12 19c2 1 3 2 3 3" />
          <circle cx="12" cy="9" r="2" />
        </svg>
      );

    case 'hibiscus':
    case 'poppy':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 3c3 0 4 3 3 6.5" />
          <path d="M21 12c0 3-3 4-6.5 3" />
          <path d="M12 21c-3 0-4-3-3-6.5" />
          <path d="M3 12c0-3 3-4 6.5-3" />
          <path d="m14 10 4-4" />
          <circle cx="18.5" cy="5.5" r="1" fill={color} />
        </svg>
      );

    case 'edelweiss':
    case 'daisy':
    case 'chrysanthemum':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          <path d="m5 5 3 3M16 16l3 3M5 19l3-3M16 8l3-3" />
          <path d="m8.5 3.5 1 3.5M14.5 17l1 3.5M3.5 15.5l3.5-1M17 9.5l3.5-1" />
        </svg>
      );

    default:
      // Generic elegant blooming botanical flower
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 7.5a4.5 4.5 0 0 0-4.5 4.5c0 3 4.5 6 4.5 6s4.5-3 4.5-6a4.5 4.5 0 0 0-4.5-4.5Z" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 18v4" />
          <path d="M8 9.5C6 9.5 4 11 4 13c0 2 2 3.5 4 3.5" />
          <path d="M16 9.5c2 0 4 1.5 4 3.5 0 2-2 3.5-4 3.5" />
        </svg>
      );
  }
};
