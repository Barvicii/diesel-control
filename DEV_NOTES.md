# Notas de Desarrollo - Control Diesel

## URLs de la Aplicación

### Local
- Vista Principal: http://localhost:3000
- Panel Admin: http://localhost:3000/admin
- API Config: http://localhost:3000/api/config
- API Logs: http://localhost:3000/api/logs

### Producción (después de deploy)
- Actualizar con tu URL de Vercel

## Variables de Entorno

### Desarrollo (.env.local)
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/control-diesel?retryWrites=true&w=majority
```

### Producción (Vercel)
Configurar en Vercel Dashboard → Settings → Environment Variables

## Datos de Ejemplo para Testing

### Registrar Carga (POST /api/logs)
```json
{
  "litros": 150,
  "maquina": "Tractor John Deere 6420",
  "tarea": "Arado"
}
```

### Actualizar Config (PUT /api/config)
```json
{
  "capacidadTotal": 6000,
  "litrosActuales": 4500,
  "listaMaquinas": [
    "Tractor John Deere 6420",
    "Tractor New Holland TM150",
    "Nueva Máquina"
  ],
  "listaTareas": [
    "Arado",
    "Siembra",
    "Nueva Tarea"
  ]
}
```

### Resetear Tanque (POST /api/config)
```json
{
  "action": "reset"
}
```

### Añadir Litros (POST /api/config)
```json
{
  "action": "add",
  "litros": 2000
}
```

## Testing con curl

```bash
# Ver configuración actual
curl http://localhost:3000/api/config

# Registrar nueva carga
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"litros":100,"maquina":"Tractor Test","tarea":"Prueba"}'

# Ver todos los logs
curl http://localhost:3000/api/logs

# Resetear tanque
curl -X POST http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{"action":"reset"}'

# Añadir 1000 litros
curl -X POST http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{"action":"add","litros":1000}'
```

## MongoDB Queries Útiles

### Ver todos los logs (MongoDB Compass o Atlas Shell)
```javascript
db.logs.find().sort({ fecha: -1 })
```

### Ver configuración
```javascript
db.tankconfigs.findOne()
```

### Eliminar todos los logs
```javascript
db.logs.deleteMany({})
```

### Resetear configuración
```javascript
db.tankconfigs.deleteMany({})
// La app recreará con defaults al próximo request
```

### Actualizar capacidad directamente
```javascript
db.tankconfigs.updateOne(
  {},
  { $set: { capacidadTotal: 6000, litrosActuales: 6000 } }
)
```

## Estructura de Datos en MongoDB

### Collection: logs
```javascript
{
  _id: ObjectId("..."),
  fecha: ISODate("2026-01-13T10:30:00.000Z"),
  litros: 150,
  maquina: "Tractor John Deere 6420",
  tarea: "Arado",
  createdAt: ISODate("2026-01-13T10:30:00.000Z"),
  updatedAt: ISODate("2026-01-13T10:30:00.000Z")
}
```

### Collection: tankconfigs
```javascript
{
  _id: ObjectId("..."),
  capacidadTotal: 5000,
  litrosActuales: 3500,
  listaMaquinas: [
    "Tractor John Deere 6420",
    "Tractor New Holland TM150",
    // ...
  ],
  listaTareas: [
    "Arado",
    "Siembra",
    // ...
  ],
  createdAt: ISODate("2026-01-13T10:00:00.000Z"),
  updatedAt: ISODate("2026-01-13T10:30:00.000Z")
}
```

## Personalización Común

### 1. Cambiar Logo/Iconos
Reemplazar archivos en `/public/`:
- `icon-192x192.png`
- `icon-512x512.png`

Actualizar `manifest.json` si es necesario.

### 2. Cambiar Nombre de la App
Archivos a editar:
- `package.json` → "name"
- `app/layout.tsx` → metadata title
- `public/manifest.json` → "name" y "short_name"

### 3. Agregar Autenticación Simple
Ejemplo con password básico en admin:

```typescript
// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // En producción, usar variables de entorno
    if (password === 'admin123') {
      setAuthenticated(true);
      localStorage.setItem('admin-auth', 'true');
    }
  };

  useEffect(() => {
    setAuthenticated(localStorage.getItem('admin-auth') === 'true');
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-xl mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-primary-600 text-white py-3 rounded-xl"
          >
            Ingresar
          </button>
        </div>
      </div>
    );
  }

  // Resto del código de AdminPage...
}
```

### 4. Añadir Campo Extra (ej: "Operador")

#### En el modelo (models/Log.ts):
```typescript
operador: {
  type: String,
  required: false,
  trim: true
}
```

#### En la API (app/api/logs/route.ts):
```typescript
const { litros, maquina, tarea, operador } = body;

const log = await Log.create({
  litros,
  maquina,
  tarea,
  operador, // nuevo campo
  fecha: new Date()
});
```

#### En el formulario (app/page.tsx):
```typescript
const [operador, setOperador] = useState<string>('');

// En el formulario:
<input
  type="text"
  value={operador}
  onChange={(e) => setOperador(e.target.value)}
  placeholder="Nombre del operador"
  className="..."
/>

// Al enviar:
body: JSON.stringify({
  litros: parseFloat(litros),
  maquina: maquinaFinal,
  tarea,
  operador // incluir en el body
}),
```

## Problemas Conocidos y Soluciones

### "Module not found" después de npm install
```bash
rm -rf node_modules .next
npm install
```

### PWA no se actualiza
El Service Worker cachea agresivamente. Para forzar actualización:
1. DevTools → Application → Service Workers → "Unregister"
2. Hard refresh (Ctrl+Shift+R)

### MongoDB timeout en Vercel
Vercel tiene límite de tiempo en funciones serverless (10s en plan free).
Si tienes muchos logs, considera:
- Paginación en la API
- Índices en MongoDB
- Límite en la query (ya implementado: `.limit(100)`)

### Errores de CORS
Si consumes la API desde otro dominio, añade en las API routes:

```typescript
export async function GET(request: NextRequest) {
  const response = NextResponse.json({ ... });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  return response;
}
```

## Métricas y Monitoreo

### Vercel Analytics (gratis)
1. Ve a tu proyecto en Vercel
2. Tab "Analytics"
3. Ver visitas, performance, etc.

### MongoDB Atlas Monitoring
1. En tu cluster → Tab "Metrics"
2. Ver operaciones, conexiones, storage

## Backup Strategy

### Código
- GitHub (automático con commits)
- Vercel (cada deployment)

### Base de Datos
- MongoDB Atlas hace snapshots automáticos (plan gratuito: retención limitada)
- Para backup manual: MongoDB Compass → Export collection

## Roadmap de Mejoras Futuras

- [ ] Autenticación de usuarios
- [ ] Roles (admin, operador)
- [ ] Reportes PDF
- [ ] Gráficos de consumo
- [ ] Notificaciones push cuando nivel bajo
- [ ] Modo offline completo
- [ ] Múltiples tanques
- [ ] Exportar datos a Excel
- [ ] QR code generator para acceso rápido
- [ ] Dark mode

## Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Vercel Docs](https://vercel.com/docs)
- [Lucide Icons](https://lucide.dev)

---

**Mantén este archivo actualizado con tus notas y cambios** 📝
