"use client";

import React from 'react';

// Traditional Bhutanese/Buddhist Icons
export function EndlessKnot({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3 L15 6 L12 9 L9 6 L12 3 Z M6 9 L9 12 L6 15 L3 12 L6 9 Z M18 9 L21 12 L18 15 L15 12 L18 9 Z M12 15 L15 18 L12 21 L9 18 L12 15 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M9 6 L6 9 M15 6 L18 9 M9 18 L6 15 M15 18 L18 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Lotus({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 20 C8 18 4 14 4 10 C4 8 6 8 8 10 C10 6 12 4 12 4 C12 4 14 6 16 10 C18 8 20 8 20 10 C20 14 16 18 12 20 Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M12 20 C8 18 4 14 4 10 C4 8 6 8 8 10 C10 6 12 4 12 4 C12 4 14 6 16 10 C18 8 20 8 20 10 C20 14 16 18 12 20 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function DharmaWheel({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* Eight spokes */}
      <path d="M12 3 L12 9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 12 L15 12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 21 L12 15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12 L9 12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18.364 5.636 L14.828 9.172" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18.364 18.364 L14.828 14.828" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.636 18.364 L9.172 14.828" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.636 5.636 L9.172 9.172" stroke="currentColor" strokeWidth="1.5" />
      
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function DragonHead({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 12 Q6 8 10 8 Q14 8 16 10 Q18 12 20 12 Q18 16 16 16 Q14 18 10 18 Q6 18 4 14 Q4 12 4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <circle cx="8" cy="11" r="1" fill="currentColor" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <path d="M16 10 Q18 8 20 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 14 Q18 16 20 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function ThunderBolt({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 2 L4 14 L10 14 L11 22 L20 10 L14 10 L13 2 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Stupa({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="6" y="18" width="12" height="2" rx="1" fill="currentColor" />
      <rect x="7" y="16" width="10" height="2" rx="1" fill="currentColor" />
      
      {/* Dome */}
      <path
        d="M8 16 Q12 12 16 16"
        fill="currentColor"
        fillOpacity="0.6"
      />
      
      {/* Harmika (square structure) */}
      <rect x="10" y="10" width="4" height="3" fill="currentColor" />
      
      {/* Spire */}
      <path d="M12 10 L12 4" stroke="currentColor" strokeWidth="2" />
      
      {/* Umbrella discs */}
      <circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="12" cy="8" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
      
      {/* Jewel on top */}
      <circle cx="12" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}