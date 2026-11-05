import React, { useState } from 'react';
import { LaLigaModelWeights } from '../types/soccer';
import {
  ExternalLink,
  Copy,
  Check,
  Download,
  Github,
  Package,
  Globe,
  Terminal,
  Sparkles,
  X,
  ShieldCheck,
  Send,
  Loader2,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: LaLigaModelWeights;
}

export const ExportPackageModal: React.FC<ExportPackageModalProps> = ({
  isOpen,
  onClose,
  weights,
}) => {
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedCommands, setCopiedCommands] = useState<boolean>(false);
  const [githubToken, setGithubToken] = useState<string>('');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [pushResult, setPushResult] = useState<{
    success: boolean;
    message: string;
    hint?: string;
  } | null>(null);

  const liveDeploymentUrl = 'https://dsrichard97.github.io/La-Liga-MathModel/';
  const githubRepoUrl = 'https://github.com/dsrichard97/La-Liga-MathModel';

  const gitCommands = `# Clone or link your repository
git remote add origin https://github.com/dsrichard97/La-Liga-MathModel.git
git branch -M main

# Push changes to GitHub
git add .
git commit -m "feat: Liga MX stats, custom La Liga model builder, and GitHub Pages build"
git push -u origin main`;

  const handlePushToGithub = async () => {
    if (!githubToken.trim()) {
      setPushResult({
        success: false,
        message: 'Please provide a GitHub Personal Access Token (PAT).',
        hint: 'Generate one at github.com/settings/tokens with "repo" permission checked.',
      });
      return;
    }

    setIsPushing(true);
    setPushResult(null);

    try {
      const response = await fetch('/api/git-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken }),
      });

      const data = await response.json();
      if (data.success) {
        setPushResult({
          success: true,
          message: data.message || 'Successfully pushed to github.com/dsrichard97/La-Liga-MathModel!',
        });
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00E5FF', '#10B981', '#F59E0B'],
        });
      } else {
        setPushResult({
          success: false,
          message: data.error || 'Push failed. Please check credentials.',
          hint: data.hint || 'Make sure the repository exists and your token has write (repo) permissions.',
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setPushResult({
        success: false,
        message: error.message || 'Network error attempting to push.',
      });
    } finally {
      setIsPushing(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(liveDeploymentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#00E5FF', '#10B981', '#F59E0B'],
    });
  };

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  // Export current model as downloadable JSON configuration
  const handleExportModelJson = () => {
    const exportPayload = {
      packageName: 'la-liga-mathmodel',
      version: '1.0.0',
      liveUrl: liveDeploymentUrl,
      repository: githubRepoUrl,
      exportTimestamp: new Date().toISOString(),
      activeModel: weights,
      formula: `Index_LaLiga = [ ${(weights.technicalPassing / 100).toFixed(2)}*PrgP + ${(weights.expectedThreatWeight / 100).toFixed(2)}*xT + ${(weights.finishingEfficiency / 100).toFixed(2)}*(G/xG) + ${(weights.pressResistance / 100).toFixed(2)}*Retention + ${(weights.highPressing / 100).toFixed(2)}*Press + ${(weights.aerialDominance / 100).toFixed(2)}*Aerial ] / sum(W)`,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `la-liga-mathmodel-${weights.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel p-5 sm:p-7 border border-cyan-500/40 shadow-2xl bg-[#090D16] space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-700/60 text-cyan-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                  Package Export & GitHub Deployment
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Live Online
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Clickable deployment link and GitHub repository sync package
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Clickable Live Deployment Link Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/50 via-[#0B1524] to-emerald-950/40 border border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
              Live GitHub Pages URL:
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Production Ready
            </span>
          </div>

          {/* Clickable URL Banner */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-black/60 border border-white/15">
            <a
              href={liveDeploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 truncate px-2 py-1 flex items-center gap-1.5"
            >
              <span>{liveDeploymentUrl}</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <a
                href={liveDeploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,229,255,0.4)] cursor-pointer"
              >
                <span>Visit Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* GitHub Code Repository Card */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
              <Github className="w-4 h-4 text-white" />
              GitHub Repository Source Code:
            </div>
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>dsrichard97/La-Liga-MathModel</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs font-mono text-slate-300 p-3 rounded-lg bg-white/5 border border-white/5">
            <div>
              <div className="font-bold text-white">Repository Name: La-Liga-MathModel</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Configured in package.json & vite.config.ts (base: ./)</div>
            </div>
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              View Code
            </a>
          </div>
        </div>

        {/* Direct Push to GitHub with Personal Access Token */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-cyan-950/40 border border-indigo-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-indigo-400" />
              Push Code to dsrichard97/La-Liga-MathModel:
            </div>
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Create GitHub Token (repo scope)</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
            GitHub requires authentication to push commits to your account. Enter your Personal Access Token (classic with <code className="text-cyan-300 bg-white/5 px-1 rounded">repo</code> checked or fine-grained with Contents Read/Write permissions):
          </p>

          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxx"
                className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/20 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              onClick={handlePushToGithub}
              disabled={isPushing}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                isPushing
                  ? 'bg-slate-700 text-slate-300 cursor-wait'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white hover:opacity-90 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
              }`}
            >
              {isPushing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Pushing to GitHub...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Push to GitHub Now</span>
                </>
              )}
            </button>
          </div>

          {pushResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2 animate-fadeIn ${
                pushResult.success
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500 text-rose-200'
              }`}
            >
              {pushResult.success ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold">{pushResult.message}</div>
                {pushResult.hint && <div className="text-[11px] text-slate-300">{pushResult.hint}</div>}
                {pushResult.success && (
                  <div className="pt-1 flex items-center gap-3">
                    <a
                      href={liveDeploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-cyan-300 font-bold hover:text-white"
                    >
                      Visit Live Site & Refresh
                    </a>
                    <span>·</span>
                    <a
                      href={githubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-indigo-300 hover:text-white"
                    >
                      View Commits on GitHub
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Terminal Git Commands Helper */}
        <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              Deploy & Push Commands:
            </div>
            <button
              onClick={handleCopyCommands}
              className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copiedCommands ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Shell Commands</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 rounded-lg bg-black/80 border border-white/5 text-[11px] font-code text-cyan-300 overflow-x-auto leading-relaxed">
            {gitCommands}
          </pre>
        </div>

        {/* Download Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
          <button
            onClick={handleExportModelJson}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold border border-white/15 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            Download Model Config (.json)
          </button>

          <a
            href={liveDeploymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
          >
            <span>Open https://dsrichard97.github.io/La-Liga-MathModel/</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
