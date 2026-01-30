
import mongoose, { Schema, Document } from 'mongoose';

export interface IBusRoute extends Document {
  routeNumber: string;
  origin: string;
  destination: string;
  color: string;
  stops: string[];
}

const BusRouteSchema: Schema = new Schema({
  routeNumber: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  color: { type: String, default: '#2563eb' },
  stops: [{ type: String }],
});

export default mongoose.model<IBusRoute>('BusRoute', BusRouteSchema);
