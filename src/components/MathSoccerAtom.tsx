import React from 'react';

interface MathSoccerAtomProps {
  size?: 'sm' | 'md' | 'lg' | 'watermark';
  animate?: boolean;
  className?: string;
}

export const MathSoccerAtom: React.FC<MathSoccerAtomProps> = ({
  size = 'md',
  animate = true,
  className = '',
}) => {
  const pixelSize = {
    sm: 36,
    md: 56,
    lg: 110,
    watermark: 520,
  }[size];

  const strokeWidth = size === 'watermark' ? 1.5 : size === 'sm' ? 1.8 : 2;
  const isWatermark = size === 'watermark';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 200 200"
        width={pixelSize}
        height={pixelSize}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Radial Gradients */}
          <radialGradient id="atomGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity={isWatermark ? 0.08 : 0.6} />
            <stop offset="60%" stopColor="#10B981" stopOpacity={isWatermark ? 0.03 : 0.2} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="orbitalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity={isWatermark ? 0.2 : 0.9} />
            <stop offset="50%" stopColor="#10B981" stopOpacity={isWatermark ? 0.15 : 0.7} />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity={isWatermark ? 0.1 : 0.5} />
          </linearGradient>

          <linearGradient id="ballFacetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity={isWatermark ? 0.3 : 0.9} />
            <stop offset="100%" stopColor="#0F172A" stopOpacity={isWatermark ? 0.2 : 0.95} />
          </linearGradient>
        </defs>

        {/* Ambient Backlight Glow */}
        <circle cx="100" cy="100" r="90" fill="url(#atomGlow)" />

        {/* ================= ATOMIC ORBITAL RINGS ================= */}
        <g className={animate ? 'origin-center animate-[spin_24s_linear_infinite]' : ''}>
          {/* Orbital 1: Horizontal */}
          <ellipse
            cx="100"
            cy="100"
            rx="88"
            ry="34"
            stroke="url(#orbitalGrad1)"
            strokeWidth={strokeWidth}
            strokeDasharray={isWatermark ? '6 4' : 'none'}
            opacity={isWatermark ? 0.25 : 0.85}
          />
          {/* Orbital 1 Electron Node with Math Sigma (Σ) */}
          <g transform="translate(188, 100)">
            <circle cx="0" cy="0" r={size === 'sm' ? 4 : 7} fill="#00E5FF" />
            {!isWatermark && size !== 'sm' && (
              <text
                x="0"
                y="3"
                fontSize="9"
                fontFamily="Space Grotesk, monospace"
                fontWeight="bold"
                fill="#000000"
                textAnchor="middle"
              >
                Σ
              </text>
            )}
          </g>
          {/* Opposite Node with Delta (Δ) */}
          <g transform="translate(12, 100)">
            <circle cx="0" cy="0" r={size === 'sm' ? 3.5 : 6} fill="#F59E0B" />
            {!isWatermark && size !== 'sm' && (
              <text
                x="0"
                y="2.5"
                fontSize="8"
                fontFamily="Space Grotesk, monospace"
                fontWeight="bold"
                fill="#000000"
                textAnchor="middle"
              >
                Δ
              </text>
            )}
          </g>
        </g>

        {/* Orbital 2: Rotated 60 degrees */}
        <g
          transform="rotate(60 100 100)"
          className={animate ? 'origin-center animate-[spin_32s_linear_infinite_reverse]' : ''}
        >
          <ellipse
            cx="100"
            cy="100"
            rx="88"
            ry="34"
            stroke="#10B981"
            strokeWidth={strokeWidth}
            opacity={isWatermark ? 0.2 : 0.75}
          />
          {/* Node with Pi (π) */}
          <g transform="translate(188, 100)">
            <circle cx="0" cy="0" r={size === 'sm' ? 4 : 7} fill="#10B981" />
            {!isWatermark && size !== 'sm' && (
              <text
                x="0"
                y="3"
                fontSize="9"
                fontFamily="Space Grotesk, monospace"
                fontWeight="bold"
                fill="#000000"
                textAnchor="middle"
              >
                π
              </text>
            )}
          </g>
        </g>

        {/* Orbital 3: Rotated -60 degrees */}
        <g
          transform="rotate(-60 100 100)"
          className={animate ? 'origin-center animate-[spin_28s_linear_infinite]' : ''}
        >
          <ellipse
            cx="100"
            cy="100"
            rx="88"
            ry="34"
            stroke="#F59E0B"
            strokeWidth={strokeWidth}
            opacity={isWatermark ? 0.2 : 0.75}
          />
          {/* Node with Integral (∫) */}
          <g transform="translate(188, 100)">
            <circle cx="0" cy="0" r={size === 'sm' ? 4 : 7} fill="#F59E0B" />
            {!isWatermark && size !== 'sm' && (
              <text
                x="0"
                y="3"
                fontSize="9"
                fontFamily="Space Grotesk, monospace"
                fontWeight="bold"
                fill="#000000"
                textAnchor="middle"
              >
                ∫
              </text>
            )}
          </g>
        </g>

        {/* ================= CENTRAL SOCCER BALL GEOMETRY ================= */}
        {/* Soccer Ball Outer Sphere */}
        <circle
          cx="100"
          cy="100"
          r="45"
          fill="url(#ballFacetGrad)"
          stroke="#00E5FF"
          strokeWidth={strokeWidth}
          filter={isWatermark ? 'none' : 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.4))'}
        />

        {/* Central Pentagon Facet with Playmaker Number "10" */}
        <polygon
          points="100,82 116,94 110,113 90,113 84,94"
          fill="#00E5FF"
          fillOpacity={isWatermark ? 0.3 : 0.85}
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
        />
        {/* Playmaker "10" inscribed in center */}
        <text
          x="100"
          y="103"
          fontSize={size === 'sm' ? 9 : 12}
          fontFamily="Rajdhani, sans-serif"
          fontWeight="900"
          fill="#080B11"
          textAnchor="middle"
          dominantBaseline="central"
        >
          10
        </text>

        {/* Outer Pentagon Seams / Connecting Vertices with Jersey Coordinates */}
        {/* Top seam to vertex 100,55 (Number 9 - Striker) */}
        <line x1="100" y1="82" x2="100" y2="57" stroke="#00E5FF" strokeWidth={strokeWidth} strokeOpacity="0.7" />
        <circle cx="100" cy="57" r={size === 'sm' ? 3 : 5} fill="#0F172A" stroke="#00E5FF" strokeWidth="1.5" />
        {size !== 'sm' && (
          <text x="100" y="58" fontSize="7" fontFamily="Rajdhani" fontWeight="bold" fill="#00E5FF" textAnchor="middle" dominantBaseline="central">
            9
          </text>
        )}

        {/* Right seam to 134,80 (Number 7 - Winger) */}
        <line x1="116" y1="94" x2="137" y2="86" stroke="#00E5FF" strokeWidth={strokeWidth} strokeOpacity="0.7" />
        <circle cx="137" cy="86" r={size === 'sm' ? 3 : 5} fill="#0F172A" stroke="#10B981" strokeWidth="1.5" />
        {size !== 'sm' && (
          <text x="137" y="87" fontSize="7" fontFamily="Rajdhani" fontWeight="bold" fill="#10B981" textAnchor="middle" dominantBaseline="central">
            7
          </text>
        )}

        {/* Bottom-right seam to 128,130 (Number 8 - Box-to-Box) */}
        <line x1="110" y1="113" x2="128" y2="130" stroke="#00E5FF" strokeWidth={strokeWidth} strokeOpacity="0.7" />
        <circle cx="128" cy="130" r={size === 'sm' ? 3 : 5} fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
        {size !== 'sm' && (
          <text x="128" y="131" fontSize="7" fontFamily="Rajdhani" fontWeight="bold" fill="#F59E0B" textAnchor="middle" dominantBaseline="central">
            8
          </text>
        )}

        {/* Bottom-left seam to 72,130 (Number 4 - Defensive Center Back) */}
        <line x1="90" y1="113" x2="72" y2="130" stroke="#00E5FF" strokeWidth={strokeWidth} strokeOpacity="0.7" />
        <circle cx="72" cy="130" r={size === 'sm' ? 3 : 5} fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
        {size !== 'sm' && (
          <text x="72" y="131" fontSize="7" fontFamily="Rajdhani" fontWeight="bold" fill="#F59E0B" textAnchor="middle" dominantBaseline="central">
            4
          </text>
        )}

        {/* Left seam to 63,86 (Number 11 - Left Winger) */}
        <line x1="84" y1="94" x2="63" y2="86" stroke="#00E5FF" strokeWidth={strokeWidth} strokeOpacity="0.7" />
        <circle cx="63" cy="86" r={size === 'sm' ? 3 : 5} fill="#0F172A" stroke="#10B981" strokeWidth="1.5" />
        {size !== 'sm' && (
          <text x="63" y="87" fontSize="7" fontFamily="Rajdhani" fontWeight="bold" fill="#10B981" textAnchor="middle" dominantBaseline="central">
            11
          </text>
        )}

        {/* Hexagonal Boundary lines linking outer vertices */}
        <polygon
          points="100,57 137,86 128,130 72,130 63,86"
          fill="none"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      </svg>
    </div>
  );
};
