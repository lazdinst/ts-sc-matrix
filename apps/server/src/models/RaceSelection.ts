import mongoose, { Document, Model, Schema } from 'mongoose';

interface IRaceSelection extends Document {
  player: number;
  race: string;
  units: mongoose.Types.ObjectId[];
}

const raceSelectionSchema: Schema<IRaceSelection> = new Schema<IRaceSelection>({
  player: {
    type: Number,
    required: true,
  },
  race: {
    type: String,
    required: true,
    enum: ['protoss', 'zerg', 'terran'],
  },
  units: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
    },
  ],
});

const RaceSelection: Model<IRaceSelection> = mongoose.model<IRaceSelection>('RaceSelection', raceSelectionSchema);

export default RaceSelection;
