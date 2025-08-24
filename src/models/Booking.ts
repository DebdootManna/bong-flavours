import mongoose from 'mongoose'

export interface IBooking extends mongoose.Document {
  name: string
  email: string
  phone: string
  date: Date
  time: string
  numPersons: number
  status: 'requested' | 'confirmed' | 'cancelled' | 'completed'
  tableNumber?: string
  notes?: string
  reminderSent?: boolean
  createdAt: Date
  updatedAt: Date
}

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required'],
    validate: {
      validator: function(value: Date) {
        return value >= new Date()
      },
      message: 'Booking date cannot be in the past'
    },
    index: true
  },
  time: {
    type: String,
    required: [true, 'Booking time is required'],
    trim: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  numPersons: {
    type: Number,
    required: [true, 'Number of persons is required'],
    min: [1, 'Number of persons must be at least 1'],
    max: [20, 'Number of persons cannot exceed 20']
  },
  status: {
    type: String,
    enum: ['requested', 'confirmed', 'cancelled', 'completed'],
    default: 'requested',
    index: true
  },
  tableNumber: {
    type: String,
    trim: true,
    sparse: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

bookingSchema.index({ date: 1, time: 1 })
bookingSchema.index({ status: 1, date: 1 })
bookingSchema.index({ email: 1 })

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema)
