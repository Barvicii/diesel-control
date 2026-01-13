# Control Diesel - PWA

Sistema de gestión de combustible para maquinaria agrícola.

![Control Diesel](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![PWA](https://img.shields.io/badge/PWA-Ready-orange)

## 🚀 Características

- **PWA (Progressive Web App)**: Instalable en móviles y escritorio
- **Mobile-First**: Diseño optimizado para operarios en campo
- **Gestión de Tanque**: Control en tiempo real del nivel de combustible
- **Historial Completo**: Registro detallado de todas las cargas
- **Panel Admin**: Configuración y gestión centralizada
- **Base de Datos Cloud**: MongoDB Atlas para acceso desde cualquier lugar

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: MongoDB + Mongoose
- **Iconos**: Lucide React
- **PWA**: next-pwa

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd diesel-tank
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/control-diesel?retryWrites=true&w=majority
```

Reemplaza `username`, `password` y `cluster` con tus credenciales de MongoDB Atlas.

### Cómo obtener MongoDB Atlas URI:

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (gratis)
4. En "Database Access", crea un usuario con contraseña
5. En "Network Access", añade tu IP (o 0.0.0.0/0 para desarrollo)
6. Click en "Connect" → "Connect your application"
7. Copia la connection string y reemplaza `<password>`

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🚀 Despliegue en Vercel

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta con GitHub

2. **Importar proyecto**
   - Click en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente Next.js

3. **Configurar variables de entorno**
   - En la configuración del proyecto, añade:
     - `MONGODB_URI`: Tu connection string de MongoDB Atlas

4. **Desplegar**
   - Click en "Deploy"
   - ¡Listo! Tu app estará en línea

Cada push a `main` desplegará automáticamente.

## 📱 Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   ├── logs/route.ts      # API para registros
│   │   └── config/route.ts     # API para configuración
│   ├── admin/
│   │   └── page.tsx            # Panel de administración
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página de inicio (formulario)
│   └── globals.css             # Estilos globales
├── lib/
│   └── mongodb.ts              # Conexión a MongoDB
├── models/
│   ├── Log.ts                  # Modelo de registro
│   └── TankConfig.ts           # Modelo de configuración
├── public/
│   ├── manifest.json           # Manifest PWA
│   ├── icon-192x192.png        # Icono PWA
│   └── icon-512x512.png        # Icono PWA
└── ...config files
```

## 🎯 Uso

### Vista Principal (/)
Para operarios en campo (al escanear QR):
- **Ver litros disponibles**: Destacado en grande y claro al inicio
- Ver nivel actual del tanque con barra de progreso
- Registrar cargas de combustible
- Seleccionar máquina y tarea
- Opción de máquina personalizada
- Alerta visual si el nivel está bajo

### Panel Admin (/admin)
Para administradores (versión web):
- Ver historial completo de cargas
- Eliminar registros
- **Recargar el tanque**:
  - Llenar tanque completo (resetear a capacidad máxima)
  - Añadir cantidad específica de litros
- Gestionar lista de máquinas
- Gestionar lista de tareas

**Nota importante**: La recarga del tanque SOLO se puede hacer desde el panel de administración web.

## 📊 Modelos de Datos

### Log
```typescript
{
  fecha: Date,
  litros: Number,
  maquina: String,
  tarea: String
}
```

### TankConfig
```typescript
{
  capacidadTotal: Number,     // Default: 5000
  litrosActuales: Number,     // Default: 5000
  listaMaquinas: String[],    // Máquinas predefinidas
  listaTareas: String[]       // Tareas predefinidas
}
```

## 🔒 Seguridad

Para producción, considera:
- Implementar autenticación en `/admin`
- Validar permisos de usuarios
- Configurar CORS apropiadamente
- Usar variables de entorno seguras

## 🎨 Diseño

Estilo "Apple-like":
- Espacios en blanco generosos
- Sombras suaves
- Bordes redondeados (rounded-xl, 2xl)
- Colores: Azul primario (#0ea5e9)
- Tipografía: Inter (sans-serif)

## 📝 Licencia

MIT

## 👨‍💻 Autor

Desarrollado para gestión agrícola eficiente.

---

¿Preguntas o sugerencias? Abre un issue en GitHub.
