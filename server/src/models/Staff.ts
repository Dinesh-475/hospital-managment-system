import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStaff extends Document {
  userId: Types.ObjectId;
  employeeId: string;
  department: string;
  position: string;
  specialization?: string;
  qualification?: string;
  experience?: number;
  joinDate: Date;
  salary?: number;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: { 
    type: String, 
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  department: { 
    type: String, 
    required: true 
  },
  position: { 
    type: String, 
    required: true 
  },
  specialization: { 
    type: String 
  },
  qualification: { 
    type: String 
  },
  experience: { 
    type: Number,
    min: 0
  },
  joinDate: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  salary: { 
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
StaffSchema.index({ employeeId: 1 });
StaffSchema.index({ userId: 1 });
StaffSchema.index({ department: 1 });

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema);
