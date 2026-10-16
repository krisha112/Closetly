
const express = require("express");
const router = express.Router();

const {
  createOutfit,
  getOutfits,
  getOutfitById,
  updateOutfit,
  deleteOutfit
} = require("../controllers/outfitController");

// Create an outfit
router.post("/", createOutfit);

// Get all outfits for a user
router.get("/", getOutfits);

// Get one outfit
router.get("/:id", getOutfitById);

// Update an outfit
router.patch("/:id", updateOutfit);

// Delete an outfit
router.delete("/:id", deleteOutfit);

module.exports = router;
