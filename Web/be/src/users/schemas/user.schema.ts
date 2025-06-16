import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument, Types } from 'mongoose';

export enum UserRole {
  USER = 'user',
  COMPANY_ADMIN = 'company_admin',
  ADMIN = 'admin',
}

export type SanitizedUser = Omit<
  User,
  | 'passwordHash'
  | 'emailVerificationToken'
  | 'emailVerificationExpires'
  | 'passwordResetToken'
  | 'passwordResetExpires'
  | '__v'
>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  phone: string;

  @Prop({ type: String, required: true, select: false })
  passwordHash: string;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  companyId?: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({
    type: String,
    select: false,
    index: true,
    unique: true,
    sparse: true,
  })
  emailVerificationToken?: string;

  @Prop({ type: Date, select: false })
  emailVerificationExpires?: Date;

  // Các trường cho reset password
  @Prop({
    type: String,
    select: false,
    index: true,
    unique: true,
    sparse: true,
  })
  passwordResetToken?: string;

  @Prop({ type: Date, select: false })
  passwordResetExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export type UserDocument = HydratedDocument<User> & {
  comparePassword: (password: string) => Promise<boolean>;
};
