const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
      index: true,
    },
    tableNumber: {
      type: String,
      required: [true, 'Table number/label is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Table capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [24, 'Capacity cannot exceed 24'],
    },
    status: {
      type: String,
      enum: ['available', 'held', 'occupied', 'reserved'],
      default: 'available',
      required: true,
      index: true,
    },
    floor: {
      type: String,
      default: 'Main Dining',
      trim: true,
    },
    position: {
      x: { type: Number, default: 20 }, // percentage 0 - 100 for visual canvas
      y: { type: Number, default: 20 },
      shape: { type: String, enum: ['square', 'rect', 'round'], default: 'square' },
      width: { type: Number, default: 60 },
      height: { type: Number, default: 60 },
    },
    currentOccupant: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      partySize: { type: Number, default: null },
      seatedAt: { type: Date, default: null },
      expectedEnd: { type: Date, default: null },
      bookingReference: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
tableSchema.index({ restaurantId: 1, status: 1 });
tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });
tableSchema.index({ restaurantId: 1, capacity: 1 });

module.exports = mongoose.model('Table', tableSchema);
