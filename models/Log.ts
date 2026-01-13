import mongoose, { Schema, model, models } from 'mongoose';

export interface ILog {
  _id?: string;
  fecha: Date;
  litros: number;
  maquina: string;
  tarea: string;
}

const LogSchema = new Schema<ILog>({
  fecha: {
    type: Date,
    default: Date.now,
    required: true
  },
  litros: {
    type: Number,
    required: true,
    min: 0
  },
  maquina: {
    type: String,
    required: true,
    trim: true
  },
  tarea: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Log = models.Log || model<ILog>('Log', LogSchema);

export default Log;
