# Control Diesel - PWA Project

Sistema de gestión de combustible para maquinaria agrícola.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- Lucide React Icons
- PWA Support

## Features
- Vista principal mobile-first para operarios
- Panel de administración con historial y configuración
- PWA instalable
- Gestión de tanque de diesel en tiempo real
- API Routes para logs y configuración
- Base de datos MongoDB Atlas

## Project Structure
- `/app` - Next.js App Router pages and API routes
- `/lib` - Database connection utilities
- `/models` - Mongoose models (Log, TankConfig)
- `/public` - Static assets and PWA manifest

## Status: ✅ Completado

## Setup Required
1. Configure MongoDB Atlas connection string in `.env.local`
2. See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions

## Development
```bash
npm install
npm run dev  # http://localhost:3000
```

## Deployment
- Platform: Vercel (recommended)
- See [README.md](README.md) for deployment instructions
