import mongoose, { Schema, model, models } from 'mongoose';

export interface ITankConfig {
  _id?: string;
  capacidadTotal: number;
  litrosActuales: number;
  listaMaquinas: string[];
  listaTareas: string[];
}

const TankConfigSchema = new Schema<ITankConfig>({
  capacidadTotal: {
    type: Number,
    required: true,
    default: 2000,
    min: 0
  },
  litrosActuales: {
    type: Number,
    required: true,
    default: 2000,
    min: 0
  },
  listaMaquinas: {
    type: [String],
    default: [
      'John Deere 6420 Tractor',
      'New Holland TM150 Tractor',
      'Case IH MX135 Tractor',
      'John Deere 9870 STS Harvester',
      'Wheel Loader'
    ]
  },
  listaTareas: {
    type: [String],
    default: [
      'Plowing',
      'Seeding',
      'Spraying',
      'Harvesting',
      'Harrowing',
      'Transport',
      'Material Loading'
    ]
  }
}, {
  timestamps: true
});

const TankConfig = models.TankConfig || model<ITankConfig>('TankConfig', TankConfigSchema);

export default TankConfig;
