# 05 · Guía de uso

## Arrancar
```bash
npm run install:all
npm run dev
```
Abre <http://localhost:5173>. Verás dos pestañas: **Texto a voz** y **Voz a texto**.

## Texto a voz
1. Escribe o edita el texto (hasta 500 caracteres; hay un contador).
2. Elige el **idioma**: la lista de **voces** cambia sola, y si no has editado el texto, la frase de ejemplo también.
3. Elige la **voz** (mujer u hombre, según el idioma).
4. Pulsa **Escuchar**. El botón dice "Generando…" y luego el reproductor suena.
5. Puedes repetir, pausar o mover el audio con los controles.

## Voz a texto
1. Elige el **idioma de reconocimiento** (se bloquea mientras se graba).
2. Pulsa **Iniciar grabación** y acepta el permiso del micrófono la primera vez.
3. Habla. El texto en gris es provisional y se vuelve definitivo al terminar cada frase.
4. Pulsa **Detener** para terminar, o **Limpiar** para borrar la transcripción.

## Si algo falla
| Mensaje | Qué hacer |
|---------|-----------|
| Revisa la clave y la región de Azure | Corrige `server/.env` y reinicia |
| No se pudo conectar con el servidor | Verifica que `npm run dev` siga corriendo |
| Permiso de micrófono denegado | Candado de la barra de direcciones → permitir micrófono |
| El texto no puede superar los 500 caracteres | Acórtalo |
