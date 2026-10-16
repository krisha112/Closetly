
const Outfit = require("../models/Outfit");

// Create a new outfit
const createOutfit = async (req, res) => {
  try {
    const { userId, name, clothingItems, occasion, scheduledFor } = req.body;

    if (!userId || !name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "userId and outfit name are required"
      });
    }

    const outfit = await Outfit.create({
      userId,
      name: name.trim(),
      clothingItems: clothingItems || [],
      occasion: occasion || "Everyday",
      scheduledFor: scheduledFor || null
    });

    return res.status(201).json({
      success: true,
      data: outfit
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all outfits for a user
const getOutfits = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const outfits = await Outfit.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: outfits.length,
      data: outfits
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get one outfit
const getOutfitById = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const outfit = await Outfit.findOne({
      _id: req.params.id,
      userId
    });

    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: "Outfit not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: outfit
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update an outfit
const updateOutfit = async (req, res) => {
  try {
    const { userId, name, clothingItems, occasion, isFavorite, scheduledFor } =
      req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (clothingItems !== undefined) updates.clothingItems = clothingItems;
    if (occasion !== undefined) updates.occasion = occasion;
    if (isFavorite !== undefined) updates.isFavorite = isFavorite;
    if (scheduledFor !== undefined) updates.scheduledFor = scheduledFor;

    const outfit = await Outfit.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: "Outfit not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: outfit
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete an outfit
const deleteOutfit = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const outfit = await Outfit.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: "Outfit not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Outfit deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOutfit,
  getOutfits,
  getOutfitById,
  updateOutfit,
  deleteOutfit
};
