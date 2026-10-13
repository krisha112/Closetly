const express = require('express');

const {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
} = require('../controllers/clothingController');

const router = express.Router();

// GET all clothing items
router.get('/', getClothingItems);

// GET one clothing item
router.get('/:id', getClothingItem);

// POST a new clothing item
router.post('/', createClothingItem);

// PUT to update a clothing item
router.put('/:id', updateClothingItem);

// DELETE a clothing item
router.delete('/:id', deleteClothingItem);

module.exports = router;
