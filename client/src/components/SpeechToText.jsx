import { useEffect, useRef, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { LANGS } from "../languages.js";

export default function SpeechToText() {
  const [lang, setLang] = useState("es-CO");
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [partial, setPartial] = useState("");
  const [error, setError] = useState("");
  const recognizerRef = useRef(null);

  // Cerrar el reconocedor si se cambia de pestaña
  useEffect(() => () => cerrar(), []);

  function cerrar() {
    const r = recognizerRef.current;
    recognizerRef.current = null;
    if (r) {
      try {
        r.stopContinuousRecognitionAsync(() => r.close(), () => r.close());
      } catch {
        /* ya cerrado */
      }
    }
    setListening(false);
    setPartial("");
  }

  async function iniciar() {
    setError("");
    try {
      // 1) Token temporal desde el backend (la clave nunca llega al navegador)
      const res = await fetch("/api/token");
      if (!res.ok) throw new Error("Revisa la clave y la región de Azure");
      const { token, region } = await res.json();

      // 2) Configurar el SDK con el token
      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechRecognitionLanguage = lang;
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      recognizerRef.current = recognizer;

      // 3) Eventos del reconocimiento continuo
      recognizer.recognizing = (_s, e) => setPartial(e.result.text);
      recognizer.recognized = (_s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech && e.result.text) {
          setFinalText((t) => (t ? t + " " : "") + e.result.text);
        }
        setPartial("");
      };
      recognizer.canceled = (_s, e) => {
        if (e.reason === sdk.CancellationReason.Error) {
          setError(
            e.errorCode === sdk.CancellationErrorCode.ConnectionFailure
              ? "Error de conexión. Revisa tu internet."
              : "Revisa la clave y la región de Azure"
          );
        }
        cerrar();
      };
      recognizer.sessionStopped = () => cerrar();

      recognizer.startContinuousRecognitionAsync(
        () => setListening(true),
        (err) => {
          setError(mensajeError(String(err)));
          cerrar();
        }
      );
    } catch (e) {
      setError(mensajeError(e.message));
      cerrar();
    }
  }

  function mensajeError(msg) {
    if (/permission|denied|notallowed/i.test(msg)) {
      return "Permiso de micrófono denegado. Haz clic en el candado de la barra de direcciones y permite el micrófono.";
    }
    if (/Failed to fetch|NetworkError/i.test(msg)) {
      return "Sin conexión con el servidor. Revisa tu internet.";
    }
    return msg || "Ocurrió un error inesperado.";
  }

  return (
    <section>
      <div className="row">
        <div className="field">
          <label className="label" htmlFor="stt-lang">Idioma de reconocimiento</label>
          <select
            id="stt-lang"
            value={lang}
            disabled={listening}
            onChange={(e) => setLang(e.target.value)}
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="controls">
        {listening ? (
          <button className="primary danger" onClick={cerrar}>Detener</button>
        ) : (
          <button className="primary" onClick={iniciar}>Iniciar grabación</button>
        )}
        <button className="secondary" onClick={() => { setFinalText(""); setPartial(""); }}>
          Limpiar
        </button>
        {listening && (
          <span className="rec"><span className="dot" /> Escuchando…</span>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {/* Texto plano: React escapa el contenido, nunca se interpreta como HTML */}
      <div className="transcript" aria-live="polite">
        {finalText}
        {partial && <span className="partial"> {partial}</span>}
        {!finalText && !partial && (
          <span className="placeholder">La transcripción aparecerá aquí…</span>
        )}
      </div>
    </section>
  );
}
