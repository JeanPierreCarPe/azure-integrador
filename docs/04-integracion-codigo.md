# 04 · Integración en el código

Dos caminos, según dónde se necesita el hardware:

| Función | Dónde corre el SDK | Credencial |
|---------|--------------------|------------|
| Texto a voz | Servidor (Express) | Clave (`fromSubscription`) |
| Voz a texto | Navegador (React) | Token temporal (`fromAuthorizationToken`) |

## Texto a voz — [server/index.js](../server/index.js)
```js
const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
speechConfig.speechSynthesisVoiceName = voice;                  // ej. es-CO-SalomeNeural
speechConfig.speechSynthesisOutputFormat =
  sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null); // null: no reproducir en el servidor
synthesizer.speakTextAsync(text, (result) => {
  synthesizer.close();
  res.set("Content-Type", "audio/mpeg");
  res.send(Buffer.from(result.audioData));
});
```
Antes de llegar aquí se valida: texto no vacío, ≤ 500 caracteres y voz dentro del catálogo.

## Token temporal — [server/index.js](../server/index.js)
```js
const r = await fetch(
  `https://${SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
  { method: "POST", headers: { "Ocp-Apim-Subscription-Key": SPEECH_KEY } }
);
res.json({ token: await r.text(), region: SPEECH_REGION });
```
El token dura unos 10 minutos. La clave se queda en el servidor.

## Voz a texto — [client/src/components/SpeechToText.jsx](../client/src/components/SpeechToText.jsx)
```js
const { token, region } = await (await fetch("/api/token")).json();
const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
speechConfig.speechRecognitionLanguage = lang;                  // ej. es-CO
const recognizer = new sdk.SpeechRecognizer(
  speechConfig, sdk.AudioConfig.fromDefaultMicrophoneInput());

recognizer.recognizing = (_s, e) => setPartial(e.result.text);  // texto mientras habla
recognizer.recognized  = (_s, e) => { /* frase final */ };
recognizer.startContinuousRecognitionAsync();
```

## Reproducción en el cliente — [client/src/components/TextToSpeech.jsx](../client/src/components/TextToSpeech.jsx)
El navegador hace `POST /api/tts`, recibe el MP3 como `Blob`, crea una URL con `URL.createObjectURL` y la asigna al `<audio>`. La URL se libera al desmontar.

## Proxy — [client/vite.config.js](../client/vite.config.js)
`"/api": "http://localhost:3001"` evita CORS y URLs absolutas en desarrollo.
