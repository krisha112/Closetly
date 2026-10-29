
const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'test-user-1',
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'My Outfit',
    },
    occasion: {
      type: String,
      default: 'Custom',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    bodyShape: {
      type: String,
      default: 'hourglass',
    },
    view: {
      type: String,
      default: 'front',
    },
    clothingItems: [
      {
        id: String,
        _id: String,
        name: String,
        category: String,
        image: String,
        color: String,
        brand: String,
      },
    ],
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Outfit', outfitSchema);
