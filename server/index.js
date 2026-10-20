import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { voices, voiceIds } from "./voices.js";

// Cargar server/.env sin importar desde qué carpeta se ejecute
dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const { SPEECH_KEY, SPEECH_REGION } = process.env;
const PORT = process.env.PORT || 3001;
const MAX_CHARS = 500;

// Validar configuración al arrancar (sin imprimir la clave)
const faltantes = [];
if (!SPEECH_KEY || SPEECH_KEY.startsWith("pega_aqui")) faltantes.push("SPEECH_KEY");
if (!SPEECH_REGION || SPEECH_REGION.startsWith("pega_aqui")) faltantes.push("SPEECH_REGION");
if (faltantes.length) {
  console.error(
    `Faltan variables en server/.env: ${faltantes.join(", ")}.\n` +
      "Copia server/.env.example a server/.env y pega tu clave y región de Azure."
  );
  process.exit(1);
}

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));

// Comprobar que el servidor está vivo
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Catálogo de voces por idioma
app.get("/api/voices", (_req, res) => res.json(voices));

// Texto a voz: genera un MP3 con Azure y lo devuelve
app.post("/api/tts", (req, res) => {
  const { text, voice } = req.body ?? {};

  if (typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "El texto es obligatorio" });
  }
  if (text.length > MAX_CHARS) {
    return res
      .status(400)
      .json({ error: `El texto no puede superar los ${MAX_CHARS} caracteres` });
  }
  if (typeof voice !== "string" || !voiceIds.has(voice)) {
    return res.status(400).json({ error: "La voz seleccionada no es válida" });
  }

  const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
  speechConfig.speechSynthesisVoiceName = voice;
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

  // AudioConfig null: no reproducir localmente, solo obtener los bytes
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

  synthesizer.speakTextAsync(
    text,
    (result) => {
      synthesizer.close();
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        res.set("Content-Type", "audio/mpeg");
        return res.send(Buffer.from(result.audioData));
      }
      console.error("Error de síntesis:", result.errorDetails || result.reason);
      res.status(500).json({ error: "No se pudo generar el audio" });
    },
    (err) => {
      synthesizer.close();
      console.error("Error de síntesis:", String(err));
      res.status(500).json({ error: "No se pudo generar el audio" });
    }
  );
});

// Token temporal para que el navegador use el SDK sin conocer la clave
app.get("/api/token", async (_req, res, next) => {
  try {
    const r = await fetch(
      `https://${SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      { method: "POST", headers: { "Ocp-Apim-Subscription-Key": SPEECH_KEY } }
    );
    if (!r.ok) {
      console.error("Error al pedir token, estado HTTP:", r.status);
      return res
        .status(500)
        .json({ error: "Revisa la clave y la región de Azure" });
    }
    const token = await r.text();
    res.json({ token, region: SPEECH_REGION });
  } catch (err) {
    next(err);
  }
});

// Manejador final: nunca filtra detalles ni la clave
app.use((err, _req, res, _next) => {
  console.error("Error del servidor:", err?.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
