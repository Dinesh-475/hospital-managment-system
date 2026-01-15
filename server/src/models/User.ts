import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  googleId?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  passwordHash?: string;
  role: 'PATIENT' | 'DOCTOR' | 'NURSE' | 'ADMIN' | 'RECEPTIONIST';
  isVerified: boolean;
  isActive: boolean;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  googleId: { 
    type: String, 
    sparse: true,
    unique: true 
  },
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  phoneNumber: { 
    type: String,
    sparse: true
  },
  passwordHash: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ['PATIENT', 'DOCTOR', 'NURSE', 'ADMIN', 'RECEPTIONIST'],
    required: true,
    default: 'PATIENT'
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  tokenVersion: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ phoneNumber: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
