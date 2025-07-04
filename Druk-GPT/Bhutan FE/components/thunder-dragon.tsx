"use client";

import React from 'react';

import { memo } from 'react';

export const ThunderDragon = memo(function ThunderDragon({ className = "" }: { className?: string }) {
  return (
    <div className={`thunder-dragon-watermark ${className}`} style={{ animation: 'thunder-dragon 8s ease-in-out infinite' }}>
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Traditional Bhutanese Thunder Dragon (Druk) */}
        
        {/* Dragon body - serpentine form */}
        <path
          d="M80 220 Q120 180 140 160 Q160 140 180 130 Q200 120 220 140 Q240 160 250 180"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-crimson-950/20 dark:text-crimson-400/20"
        />
        
        {/* Dragon head - traditional style */}
        <ellipse
          cx="250"
          cy="180"
          rx="20"
          ry="15"
          fill="currentColor"
          className="text-crimson-950/25 dark:text-crimson-400/25"
        />
        
        {/* Dragon eyes */}
        <circle cx="245" cy="175" r="3" fill="currentColor" className="text-gold-600" />
        <circle cx="255" cy="175" r="3" fill="currentColor" className="text-gold-600" />
        
        {/* Dragon mane/whiskers */}
        <path
          d="M270 170 Q285 165 280 175"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-crimson-700/40"
        />
        <path
          d="M270 185 Q285 190 280 180"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-crimson-700/40"
        />
        
        {/* Thunder/Lightning symbols - traditional Tibetan style */}
        <g className="text-gold-600/60">
          {/* Thunder symbol 1 */}
          <path
            d="M200 100 L185 125 L195 125 L180 150 L200 125 L190 125 L205 100 Z"
            fill="currentColor"
          />
          
          {/* Thunder symbol 2 */}
          <path
            d="M160 80 L145 105 L155 105 L140 130 L160 105 L150 105 L165 80 Z"
            fill="currentColor"
          />
          
          {/* Thunder symbol 3 */}
          <path
            d="M240 60 L225 85 L235 85 L220 110 L240 85 L230 85 L245 60 Z"
            fill="currentColor"
          />
        </g>
        
        {/* Dragon wings - traditional cloud-like forms */}
        <path
          d="M200 140 Q230 110 250 120 Q245 135 220 150 Z"
          fill="currentColor"
          className="text-crimson-950/15 dark:text-crimson-400/15"
        />
        <path
          d="M160 135 Q130 105 110 115 Q115 130 140 145 Z"
          fill="currentColor"
          className="text-crimson-950/15 dark:text-crimson-400/15"
        />
        
        {/* Sacred flames at tail */}
        <g className="text-gold-500/50">
          <path
            d="M80 220 Q60 230 50 210 Q65 215 75 225"
            fill="currentColor"
          />
          <path
            d="M85 225 Q65 235 55 215 Q70 220 80 230"
            fill="currentColor"
          />
          <path
            d="M75 215 Q55 225 45 205 Q60 210 70 220"
            fill="currentColor"
          />
        </g>
        
        {/* Jewel symbols (representing wisdom) */}
        <g className="text-gold-700/60">
          <circle cx="120" cy="50" r="4" fill="currentColor" />
          <path d="M116 46 L120 42 L124 46 L120 50 Z" fill="currentColor" />
          
          <circle cx="180" cy="40" r="4" fill="currentColor" />
          <path d="M176 36 L180 32 L184 36 L180 40 Z" fill="currentColor" />
        </g>
        
        {/* Traditional Tibetan cloud patterns */}
        <g className="text-crimson-950/10 dark:text-crimson-400/10">
          <path
            d="M100 70 Q110 65 115 70 Q120 75 110 80 Q100 75 100 70"
            fill="currentColor"
          />
          <path
            d="M210 90 Q220 85 225 90 Q230 95 220 100 Q210 95 210 90"
            fill="currentColor"
          />
          <path
            d="M260 120 Q270 115 275 120 Q280 125 270 130 Q260 125 260 120"
            fill="currentColor"
          />
        </g>
        
        {/* Sacred syllables hint (Om Mani Padme Hum elements) */}
        <g className="text-gold-800/40 font-tibetan text-xs">
          <text x="150" y="260" textAnchor="middle" className="fill-current font-jomolhari">༄༅།</text>
          <text x="200" y="270" textAnchor="middle" className="fill-current font-jomolhari">།།</text>
        </g>
      </svg>
    </div>
  );
});