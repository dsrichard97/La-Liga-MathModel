import React, { useState, useEffect } from 'react';
import { ExternalLink, Link2, Music, Check, Sparkles, X, Disc3, ShieldCheck } from 'lucide-react';

interface SpotifyPlayerProps {
  onClose?: () => void;
}

interface CuratedPlaylist {
  id: string;
  name: string;
  genre: string;
  description: string;
  spotifyUri: string; // Spotify playlist ID
  coverBadgeColor: string;
}

export const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ onClose }) => {
  const curatedPlaylists: CuratedPlaylist[] = [
    {
      id: 'fifa-classics',
      name: 'EA Sports FC / FIFA Classics',
      genre: 'Soundtrack Anthem',
      description: 'The greatest tracks in FIFA history (Blur, Kasabian, Avicii, Billie Eilish)',
      spotifyUri: '37i9dQZF1DX4sWSpwq3LiO',
      coverBadgeColor: '#00E5FF',
    },
    {
      id: 'ligamx-estadio',
      name: 'Liga MX Estadio Vivo',
      genre: 'Latin Matchday Hype',
      description: 'Estadio Azteca & Universitario energy, Mexican rock, cumbia, and corridos',
      spotifyUri: '37i9dQZF1DX10zKzsJ2jva',
      coverBadgeColor: '#10B981',
    },
    {
      id: 'reggaeton-soccer',
      name: 'Latin Urban & Trap Matchday',
      genre: 'Latin Urban',
      description: 'High-energy reggaeton, dembow, and trap for pre-match locker room focus',
      spotifyUri: '37i9dQZF1DXcBWIGoYBM5M',
      coverBadgeColor: '#F59E0B',
    },
    {
      id: 'tikitaka-focus',
      name: 'Tiki-Taka Instrumental Flow',
      genre: 'Deep Focus & Study',
      description: 'Electronic beats and lo-fi rhythms for tactical match review and data analysis',
      spotifyUri: '37i9dQZF1DX8Uebhn9wzrS',
      coverBadgeColor: '#8B5CF6',
    },
  ];

  // Active playlist ID
  const [activePlaylistId, setActivePlaylistId] = useState<string>(() => {
    return localStorage.getItem('ligamx_spotify_active') || '37i9dQZF1DX4sWSpwq3LiO';
  });

  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [customLinkInput, setCustomLinkInput] = useState<string>('');
  const [connectSuccessMsg, setConnectSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ligamx_spotify_active', activePlaylistId);
  }, [activePlaylistId]);

  // Handle parsing custom playlist or album or track link
  const handleConnectCustomSpotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkInput.trim()) return;

    try {
      let extractedId = customLinkInput.trim();

      // Check if full URL: e.g. https://open.spotify.com/playlist/37i9dQZF1DX... or spotify:playlist:...
      if (extractedId.includes('open.spotify.com/')) {
        const parts = extractedId.split('open.spotify.com/')[1].split('?')[0].split('/');
        // parts[0] is 'playlist' or 'track' or 'album', parts[1] is id
        if (parts[1]) {
          extractedId = `${parts[0]}/${parts[1]}`;
        }
      } else if (extractedId.startsWith('spotify:')) {
        const parts = extractedId.split(':');
        if (parts.length >= 3) {
          extractedId = `${parts[1]}/${parts[2]}`;
        }
      }

      setActivePlaylistId(extractedId);
      setConnectSuccessMsg('Successfully connected your custom Spotify music source!');
      setTimeout(() => {
        setConnectSuccessMsg(null);
        setIsConnectModalOpen(false);
      }, 1500);
    } catch (err) {
      console.warn('Invalid Spotify link format', err);
    }
  };

  // Compute embed URL
  const embedUrl = activePlaylistId.includes('/')
    ? `https://open.spotify.com/embed/${activePlaylistId}?utm_source=generator&theme=0`
    : `https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`;

  return (
    <div className="w-full rounded-2xl glass-panel p-4 sm:p-5 border border-white/10 shadow-2xl space-y-4 bg-gradient-to-br from-[#0A120E] via-[#080B11] to-[#0A0D14]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Spotify Official Green Badge */}
          <div className="w-10 h-10 rounded-xl bg-[#1DB954] flex items-center justify-center shadow-[0_0_20px_rgba(29,185,84,0.4)]">
            <svg
              className="w-6 h-6 fill-black"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.218.358-.684.471-1.042.253-2.855-1.745-6.449-2.14-10.684-1.171-.41.093-.815-.164-.908-.574-.093-.41.164-.816.574-.908 4.636-1.06 8.608-.611 11.807 1.348.358.218.471.694.253 1.052zm1.467-3.262c-.274.446-.86.589-1.306.315-3.268-2.008-8.25-2.59-12.115-1.416-.499.151-1.026-.134-1.177-.633-.151-.499.134-1.026.633-1.177 4.417-1.34 9.907-.694 13.65 1.605.446.274.589.86.315 1.306zm.126-3.41c-3.918-2.327-10.375-2.541-14.11-1.398-.6.183-1.238-.16-1.421-.76-.183-.6.16-1.238.76-1.421 4.298-1.31 11.428-1.063 15.938 1.614.538.319.715 1.02.396 1.558-.319.538-1.02.725-1.563.407z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                Spotify Matchday Audio Hub
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40">
                Live Spotify Connect
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Stream authentic matchday anthems, iconic FIFA soundtracks, or connect your personal Spotify playlist
            </p>
          </div>
        </div>

        {/* Connect Action & Close */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(29,185,84,0.35)] cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5" />
            Connect Spotify
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Playlist Switcher Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400">Curated Playlists:</span>
        {curatedPlaylists.map((pl) => {
          const isActive = activePlaylistId === pl.spotifyUri;
          return (
            <button
              key={pl.id}
              onClick={() => setActivePlaylistId(pl.spotifyUri)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/60 shadow-[0_0_12px_rgba(29,185,84,0.25)] font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: pl.coverBadgeColor }}
              />
              <span>{pl.name}</span>
            </button>
          );
        })}
      </div>

      {/* Official Spotify IFrame Embed Player */}
      <div className="rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-inner">
        <iframe
          src={embedUrl}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
          title="Spotify Matchday Player"
        />
      </div>

      {/* Footer Helper Note */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-1">
        <div className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954]" />
          <span>Official Spotify Web Embed · Login via Spotify to sync full-length playback</span>
        </div>
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#1DB954] hover:underline"
        >
          Open Spotify Web App
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Connect Custom Spotify Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative rounded-2xl glass-panel p-6 max-w-md w-full border border-[#1DB954]/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1DB954] flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-black" />
                </div>
                <h4 className="font-display font-bold text-base text-white">
                  Connect Custom Spotify Music
                </h4>
              </div>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Paste any Spotify link (Playlist, Album, or Track URL) from your personal account to stream it directly inside the Liga MX Hub!
            </p>

            <form onSubmit={handleConnectCustomSpotify} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Spotify Link or URI:
                </label>
                <input
                  type="text"
                  placeholder="https://open.spotify.com/playlist/..."
                  value={customLinkInput}
                  onChange={(e) => setCustomLinkInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 text-white text-xs font-mono border border-white/20 focus:outline-none focus:border-[#1DB954] placeholder:text-slate-600"
                />
              </div>

              {connectSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{connectSuccessMsg}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Load Spotify Music
                </button>
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
