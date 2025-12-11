// src/components/auth/LoginScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { sound } from "../../sound/sounds";
import { VisualFilters } from "../effects/VisualFilters";

// Séquence ASCII
const ASCII_FRAMES = [
  `
   ░░░░░░░░░░░░░░░░░░
   Loading...
  `,
  `
   █░░░░░░░░░░░░░░░░░
   Initializing kernel...
  `,
  `
   ██░░░░░░░░░░░░░░░░
   Mapping devices...
  `,
  `
   ███░░░░░░░░░░░░░░░
   Authenticating...
  `,
  `
   ████░░░░░░░░░░░░░░
   Bootstrapping VM...
  `,
  `
   █████░░░░░░░░░░░░░
   Mounting volumes...
  `,
  `
   ██████░░░░░░░░░░░░
   Finalizing...
  `,
  `
   ████████░░░░░░░░░░
   Ready.
  `,
];

export const LoginScreen: React.FC = () => {
  const { login, finalizeLogin } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [humanCheck, setHumanCheck] = useState(false);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [genericError, setGenericError] = useState<string | null>(null);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const hiddenTextRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  // CONFIG: 5 secondes de chargement
  const TOTAL_DURATION_MS = 5000;
  const VIDEO_WAIT_MS = 1200;

  // --- FIX AUDIO: Forcer l'arrêt de l'outro au montage du Login ---
  useEffect(() => {
    try {
      if (sound.outro && sound.outro.playing()) {
        sound.outro.stop();
        sound.outro.volume(0);
      }
    } catch (e) {
      console.error("Audio stop error:", e);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    setFrameIndex(0);
    const startTime = Date.now();

    const tryPlayVisibleVideo = async () => {
      try {
        const vis = document.getElementById("visible-loading-video") as HTMLVideoElement | null;
        if (vis) {
          try { vis.currentTime = 0; } catch {}
          await vis.play();
        }
      } catch (err) {}
    };

    let waited = 0;
    let playAttemptInterval: number | undefined;
    const startPlayAttempts = () => {
      tryPlayVisibleVideo();
      const pre = document.getElementById("preload-loading-video") as HTMLVideoElement | null;
      if (!pre) return;

      playAttemptInterval = window.setInterval(() => {
        waited += 200;
        if ((pre.readyState ?? 0) >= 3 || waited >= VIDEO_WAIT_MS) {
          tryPlayVisibleVideo();
          if (playAttemptInterval) {
            clearInterval(playAttemptInterval);
          }
        }
      }, 200);
    };

    startPlayAttempts();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      // Calcul des frames ASCII
      const f = Math.floor((elapsed / (TOTAL_DURATION_MS / ASCII_FRAMES.length)) % ASCII_FRAMES.length);
      setFrameIndex(f);

      // Fin du chargement
      if (elapsed >= TOTAL_DURATION_MS) {
        clearInterval(interval);
        if (playAttemptInterval) clearInterval(playAttemptInterval);
        
        // Petit délai pour voir "Ready."
        setTimeout(() => {
          setIsLoading(false);
          finalizeLogin();
        }, 500);
      }
    }, 80);

    return () => {
      clearInterval(interval);
      if (playAttemptInterval) clearInterval(playAttemptInterval);
    };
  }, [isLoading, finalizeLogin]);

  useEffect(() => {
    if (failedAttempts === 3 && hiddenTextRef.current) {
      const range = document.createRange();
      range.selectNodeContents(hiddenTextRef.current);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [failedAttempts]);

  const currentFrame = useMemo(() => ASCII_FRAMES[frameIndex % ASCII_FRAMES.length], [frameIndex]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setUsernameError(null);
    setPasswordError(null);
    setGenericError(null);

    let ok = true;
    if (!username.trim()) {
      setUsernameError("Username is required.");
      ok = false;
    }
    if (!password) {
      setPasswordError("Password is required.");
      ok = false;
    }
    if (!humanCheck) {
      setGenericError("Please confirm you are not an AI.");
      ok = false;
    }
    if (!ok) return;

    const valid = await login(username.trim(), password, humanCheck);
    if (!valid) {
      setGenericError("Invalid username or password.");
      setFailedAttempts(prev => prev + 1);
      return;
    }

    setFailedAttempts(0);
    setIsLoading(true);
    try { sound?.windowOpen?.play?.(); } catch {}
  };

  return (
    <>
      <style>{`
        /* CURSEURS : Forcés ici pour le LoginScreen */
        .login-screen-root {
          cursor: url('/cursors/cursor-default.cur'), default;
        }
        
        /* Quand loading est actif */
        .login-screen-root[data-cursor="wait"] {
          cursor: url('/cursors/cursor-wait.cur'), wait !important;
        }

        /* Inputs */
        .login-input, .hidden-clue {
          cursor: url('/cursors/cursor-text.cur'), text !important;
        }
        
        /* Boutons et Checkbox */
        .btn-primary, .login-check input, .login-check {
          cursor: url('/cursors/cursor-pointer.cur'), pointer !important;
        }

        /* STYLES GÉNÉRAUX */
        .login-screen-root {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--os-color-bg);
          z-index: 99999;
          font-family: "Ubuntu", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: var(--os-color-accent);
        }

        .login-card {
          width: 520px;
          max-width: calc(100% - 32px);
          background: var(--os-color-surface);
          border: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          padding: 42px;
          border-radius: 0;
          color: var(--os-color-accent);
        }

        .login-title {
          font-size: 20px;
          margin: 0 0 18px 0;
          color: var(--os-color-accent);
          font-weight: 400;
        }

        .login-form { display: flex; flex-direction: column; gap: 32px; }

        .login-row {
          display: block;
          position: relative;
        }

        .login-label {
          position: absolute;
          top: -16px;
          left: 12px;
          background: var(--os-color-surface);
          padding: 0 6px;
          font-size: 13px;
          color: var(--os-color-accent);
        }

        .login-input {
          width: 100%;
          min-height: 58px;
          padding: 18px 16px 12px 16px;
          font-size: 16px;
          background: rgba(0,0,0,0);
          border: 2px solid var(--os-color-accent);
          color: var(--os-color-accent);
          border-radius: 0;
          outline: none;
          box-sizing: border-box;
          transition: box-shadow 120ms ease, border-color 120ms ease;
          font-weight: 400;
        }

        .login-input::placeholder { color: rgba(57,60,65,0.25); }

        .login-input:focus {
          box-shadow: 0 6px 18px rgba(57,60,65,0.06);
          border-color: var(--os-color-accent);
        }

        .login-input.has-error {
          border-color: #ff6b6b;
        }
        .field-error {
          color: #ff6b6b;
          font-size: 12px;
          margin-top: 6px;
        }

        .hidden-clue {
          font-size: 12px;
          margin-top: 4px;
          margin-left: 2px;
          color: var(--os-color-surface); 
          user-select: text; 
          pointer-events: auto;
        }

        .login-check { display:flex; align-items:center; gap:10px; margin-top:6px; }
        .login-check input { width: 16px; height: 16px; accent-color: var(--os-color-accent); border-radius: 0; }
        .login-check-text { font-size: 13px; color: var(--os-color-accent); font-weight: 400; }

        .login-error { color: #ff6b6b; font-size: 13px; margin-top: 6px; }

        .login-actions { display:flex; justify-content:flex-end; margin-top:6px; }
        .btn-primary {
          background: var(--os-color-accent);
          color: #fff;
          padding: 10px 14px;
          border-radius: 0;
          border: none;
          cursor: pointer;
          font-weight: 400;
        }
        .btn-primary:hover { opacity: 0.95; }

        .login-credits {
          position: absolute;
          align-items: center;
          top: 150px;
          font-size: 72px;
          color: rgba(57,60,65,0.45);
        }

        .loader-wrapper {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: center;
          justify-content: center;
        }

        .loader-video {
          width: 420px;
          max-width: calc(100% - 40px);
          background: var(--os-color-bg);
          border: none;
          box-shadow: none;
          border-radius: 0;
        }

        .ascii-loader { 
            display:flex; 
            flex-direction:column; 
            gap:0; /* Plus de gap car plus de barre */
            align-items:stretch; 
            width: 420px; 
            max-width: calc(100% - 40px); 
        }
        .ascii-frame {
          padding: 12px;
          border-radius: 0;
          color: var(--os-color-accent); 
          min-height: 76px;
          margin: 0;
          font-size: 13px;
          line-height: 1.1;
          white-space: pre-wrap;
          font-family: "Courier New", Courier, monospace;
        }
      `}</style>

      {/* AJOUT data-cursor="wait" si isLoading est vrai */}
      <div className="login-screen-root" data-cursor={isLoading ? "wait" : undefined}>
        {!isLoading ? (
          <div className="login-card">
            <h2 className="login-title">Admin Login</h2>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <label className="login-row">
                <span className="login-label">Username</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`login-input ${usernameError ? "has-error" : ""}`}
                  autoFocus
                  placeholder="Enter username"
                  aria-invalid={!!usernameError}
                />
                <div ref={hiddenTextRef} className="hidden-clue">
                  it's your real name
                </div>
                {usernameError && <div className="field-error">{usernameError}</div>}
              </label>

              <label className="login-row">
                <span className="login-label">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`login-input ${passwordError ? "has-error" : ""}`}
                  placeholder="Enter password"
                  aria-invalid={!!passwordError}
                />
                {passwordError && <div className="field-error">{passwordError}</div>}
              </label>

              <label className="login-check">
                <input
                  type="checkbox"
                  checked={humanCheck}
                  onChange={(e) => setHumanCheck(e.target.checked)}
                />
                <span className="login-check-text">I'm not an AI</span>
              </label>

              {genericError && <div className="login-error">{genericError}</div>}

              <div className="login-actions">
                <button type="submit" className="btn-primary">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="loader-wrapper">
            <video
              id="visible-loading-video"
              src="/loading.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="loader-video"
            />

            <div className="ascii-loader">
              <pre className="ascii-frame" aria-hidden>
                {currentFrame}
              </pre>
              {/* Suppression de la barre de progression ici */}
            </div>
          </div>
        )}

        <div className="login-credits"></div>
        <VisualFilters />
      </div>
    </>
  );
};