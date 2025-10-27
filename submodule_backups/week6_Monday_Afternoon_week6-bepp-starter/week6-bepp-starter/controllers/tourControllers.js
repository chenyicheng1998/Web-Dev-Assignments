const Tour = require("../models/tourModel");
const mongoose = require("mongoose");

// GET /tours
const getAllTours = async (req, res) => {
  try {
    const user_id = req.user._id;
    const tours = await Tour.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tours" });
  }
};

// POST /tours
const createTour = async (req, res) => {
  try {
    const user_id = req.user._id;

    const newTour = await Tour.create({ ...req.body, user_id });

    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: "Failed to create tour", error: error.message });
  }
};

// GET /tours/:tourId
const getTourById = async (req, res) => {
  const { tourId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return res.status(400).json({ error: "Invalid tour ID" });
  }

  try {
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Check if the tour belongs to the logged in user
    if (tour.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tour" });
  }
};

// PUT /tours/:tourId
const updateTour = async (req, res) => {
  const { tourId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return res.status(400).json({ error: "Invalid tour ID" });
  }

  try {
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Check if the tour belongs to the logged in user
    if (tour.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /tours/:tourId
const deleteTour = async (req, res) => {
  const { tourId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return res.status(400).json({ error: "Invalid tour ID" });
  }

  try {
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Check if the tour belongs to the logged in user
    if (tour.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    await Tour.findByIdAndDelete(tourId);
    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tour" });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
};
