
const express = require('express');
const router = express.Router();
const Outfit = require('../models/outfit');

// GET all outfits for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'test-user-1';

    const outfits = await Outfit.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: outfits.length,
      data: outfits,
    });
  } catch (error) {
    console.error('Get outfits error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve outfits.',
    });
  }
});

// POST save a new outfit
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      name,
      occasion,
      description,
      bodyShape,
      view,
      clothingItems,
    } = req.body;

    if (!clothingItems || clothingItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Select at least one clothing item.',
      });
    }

    const outfit = await Outfit.create({
      userId: userId || 'test-user-1',
      name: name || 'My Outfit',
      occasion: occasion || 'Custom',
      description: description || '',
      bodyShape: bodyShape || 'hourglass',
      view: view || 'front',
      clothingItems,
    });

    res.status(201).json({
      success: true,
      message: 'Outfit saved successfully.',
      data: outfit,
    });
  } catch (error) {
    console.error('Save outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not save outfit.',
    });
  }
});


/* Update an outfit's favourite status */
router.patch('/:id/favorite', async (req, res) => {
  try {
    const { isFavorite } = req.body;

    if (typeof isFavorite !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isFavorite must be true or false.',
      });
    }

    const outfit = await Outfit.findByIdAndUpdate(
      req.params.id,
      { isFavorite },
      { new: true, runValidators: true }
    );

    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Favorite status updated.',
      data: outfit,
    });
  } catch (error) {
    console.error('Update favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not update favorite status.',
    });
  }
});

// DELETE an outfit
router.delete('/:id', async (req, res) => {
  try {
    const outfit = await Outfit.findByIdAndDelete(req.params.id);

    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Outfit deleted successfully.',
      data: outfit,
    });
  } catch (error) {
    console.error('Delete outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not delete outfit.',
    });
  }
});

module.exports = router;
