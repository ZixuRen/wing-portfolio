/* ==========================================================================
   Voice I/O — Web Speech API (input) + ElevenLabs (output)
   ========================================================================== */

const ELEVENLABS_API = 'https://api.elevenlabs.io/v1/text-to-speech';

// ---- Speech Recognition (input) ----

let recognition = null;

export function startListening(onResult, onEnd) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('[Voice] SpeechRecognition not supported in this browser');
    return null;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('[Voice] Heard:', transcript);
    onResult(transcript);
  };

  recognition.onend = () => {
    onEnd?.();
  };

  recognition.onerror = (event) => {
    console.error('[Voice] Recognition error:', event.error);
    onEnd?.();
  };

  recognition.start();
  console.log('[Voice] Listening...');
  return recognition;
}

export function stopListening() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}

// ---- Text-to-Speech via ElevenLabs (output) ----

let currentAudio = null;

export async function speak(text, onStart, onDone) {
  const apiKey = import.meta.env.PUBLIC_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.PUBLIC_ELEVENLABS_VOICE_ID;

  const res = await fetch(`${ELEVENLABS_API}/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${err}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  stopSpeaking();

  currentAudio = new Audio(url);
  currentAudio.onplay = () => onStart?.();
  currentAudio.onended = () => {
    URL.revokeObjectURL(url);
    currentAudio = null;
    onDone?.();
  };
  currentAudio.onerror = () => {
    URL.revokeObjectURL(url);
    currentAudio = null;
    onDone?.();
  };
  currentAudio.play();
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}
