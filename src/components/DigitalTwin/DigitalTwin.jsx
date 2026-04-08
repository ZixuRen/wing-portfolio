import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import './DigitalTwin.css';
import { sendMessage } from './api.js';
import { startListening, stopListening, finishRecording, speak, stopSpeaking } from './voice.js';

/*
  Animation phases:
  0 "idle"      — static yellow bottom half, button visible
  1 "expanding" — yellow wave rises to cover full viewport (~1.6s)
  2 "morphing"  — full-screen yellow shrinks to blob (~1.8s)
  3 "active"    — blob morphs through shapes, controls visible
*/

export default function DigitalTwin() {
  const [phase, setPhase] = useState(0);
  const [muted, setMuted] = useState(false);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [voiceState, setVoiceState] = useState('idle');
  const [statusText, setStatusText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [useMic, setUseMic] = useState(true);
  const morphCooldown = useRef(false);
  const conversationRef = useRef([]);
  const speechFailCount = useRef(0);

  const shapeKeys = ['blob', 'lemon', 'cat', 'bulb', 'lemonTilt', 'drop', 'lemonLow', 'lemonVert'];
  const currentShape = SHAPES[shapeKeys[shapeIndex]];

  function morphNext() {
    if (morphCooldown.current) return;
    morphCooldown.current = true;
    setShapeIndex((i) => (i + 1) % shapeKeys.length);
    setTimeout(() => { morphCooldown.current = false; }, 1800);
  }

  function handleMouseEnter() {
    if (phase !== 3) return;
    morphNext();
  }

  function handleBlobClick() {
    if (phase !== 3 || muted) return;
    if (voiceState === 'idle') {
      listen();
    } else if (voiceState === 'listening') {
      handleStopRecording();
    }
  }

  function handleActivate() {
    setPhase(1);
  }

  // Send text to Claude and speak the reply
  async function handleSendText(text) {
    if (!text.trim()) return;

    setVoiceState('thinking');
    setStatusText('thinking...');

    conversationRef.current.push({ role: 'user', content: text.trim() });

    try {
      const reply = await sendMessage(conversationRef.current);
      console.log('[DigitalTwin] Reply:', reply);
      conversationRef.current.push({ role: 'assistant', content: reply });

      setVoiceState('speaking');
      setStatusText('');
      setDisplayText('');

      try {
        await speak(
          reply,
          () => morphNext(),
          () => {
            setVoiceState('idle');
            setStatusText('');
            setDisplayText('');
          }
        );
      } catch (speakErr) {
        // ElevenLabs failed (quota etc) — show text instead
        console.warn('[DigitalTwin] Speech failed, showing text:', speakErr);
        setDisplayText(reply);
        setVoiceState('idle');
        setStatusText('');
        setTimeout(() => setDisplayText(''), 8000);
      }
    } catch (err) {
      console.error('[DigitalTwin] Error:', err);
      setVoiceState('idle');
      setStatusText('');
    }
  }

  // Start recording voice
  const listen = useCallback(() => {
    if (muted || voiceState !== 'idle' || !useMic) return;

    setVoiceState('listening');
    setStatusText('listening...');

    startListening(
      (transcript) => {
        handleSendText(transcript);
      },
      (reason) => {
        setVoiceState('idle');
        setStatusText('');
        if (reason === 'unavailable') {
          setUseMic(false);
          console.log('[DigitalTwin] Mic unavailable — use text input');
        }
      }
    );
  }, [muted, voiceState, useMic]);

  // Stop recording and send to Whisper
  function handleStopRecording() {
    if (voiceState === 'listening') {
      finishRecording();
    }
  }

  // Phase transitions
  useEffect(() => {
    if (phase === 1) {
      const t = setTimeout(() => setPhase(2), 1600);
      return () => clearTimeout(t);
    }
    if (phase === 2) {
      const t = setTimeout(() => setPhase(3), 1800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Greet on activation
  useEffect(() => {
    if (phase === 3) {
      setVoiceState('thinking');
      setStatusText('connecting...');

      sendMessage([{ role: 'user', content: 'Hi! Who are you?' }])
        .then(async (reply) => {
          conversationRef.current = [
            { role: 'user', content: 'Hi! Who are you?' },
            { role: 'assistant', content: reply },
          ];

          setVoiceState('speaking');
          setStatusText('');

          await speak(
            reply,
            null,
            () => {
              setVoiceState('idle');
            }
          );
        })
        .catch((err) => {
          console.error('[DigitalTwin] Greeting error:', err);
          setVoiceState('idle');
          setStatusText('');
        });
    }
  }, [phase]);

  // Handle mute toggle
  useEffect(() => {
    if (muted) {
      stopListening();
      stopSpeaking();
      setVoiceState('idle');
      setStatusText('');
    } else if (phase === 3 && useMic) {
      setTimeout(() => listen(), 300);
    }
  }, [muted]);

  const handleEndCall = useCallback(() => {
    stopListening();
    stopSpeaking();
    setPhase(0);
    setMuted(false);
    setShapeIndex(0);
    setVoiceState('idle');
    setStatusText('');
    setDisplayText('');
    setUseMic(true);
    conversationRef.current = [];
    speechFailCount.current = 0;
  }, []);

  return (
    <>
      {phase === 0 && (
        <button class="dt-cta" type="button" onClick={handleActivate}>
          talk to my digital twin
        </button>
      )}

      {phase > 0 && (
        <div
          class={[
            'dt-overlay',
            phase === 1 && 'dt-overlay--expanding',
            phase === 2 && 'dt-overlay--morphing',
            phase === 3 && 'dt-overlay--active',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* Rising container */}
          <div class="dt-overlay__rising">
            <div class="dt-overlay__wave-top">
              <svg
                class="dt-overlay__wave-svg"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="#ECE543">
                  <animate
                    attributeName="d"
                    values="
                      M0,80 C120,95 240,40 400,60 C560,80 680,30 840,55 C1000,80 1160,35 1300,50 C1380,58 1420,65 1440,60 L1440,120 L0,120 Z;
                      M0,60 C160,30 320,85 480,55 C640,25 800,75 960,50 C1120,25 1280,70 1380,55 C1420,48 1440,52 1440,55 L1440,120 L0,120 Z;
                      M0,70 C140,50 280,90 440,65 C600,40 760,80 920,58 C1080,36 1240,72 1360,55 C1410,48 1440,58 1440,55 L1440,120 L0,120 Z;
                      M0,80 C120,95 240,40 400,60 C560,80 680,30 840,55 C1000,80 1160,35 1300,50 C1380,58 1420,65 1440,60 L1440,120 L0,120 Z
                    "
                    dur="5s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
                  />
                </path>
                <path
                  fill="none"
                  stroke="var(--color-black)"
                  stroke-width="1.2"
                  opacity="0.6"
                >
                  <animate
                    attributeName="d"
                    values="
                      M0,78 C100,92 220,38 380,58 C540,78 700,28 860,52 C1020,76 1180,32 1320,48 C1400,56 1440,62 1440,58;
                      M0,58 C140,28 300,82 460,52 C620,22 780,72 940,48 C1100,24 1260,68 1360,52 C1420,45 1440,50 1440,53;
                      M0,68 C120,48 260,88 420,62 C580,38 740,78 900,55 C1060,34 1220,70 1340,52 C1400,45 1440,56 1440,53;
                      M0,78 C100,92 220,38 380,58 C540,78 700,28 860,52 C1020,76 1180,32 1320,48 C1400,56 1440,62 1440,58
                    "
                    dur="5s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
                  />
                </path>
              </svg>
            </div>
            <div class="dt-overlay__body" />
          </div>

          {/* Clip-path shape */}
          {(phase === 2 || phase === 3) && (
            <div class={`dt-overlay__shape ${phase === 3 ? 'dt-overlay__shape--hold' : ''}`} />
          )}

          {/* SVG blob */}
          {(phase === 2 || phase === 3) && (
            <div
              class={`dt-overlay__blob-wrap ${phase === 2 ? 'dt-overlay__blob-wrap--fadein' : ''}`}
              onMouseEnter={handleMouseEnter}
              onClick={handleBlobClick}
              style={{ cursor: phase === 3 && voiceState === 'idle' ? 'pointer' : 'default' }}
            >
              <svg
                class="dt-overlay__blob-svg"
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="dt-overlay__blob-path"
                  fill="#ECE543"
                  style={{ d: `path('${currentShape}')` }}
                />
              </svg>
            </div>
          )}

          {/* Status text */}
          {phase === 3 && (
            <div class="dt-status">
              {statusText || (voiceState === 'idle' && useMic ? 'click blob to talk' : '')}
            </div>
          )}

          {/* Fallback text display when ElevenLabs fails */}
          {phase === 3 && displayText && (
            <div class="dt-display-text">{displayText}</div>
          )}

          {/* Listening indicator */}
          {phase === 3 && voiceState === 'listening' && (
            <div class="dt-listening-indicator" />
          )}


          {phase === 3 && (
            <div class="dt-controls">
              <button
                class={`dt-controls__btn ${muted ? 'dt-controls__btn--active' : ''}`}
                type="button"
                onClick={() => setMuted((m) => !m)}
              >
                {muted ? 'unmute' : 'mute'}
              </button>
              <button
                class="dt-controls__btn dt-controls__btn--end"
                type="button"
                onClick={handleEndCall}
              >
                end
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const SHAPES = {
  blob:
    'M 200,38 C 252,32 312,58 348,102 C 384,146 395,205 382,255 C 369,305 335,345 288,368 C 241,391 188,390 142,368 C 96,346 58,305 38,252 C 18,199 20,148 42,108 C 64,68 102,45 148,38 C 168,34 185,35 200,38 Z',
  lemon:
    'M 200,72 C 258,42 332,38 382,82 C 432,126 445,195 425,248 C 405,301 358,335 302,352 C 252,366 205,362 158,342 C 111,322 68,288 38,240 C 8,192 -2,142 18,102 C 38,62 82,42 132,48 C 162,52 182,60 200,72 Z',
  // Cat head — round face with two pointy ears at top
  cat:
    'M 200,75 C 230,72 280,18 310,22 C 340,26 355,85 370,145 C 385,205 380,285 340,338 C 300,391 250,400 200,400 C 150,400 100,391 60,338 C 20,285 15,205 30,145 C 45,85 60,26 90,22 C 120,18 170,72 200,75 Z',

  bulb:
    'M 200,28 C 260,22 328,52 368,105 C 408,158 415,218 388,265 C 361,312 318,335 282,358 C 256,374 238,392 200,395 C 162,392 144,374 118,358 C 82,335 39,312 12,265 C -15,218 -8,158 32,105 C 72,52 140,22 200,28 Z',
  drop:
    'M 200,18 C 218,18 252,62 282,122 C 312,182 348,238 362,285 C 376,332 368,372 335,392 C 302,412 252,418 200,418 C 148,418 98,412 65,392 C 32,372 24,332 38,285 C 52,238 88,182 118,122 C 148,62 182,18 200,18 Z',
  lemonTilt:
    'M 200,52 C 248,28 312,22 362,62 C 412,102 435,168 418,232 C 401,296 352,342 295,365 C 238,388 182,382 132,352 C 82,322 42,272 22,215 C 2,158 12,98 52,62 C 92,26 142,28 172,38 C 185,42 192,46 200,52 Z',
  lemonLow:
    'M 200,58 C 255,38 318,48 365,95 C 412,142 428,208 408,268 C 388,328 338,365 278,378 C 218,391 162,378 118,345 C 74,312 38,262 22,205 C 6,148 18,92 55,58 C 92,24 138,22 168,32 C 182,38 192,48 200,58 Z',
  lemonVert:
    'M 200,15 C 232,18 268,42 292,88 C 316,134 328,195 322,252 C 316,309 295,358 262,385 C 229,412 202,418 178,402 C 154,386 132,348 115,298 C 98,248 88,188 92,135 C 96,82 115,42 148,22 C 168,12 182,12 200,15 Z',
};
