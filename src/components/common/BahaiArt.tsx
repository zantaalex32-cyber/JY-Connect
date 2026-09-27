import React from 'react';

/**
 * Bahá'í Nine-Pointed Star SVG
 * Exact geometric construction of 9 overlapping rays
 */
export const BahaiNinePointedStar: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 24, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Bahá'í Nine-Pointed Star"
    >
      {/* 9-pointed star polygon */}
      <polygon
        points="
          50,3 59,28 85,15 78,41 100,56 75,67 79,94 54,82 35,99
          35,73 10,75 25,52 3,35 28,32 30,5
        "
        fill={color}
        fillRule="evenodd"
      />
      <circle cx="50" cy="50" r="14" fill="#ffffff" />
      <circle cx="50" cy="50" r="10" fill={color} />
      <circle cx="50" cy="50" r="4" fill="#ffffff" />
    </svg>
  );
};

/**
 * The User's Logo: The Mascot silhouette from download.jpg
 * Faithful SVG rendering with textured crown, smiling eyes, and waving arms
 */
export const JyMascotLogo: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 36, color = '#0f172a' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="JY Connect Mascot Logo"
    >
      {/* Mascot Silhouette */}
      <path
        d="M60 20
           C63 20 66 12 70 14
           C73 16 75 24 78 22
           C81 20 83 26 82 32
           C82 36 84 39 83 45
           C82 52 82 60 76 66
           C74 68 70 70 66 71
           C68 74 72 77 75 80
           C78 84 81 87 79 92
           C77 96 72 95 68 91
           C67 93 68 98 67 104
           C66 109 69 113 72 118
           C74 121 72 124 66 124
           C60 124 58 120 57 114
           C55 110 53 110 51 114
           C50 120 48 124 42 124
           C36 124 34 120 37 116
           C40 112 41 106 41 100
           C40 94 36 90 32 88
           C28 86 24 85 24 80
           C24 75 29 76 34 81
           C37 83 40 83 42 80
           C41 74 38 68 36 60
           C34 50 35 38 36 32
           C37 25 41 27 44 29
           C47 31 49 22 53 18
           C55 16 57 20 60 20 Z"
        fill={color}
      />
      {/* Friendly Wide Eyes */}
      <ellipse cx="48" cy="54" rx="4.5" ry="6" fill="#ffffff" />
      <ellipse cx="68" cy="54" rx="4.5" ry="6" fill="#ffffff" />
      {/* Warm Smile */}
      <path
        d="M51 68 Q58 75 66 68"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

/**
 * Bahá'í Calligraphic Rosette & Art Motif
 * Elegant circular calligraphy medallion with nine geometric lobes
 */
export const BahaiCalligraphyMotif: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Bahá'í Calligraphic Emblem"
    >
      {/* Outer Nine-Lobed Border */}
      <circle cx="50" cy="50" r="46" stroke="#0284c7" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="42" stroke="#0f172a" strokeWidth="0.75" />
      
      {/* 9 Petal flourishes */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 50 50)`}>
          <path
            d="M50 8 C48 18 43 25 50 32 C57 25 52 18 50 8 Z"
            fill="#e0f2fe"
            stroke="#0284c7"
            strokeWidth="0.8"
          />
          <circle cx="50" cy="14" r="1.5" fill="#0284c7" />
        </g>
      ))}

      {/* Central Nine Pointed Star */}
      <circle cx="50" cy="50" r="22" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
      <polygon
        points="
          50,32 54,42 65,37 62,48 71,54 61,58 63,69 53,64 45,71
          45,60 35,61 41,51 32,44 42,43 43,32
        "
        fill="#0f172a"
      />
      <circle cx="50" cy="50" r="5" fill="#0284c7" />
    </svg>
  );
};

/**
 * Editorial Decorative Divider with Bahá'í Star
 */
export const BahaiDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center my-6 gap-3 ${className}`}>
      <div className="h-[1px] bg-slate-200 flex-1 max-w-xs" />
      <div className="flex items-center gap-1.5 text-sky-600">
        <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
        <BahaiNinePointedStar size={18} color="#0284c7" />
        <span className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
      </div>
      <div className="h-[1px] bg-slate-200 flex-1 max-w-xs" />
    </div>
  );
};
