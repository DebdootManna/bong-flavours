import mongoose from 'mongoose'

export interface IMenuItem extends mongoose.Document {
  name: string
  category: string
  price: number
  veg: boolean
  variants?: Array<{
    name: string
    price: number
  }>
  description?: string
  image?: string
  available: boolean
  ingredients?: string[]
  allergens?: string[]
  spiceLevel?: 'mild' | 'medium' | 'spicy' | 'very-spicy'
  preparationTime?: number // in minutes
  createdAt: Date
  updatedAt: Date
}

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [200, 'Item name cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: false,
    min: [0, 'Price cannot be negative']
  },
  veg: {
    type: Boolean,
    required: [true, 'Vegetarian status is required'],
    index: true
  },
  variants: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Variant price cannot be negative']
    }
  }],
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    trim: true
  },
  available: {
    type: Boolean,
    default: true,
    index: true
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'spicy', 'very-spicy'],
    default: 'medium'
  },
  preparationTime: {
    type: Number,
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [180, 'Preparation time cannot exceed 180 minutes']
  }
}, {
  timestamps: true
})

menuItemSchema.index({ category: 1, available: 1 })
menuItemSchema.index({ veg: 1, available: 1 })
menuItemSchema.index({ name: 'text', description: 'text' })

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', menuItemSchema)
