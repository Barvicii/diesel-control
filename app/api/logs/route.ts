import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Log from '@/models/Log';
import TankConfig from '@/models/TankConfig';

// GET - Obtener todos los logs
export async function GET() {
  try {
    await dbConnect();
    const logs = await Log.find({}).sort({ fecha: -1 }).limit(100);
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error getting logs:', error);
    return NextResponse.json(
      { success: false, error: 'Error getting logs' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo log y actualizar el tanque
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { litros, maquina, tarea } = body;

    // Validar datos
    if (!litros || !maquina || !tarea) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      );
    }

    if (litros <= 0) {
      return NextResponse.json(
        { success: false, error: 'Liters must be greater than 0' },
        { status: 400 }
      );
    }

    // Obtener configuración del tanque
    let config = await TankConfig.findOne();
    
    // Si no existe configuración, crear una por defecto
    if (!config) {
      config = await TankConfig.create({
        capacidadTotal: 2000,
        litrosActuales: 2000,
        listaMaquinas: [
          'John Deere 6420 Tractor',
          'New Holland TM150 Tractor',
          'Case IH MX135 Tractor',
          'John Deere 9870 STS Combine',
          'Wheel Loader'
        ],
        listaTareas: [
          'Plowing',
          'Seeding',
          'Spraying',
          'Harvesting',
          'Harrowing',
          'Transportation',
          'Material Loading'
        ]
      });
    }

    // Verificar si hay suficiente combustible
    if (config.litrosActuales < litros) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Not enough fuel in tank',
          litrosDisponibles: config.litrosActuales 
        },
        { status: 400 }
      );
    }

    // Crear el log
    const log = await Log.create({
      litros,
      maquina,
      tarea,
      fecha: new Date()
    });

    // Actualizar litros actuales del tanque
    config.litrosActuales -= litros;
    await config.save();

    return NextResponse.json({ 
      success: true, 
      data: log,
      litrosRestantes: config.litrosActuales 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json(
      { success: false, error: 'Error creating log' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un log específico
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID not provided' },
        { status: 400 }
      );
    }

    const log = await Log.findByIdAndDelete(id);

    if (!log) {
      return NextResponse.json(
        { success: false, error: 'Log not found' },
        { status: 404 }
      );
    }

    // Devolver los litros al tanque
    const config = await TankConfig.findOne();
    if (config) {
      config.litrosActuales += log.litros;
      await config.save();
    }

    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error('Error deleting log:', error);
    return NextResponse.json(
      { success: false, error: 'Error deleting log' },
      { status: 500 }
    );
  }
}
