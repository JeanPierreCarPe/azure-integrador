import { useState } from "react";
import TextToSpeech from "./components/TextToSpeech.jsx";
import SpeechToText from "./components/SpeechToText.jsx";

export default function App() {
  const [tab, setTab] = useState("tts");

  return (
    <div className="app">
      <header className="header">
        <h1>Azure Speech Demo</h1>
        <p>Demostración de síntesis y reconocimiento de voz</p>
      </header>

      <nav className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "tts"}
          className={tab === "tts" ? "tab active" : "tab"}
          onClick={() => setTab("tts")}
        >
          Texto a voz
        </button>
        <button
          role="tab"
          aria-selected={tab === "stt"}
          className={tab === "stt" ? "tab active" : "tab"}
          onClick={() => setTab("stt")}
        >
          Voz a texto
        </button>
      </nav>

      <main className="card">
        {tab === "tts" ? <TextToSpeech /> : <SpeechToText />}
      </main>

      <footer className="footer">Powered by Azure AI Speech</footer>
    </div>
  );
}
