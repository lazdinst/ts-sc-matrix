import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUnit extends Document {
  race: 'protoss' | 'zerg' | 'terran';
  name: string;
  mins: number;
  gas: number;
  supply: number;
  type: string;
}

const unitSchema: Schema<IUnit> = new Schema<IUnit>({
  race: {
    type: String,
    required: true,
    enum: ['protoss', 'zerg', 'terran'],
  },
  name: {
    type: String,
    required: true,
  },
  mins: {
    type: Number,
    required: true,
  },
  gas: {
    type: Number,
    required: true,
  },
  supply: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Unit: Model<IUnit> = mongoose.model<IUnit>('Unit', unitSchema);

export default Unit;
