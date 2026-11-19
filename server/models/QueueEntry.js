const mongoose = require('mongoose');

const queueEntrySchema = new mongoose.Schema(
  {
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
    partySize: {
      type: Number,
      required: [true, 'Party size is required'],
      min: [1, 'Party size must be at least 1'],
    },
    queuePosition: {
      type: Number,
      required: true,
      min: 1,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    estimatedWaitMinutes: {
      type: Number,
      default: 15,
      min: 0,
    },
    status: {
      type: String,
      enum: ['waiting', 'notified', 'seated', 'cancelled'],
      default: 'waiting',
      index: true,
    },
    assignedTableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      default: null,
    },
    customerName: {
      type: String,
      default: '',
    },
    customerPhone: {
      type: String,
      default: '',
    },
    notifiedAt: {
      type: Date,
      default: null,
    },
    seatedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

queueEntrySchema.index({ restaurantId: 1, status: 1, queuePosition: 1 });
queueEntrySchema.index({ userId: 1, restaurantId: 1, status: 1 });

module.exports = mongoose.model('QueueEntry', queueEntrySchema);
