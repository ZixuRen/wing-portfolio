import { useState, useEffect, useCallback } from 'preact/hooks';
import './DigitalTwin.css';

/*
  Animation phases:
  0 "idle"      — static yellow bottom half, button visible
  1 "expanding" — yellow rises to cover full viewport (~1s)
  2 "morphing"  — full-screen yellow shrinks into blob (~1s)
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
      const t = setTimeout(() => setPhase(2), 1000);
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
          {/* The organic divider line that travels with the yellow */}
          <svg
            class="dt-overlay__line"
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,35 C180,55 360,10 540,30 C720,50 900,5 1080,25 C1200,38 1350,15 1440,28"
              fill="none"
              stroke="var(--color-black)"
              stroke-width="1"
            >
              <animate
                attributeName="d"
                values="
                  M0,35 C180,55 360,10 540,30 C720,50 900,5 1080,25 C1200,38 1350,15 1440,28;
                  M0,28 C180,10 360,50 540,25 C720,5 900,45 1080,30 C1200,15 1350,45 1440,35;
                  M0,35 C180,55 360,10 540,30 C720,50 900,5 1080,25 C1200,38 1350,15 1440,28
                "
                dur="4s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
              />
            </path>
          </svg>

          {/* Yellow fill — becomes blob in phase 2-3 */}
          <div class="dt-overlay__yellow">
            {(phase === 2 || phase === 3) && (
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
            )}
          </div>

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
