// Idiomas compartidos por texto a voz y voz a texto
export const LANGS = [
  { code: "es-CO", label: "Español (Colombia)" },
  { code: "es-ES", label: "Español (España)" },
  { code: "es-MX", label: "Español (México)" },
  { code: "es-AR", label: "Español (Argentina)" },
  { code: "en-US", label: "Inglés (EE. UU.)" },
  { code: "en-GB", label: "Inglés (Reino Unido)" },
  { code: "pt-BR", label: "Portugués (Brasil)" },
  { code: "fr-FR", label: "Francés (Francia)" },
  { code: "de-DE", label: "Alemán (Alemania)" },
  { code: "it-IT", label: "Italiano (Italia)" }
];

// Frase de ejemplo por idioma (para la demo de texto a voz)
const ES = "Buenos días, hoy aprenderemos sobre inteligencia artificial.";
const EN = "Good morning, today we will learn about artificial intelligence.";
export const EJEMPLOS = {
  "es-CO": ES,
  "es-ES": ES,
  "es-MX": ES,
  "es-AR": ES,
  "en-US": EN,
  "en-GB": EN,
  "pt-BR": "Bom dia, hoje vamos aprender sobre inteligência artificial.",
  "fr-FR": "Bonjour, aujourd'hui nous allons apprendre l'intelligence artificielle.",
  "de-DE": "Guten Morgen, heute lernen wir etwas über künstliche Intelligenz.",
  "it-IT": "Buongiorno, oggi impareremo l'intelligenza artificiale."
};
