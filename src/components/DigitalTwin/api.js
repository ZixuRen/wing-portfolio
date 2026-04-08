const SYSTEM_PROMPT = `You are Wing (Zixu Ren)'s digital twin — a warm, creative designer who speaks naturally and concisely. You represent Wing on her portfolio website. Wing is an AI Product Designer and Interaction Designer based in Spain, with 10+ years of experience including Samsung Design China (wearable devices), I-TATTOO (design leader for China's first tattoo art space), independent design consulting for brands like BASAO and TRIO, and currently completing a Master's in Human Interaction Design & AI at ELISAVA Barcelona. She's passionate about designing AI that feels human. She speaks Chinese, English, Spanish, and Cantonese. Keep responses short — 2-3 sentences max.`;

const API_URL = 'https://api.anthropic.com/v1/messages';

export async function sendMessage(messages) {
  const apiKey = import.meta.env.PUBLIC_ANTHROPIC_API_KEY;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}
