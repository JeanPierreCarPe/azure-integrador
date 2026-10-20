# 01 · Blueprint del proyecto

## Propósito
Mostrar en una exposición universitaria dos capacidades de **Azure AI Speech** con una aplicación pequeña, entendible en 10 minutos.

## Alcance
| Dentro | Fuera |
|--------|-------|
| Texto a voz (TTS) con voces neuronales | Autenticación de usuarios |
| Voz a texto (STT) en vivo desde el micrófono | Guardar audios o transcripciones |
| 10 idiomas, catálogo de voces | Despliegue en producción |
| Clave de Azure protegida | Traducción, diarización, voces personalizadas |

## Requisitos funcionales
- RF1. El usuario escribe un texto (máx. 500 caracteres), elige idioma y voz, y lo escucha.
- RF2. El usuario habla y ve la transcripción: texto parcial mientras habla, texto final al terminar cada frase.
- RF3. Los errores se muestran en español y dicen qué hacer.

## Requisitos no funcionales
- RNF1. La clave `SPEECH_KEY` nunca llega al navegador.
- RNF2. El backend valida toda entrada (texto vacío, largo, voz fuera del catálogo).
- RNF3. Un solo comando levanta todo (`npm run dev`).
- RNF4. Código corto y comentado, pensado para explicarse.

## Decisiones de arquitectura
| Decisión | Alternativa descartada | Motivo |
|----------|------------------------|--------|
| TTS en el servidor | TTS en el navegador con la clave | Protege la clave |
| STT en el navegador con token temporal | STT en el servidor | El micrófono solo es accesible desde el navegador |
| Express 4 + Vite 5 | Versiones más nuevas | Estabilidad y documentación abundante |
| Proxy de Vite `/api` | CORS con URLs absolutas | Menos configuración |

## Diagrama
```
Navegador (React) ──/api/tts───▶ Express ──clave──▶ Azure Speech (REST/SDK)
        │                           ▲
        └──/api/token──────────────┘  (token ~10 min)
        └──token──▶ Azure Speech (WebSocket, SDK en el navegador)
```

## Criterios de aceptación
1. Con clave válida, "Escuchar" reproduce audio en menos de 3 s.
2. Con clave inválida, la app muestra "Revisa la clave y la región de Azure" y no se cae.
3. Buscar `SPEECH_KEY` en el código enviado al navegador no da resultados.
4. Cambiar de idioma cambia la lista de voces y el texto de ejemplo.
