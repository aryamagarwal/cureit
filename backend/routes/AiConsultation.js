const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const googleTTS = require("google-tts-api");

const { TextToSpeechClient } = require("@google-cloud/text-to-speech");

const creds = JSON.parse(process.env.TTS_SA_KEY_JSON);
const ttsClient = new TextToSpeechClient({ credentials: creds });
async function synthesizeHinglish(text) {
  // this will split your text into ≤200-char chunks for you
  const urls = googleTTS.getAllAudioUrls(text, {
    lang: "hi", // Hindi voice (auto-passes English words)
    slow: false, // normal speed
    host: "https://translate.google.com",
  });

  // fetch each chunk and collect the buffers
  const buffers = [];
  for (const { url } of urls) {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`TTS fetch failed: ${res.status}`);
    buffers.push(await res.buffer());
  }

  // concatenate and return base64 exactly like before
  const merged = Buffer.concat(buffers);
  return merged.toString("base64");
}

router.post("/consult", async (req, res) => {
  const { prompt, voiceId = "JBFqnCBsd6RMkjVDRZzb" } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  const now = new Date();
  const hour = now.getHours();
  let greeting;
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  const systemPrompt = `
You are Dr. AI, a board-certified physician who uses hinglish on speaking and if patient specifies a language you use that language. When responding:
- Begin with a time-appropriate greeting: "${greeting},"
- Be Professional while talking to patients (and be respectful)
- Provide concise (20–30 words), evidence-based medical advice in a calm, reassuring tone.
- If the user’s query is not medical, reply: "Sorry that is not in my domain."
Patient says: "${prompt}"
`.trim();

  console.log("hit /consult");

  try {
    // 1. Call Gemini AI
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`;
    // const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`;
    const geminiResp = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}`,
              },
            ],
          },
        ],
      }),
    });
    if (!geminiResp.ok) {
      const txt = await geminiResp.text();
      throw new Error(`Gemini API error: ${txt}`);
    }
    const geminiData = await geminiResp.json();
    const replyText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!replyText) throw new Error("No reply from Gemini");
    console.log("AI reply:", replyText);

    // 2. Call ElevenLabs TTS
    // const ttsResp = await fetch(
    //   `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "xi-api-key": process.env.ELEVENLABS_API_KEY,
    //     },
    //     body: JSON.stringify({
    //       text: replyText,
    //       model_id: "eleven_multilingual_v2",
    //       voice_settings: { stability: 0.5, similarity_boost: 0.5 },
    //     }),
    //   }
    // );
    // if (!ttsResp.ok) {
    //   const txt = await ttsResp.text();
    //   throw new Error(`ElevenLabs API error: ${txt}`);
    // }

    // // 3. Base64-encode the MP3 and return JSON
    // const audioBuffer = await ttsResp.arrayBuffer();
    // const audioBase64 = Buffer.from(audioBuffer).toString("base64");
    const ssml = `
        <speak>
          <prosody rate="2" pitch="+0st">
            ${replyText}
          </prosody>
        </speak>
      `;
    const ssml2 = `
        <speak>
          ${replyText}
        </speak>

    `;
    console.log("sssssss", ssml2);

    // Request;
    // const [ttsResponse] = await ttsClient.synthesizeSpeech({
    //   input: { text: replyText },
    //   voice: {
    //     languageCode: "en-IN",
    //     name: "en-IN-Chirp3-HD-Schedar", // one of Google’s top-quality voices
    //     ssmlGender: "MALE",
    //   },
    //   audioConfig: {
    //     audioEncoding: "MP3",
    //     speakingRate: 1, // slows the speech slightly
    //     pitch: 0, // leave pitch neutral
    //     volumeGainDb: 1.5, // you can boost it slightly if needed
    //   },
    // });
    // The API returns a Buffer in `audioContent`
    // const audioBase64 = ttsResponse.audioContent.toString("base64");

    const audioBase64 = await synthesizeHinglish(replyText);

    res.json({
      replyText,
      audioBase64,
    });
  } catch (err) {
    console.error("Error in /consult:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
