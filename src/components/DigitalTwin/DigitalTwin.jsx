import { useState, useRef, useEffect } from 'preact/hooks';
import './DigitalTwin.css';

export default function DigitalTwin() {
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  function handleActivate() {
    setActive(true);
    setMessages([
      {
        role: 'assistant',
        content:
          "Hey! I'm Wing's digital twin. Ask me anything about his work, design philosophy, or experience.",
      },
    ]);
  }

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input.trim() }]);
    setInput('');

    // Dummy response — will be replaced with Claude API
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "That's a great question! I'll be able to answer properly once I'm connected to the AI backend. For now, I'm just a placeholder.",
        },
      ]);
    }, 800);
  }

  function handleClose() {
    setActive(false);
    setMessages([]);
    setInput('');
  }

  return (
    <div class={`dt ${active ? 'dt--active' : ''}`}>
      {/* Yellow background — full rect or blob */}
      <div class="dt__blob-wrap">
        <svg
          class="dt__blob-svg"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="blob-clip">
              <path class="dt__blob-path" d={active ? BLOB_PATH : RECT_PATH}>
                {active && (
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
            </clipPath>
          </defs>
          <rect
            width="800"
            height="600"
            fill="#ECE543"
            clip-path="url(#blob-clip)"
          />
        </svg>
      </div>

      {/* CTA button — only when inactive */}
      {!active && (
        <button class="dt__cta" type="button" onClick={handleActivate}>
          talk to my digital twin
        </button>
      )}

      {/* Chat interface — only when active */}
      {active && (
        <div class="dt__chat">
          <button class="dt__close" type="button" onClick={handleClose} aria-label="Close chat">
            &times;
          </button>

          <div class="dt__messages">
            {messages.map((msg, i) => (
              <div key={i} class={`dt__msg dt__msg--${msg.role}`}>
                {msg.role === 'assistant' && <span class="dt__msg-label">twin</span>}
                <p>{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form class="dt__input-wrap" onSubmit={handleSend}>
            <input
              class="dt__input"
              type="text"
              value={input}
              onInput={(e) => setInput(e.currentTarget.value)}
              placeholder="Ask me anything..."
              autoFocus
            />
            <button class="dt__send" type="submit" aria-label="Send message">
              &rarr;
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* --- SVG Paths --- */

// Full rectangle (initial state)
const RECT_PATH =
  'M 0 0 L 800 0 L 800 600 L 0 600 Z';

// Organic blob shapes for breathing animation
const BLOB_PATH =
  'M 400 30 C 560 20, 720 100, 740 220 C 760 340, 680 460, 560 520 C 440 580, 280 560, 160 480 C 40 400, 20 260, 80 160 C 140 60, 240 40, 400 30 Z';

const BLOB_PATH_2 =
  'M 420 40 C 580 10, 740 120, 720 240 C 700 360, 660 480, 540 530 C 420 580, 260 580, 140 500 C 20 420, 40 280, 100 170 C 160 60, 260 70, 420 40 Z';

const BLOB_PATH_3 =
  'M 390 25 C 540 30, 700 90, 750 210 C 800 330, 700 470, 570 540 C 440 610, 300 570, 170 490 C 40 410, 10 270, 60 150 C 110 30, 240 20, 390 25 Z';
