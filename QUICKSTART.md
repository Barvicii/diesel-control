# Guía de Inicio Rápido - Control Diesel

## 🚀 Configuración Inicial (5 minutos)

### 1. Configurar MongoDB Atlas (Base de Datos)

1. Ve a [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Crea una cuenta gratuita (no necesitas tarjeta de crédito)
3. Crea un nuevo proyecto llamado "Control Diesel"
4. Click en "Build a Database" → Selecciona "FREE" (M0)
5. Selecciona una región cercana (ej: AWS / São Paulo)
6. Click "Create"

**Configurar Acceso:**
- En "Security Quickstart":
  - Username: `admin`
  - Password: (copia y guarda esta contraseña)
  - Click "Create User"
  
- En "Where would you like to connect from?":
  - Click "Add My Current IP Address"
  - O añade `0.0.0.0/0` para permitir todo (solo para desarrollo)
  - Click "Finish and Close"

**Obtener Connection String:**
1. Click en "Connect" → "Drivers"
2. Copia el string que se ve así:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Reemplaza `<password>` con tu contraseña real

### 2. Configurar el Proyecto

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza la línea `MONGODB_URI` con tu connection string:
   ```env
   MONGODB_URI=mongodb+srv://admin:tuContraseña@cluster0.xxxxx.mongodb.net/control-diesel?retryWrites=true&w=majority
   ```
   
   ⚠️ **IMPORTANTE**: Asegúrate de que después de `mongodb.net/` diga `control-diesel` (es el nombre de la base de datos)

### 3. Instalar y Ejecutar

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📱 Primer Uso

### Vista Principal (Operarios - Escanear QR)

1. Al abrir la app, verás inmediatamente:
   - **Litros disponibles en grande**: Número destacado con el combustible actual
   - Barra de progreso visual del nivel
   - Alerta si el nivel está bajo

2. Para registrar una carga:
   - Ingresa los **litros** cargados (ej: 150)
   - Selecciona la **máquina** del dropdown
   - Si la máquina no está en la lista, selecciona "Otra / Custom"
   - Ingresa la **tarea** (con autocompletado)
   - Click "Registrar Carga"

3. **Importante**: Los operarios NO pueden recargar el tanque desde esta vista, solo registrar consumo.

### Panel Admin (Versión Web)

1. Ve a [http://localhost:3000/admin](http://localhost:3000/admin)
2. Verás dos pestañas:
   - **Historial**: Todos los registros con opción de eliminar
   - **Configuración**: Gestionar tanque, máquinas y tareas

**Recargar el Tanque (Solo desde Admin):**
- **Llenar Tanque Completo**: Cuando se recarga todo el tanque
- **Añadir Cantidad Específica**: Cuando se añade una cantidad parcial (ej: 2000 litros)

**Gestionar Listas:**
- Añade nuevas máquinas o tareas
- Elimina las que ya no uses

## 🚀 Desplegar en Vercel (Gratis)

### Preparar el Código

1. Crea un repositorio en GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Control Diesel PWA"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/control-diesel.git
   git push -u origin main
   ```

### Desplegar

1. Ve a [https://vercel.com/signup](https://vercel.com/signup)
2. Conecta con GitHub
3. Click "New Project" → Importa tu repositorio
4. En "Environment Variables" añade:
   - Name: `MONGODB_URI`
   - Value: (tu connection string de MongoDB)
5. Click "Deploy"

**¡Listo!** En 2 minutos tendrás tu app en línea.

Vercel te dará una URL como: `https://control-diesel.vercel.app`

### Instalar como PWA en Móvil

**Android:**
1. Abre la app en Chrome
2. Menú (⋮) → "Añadir a pantalla de inicio"
3. Ahora tendrás un icono como una app nativa

**iOS:**
1. Abre la app en Safari
2. Toca el botón "Compartir" (□↑)
3. Toca "Añadir a pantalla de inicio"

## 🔧 Personalización

### Cambiar Capacidad del Tanque

1. Ve a `/admin`
2. No hay UI directa para esto, pero puedes:
   - Usar MongoDB Compass o Atlas para editar el documento `TankConfig`
   - O modificar el default en [models/TankConfig.ts](models/TankConfig.ts)

### Cambiar Colores

Edita [tailwind.config.ts](tailwind.config.ts):
```typescript
colors: {
  primary: {
    // Cambia estos valores
    600: '#TU_COLOR',
    700: '#TU_COLOR_OSCURO',
  }
}
```

### Cambiar Iconos PWA

Reemplaza los archivos en `/public/`:
- `icon-192x192.png`
- `icon-512x512.png`

(Usa una herramienta como [https://realfavicongenerator.net/](https://realfavicongenerator.net/))

## 🆘 Solución de Problemas

### "Cannot connect to MongoDB"

✅ Verifica que:
- El connection string en `.env.local` es correcto
- La contraseña no tiene caracteres especiales sin escapar
- Permitiste tu IP en MongoDB Atlas (Network Access)

### "Module not found"

```bash
# Borra node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### La app no actualiza los datos

- Verifica que MongoDB esté conectado
- Mira la consola del navegador (F12) para errores
- Verifica que `.env.local` existe y está configurado

## 📊 Estructura de URLs

- `/` - Vista principal (operarios)
- `/admin` - Panel de administración
- `/api/logs` - API para registros (GET, POST, DELETE)
- `/api/config` - API para configuración (GET, PUT, POST)

## 🔒 Seguridad para Producción

⚠️ **IMPORTANTE**: Este proyecto no tiene autenticación por defecto.

Para producción, considera:

1. **Proteger `/admin`** con contraseña:
   - Usa NextAuth.js
   - O implementa un simple password en variables de entorno

2. **CORS**: Configurar en las API routes

3. **Rate Limiting**: Para evitar spam

4. **HTTPS**: Vercel lo proporciona automáticamente

## 💡 Tips

- **Backup**: MongoDB Atlas hace backups automáticos en el plan gratuito
- **QR Code**: Genera un QR a tu URL para acceso rápido en campo
- **Offline**: La PWA funciona parcialmente offline (puede cachear la UI)
- **Actualizaciones**: Cada push a `main` despliega automáticamente en Vercel

## 📞 Soporte

¿Problemas? Abre un issue en GitHub o contacta al desarrollador.

---

**¡Disfruta de Control Diesel!** 🚜⛽
