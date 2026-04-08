import { useState, useEffect, useCallback } from 'preact/hooks';
import './DigitalTwin.css';

/*
  Animation phases:
  0 "idle"      — static yellow bottom half, button visible
  1 "expanding" — yellow wave rises to cover full viewport (~1.6s)
  2 "morphing"  — full-screen yellow shrinks into blob (~1.2s)
  3 "active"    — blob breathes/floats, controls visible
*/

export default function DigitalTwin() {
  const [phase, setPhase] = useState(0);
  const [muted, setMuted] = useState(false);

  function handleActivate() {
    setPhase(1);
  }

  useEffect(() => {
    if (phase === 1) {
      const t = setTimeout(() => setPhase(2), 1600);
      return () => clearTimeout(t);
    }
    if (phase === 2) {
      const t = setTimeout(() => setPhase(3), 1200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleEndCall = useCallback(() => {
    setPhase(0);
    setMuted(false);
  }, []);

  return (
    <>
      {/* CTA button — only in idle state */}
      {phase === 0 && (
        <button class="dt-cta" type="button" onClick={handleActivate}>
          talk to my digital twin
        </button>
      )}

      {/* Full-screen overlay for animation phases 1-3 */}
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
          {/* Wavy top edge + hand-drawn line — rides on top of yellow */}
          <div class="dt-overlay__wave-top">
            {/* Wave shape that forms the organic top edge of the yellow area */}
            <svg
              class="dt-overlay__wave-svg"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Yellow wave fill — the organic top edge */}
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
              {/* Hand-drawn line overlaid on the wave */}
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

          {/* Solid yellow body below the wave */}
          <div class="dt-overlay__body" />

          {/* Blob — appears in phase 2-3 */}
          {(phase === 2 || phase === 3) && (
            <div class="dt-overlay__blob-wrap">
              <svg
                class="dt-overlay__blob"
                viewBox="0 0 600 600"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="#ECE543" d={BLOB_PATH}>
                  {phase === 3 && (
                    <animate
                      attributeName="d"
                      values={`${BLOB_PATH};${BLOB_PATH_2};${BLOB_PATH_3};${BLOB_PATH}`}
                      dur="8s"
                      repeatCount="indefinite"
                      calcMode="spline"
                      keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
                    />
                  )}
                </path>
              </svg>
            </div>
          )}

          {/* Controls — only in active phase */}
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
                end call
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* --- Blob paths --- */
const BLOB_PATH =
  'M 300 45 C 410 35, 520 80, 545 170 C 570 260, 530 370, 440 430 C 350 490, 230 480, 150 400 C 70 320, 50 210, 100 130 C 150 50, 190 55, 300 45 Z';

const BLOB_PATH_2 =
  'M 310 50 C 430 30, 530 100, 540 190 C 550 280, 510 380, 420 440 C 330 500, 210 490, 140 410 C 70 330, 60 220, 110 140 C 160 60, 200 70, 310 50 Z';

const BLOB_PATH_3 =
  'M 290 40 C 400 45, 510 90, 550 180 C 590 270, 540 380, 450 440 C 360 500, 240 470, 155 395 C 70 320, 40 200, 90 120 C 140 40, 180 35, 290 40 Z';
