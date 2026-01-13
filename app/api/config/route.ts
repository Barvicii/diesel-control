import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TankConfig from '@/models/TankConfig';

// GET - Obtener configuración del tanque
export async function GET() {
  try {
    await dbConnect();
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

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('Error getting configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Error getting configuration' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar configuración del tanque
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { capacidadTotal, litrosActuales, listaMaquinas, listaTareas } = body;

    let config = await TankConfig.findOne();

    if (!config) {
      // Crear si no existe
      config = await TankConfig.create(body);
    } else {
      // Actualizar campos proporcionados
      if (capacidadTotal !== undefined) config.capacidadTotal = capacidadTotal;
      if (litrosActuales !== undefined) config.litrosActuales = litrosActuales;
      if (listaMaquinas !== undefined) config.listaMaquinas = listaMaquinas;
      if (listaTareas !== undefined) config.listaTareas = listaTareas;
      
      await config.save();
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('Error updating configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Error updating configuration' },
      { status: 500 }
    );
  }
}

// POST - Resetear tanque o añadir combustible
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { action, litros } = body;

    let config = await TankConfig.findOne();
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Configuration not found' },
        { status: 404 }
      );
    }

    if (action === 'reset') {
      // Resetear el tanque a capacidad total
      config.litrosActuales = config.capacidadTotal;
    } else if (action === 'add' && litros) {
      // Añadir litros específicos
      config.litrosActuales = Math.min(
        config.litrosActuales + litros,
        config.capacidadTotal
      );
    }

    await config.save();

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('Error resetting tank:', error);
    return NextResponse.json(
      { success: false, error: 'Error resetting tank' },
      { status: 500 }
    );
  }
}
