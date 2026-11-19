const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
      index: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'Table ID is required'],
      index: true,
    },
    bookingDate: {
      type: String, // 'YYYY-MM-DD' formatted for clean date equality comparisons
      required: [true, 'Booking date is required'],
      index: true,
    },
    startTime: {
      type: String, // 'HH:MM' 24-hr format (e.g. '19:00')
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // 'HH:MM' 24-hr format (e.g. '20:30')
      required: [true, 'End time is required'],
    },
    durationMinutes: {
      type: Number,
      default: 90,
    },
    partySize: {
      type: Number,
      required: [true, 'Party size is required'],
      min: [1, 'Party size must be at least 1'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
    customerName: {
      type: String,
      default: '',
    },
    customerPhone: {
      type: String,
      default: '',
    },
    specialRequests: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ restaurantId: 1, bookingDate: 1, status: 1 });
bookingSchema.index({ tableId: 1, bookingDate: 1, startTime: 1, status: 1 });
bookingSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
