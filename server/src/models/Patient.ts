import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPatient extends Document {
  userId: Types.ObjectId;
  dateOfBirth: Date;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true
  },
  dateOfBirth: { 
    type: Date,
    required: true
  },
  gender: { 
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER']
  },
  bloodGroup: { 
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  address: { 
    type: String 
  },
  emergencyContact: { 
    type: String 
  },
  medicalHistory: { 
    type: String 
  },
  allergies: { 
    type: String 
  }
}, {
  timestamps: true
});

// Indexes
PatientSchema.index({ userId: 1 });

export const Patient = mongoose.model<IPatient>('Patient', PatientSchema);
