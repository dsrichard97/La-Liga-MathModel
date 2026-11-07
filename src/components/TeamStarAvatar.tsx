import React, { useState, useEffect } from 'react';

export interface TeamStarAvatarProps {
  wikiSlug?: string;
  playerName?: string;
  jerseyNumber?: number | string;
  primaryColor?: string;
  secondaryColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
  showNameBadge?: boolean;
}

const WIKI_CACHE: Record<string, string> = {
  'Henry_Martín': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Henry_Mart%C3%ADn_2022.jpg/330px-Henry_Mart%C3%ADn_2022.jpg',
  'André-Pierre_Gignac': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Andr%C3%A9-Pierre_Gignac_2018.jpg/330px-Andr%C3%A9-Pierre_Gignac_2018.jpg',
  'Sergio_Canales': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Sergio_Canales_2021.jpg/330px-Sergio_Canales_2021.jpg',
  'Carlos_Rodríguez_(footballer,_born_1997)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Carlos_Rodr%C3%ADguez_2021.jpg/330px-Carlos_Rodr%C3%ADguez_2021.jpg',
  'Roberto_Alvarado': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Roberto_Alvarado_2021.jpg/330px-Roberto_Alvarado_2021.jpg',
  'Alexis_Vega_(footballer,_born_1997)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Alexis_Vega_2021.jpg/330px-Alexis_Vega_2021.jpg',
  'Salomón_Rondón': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Salom%C3%B3n_Rond%C3%B3n_2018.jpg/330px-Salom%C3%B3n_Rond%C3%B3n_2018.jpg',
  'César_Huerta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/C%C3%A9sar_Huerta_2023.jpg/330px-C%C3%A9sar_Huerta_2023.jpg',
  'Keylor_Navas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Keylor_Navas_2018.jpg/330px-Keylor_Navas_2018.jpg'
};

export const TeamStarAvatar: React.FC<TeamStarAvatarProps> = ({
  wikiSlug,
  playerName = 'Star Player',
  jerseyNumber = '10',
  primaryColor = '#1e3a8a',
  secondaryColor = '#f59e0b',
  size = 'md',
  className = '',
  showBadge = true,
  showNameBadge = false
}) => {
  const [imgUrl, setImgUrl] = useState<string | null>(wikiSlug && WIKI_CACHE[wikiSlug] ? WIKI_CACHE[wikiSlug] : null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!wikiSlug) return;
    if (WIKI_CACHE[wikiSlug]) {
      setImgUrl(WIKI_CACHE[wikiSlug]);
      return;
    }
    let isMounted = true;
    const slugClean = wikiSlug.replace(/^\//, '');
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slugClean)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data?.thumbnail?.source) {
          WIKI_CACHE[wikiSlug] = data.thumbnail.source;
          setImgUrl(data.thumbnail.source);
        }
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      });
    return () => { isMounted = false; };
  }, [wikiSlug]);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
  }[size];

  const badgeSizeClasses = {
    xs: 'text-[8px] px-0.5 py-0',
    sm: 'text-[9px] px-1 py-0.5',
    md: 'text-[10px] px-1.5 py-0.5',
    lg: 'text-xs px-2 py-0.5',
    xl: 'text-sm px-2.5 py-1',
  }[size];

  const numDisplay = typeof jerseyNumber === 'number' ? `#${jerseyNumber}` : (jerseyNumber.startsWith('#') ? jerseyNumber : `#${jerseyNumber}`);

  return (
    <div className={`relative inline-flex flex-col items-center justify-center shrink-0 ${className}`}>
      <div className={`relative rounded-full overflow-visible ${sizeClasses}`}>
        <div
          className="w-full h-full rounded-full overflow-hidden border-2 shadow-sm flex items-center justify-center relative bg-slate-800"
          style={{ borderColor: secondaryColor }}
        >
          {imgUrl && !hasError ? (
            <img
              src={imgUrl}
              alt={playerName}
              className="w-full h-full object-cover object-top"
              onError={() => setHasError(true)}
            />
          ) : (
            <svg className="w-full h-full p-1" viewBox="0 0 24 24" fill="currentColor" style={{ color: secondaryColor }}>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
        {showBadge && (
          <span
            className={`absolute -bottom-1 -right-1 rounded-full font-black text-white shadow border border-white z-10 ${badgeSizeClasses}`}
            style={{ backgroundColor: secondaryColor }}
          >
            {numDisplay}
          </span>
        )}
      </div>
      {showNameBadge && (
        <span className="mt-1 text-[11px] font-semibold text-slate-200 tracking-wide truncate max-w-[100px]">
          {playerName}
        </span>
      )}
    </div>
  );
};
