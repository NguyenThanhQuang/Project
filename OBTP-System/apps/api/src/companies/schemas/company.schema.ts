import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CompanyStatus } from '@obtp/shared-types';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: CompanyStatus.PENDING })
  status: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.virtual('id').get(function () {
  return this._id.toHexString();
});