// Catálogo de voces neuronales de Azure agrupadas por idioma
export const voices = {
  "es-CO": [
    { id: "es-CO-SalomeNeural", label: "Salomé (mujer, Colombia)" },
    { id: "es-CO-GonzaloNeural", label: "Gonzalo (hombre, Colombia)" }
  ],
  "es-ES": [
    { id: "es-ES-ElviraNeural", label: "Elvira (mujer, España)" },
    { id: "es-ES-AlvaroNeural", label: "Álvaro (hombre, España)" }
  ],
  "en-US": [
    { id: "en-US-JennyNeural", label: "Jenny (mujer, EE. UU.)" },
    { id: "en-US-GuyNeural", label: "Guy (hombre, EE. UU.)" }
  ]
};

// Lista plana de ids para validar rápido
export const voiceIds = new Set(
  Object.values(voices).flat().map((v) => v.id)
);
