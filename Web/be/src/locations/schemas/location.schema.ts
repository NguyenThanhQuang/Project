import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import slugify from 'slugify';

export enum LocationType {
  BUS_STATION = 'bus_station',
  COMPANY_OFFICE = 'company_office',
  PICKUP_POINT = 'pickup_point',
  REST_STOP = 'rest_stop',
  CITY = 'city',
  OTHER = 'other',
}

export type LocationDocument = HydratedDocument<Location>;

@Schema({ timestamps: true })
export class Location {
  @Prop({ type: String, required: true, trim: true, index: 'text' })
  name: string;

  @Prop({ type: String, trim: true, unique: true, sparse: true })
  slug: string;

  @Prop({ type: String, required: true, trim: true, index: true })
  province: string;

  @Prop({ type: String, trim: true })
  district?: string;

  @Prop({ type: String, required: true, trim: true })
  fullAddress: string;

  @Prop(
    raw({
      type: { type: String, enum: ['Point'], default: 'Point', required: true },
      coordinates: { type: [Number], required: true },
    }),
  )
  location: { type: 'Point'; coordinates: [number, number] };

  @Prop({ type: String, enum: Object.values(LocationType), required: true })
  type: LocationType;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.pre<LocationDocument>('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

LocationSchema.index({ location: '2dsphere' });
