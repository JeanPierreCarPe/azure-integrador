// Catálogo de voces neuronales de Azure agrupadas por idioma
export const voices = {
  "es-CO": [
    { id: "es-CO-SalomeNeural", label: "Salomé (mujer, Colombia)" },
    { id: "es-CO-GonzaloNeural", label: "Gonzalo (hombre, Colombia)" }
  ],
  "es-ES": [
    { id: "es-ES-ElviraNeural", label: "Elvira (mujer, España)" },
    { id: "es-ES-AlvaroNeural", label: "Álvaro (hombre, España)" },
    { id: "es-ES-AbrilNeural", label: "Abril (mujer, España)" },
    { id: "es-ES-EstrellaNeural", label: "Estrella (mujer, España)" },
    { id: "es-ES-LaiaNeural", label: "Laia (mujer, España)" },
    { id: "es-ES-DarioNeural", label: "Darío (hombre, España)" },
    { id: "es-ES-SaulNeural", label: "Saúl (hombre, España)" },
    { id: "es-ES-TeoNeural", label: "Teo (hombre, España)" }
  ],
  "es-MX": [
    { id: "es-MX-DaliaNeural", label: "Dalia (mujer, México)" },
    { id: "es-MX-BeatrizNeural", label: "Beatriz (mujer, México)" },
    { id: "es-MX-CandelaNeural", label: "Candela (mujer, México)" },
    { id: "es-MX-JorgeNeural", label: "Jorge (hombre, México)" },
    { id: "es-MX-LibertoNeural", label: "Liberto (hombre, México)" }
  ],
  "es-AR": [
    { id: "es-AR-ElenaNeural", label: "Elena (mujer, Argentina)" },
    { id: "es-AR-TomasNeural", label: "Tomás (hombre, Argentina)" }
  ],
  "en-US": [
    { id: "en-US-JennyNeural", label: "Jenny (mujer, EE. UU.)" },
    { id: "en-US-AriaNeural", label: "Aria (mujer, EE. UU.)" },
    { id: "en-US-JaneNeural", label: "Jane (mujer, EE. UU.)" },
    { id: "en-US-NancyNeural", label: "Nancy (mujer, EE. UU.)" },
    { id: "en-US-SaraNeural", label: "Sara (mujer, EE. UU.)" },
    { id: "en-US-GuyNeural", label: "Guy (hombre, EE. UU.)" },
    { id: "en-US-DavisNeural", label: "Davis (hombre, EE. UU.)" },
    { id: "en-US-JasonNeural", label: "Jason (hombre, EE. UU.)" },
    { id: "en-US-TonyNeural", label: "Tony (hombre, EE. UU.)" }
  ],
  "en-GB": [
    { id: "en-GB-SoniaNeural", label: "Sonia (mujer, Reino Unido)" },
    { id: "en-GB-LibbyNeural", label: "Libby (mujer, Reino Unido)" },
    { id: "en-GB-RyanNeural", label: "Ryan (hombre, Reino Unido)" }
  ],
  "pt-BR": [
    { id: "pt-BR-FranciscaNeural", label: "Francisca (mujer, Brasil)" },
    { id: "pt-BR-AntonioNeural", label: "Antônio (hombre, Brasil)" }
  ],
  "fr-FR": [
    { id: "fr-FR-DeniseNeural", label: "Denise (mujer, Francia)" },
    { id: "fr-FR-HenriNeural", label: "Henri (hombre, Francia)" }
  ],
  "de-DE": [
    { id: "de-DE-KatjaNeural", label: "Katja (mujer, Alemania)" },
    { id: "de-DE-ConradNeural", label: "Conrad (hombre, Alemania)" }
  ],
  "it-IT": [
    { id: "it-IT-ElsaNeural", label: "Elsa (mujer, Italia)" },
    { id: "it-IT-DiegoNeural", label: "Diego (hombre, Italia)" }
  ]
};

// Lista plana de ids para validar rápido
export const voiceIds = new Set(
  Object.values(voices).flat().map((v) => v.id)
);
