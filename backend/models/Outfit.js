
const mongoose = require("mongoose");

const outfitSchema = new mongoose.Schema(
  {
    // The user who owns this outfit
    userId: {
      type: String,
      required: true,
      index: true
    },

    // Name given to the outfit
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    // Clothing item IDs selected for this outfit
    clothingItems: [
  {
    id: String,
    name: String,
    image: String,
  },
],

    // Optional occasion, such as Casual, Party, or Office
    occasion: {
      type: String,
      trim: true,
      default: "Everyday"
    },

    // Whether the outfit is a favorite
    isFavorite: {
      type: Boolean,
      default: false
    },

    // Optional date for scheduling the outfit
    scheduledFor: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

outfitSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Outfit", outfitSchema);
