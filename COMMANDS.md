# Comandos Útiles - Control Diesel

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (con hot reload)
npm run dev

# Compilar para producción
npm run build

# Ejecutar versión de producción localmente
npm run start

# Verificar linting
npm run lint
```

## Base de Datos

### Ver datos en MongoDB Atlas
1. Ve a [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Click en "Browse Collections"
3. Verás tus colecciones: `logs` y `tankconfigs`

### Resetear base de datos
Simplemente elimina las colecciones desde MongoDB Atlas, la app las recreará automáticamente con valores por defecto.

## Git (Control de Versiones)

```bash
# Inicializar repositorio
git init

# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Descripción de cambios"

# Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/control-diesel.git

# Subir cambios
git push -u origin main
```

## Vercel (Despliegue)

```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Desplegar desde terminal
vercel

# Desplegar a producción
vercel --prod
```

## PWA

Los archivos de Service Worker se generan automáticamente en `/public/`:
- `sw.js` - Service Worker principal
- `workbox-*.js` - Librerías de Workbox

**No edites estos archivos manualmente**, se regeneran en cada build.

## Logs y Debugging

### Ver logs en desarrollo
Los errores aparecen en:
- Terminal donde corriste `npm run dev`
- Consola del navegador (F12)

### Ver logs en producción (Vercel)
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Click en el deployment
3. Tab "Functions" → Ver logs de las API routes

## Testing Local de PWA

PWA solo funciona en producción. Para probar:

```bash
# 1. Compilar
npm run build

# 2. Ejecutar
npm run start

# 3. Abrir en navegador
# http://localhost:3000
```

En Chrome:
- F12 → Tab "Application" → "Service Workers"
- Aquí puedes ver el estado del Service Worker

## Variables de Entorno

### Desarrollo Local
Edita `.env.local`

### Producción (Vercel)
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade/edita variables
4. Redeploy para aplicar cambios

## Mantenimiento

### Actualizar dependencias
```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar (cuidado con breaking changes)
npm update

# Actualizar Next.js
npm install next@latest react@latest react-dom@latest
```

### Limpiar cache
```bash
# Limpiar .next y node_modules
rm -rf .next node_modules

# Reinstalar
npm install
```

## Iconos y Assets

### Generar nuevos iconos PWA
1. Crea un logo cuadrado de 512x512px
2. Usa [https://realfavicongenerator.net/](https://realfavicongenerator.net/)
3. Descarga y reemplaza en `/public/`

### Optimizar imágenes
Next.js optimiza automáticamente con el componente `<Image>`.

## API Testing

### Con curl (terminal)
```bash
# GET config
curl http://localhost:3000/api/config

# POST nuevo log
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"litros":100,"maquina":"Tractor Test","tarea":"Prueba"}'

# DELETE log
curl -X DELETE "http://localhost:3000/api/logs?id=ID_DEL_LOG"
```

### Con Postman o Thunder Client (VS Code)
Importa las siguientes rutas:
- GET `http://localhost:3000/api/config`
- PUT `http://localhost:3000/api/config`
- POST `http://localhost:3000/api/config`
- GET `http://localhost:3000/api/logs`
- POST `http://localhost:3000/api/logs`
- DELETE `http://localhost:3000/api/logs?id=ID`

## Solución Rápida de Problemas

```bash
# Error: Module not found
rm -rf node_modules package-lock.json .next
npm install

# Error: Port 3000 in use
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Error de tipos TypeScript
# Regenerar tipos de Next.js
rm -rf .next
npm run dev

# MongoDB connection issues
# Verifica .env.local existe y tiene MONGODB_URI correcto
```

## Performance

### Analizar bundle size
```bash
npm run build

# Mira el output, especialmente:
# - First Load JS
# - Page sizes
```

### Lighthouse (Performance, PWA Score)
1. Abre la app en Chrome
2. F12 → Tab "Lighthouse"
3. Click "Generate report"
4. Objetivo: 90+ en todas las categorías

## Backup

### Exportar datos de MongoDB
En MongoDB Atlas:
1. Clusters → ... → Command Line Tools
2. mongodump o usar MongoDB Compass

### Código
Tu código en GitHub es tu backup automático.

## Shortcuts Útiles en VS Code

- `Ctrl + P` - Buscar archivo
- `Ctrl + Shift + F` - Buscar en todo el proyecto
- `F5` - Debugger (si está configurado)
- `Ctrl + ` ` - Terminal

---

**Guardar este archivo como referencia rápida** 🚀
