
const express = require('express');
const router = express.Router();
const ClothingItem = require('../models/ClothingItem');
const Outfit = require('../models/Outfit');

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const [
      totalClothes,
      favoriteClothes,
      totalOutfits,
      favoriteOutfits,
      recentClothes
    ] = await Promise.all([
      ClothingItem.countDocuments(),
      ClothingItem.countDocuments({ isFavorite: true }),
      Outfit.countDocuments(),
      Outfit.countDocuments({ isFavorite: true }),
      ClothingItem.find()
        .sort({ createdAt: -1 })
        .limit(4)
        .lean()
    ]);

    res.status(200).json({
      success: true,
      totalClothes,
      totalOutfits,
      favoriteOutfits,
      recentClothes
    });
  } catch (error) {
    console.error('Dashboard API error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
      error: error.message
    });
  }
});

module.exports = router;
