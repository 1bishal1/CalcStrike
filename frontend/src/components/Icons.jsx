import React from 'react';

export const SwordLogoIcon = ({ size = 48, color = '#E5CD82' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 4C24 4 14 10 14 22C14 31 20 38 24 41C28 38 34 31 34 22C34 10 24 4 24 4Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="rgba(21, 55, 13, 0.4)"
    />
    <path
      d="M24 10V33"
      stroke={color}
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path
      d="M19 28H29"
      stroke={color}
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <circle cx="24" cy="36" r="2" fill={color} />
  </svg>
);

export const UserIcon = ({ size = 20, color = '#728E6D' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const LockIcon = ({ size = 20, color = '#728E6D' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const MailIcon = ({ size = 20, color = '#728E6D' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const EyeIcon = ({ size = 20, color = '#728E6D' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = ({ size = 20, color = '#728E6D' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const HomeIcon = ({ size = 20, color = '#FFF2B4' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const PlayIcon = ({ size = 20, color = '#728E6D' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const TrophyIcon = ({ size = 20, color = '#728E6D' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
    <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
  </svg>
);

export const ClockIcon = ({ size = 18, color = '#E5CD82' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const LeafIcon = ({ size = 32, color = '#2ed573' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export const MountainIcon = ({ size = 32, color = '#E5CD82' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

export const CrownIcon = ({ size = 32, color = '#ff4757' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

export const WarriorAvatar = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="26" cy="26" r="24" fill="#15370D" stroke="#728E6D" strokeWidth="2" />
    <path d="M26 12C20 12 16 17 16 23C16 30 20 37 26 39C32 37 36 30 36 23C36 17 32 12 26 12Z" fill="#2d4828" />
    {/* Hood / Helmet eye slit */}
    <rect x="20" y="22" width="12" height="3" rx="1.5" fill="#E5CD82" />
    <path d="M18 28C21 31 31 31 34 28" stroke="#15370D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const BossAvatar = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="26" cy="26" r="24" fill="#2a1010" stroke="#ff4757" strokeWidth="2" />
    {/* Demon face / Horns */}
    <path d="M16 14L20 22M36 14L32 22" stroke="#ff4757" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M19 23C19 23 21 21 26 21C31 21 33 23 33 23C34 28 32 35 26 38C20 35 18 28 19 23Z" fill="#4d1414" />
    {/* Glowing Eyes */}
    <ellipse cx="22" cy="26" rx="2" ry="1.5" fill="#ff4757" />
    <ellipse cx="30" cy="26" rx="2" ry="1.5" fill="#ff4757" />
    {/* Fangs */}
    <path d="M22 31L23 34M30 31L29 34" stroke="#FFF2B4" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

