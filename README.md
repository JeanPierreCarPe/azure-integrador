# Azure Speech Demo

Aplicación web pequeña para una exposición universitaria que muestra dos capacidades de **Azure AI Speech**:

- **Texto a voz (TTS):** escribes una frase, eliges idioma y voz, y la escuchas.
- **Voz a texto (STT):** hablas al micrófono y ves la transcripción en vivo.

Stack: React 18 + Vite (frontend), Node.js + Express (backend), `microsoft-cognitiveservices-speech-sdk`.

## 1. Crear el recurso en Azure

1. Entra al [portal de Azure](https://portal.azure.com) y crea un recurso **Speech** (Azure AI Services).
2. Abre el recurso → **Claves y punto de conexión**.
3. Copia **KEY 1** y la **Región** (ej. `eastus`, `northcentralus`).

## 2. Instalación y ejecución

```bash
npm run install:all
cp server/.env.example server/.env    # y pegar la clave y la región
npm run dev
```

(En Windows PowerShell: `Copy-Item server/.env.example server/.env`.)

La app queda en <http://localhost:5173>. El backend corre en el puerto 3001.

## 3. Estructura

```
azure-speech-demo/
├── package.json        # scripts raíz (dev, install:all)
├── server/
│   ├── index.js        # Express: /api/health, /api/voices, /api/tts, /api/token
│   ├── voices.js       # catálogo de voces
│   └── .env.example
└── client/
    ├── vite.config.js  # proxy /api -> localhost:3001
    └── src/
        ├── App.jsx, App.css, main.jsx
        └── components/ TextToSpeech.jsx, SpeechToText.jsx
```

## 4. Cómo funciona

**TTS:** el navegador envía `{text, voice}` a `POST /api/tts`. El backend usa el SDK con la clave, genera un MP3 en memoria y lo devuelve. El frontend lo reproduce con `<audio>`.

**STT:** el navegador necesita el micrófono, así que el SDK corre en el cliente. Para no exponer la clave, pide un **token temporal (~10 min)** a `GET /api/token` (el backend lo obtiene de Azure con la clave) y lo usa con `SpeechConfig.fromAuthorizationToken`. Se pide un token nuevo cada vez que se pulsa "Iniciar grabación".

La clave `SPEECH_KEY` vive solo en `server/.env` (ignorado por git) y nunca llega al navegador.

## 5. Solución de problemas

- **"Revisa la clave y la región de Azure":** verifica `server/.env`; la región debe coincidir con la del recurso.
- **El servidor termina al arrancar:** faltan `SPEECH_KEY` o `SPEECH_REGION` en `server/.env`.
- **Micrófono no funciona:** permite el micrófono desde el candado de la barra de direcciones (usa `localhost` o HTTPS).
- **Puerto ocupado:** cambia `PORT` en `server/.env` y el destino del proxy en `client/vite.config.js`; para el 5173, cierra el otro proceso de Vite.

## Notas

- Se eligió `express@4` y Vite 5 por estabilidad.
