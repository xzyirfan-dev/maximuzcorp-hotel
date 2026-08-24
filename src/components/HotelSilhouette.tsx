import React from "react";

export const HotelSilhouette: React.FC<{ className?: string; opacity?: number }> = ({ 
  className = "w-full h-full text-emerald-200", 
  opacity = 0.15 
}) => {
  return (
    <svg
      viewBox="0 0 1000 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      preserveAspectRatio="xMaxYMax meet"
    >
      <defs>
        <linearGradient id="hotelGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8c872" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#c5a059" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#dfba5b" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="hotelEmeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
        </linearGradient>
        <pattern id="luxWindowGrid" width="14" height="20" patternUnits="userSpaceOnUse">
          <rect x="2" y="2" width="10" height="15" rx="1.5" fill="currentColor" fillOpacity="0.18" />
          <rect x="3" y="3" width="8" height="6" rx="0.5" fill="#fceba7" fillOpacity="0.25" />
        </pattern>
        <pattern id="luxGlassFacade" width="8" height="12" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="8" y2="12" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="8" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />
        </pattern>
      </defs>

      {/* Horizon base line with architectural stepping */}
      <path
        d="M0 318 L1000 318"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Distant background towers */}
      <g opacity="0.45">
        <rect x="40" y="110" width="80" height="208" fill="url(#hotelEmeraldGrad)" rx="2" />
        <polygon points="40,110 80,70 120,110" fill="currentColor" opacity="0.6" />
        
        <rect x="180" y="80" width="110" height="238" fill="url(#hotelEmeraldGrad)" rx="3" />
        <rect x="760" y="95" width="95" height="223" fill="url(#hotelEmeraldGrad)" rx="2" />
        <polygon points="760,95 807,55 855,95" fill="currentColor" opacity="0.5" />
        
        <rect x="885" y="120" width="85" height="198" fill="url(#hotelEmeraldGrad)" rx="2" />
      </g>

      {/* Midground Grand Wings & Architecture */}
      <g opacity="0.75">
        {/* Left Wing with Classic Arches */}
        <rect x="90" y="140" width="160" height="178" fill="url(#hotelEmeraldGrad)" />
        <rect x="100" y="150" width="140" height="155" fill="url(#luxWindowGrid)" />
        
        {/* Classical Arches row on base */}
        <path
          d="M100 318 V 280 Q 112 265 124 280 V 318 
             M132 318 V 280 Q 144 265 156 280 V 318 
             M164 318 V 280 Q 176 265 188 280 V 318 
             M196 318 V 280 Q 208 265 220 280 V 318"
          stroke="#e8c872"
          strokeWidth="1.2"
          fill="none"
          opacity="0.6"
        />

        {/* Right Wing Tower */}
        <rect x="640" y="120" width="150" height="198" fill="url(#hotelEmeraldGrad)" />
        <rect x="650" y="135" width="130" height="170" fill="url(#luxWindowGrid)" />
      </g>

      {/* Foreground: The Main Luxury Centerpiece Tower - Grand Heritage Resort */}
      <g>
        {/* Main Central Tower Body */}
        <rect x="290" y="40" width="310" height="278" fill="url(#hotelEmeraldGrad)" rx="4" />
        <rect x="305" y="65" width="280" height="240" fill="url(#luxGlassFacade)" />

        {/* Tiered Deco Roof & Pinnacle Spire */}
        <polygon points="290,40 330,10 560,10 600,40" fill="currentColor" opacity="0.8" />
        <rect x="350" y="12" width="190" height="18" fill="url(#hotelGoldGrad)" />
        <polygon points="370,12 445,-20 520,12" fill="url(#hotelGoldGrad)" />
        <line x1="445" y1="-35" x2="445" y2="12" stroke="#fceba7" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="445" cy="-35" r="3.5" fill="#fceba7" />

        {/* Grand Portico & Hotel Entrance Pillars */}
        <rect x="390" y="240" width="110" height="78" fill="currentColor" opacity="0.3" rx="2" />
        <polygon points="370,240 445,215 520,240" fill="url(#hotelGoldGrad)" />
        <line x1="400" y1="240" x2="400" y2="318" stroke="#e8c872" strokeWidth="2" />
        <line x1="425" y1="240" x2="425" y2="318" stroke="#e8c872" strokeWidth="2" />
        <line x1="465" y1="240" x2="465" y2="318" stroke="#e8c872" strokeWidth="2" />
        <line x1="490" y1="240" x2="490" y2="318" stroke="#e8c872" strokeWidth="2" />
        
        {/* Warm Illuminated Hotel Lobby Chandelier Glow */}
        <circle cx="445" cy="275" r="16" fill="#fceba7" fillOpacity="0.25" filter="blur(3px)" />
        <circle cx="445" cy="275" r="5" fill="#fceba7" fillOpacity="0.8" />

        {/* Fine Architectural Gold Line Accents */}
        <line x1="290" y1="40" x2="600" y2="40" stroke="#e8c872" strokeWidth="2" strokeOpacity="0.7" />
        <line x1="300" y1="120" x2="590" y2="120" stroke="#e8c872" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="300" y1="180" x2="590" y2="180" stroke="#e8c872" strokeWidth="1" strokeOpacity="0.4" />
      </g>

      {/* Floating geometric luxury stars / constellation motiff */}
      <g fill="#fceba7" opacity="0.7">
        <path d="M220 45 L222 51 L228 53 L222 55 L220 61 L218 55 L212 53 L218 51 Z" />
        <path d="M680 35 L681 40 L686 41 L681 42 L680 47 L679 42 L674 41 L679 40 Z" />
        <path d="M140 90 L141 93 L144 94 L141 95 L140 98 L139 95 L136 94 L139 93 Z" opacity="0.5" />
        <path d="M820 60 L821 64 L825 65 L821 66 L820 70 L819 66 L815 65 L819 64 Z" opacity="0.5" />
      </g>
    </svg>
  );
};

export const LuxuryHotelCrest: React.FC<{ className?: string; size?: number }> = ({ 
  className = "text-[#c5a059]", 
  size = 36 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5dc8c" />
          <stop offset="50%" stopColor="#c5a059" />
          <stop offset="100%" stopColor="#9a762e" />
        </linearGradient>
      </defs>
      
      {/* Outer Hexagonal Shield with Fine Double Border */}
      <polygon 
        points="24,3 43,12 43,33 24,45 5,33 5,12" 
        stroke="url(#crestGold)" 
        strokeWidth="1.5" 
        fill="#1a3d2e" 
      />
      <polygon 
        points="24,6 40,14 40,31 24,42 8,31 8,14" 
        stroke="url(#crestGold)" 
        strokeWidth="0.8" 
        strokeOpacity="0.6" 
        fill="none" 
      />

      {/* 5-Star Luxury Architectural Crown / Hotel Facade */}
      <path 
        d="M17 19 L20 15 L24 17 L28 15 L31 19 V28 H17 Z" 
        fill="url(#crestGold)" 
        fillOpacity="0.2"
        stroke="url(#crestGold)"
        strokeWidth="1"
      />
      
      {/* Maximuz "M" Architectural Monogram */}
      <path 
        d="M19 28 V20 L24 25 L29 20 V28" 
        stroke="url(#crestGold)" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Laurel leaves branches at bottom */}
      <path 
        d="M13 33 Q 18 36 24 37 Q 30 36 35 33" 
        stroke="url(#crestGold)" 
        strokeWidth="1.2" 
        strokeLinecap="round"
      />
      <circle cx="24" cy="11" r="1.5" fill="url(#crestGold)" />
      <circle cx="19" cy="12" r="1" fill="url(#crestGold)" />
      <circle cx="29" cy="12" r="1" fill="url(#crestGold)" />
    </svg>
  );
};

export const LuxuryOrnamentBorder: React.FC<{ className?: string }> = ({ className = "text-[#c5a059]" }) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c5a059]/40 to-[#c5a059]" />
      <div className="flex items-center gap-1.5 px-2 text-[#c5a059]">
        <span className="w-1.5 h-1.5 rotate-45 border border-[#c5a059] bg-[#1a3d2e]" />
        <span className="text-[10px] tracking-widest uppercase font-mono font-semibold">MAXIMUZ LUXURY STANDARD</span>
        <span className="w-1.5 h-1.5 rotate-45 border border-[#c5a059] bg-[#1a3d2e]" />
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#c5a059]/40 to-[#c5a059]" />
    </div>
  );
};
