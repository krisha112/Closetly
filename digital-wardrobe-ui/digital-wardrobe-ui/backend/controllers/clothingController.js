const ClothingItem = require('../models/ClothingItem');

// Get all clothing items
const getClothingItems = async (req, res) => {
  try {
    const items = await ClothingItem.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clothing items',
      error: error.message,
    });
  }
};

// Get one clothing item
const getClothingItem = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Clothing item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid clothing item ID',
    });
  }
};

// Add a clothing item
const createClothingItem = async (req, res) => {
  try {
    const item = await ClothingItem.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Clothing item added successfully',
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add clothing item',
      error: error.message,
    });
  }
};

// Update a clothing item
const updateClothingItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Clothing item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Clothing item updated successfully',
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update clothing item',
      error: error.message,
    });
  }
};

// Delete a clothing item
const deleteClothingItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Clothing item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Clothing item deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete clothing item',
      error: error.message,
    });
  }
};

module.exports = {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
};
