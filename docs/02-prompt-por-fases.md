# 02 · Especificación por fases (prompt reconstruido)

> **Reconstrucción.** Este texto se redactó después, leyendo el código final, para mostrar el orden lógico y los criterios de cada etapa. No es una transcripción de lo que se pidió en su momento.

## Contexto general (se repite al inicio de cada fase)
Eres un desarrollador full-stack. Construyes "Azure Speech Demo", una web para una exposición universitaria.
Stack: React 18 + Vite (cliente), Node.js + Express 4 (servidor), `microsoft-cognitiveservices-speech-sdk`.
Reglas: código corto y comentado en español; la clave de Azure nunca sale del servidor; validar toda entrada; mensajes de error en español.

## Fase 1 · Estructura y configuración
**Tarea:** crea un monorepo con `server/` y `client/`, y un `package.json` raíz con `npm run dev` (usa `concurrently`) y `npm run install:all`.
**Entradas:** `SPEECH_KEY`, `SPEECH_REGION`, `PORT` en `server/.env`, con `.env.example` versionado y `.env` ignorado.
**Criterio:** si falta una variable, el servidor termina con un mensaje claro y sin imprimir la clave.

## Fase 2 · Backend
**Tarea:** Express con `GET /api/health`, `GET /api/voices`, `POST /api/tts`, `GET /api/token`.
- `/api/tts` recibe `{text, voice}`; valida texto no vacío, ≤ 500 caracteres y voz dentro del catálogo; devuelve `audio/mpeg`.
- `/api/token` pide a Azure un token (`issueToken`) y devuelve `{token, region}`.
- Un manejador final de errores que no filtre detalles.
**Criterio:** respuestas 400 con mensaje claro ante entradas inválidas; 500 genérico ante fallos de Azure.

## Fase 3 · Catálogo de voces
**Tarea:** `voices.js` con voces neuronales agrupadas por idioma, y un `Set` de ids para validar.
**Criterio:** es-CO, es-ES, es-MX, es-AR, en-US, en-GB, pt-BR, fr-FR, de-DE, it-IT.

## Fase 4 · Texto a voz (cliente)
**Tarea:** componente `TextToSpeech` con textarea y contador, selectores de idioma y voz, botón "Escuchar" y `<audio controls>`.
**Criterio:** al cambiar el idioma se cambia la voz y, si el texto sigue siendo el ejemplo, también la frase; se libera la URL del audio al desmontar.

## Fase 5 · Voz a texto (cliente)
**Tarea:** componente `SpeechToText` que pide el token, crea `SpeechRecognizer` con `fromAuthorizationToken` y reconoce de forma continua.
**Criterio:** muestra el texto parcial (`recognizing`) y acumula el final (`recognized`); maneja permisos de micrófono denegados y fallos de conexión; cierra el reconocedor al detener o cambiar de pestaña.

## Fase 6 · Interfaz
**Tarea:** `App` con dos pestañas accesibles (`role="tab"`, `aria-selected`), tarjeta central y estilos sobrios.

## Fase 7 · Documentación y pruebas manuales
**Tarea:** README con creación del recurso en Azure, instalación, estructura, cómo funciona y solución de problemas.
**Pruebas manuales:** clave inválida, texto vacío, texto de 501 caracteres, micrófono denegado, sin internet.
