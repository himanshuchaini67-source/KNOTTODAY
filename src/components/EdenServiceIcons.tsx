import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

// 1. RESTAURANT: Wedding canopy / pavilion with draped curtains and dancing couple silhouette
export function RestaurantIcon({ className = 'w-14 h-14', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Canopy Roof & Valance */}
      <path d="M12 20 C18 10, 46 10, 52 20" strokeWidth="1.6" />
      <path d="M12 20 Q22 23, 32 20 Q42 23, 52 20" strokeWidth="1.4" />
      {/* Decorative center spire / ornament */}
      <path d="M32 11 V7 M30 7 H34" strokeWidth="1.5" />
      <circle cx="32" cy="6" r="1.5" fill="currentColor" />

      {/* Draped Curtains Left */}
      <path d="M15 20 C14 30, 8 36, 12 56" />
      <path d="M18 21 C17 32, 14 38, 17 56" />
      <path d="M10 38 Q15 40, 18 37" strokeWidth="1.2" /> {/* Curtain tie-back */}

      {/* Draped Curtains Right */}
      <path d="M49 20 C50 30, 56 36, 52 56" />
      <path d="M46 21 C47 32, 50 38, 47 56" />
      <path d="M46 37 Q49 40, 54 38" strokeWidth="1.2" /> {/* Curtain tie-back */}

      {/* Dancing Couple Silhouette in Center */}
      {/* Groom Head & Torso */}
      <circle cx="28.5" cy="33" r="2" fill="currentColor" stroke="none" />
      <path d="M28.5 35 V44 M26 44 L31 44" strokeWidth="1.4" />
      {/* Bride Head & Gown */}
      <circle cx="35" cy="34" r="2" fill="currentColor" stroke="none" />
      <path d="M33.5 36 Q35 40, 38 43" strokeWidth="1.2" />
      {/* Flowing bridal gown */}
      <path d="M34 38 L31 52 Q36 54, 42 52 L36 38 Z" fill="currentColor" fillOpacity="0.15" strokeWidth="1.3" />
      {/* Groom legs */}
      <path d="M27.5 44 L26 53 M29.5 44 L31 53" strokeWidth="1.4" />
      {/* Joined arms */}
      <path d="M28 38 Q32 37, 34 38" strokeWidth="1.3" />

      {/* Ground baseline */}
      <line x1="8" y1="56" x2="56" y2="56" strokeWidth="1.5" />
    </svg>
  );
}

// 2. BAND: Diagonal microphone with sparkles (✦) and musical notes (♪, ♫)
export function BandIcon({ className = 'w-14 h-14', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Sparkling Stars on Top Left */}
      <path d="M13 14 L15 10 L17 14 L21 16 L17 18 L15 22 L13 18 L9 16 Z" fill="currentColor" stroke="none" />
      <path d="M22 8 L23 6 L24 8 L26 9 L24 10 L23 12 L22 10 L20 9 Z" fill="currentColor" stroke="none" />

      {/* Microphone Head (angled ~40 deg) */}
      <g transform="rotate(-38 32 32)">
        {/* Mesh Capsule */}
        <path d="M27 15 C27 9, 37 9, 37 15 L37 23 C37 26, 27 26, 27 23 Z" strokeWidth="1.6" />
        {/* Mesh internal texture */}
        <line x1="28" y1="18" x2="36" y2="18" strokeWidth="1" strokeDasharray="1 1" />
        <line x1="28" y1="21" x2="36" y2="21" strokeWidth="1" strokeDasharray="1 1" />
        <line x1="32" y1="11" x2="32" y2="25" strokeWidth="1" />
        {/* Mic Collar */}
        <rect x="26" y="25" width="12" height="3" rx="1" fill="currentColor" fillOpacity="0.2" strokeWidth="1.3" />
        {/* Tapered Mic Handle */}
        <path d="M28 28 L29.5 48 H34.5 L36 28 Z" strokeWidth="1.5" />
        <line x1="32" y1="32" x2="32" y2="38" strokeWidth="2" />
        <rect x="30" y="48" width="4" height="4" rx="0.5" strokeWidth="1.3" />
      </g>

      {/* Musical Notes on Bottom Right */}
      {/* Single note ♪ */}
      <g transform="translate(45, 33)">
        <ellipse cx="4" cy="11" rx="2.5" ry="2" fill="currentColor" transform="rotate(-20 4 11)" />
        <line x1="6" y1="10" x2="6" y2="1" strokeWidth="1.4" />
        <path d="M6 1 Q9 2, 9 6" strokeWidth="1.4" />
      </g>
      {/* Beamed double note ♫ */}
      <g transform="translate(41, 44)">
        <ellipse cx="3" cy="8" rx="2" ry="1.6" fill="currentColor" transform="rotate(-20 3 8)" />
        <ellipse cx="10" cy="7" rx="2" ry="1.6" fill="currentColor" transform="rotate(-20 10 7)" />
        <line x1="4.5" y1="7" x2="4.5" y2="1" strokeWidth="1.3" />
        <line x1="11.5" y1="6" x2="11.5" y2="0" strokeWidth="1.3" />
        <polygon points="4.5,1 11.5,0 11.5,3 4.5,4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

// 3. PHOTOGRAPHY & VIDEOGRAPHY: Cine/still camera on tripod with reels
export function PhotographyIcon({ className = 'w-14 h-14', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Top Reel / Viewfinder knobs */}
      <circle cx="27" cy="14" r="5" strokeWidth="1.4" />
      <circle cx="27" cy="14" r="1.8" fill="currentColor" stroke="none" />
      <path d="M22 17 L18 19" strokeWidth="1.3" />
      <rect x="35" y="11" width="8" height="5" rx="1" strokeWidth="1.3" />

      {/* Main Camera Body */}
      <rect x="19" y="19" width="28" height="20" rx="3" strokeWidth="1.6" />

      {/* Large Lens Center / Left */}
      <circle cx="33" cy="29" r="6.5" strokeWidth="1.5" />
      <circle cx="33" cy="29" r="3.5" fill="currentColor" fillOpacity="0.25" strokeWidth="1.2" />

      {/* Video Cam Front Hood (Lens projection) */}
      <path d="M47 24 L55 20 V38 L47 34 Z" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />

      {/* Recording LED Dot */}
      <circle cx="23" cy="24" r="1.2" fill="currentColor" stroke="none" />

      {/* Tripod Mount & Legs */}
      <rect x="30" y="39" width="6" height="4" strokeWidth="1.3" />
      {/* 3 Legs spreading down */}
      <line x1="33" y1="43" x2="33" y2="57" strokeWidth="1.5" />
      <line x1="31" y1="43" x2="20" y2="57" strokeWidth="1.5" />
      <line x1="35" y1="43" x2="46" y2="57" strokeWidth="1.5" />
      {/* Tripod support braces */}
      <line x1="26" y1="50" x2="40" y2="50" strokeWidth="1.2" />
    </svg>
  );
}

// 4. DECORATION: Fairytale floral arch with draping and roses
export function DecorationIcon({ className = 'w-14 h-14', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Base Pillars */}
      <line x1="16" y1="26" x2="16" y2="56" strokeWidth="1.4" />
      <line x1="48" y1="26" x2="48" y2="56" strokeWidth="1.4" />
      {/* Pillar bases */}
      <rect x="13" y="55" width="6" height="2" strokeWidth="1.2" />
      <rect x="45" y="55" width="6" height="2" strokeWidth="1.2" />

      {/* Main Arch Outline */}
      <path d="M16 26 C16 11, 48 11, 48 26" strokeWidth="1.6" />
      <path d="M19 26 C19 14, 45 14, 45 26" strokeWidth="1.1" strokeDasharray="2 2" />

      {/* Draped Curtains tied to pillars */}
      <path d="M18 24 Q24 38, 20 54" strokeWidth="1.2" />
      <path d="M46 24 Q40 38, 44 54" strokeWidth="1.2" />

      {/* Lush Floral Garlands along Arch Top */}
      {/* Left Rose cluster */}
      <circle cx="16" cy="18" r="3" fill="currentColor" fillOpacity="0.2" strokeWidth="1.3" />
      <circle cx="13" cy="22" r="2.5" fill="currentColor" fillOpacity="0.2" strokeWidth="1.3" />
      <circle cx="19" cy="13" r="2.5" fill="currentColor" fillOpacity="0.2" strokeWidth="1.3" />

      {/* Center Top Rose cluster */}
      <circle cx="26" cy="10" r="3" fill="currentColor" fillOpacity="0.2" strokeWidth="1.3" />
      <circle cx="32" cy="8.5" r="3.5" fill="currentColor" fillOpacity="0.25" strokeWidth="1.4" />
      <circle cx="38" cy="10" r="3" fill="currentColor" fillOpacity="0.2" strokeWidth="1.3" />

      {/* Right Rose cluster */}
      <circle cx="45" cy="13" r="2.5" fill="currentColor" fillOpacity="0.2" strokeWidth="1.3" />
      <circle cx="48" cy="18" r="3" fill="currentColor" fillOpacity="0.2" strokeWidth="1.3" />
      <circle cx="51" cy="22" r="2.5" fill="currentColor" fillOpacity="0.2" strokeWidth="1.3" />

      {/* Leaf sprays */}
      <path d="M11 16 Q8 14, 10 11" strokeWidth="1.1" />
      <path d="M53 16 Q56 14, 54 11" strokeWidth="1.1" />
      <path d="M30 5 Q32 3, 34 5" strokeWidth="1.1" />
    </svg>
  );
}

// 5. SUIT & WEDDING DRESS: Groom's tuxedo and Bride's flared wedding gown
export function SuitDressIcon({ className = 'w-14 h-14', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* LEFT: Groom's Tuxedo */}
      <g transform="translate(-1, 0)">
        {/* Tuxedo Collar / Bow Tie */}
        <polygon points="20,17 24,19 24,15" fill="currentColor" stroke="none" />
        <polygon points="28,17 24,19 24,15" fill="currentColor" stroke="none" />
        <circle cx="24" cy="17" r="1" fill="white" stroke="none" />

        {/* Tuxedo Jacket */}
        <path d="M19 18 L14 26 L17 48 H30 L32 26 L29 18 Z" strokeWidth="1.4" />
        {/* Lapels */}
        <path d="M19 18 L22 28 L24 28 L26 28 L29 18" strokeWidth="1.2" />
        {/* White shirt triangle */}
        <polygon points="21,18 27,18 24,27" fill="currentColor" fillOpacity="0.1" strokeWidth="1" />
        {/* Buttons */}
        <circle cx="24" cy="32" r="0.8" fill="currentColor" />
        <circle cx="24" cy="37" r="0.8" fill="currentColor" />
        {/* Pocket square */}
        <line x1="17" y1="28" x2="20" y2="28" strokeWidth="1.2" />
        {/* Sleeve cuffs */}
        <line x1="14" y1="40" x2="17" y2="40" strokeWidth="1" />
      </g>

      {/* RIGHT: Bride's Wedding Gown */}
      <g transform="translate(6, 0)">
        {/* Sweetheart Bodice */}
        <path d="M34 22 C35 19, 39 19, 41 21 C43 19, 47 19, 48 22 L46 32 H36 Z" strokeWidth="1.4" fill="currentColor" fillOpacity="0.08" />
        {/* Waist Ribbon / Belt */}
        <line x1="36" y1="32" x2="46" y2="32" strokeWidth="1.6" />

        {/* Expansive Flared Ballgown Skirt with Pleats */}
        <path
          d="M36 32 C35 38, 28 48, 27 56 C34 58, 48 58, 55 56 C54 48, 47 38, 46 32 Z"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity="0.05"
        />
        {/* Vertical Skirt Pleat Lines */}
        <path d="M34 37 Q33 46, 33 56" strokeWidth="1.1" />
        <path d="M41 33 Q41 45, 41 57" strokeWidth="1.1" />
        <path d="M48 37 Q49 46, 49 56" strokeWidth="1.1" />

        {/* Delicate Hanger / Neckline detail */}
        <path d="M37 20 Q41 16, 45 20" strokeWidth="1.1" strokeDasharray="1 1" />
      </g>
    </svg>
  );
}

// 6. FASHION & BEAUTY: Compact powder mirror, makeup brush, and cosmetic jars
export function BeautyIcon({ className = 'w-14 h-14', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Compact Powder Bottom Pan */}
      <ellipse cx="25" cy="46" rx="14" ry="7" strokeWidth="1.6" />
      <ellipse cx="25" cy="46" rx="9" ry="4.5" fill="currentColor" fillOpacity="0.15" strokeWidth="1.2" />

      {/* Compact Open Lid / Mirror tilted up */}
      <ellipse cx="25" cy="27" rx="12" ry="6" strokeWidth="1.5" transform="rotate(-15 25 27)" />
      {/* Mirror shine line */}
      <path d="M22 24 L27 28" strokeWidth="1.2" />

      {/* Fluffy Makeup Powder Brush angled on Right */}
      <g transform="translate(42, 10)">
        {/* Brush bristles */}
        <path d="M7 6 C4 9, 3 17, 7 21 H13 C17 17, 16 9, 13 6 Z" fill="currentColor" fillOpacity="0.2" strokeWidth="1.4" />
        {/* Bristle texture lines */}
        <path d="M8 8 C7 12, 8 16, 9 20" strokeWidth="0.9" />
        <path d="M10 7 V21" strokeWidth="0.9" />
        <path d="M12 8 C13 12, 12 16, 11 20" strokeWidth="0.9" />
        {/* Ferrule (metal band) */}
        <rect x="7" y="21" width="6" height="5" rx="0.5" strokeWidth="1.3" fill="currentColor" fillOpacity="0.3" />
        {/* Tapered Handle */}
        <path d="M8.5 26 L9.5 45 H10.5 L11.5 26 Z" strokeWidth="1.4" />
      </g>
    </svg>
  );
}

// 7. CAKE: 3-tiered wedding cake with pearl borders and lovebirds topper
export function CakeIcon({ className = 'w-14 h-14', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Cake Topper: Two Lovebirds / Hearts */}
      {/* Bird Left */}
      <path d="M28 14 C27 12, 29 9, 31 10 C32 11, 31 13, 29 14 Z" fill="currentColor" stroke="none" />
      {/* Bird Right */}
      <path d="M36 14 C37 12, 35 9, 33 10 C32 11, 33 13, 35 14 Z" fill="currentColor" stroke="none" />
      <circle cx="32" cy="8" r="1.5" fill="currentColor" stroke="none" />

      {/* Tier 1 (Top Tier) */}
      <rect x="25" y="16" width="14" height="10" rx="1.5" strokeWidth="1.5" />
      {/* Piped Swags */}
      <path d="M25 21 Q28.5 23, 32 21 Q35.5 23, 39 21" strokeWidth="1.1" />
      <line x1="25" y1="26" x2="39" y2="26" strokeWidth="1.3" strokeDasharray="1.5 1.5" />

      {/* Tier 2 (Middle Tier) */}
      <rect x="20" y="26" width="24" height="12" rx="1.5" strokeWidth="1.5" />
      {/* Piped Swags */}
      <path d="M20 32 Q26 35, 32 32 Q38 35, 44 32" strokeWidth="1.1" />
      <line x1="20" y1="38" x2="44" y2="38" strokeWidth="1.3" strokeDasharray="1.5 1.5" />

      {/* Tier 3 (Bottom Wide Tier) */}
      <rect x="15" y="38" width="34" height="13" rx="1.5" strokeWidth="1.5" />
      {/* Piped Swags */}
      <path d="M15 44 Q23.5 48, 32 44 Q40.5 48, 49 44" strokeWidth="1.1" />
      <line x1="15" y1="51" x2="49" y2="51" strokeWidth="1.4" strokeDasharray="2 2" />

      {/* Cake Stand / Plate */}
      <path d="M10 52 H54 L51 55 H13 Z" fill="currentColor" fillOpacity="0.2" strokeWidth="1.4" />
      <line x1="24" y1="55" x2="22" y2="58" strokeWidth="1.5" />
      <line x1="40" y1="55" x2="42" y2="58" strokeWidth="1.5" />
      <line x1="18" y1="58" x2="46" y2="58" strokeWidth="1.6" />
    </svg>
  );
}

// 8. INVITATION: Envelope with opened flap and card with heart seal
export function InvitationIcon({ className = 'w-14 h-14', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Open Triangular Top Flap */}
      <polygon points="14,31 32,15 50,31" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05" />

      {/* Invitation Card coming out of envelope */}
      <rect x="18" y="20" width="28" height="24" rx="2" strokeWidth="1.5" fill="white" />
      {/* Heart Monogram on the card */}
      <path
        d="M32 28 C30 25, 26 26, 26 29 C26 32, 32 35, 32 35 C32 35, 38 32, 38 29 C38 26, 34 25, 32 28 Z"
        fill="currentColor"
        stroke="none"
      />
      {/* Subtle lines on card */}
      <line x1="22" y1="38" x2="42" y2="38" strokeWidth="1" strokeDasharray="1 1" />
      <line x1="25" y1="41" x2="39" y2="41" strokeWidth="1" strokeDasharray="1 1" />

      {/* Envelope Body (Front Pocket) */}
      <path d="M14 31 V53 H50 V31 Z" strokeWidth="1.6" fill="white" fillOpacity="0.9" />

      {/* Envelope Front V-folds */}
      <path d="M14 53 L30 38" strokeWidth="1.3" />
      <path d="M50 53 L34 38" strokeWidth="1.3" />
      <path d="M14 31 L32 44 L50 31" strokeWidth="1.5" />

      {/* Wax seal / bottom shadow */}
      <ellipse cx="32" cy="56" rx="16" ry="1.5" fill="currentColor" fillOpacity="0.1" stroke="none" />
    </svg>
  );
}

// 9. JEWELLERY RENTAL: Royal bridal necklace, faceted emerald/diamond cut gemstone & sparkles
export function JewelleryIcon({ className = 'w-14 h-14', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Sparkling Stars on Sides */}
      <path d="M12 16 L13.5 12 L15 16 L19 17.5 L15 19 L13.5 23 L12 19 L8 17.5 Z" fill="currentColor" stroke="none" />
      <path d="M51 15 L52 12 L53 15 L56 16 L53 17 L52 20 L51 17 L48 16 Z" fill="currentColor" stroke="none" />

      {/* Outer Curved Choker Chain */}
      <path d="M15 22 C17 38, 47 38, 49 22" strokeWidth="1.6" />
      {/* Pearl bead dots on chain */}
      <circle cx="21" cy="27" r="1.3" fill="currentColor" />
      <circle cx="27" cy="31" r="1.3" fill="currentColor" />
      <circle cx="37" cy="31" r="1.3" fill="currentColor" />
      <circle cx="43" cy="27" r="1.3" fill="currentColor" />

      {/* Inner Delicate Strand */}
      <path d="M20 20 C23 32, 41 32, 44 20" strokeWidth="1.2" strokeDasharray="1.5 2" />

      {/* Central Faceted Gemstone Pendant */}
      <polygon points="32,32 39,38 32,47 25,38" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      <polygon points="32,35 36,38 32,44 28,38" strokeWidth="1.1" />
      <line x1="25" y1="38" x2="39" y2="38" strokeWidth="1" />

      {/* Dangling Pearl Drops */}
      {/* Center drop */}
      <path d="M32 47 V53" strokeWidth="1.3" />
      <circle cx="32" cy="55" r="2" fill="currentColor" />
      {/* Left drop */}
      <path d="M26 40 L23 46" strokeWidth="1.2" />
      <circle cx="22" cy="48" r="1.6" fill="currentColor" />
      {/* Right drop */}
      <path d="M38 40 L41 46" strokeWidth="1.2" />
      <circle cx="42" cy="48" r="1.6" fill="currentColor" />
    </svg>
  );
}

// 10. CATERING: Luxury silver dining cloche / covered platter with aromatic steam
export function CateringIcon({ className = 'w-14 h-14', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Aromatic Steam Swirls */}
      <path d="M25 18 C23 15, 27 12, 25 9" strokeWidth="1.2" />
      <path d="M32 16 C30 13, 34 10, 32 7" strokeWidth="1.3" />
      <path d="M39 18 C37 15, 41 12, 39 9" strokeWidth="1.2" />

      {/* Cloche Top Handle Knob */}
      <circle cx="32" cy="22" r="3" strokeWidth="1.4" />
      <path d="M32 25 V27" strokeWidth="1.5" />

      {/* Elegant Dome Cloche */}
      <path
        d="M13 46 C13 27, 51 27, 51 46 Z"
        strokeWidth="1.6"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* Subtle reflection curve on dome */}
      <path d="M19 43 C20 32, 28 30, 34 30" strokeWidth="1.1" strokeDasharray="2 2" />

      {/* Lower Plate / Serving Platter Rim */}
      <ellipse cx="32" cy="46" rx="23" ry="4" strokeWidth="1.6" />
      <ellipse cx="32" cy="48" rx="20" ry="2.5" fill="currentColor" fillOpacity="0.2" stroke="none" />
      {/* Base stand */}
      <line x1="20" y1="50" x2="44" y2="50" strokeWidth="1.5" />
    </svg>
  );
}

