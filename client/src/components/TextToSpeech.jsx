import { useEffect, useRef, useState } from "react";

const MAX_CHARS = 500;

const LANGS = [
  { code: "es-CO", label: "Español (Colombia)" },
  { code: "es-ES", label: "Español (España)" },
  { code: "en-US", label: "Inglés (EE. UU.)" }
];

// Frases de ejemplo por idioma
const EJEMPLOS = {
  "es-CO": "Buenos días, hoy aprenderemos sobre inteligencia artificial.",
  "es-ES": "Buenos días, hoy aprenderemos sobre inteligencia artificial.",
  "en-US": "Good morning, today we will learn about artificial intelligence."
};

export default function TextToSpeech() {
  const [text, setText] = useState(EJEMPLOS["es-CO"]);
  const [lang, setLang] = useState("es-CO");
  const [catalog, setCatalog] = useState({});
  const [voice, setVoice] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(null);

  // Cargar catálogo de voces
  useEffect(() => {
    fetch("/api/voices")
      .then((r) => r.json())
      .then((data) => {
        setCatalog(data);
        setVoice(data["es-CO"]?.[0]?.id ?? "");
      })
      .catch(() =>
        setError("No se pudo conectar con el servidor. Verifica que esté en ejecución.")
      );
  }, []);

  // Liberar la URL del audio al desmontar
  useEffect(() => () => audioUrl && URL.revokeObjectURL(audioUrl), [audioUrl]);

  function cambiarIdioma(nuevo) {
    setLang(nuevo);
    setVoice(catalog[nuevo]?.[0]?.id ?? "");
    // Solo reemplazar el texto si sigue siendo un ejemplo
    if (Object.values(EJEMPLOS).includes(text)) setText(EJEMPLOS[nuevo]);
  }

  async function escuchar() {
    setError("");
    if (!text.trim()) {
      setError("Escribe un texto antes de continuar.");
      return;
    }
    setLoading(true);
    setStatus("Generando audio…");
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo generar el audio");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url); // el efecto libera la URL anterior
      setStatus("Reproduciendo…");
      // Esperar a que React asigne el src antes de reproducir
      setTimeout(() => {
        const a = audioRef.current;
        if (!a) return;
        a.onended = () => setStatus("");
        a.play().catch(() => setStatus("Pulsa play para escuchar."));
      }, 0);
    } catch (e) {
      setStatus("");
      setError(
        e instanceof TypeError
          ? "Sin conexión con el servidor. Revisa tu internet."
          : e.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <label className="label" htmlFor="tts-text">Texto</label>
      <textarea
        id="tts-text"
        value={text}
        maxLength={MAX_CHARS}
        rows={4}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="counter">{text.length} / {MAX_CHARS}</div>

      <div className="row">
        <div className="field">
          <label className="label" htmlFor="tts-lang">Idioma</label>
          <select id="tts-lang" value={lang} onChange={(e) => cambiarIdioma(e.target.value)}>
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="tts-voice">Voz</label>
          <select id="tts-voice" value={voice} onChange={(e) => setVoice(e.target.value)}>
            {(catalog[lang] ?? []).map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="primary" onClick={escuchar} disabled={loading || !voice}>
        {loading ? "Generando…" : "Escuchar"}
      </button>

      {status && <p className="status">{status}</p>}
      {error && <p className="error">{error}</p>}

      <audio ref={audioRef} controls src={audioUrl || undefined} className="player" />
    </section>
  );
}
