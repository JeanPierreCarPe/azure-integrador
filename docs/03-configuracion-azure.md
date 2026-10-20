# 03 · Configuración en Azure

## 1. Crear el recurso
1. Entra a <https://portal.azure.com> con una cuenta de Azure (la cuenta de estudiante de Azure for Students sirve).
2. Busca **Speech** (Azure AI Services) y pulsa **Crear**.
3. Completa:
   - **Suscripción:** la tuya.
   - **Grupo de recursos:** crea uno nuevo, por ejemplo `rg-speech-demo`.
   - **Región:** una cercana, por ejemplo `eastus` o `brazilsouth`. **Anótala.**
   - **Nombre:** único, por ejemplo `speech-demo-tunombre`.
   - **Plan de tarifa:** `Free F0` si está disponible (cupo mensual gratuito, suficiente para la demo); si no, `Standard S0`.
4. **Revisar y crear** → **Crear** → **Ir al recurso**.

## 2. Obtener las credenciales
En el recurso: **Administración de recursos → Claves y punto de conexión**.
- Copia **KEY 1**.
- Copia la **Ubicación/Región** (ej. `eastus`).

## 3. Guardarlas en el proyecto
```bash
cp server/.env.example server/.env        # PowerShell: Copy-Item server/.env.example server/.env
```
```ini
SPEECH_KEY=<KEY 1>
SPEECH_REGION=eastus
PORT=3001
```
`server/.env` está en `.gitignore`: **nunca se sube al repositorio**.

## 4. Buenas prácticas
- Si la clave se filtra, en la misma pantalla pulsa **Regenerar clave 1**.
- Usa KEY 2 para rotar sin tiempo de caída.
- Revisa **Administración de costos** si usas S0.
- Al terminar la exposición, elimina el grupo de recursos para no generar cobros.

## 5. Verificación
```bash
npm run dev
curl http://localhost:3001/api/health      # {"ok":true}
curl http://localhost:3001/api/token       # {"token":"...","region":"eastus"}
```
Si `/api/token` responde "Revisa la clave y la región de Azure", la clave o la región no coinciden con el recurso.
