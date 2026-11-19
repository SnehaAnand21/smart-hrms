const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 1000,
    },
    cuisine: {
      type: [String],
      required: [true, 'At least one cuisine is required'],
      index: true,
    },
    address: {
      street: { type: String, default: '' },
      area: { type: String, required: true },
      city: { type: String, required: true, default: 'Chennai' },
      state: { type: String, default: 'Tamil Nadu' },
      postalCode: { type: String, default: '600089' },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [80.1784, 13.0334], // Near Ramapuram, Chennai default
      },
    },
    openingHours: {
      open: { type: String, default: '11:00' },
      close: { type: String, default: '23:00' },
      days: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1.0,
      max: 5.0,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 128,
    },
    priceRange: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$',
    },
    contactPhone: {
      type: String,
      default: '+91 98401 23456',
    },
    features: {
      type: [String],
      default: ['Valet Parking', 'WiFi', 'Air Conditioned', 'Live Music'],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for geographic location queries
restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ name: 'text', description: 'text', 'address.area': 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
