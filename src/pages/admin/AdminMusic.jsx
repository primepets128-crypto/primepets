import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Music, Link2, Upload, Save, RotateCcw, AlertTriangle, Volume2, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import ScrollReveal from '../../components/ScrollReveal';

const DEFAULT_AUDIO_URL = '/background.mp3';

export default function AdminMusic() {
  const { frontendSettings, refreshData } = useData();

  // The persisted URL from settings (what's currently saved)
  const currentSavedUrl = frontendSettings?.siteAudioUrl || DEFAULT_AUDIO_URL;

  // Input mode: 'url' | 'file'
  const [inputMode, setInputMode] = useState('url');

  // The URL being previewed / about to be saved
  const [previewUrl, setPreviewUrl] = useState(currentSavedUrl);

  // Text field value for URL input
  const [urlInput, setUrlInput] = useState(currentSavedUrl === DEFAULT_AUDIO_URL ? '' : currentSavedUrl);

  // Status feedback
  const [status, setStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  // File name display
  const [fileName, setFileName] = useState('');

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  // Keep previewUrl in sync if settings load after mount
  useEffect(() => {
    const saved = frontendSettings?.siteAudioUrl || DEFAULT_AUDIO_URL;
    setPreviewUrl(saved);
    if (saved !== DEFAULT_AUDIO_URL) {
      setUrlInput(saved);
    }
  }, [frontendSettings]);

  // Reload the audio element whenever previewUrl changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [previewUrl]);

  /* ─── Handlers ─────────────────────────────────────── */

  const handleUrlChange = (e) => {
    setUrlInput(e.target.value);
  };

  const handleUrlApply = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      setPreviewUrl(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleUrlApply();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // Convert to base64 for preview & saving (small files)
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result; // data:audio/...;base64,...
      setPreviewUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPreviewUrl(DEFAULT_AUDIO_URL);
    setUrlInput('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    setStatus('saving');
    try {
      const newUrl = previewUrl === DEFAULT_AUDIO_URL ? null : previewUrl;
      await axios.put('/api/settings', {
        ...frontendSettings,
        siteAudioUrl: newUrl,
      });
      await refreshData();

      // Notify App.jsx (or any listener) that audio changed
      window.dispatchEvent(
        new CustomEvent('audioChanged', { detail: { url: previewUrl } })
      );
      window.dispatchEvent(
        new CustomEvent('toast', { detail: { message: 'Background audio saved!' } })
      );
      setStatus('saved');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error('Failed to save audio settings:', err);
      window.dispatchEvent(
        new CustomEvent('toast', { detail: { message: 'Error saving audio settings' } })
      );
      setStatus('error');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  /* ─── Derived state ────────────────────────────────── */
  const isDefault = previewUrl === DEFAULT_AUDIO_URL;
  const hasUnsavedChanges = previewUrl !== currentSavedUrl;

  return (
    <div className="max-w-3xl animate-fade-in">
      {/* ── Page Header ── */}
      <ScrollReveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-100 text-[#d07e20]">
                <Music size={22} />
              </span>
              Background Audio
            </h1>
            <p className="text-gray-500 font-medium">
              Manage the ambient music that plays across your storefront.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={status === 'saving'}
            className="flex items-center gap-2 bg-[#d07e20] hover:bg-[#a65d14] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            {status === 'saving' ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : status === 'saved' ? (
              <><CheckCircle2 size={18} /> Saved!</>
            ) : (
              <><Save size={18} /> Save Changes</>
            )}
          </button>
        </div>
      </ScrollReveal>

      {/* ── Unsaved-changes pill ── */}
      {hasUnsavedChanges && (
        <ScrollReveal delay={50}>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            You have unsaved changes
          </div>
        </ScrollReveal>
      )}

      <div className="space-y-6">
        {/* ── Currently Playing Card (dark music theme) ── */}
        <ScrollReveal delay={100}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl border border-gray-700">
            {/* Decorative glow blobs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative p-6">
              {/* Header row */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30">
                  <Volume2 size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                    Currently Saved
                  </p>
                  <p className="text-sm font-bold text-white truncate max-w-xs sm:max-w-sm">
                    {currentSavedUrl}
                  </p>
                </div>
              </div>

              {/* Equaliser bars decoration */}
              <div className="flex items-end gap-1 mb-5 h-8">
                {[3, 6, 4, 8, 5, 7, 3, 6, 5, 4, 7, 5, 3, 6].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-orange-500/60"
                    style={{ height: `${h * 4}px`, opacity: 0.5 + (i % 3) * 0.17 }}
                  />
                ))}
                <span className="ml-2 text-xs text-gray-400 italic self-end">Preview Player</span>
              </div>

              {/* HTML5 Audio Player */}
              <audio
                ref={audioRef}
                controls
                src={previewUrl}
                className="w-full rounded-xl"
                style={{
                  filter: 'invert(1) hue-rotate(180deg) saturate(0.7) brightness(1.1)',
                }}
              >
                Your browser does not support the audio element.
              </audio>

              <p className="mt-3 text-xs text-gray-500 text-center">
                {isDefault
                  ? 'Using default audio — /background.mp3'
                  : previewUrl.startsWith('data:')
                  ? `Previewing uploaded file: ${fileName}`
                  : `Previewing: ${previewUrl}`}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Input Method Toggle ── */}
        <ScrollReveal delay={150}>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Change Audio Source</h2>

            {/* Toggle tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 w-fit gap-1">
              <button
                onClick={() => setInputMode('url')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  inputMode === 'url'
                    ? 'bg-white text-[#d07e20] shadow-sm ring-1 ring-orange-100'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Link2 size={15} />
                URL / Link
              </button>
              <button
                onClick={() => setInputMode('file')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  inputMode === 'file'
                    ? 'bg-white text-[#d07e20] shadow-sm ring-1 ring-orange-100'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Upload size={15} />
                Upload File
              </button>
            </div>

            {/* URL Input */}
            {inputMode === 'url' && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Direct Audio URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={handleUrlChange}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com/audio/background.mp3"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium text-sm"
                  />
                  <button
                    onClick={handleUrlApply}
                    className="shrink-0 px-4 py-3 bg-orange-50 hover:bg-orange-100 text-[#d07e20] font-bold rounded-xl border border-orange-200 transition-all text-sm"
                  >
                    Preview
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Paste a direct link to an .mp3, .wav, or .ogg file. Press Enter or click Preview to load it.
                </p>
              </div>
            )}

            {/* File Upload */}
            {inputMode === 'file' && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Upload Audio File
                </label>
                <div
                  className="relative flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-orange-200 rounded-2xl p-8 bg-orange-50/40 hover:bg-orange-50 cursor-pointer transition-all group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center text-[#d07e20] transition-all">
                    <Upload size={26} />
                  </div>
                  {fileName ? (
                    <div className="text-center">
                      <p className="font-bold text-gray-800 text-sm">{fileName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Click to change file</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-semibold text-gray-700 text-sm">
                        Click to browse or drag &amp; drop
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">MP3, WAV, OGG supported</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  File will be converted to base64 for storage. For files larger than 5MB, use the URL method instead.
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ── Reset & Actions Row ── */}
        <ScrollReveal delay={200}>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-1">Reset to Default</h2>
            <p className="text-sm text-gray-500 mb-4">
              Clears any custom audio and falls back to{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded-md text-xs font-mono text-orange-700">
                /background.mp3
              </code>
              .
            </p>
            <button
              onClick={handleReset}
              disabled={isDefault}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-semibold text-sm transition-all"
            >
              <RotateCcw size={16} />
              Reset to Default
            </button>
          </div>
        </ScrollReveal>

        {/* ── Performance Note ── */}
        <ScrollReveal delay={250}>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium leading-relaxed">
              <span className="font-bold">Performance tip: </span>
              Audio files larger than 5MB may slow down your site. Use a hosted URL (e.g. from a CDN or cloud storage) for best performance.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
