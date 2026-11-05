import React, { useState, useRef, useEffect } from 'react';
import { Music2, Play, Pause, Volume2, Sparkles, Disc3, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface FifaSoundtrackPlayerProps {
  currentTeamTrackName?: string;
}

export const FifaSoundtrackPlayer: React.FC<FifaSoundtrackPlayerProps> = ({
  currentTeamTrackName = 'Vice City Symphony',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [trackTitle, setTrackTitle] = useState<string>('EA Sports FC MLS Anthem (Official Theme)');
  const [artistName, setArtistName] = useState<string>('Lyria Generative Studio');
  const [selectedModel, setSelectedModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [promptText, setPromptText] = useState<string>(
    'Generate a 30-second high-energy FIFA EA Sports FC stadium anthem with infectious drum beats, synth brass, and modern bass.'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [isSynthPlaying, setIsSynthPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const presetTracks = [
    {
      title: 'EA Sports Stadium Hype',
      model: 'lyria-3-clip-preview' as const,
      prompt: 'High-energy FIFA EA Sports FC stadium anthem with infectious drum beats, synth brass, and modern bass.',
    },
    {
      title: 'Vice City Latin Street Groove',
      model: 'lyria-3-clip-preview' as const,
      prompt: 'Latin Afro-house FIFA soundtrack beat with rhythmic percussion, acoustic guitar riffs, and Miami night energy.',
    },
    {
      title: 'Galáctico West Coast Tech House',
      model: 'lyria-3-clip-preview' as const,
      prompt: 'Catchy upbeat indie dance track with pulsing 4/4 kicks, filtered synths, and euphoric stadium drop.',
    },
    {
      title: 'Full MLS Cup Victory Suite',
      model: 'lyria-3-pro-preview' as const,
      prompt: 'Full-length epic soccer championship anthem with orchestral brass fanfare, energetic trap drums, and roaring crowd excitement.',
    },
  ];

  // Procedural Web Audio EA FC Synth fallback
  const startProceduralBeat = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      let step = 0;
      const bpm = 126;
      const stepDuration = 60 / bpm / 2; // 8th notes

      const playStep = () => {
        if (!audioContextRef.current) return;
        const now = ctx.currentTime;

        // Kick on 0, 2, 4, 6
        if (step % 2 === 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);
          gain.gain.setValueAtTime(0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        }

        // Bassline Synth
        const bassFreqs = [55, 55, 65, 73, 55, 82, 65, 55];
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreqs[step % 8], now);
        bassGain.gain.setValueAtTime(0.2, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.2);

        step++;
      };

      const timerId = window.setInterval(playStep, stepDuration * 1000);
      synthTimerRef.current = timerId;
      setIsSynthPlaying(true);
      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio synthesis error', e);
    }
  };

  const stopProceduralBeat = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsSynthPlaying(false);
  };

  // Generate music with Lyria via server endpoint
  const handleGenerateMusic = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      stopProceduralBeat();
      setIsPlaying(false);
    }

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          model: selectedModel,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Music generation failed');
      }

      setAudioSrc(data.audioDataUrl);
      setTrackTitle(`EA FC Theme (${selectedModel.includes('pro') ? 'Full Track' : '30s Clip'})`);
      setArtistName('Lyria AI MLS Sound lab');
      setIsPlaying(true);

      // Trigger playback
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) => console.log('Audio autoplay prevented:', err));
        }
      }, 200);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Lyria service error');
      // Play procedural stadium beat fallback so user still enjoys instant music
      startProceduralBeat();
      setTrackTitle('EA FC Stadium Rhythm (Live Synth Mode)');
      setArtistName('Procedural MLS Audio Engine');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayPause = () => {
    if (isSynthPlaying) {
      stopProceduralBeat();
      setIsPlaying(false);
      return;
    }

    if (!audioSrc) {
      // If no track yet generated, trigger generation or start procedural beat
      startProceduralBeat();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((e) => console.log(e));
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopProceduralBeat();
    };
  }, []);

  return (
    <div className="w-full rounded-2xl glass-panel p-4 sm:p-5 border border-white/10 shadow-2xl space-y-4">
      {/* Audio Element */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
              setDuration(audioRef.current.duration || 30);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 text-cyan-400">
            <Music2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                FIFA Ultimate Soundtrack & Lyria Generator
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                lyria-3-clip-preview
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Generate genuine EA Sports FC soccer anthems and stadium beats with Lyria
            </p>
          </div>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setSelectedModel('lyria-3-clip-preview')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedModel === 'lyria-3-clip-preview'
                ? 'bg-cyan-500 text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lyria Clip (30s)
          </button>
          <button
            onClick={() => setSelectedModel('lyria-3-pro-preview')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedModel === 'lyria-3-pro-preview'
                ? 'bg-purple-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lyria Pro (Full)
          </button>
        </div>
      </div>

      {/* Preset Pill Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400">Styles:</span>
        {presetTracks.map((pt, i) => (
          <button
            key={i}
            onClick={() => {
              setPromptText(pt.prompt);
              setSelectedModel(pt.model);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-colors cursor-pointer truncate max-w-[220px]"
          >
            {pt.title}
          </button>
        ))}
      </div>

      {/* Prompt Input & Generate Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Describe track style, tempo, stadium vibe..."
          className="flex-1 px-3 py-2 rounded-xl bg-black/40 text-white text-xs font-mono border border-white/10 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
        />
        <button
          onClick={handleGenerateMusic}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Generating Audio...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-black text-black" />
              <span>Generate Beat</span>
            </>
          )}
        </button>
      </div>

      {/* Notification banner if fallback or warning */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-mono flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="truncate">
              Lyria Notice: {errorMsg}. Playing procedural EA FC stadium synth!
            </span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-900/60">
            Live Audio
          </span>
        </div>
      )}

      {/* Active Music Player Bar */}
      <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Disc & Track Meta */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <Disc3
              className={`w-9 h-9 text-cyan-400 ${
                isPlaying ? 'animate-spin' : ''
              }`}
            />
            {isPlaying && (
              <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm pointer-events-none" />
            )}
          </div>
          <div className="truncate">
            <div className="text-xs font-display font-bold text-white truncate max-w-[240px]">
              {trackTitle}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              {artistName}
            </div>
          </div>
        </div>

        {/* Center: Equalizer Visualizer Bars */}
        <div className="flex items-end gap-1 h-6 px-4">
          {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85].map((height, i) => (
            <div
              key={i}
              style={{
                height: isPlaying ? `${Math.max(15, (height * (Math.sin(currentTime * 4 + i) + 1.2)) / 2)}%` : '20%',
              }}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-cyan-400 shadow-[0_0_6px_#00E5FF]' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Right: Play/Pause Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={togglePlayPause}
            className="p-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black text-black" />
            ) : (
              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
