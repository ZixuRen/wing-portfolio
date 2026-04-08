/* ==========================================================================
   Voice I/O — Whisper API (input) + ElevenLabs (output)
   ========================================================================== */

const ELEVENLABS_API = 'https://api.elevenlabs.io/v1/text-to-speech';
const WHISPER_API = 'https://api.openai.com/v1/audio/transcriptions';

// ---- Speech Recognition via Whisper (input) ----

let mediaRecorder = null;
let audioStream = null;

export async function startListening(onResult, onEnd) {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (e) {
    console.error('[Voice] Mic access denied:', e);
    onEnd?.('unavailable');
    return;
  }

  const chunks = [];
  mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });

    // Skip if too short (< 0.5s of audio, likely silence)
    if (blob.size < 5000) {
      console.log('[Voice] Audio too short, skipping');
      onEnd?.();
      return;
    }

    try {
      const transcript = await transcribeWithWhisper(blob);
      if (transcript && transcript.trim()) {
        console.log('[Voice] Heard:', transcript);
        onResult(transcript.trim());
      } else {
        console.log('[Voice] No speech detected');
        onEnd?.();
      }
    } catch (err) {
      console.error('[Voice] Whisper error:', err);
      onEnd?.();
    }
  };

  mediaRecorder.start();
  console.log('[Voice] Recording...');

  // Auto-stop after 10 seconds max
  setTimeout(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  }, 10000);
}

export function stopListening() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
  mediaRecorder = null;
  if (audioStream) {
    audioStream.getTracks().forEach((t) => t.stop());
    audioStream = null;
  }
}

// Stop recording and send to Whisper (called by user or by silence detection)
export function finishRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
}

async function transcribeWithWhisper(audioBlob) {
  const apiKey = import.meta.env.PUBLIC_OPENAI_API_KEY;

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-1');

  const res = await fetch(WHISPER_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Whisper error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.text;
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
  currentAudio.onplay = () => {
    console.log('[Voice] Audio playing');
    onStart?.();
  };
  currentAudio.onended = () => {
    console.log('[Voice] Audio finished');
    URL.revokeObjectURL(url);
    currentAudio = null;
    onDone?.();
  };
  currentAudio.onerror = (e) => {
    console.error('[Voice] Audio playback error:', e);
    URL.revokeObjectURL(url);
    currentAudio = null;
    onDone?.();
  };

  try {
    await currentAudio.play();
  } catch (e) {
    console.error('[Voice] Audio play blocked:', e);
    URL.revokeObjectURL(url);
    currentAudio = null;
    onDone?.();
  }
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}
