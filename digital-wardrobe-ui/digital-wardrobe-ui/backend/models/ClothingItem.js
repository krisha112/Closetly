const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Clothing name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    color: {
      type: String,
      default: '',
      trim: true,
    },
    brand: {
      type: String,
      default: '',
      trim: true,
    },
    season: {
      type: String,
      default: '',
      trim: true,
    },
    occasion: {
      type: String,
      default: '',
      trim: true,
    },
    size: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
