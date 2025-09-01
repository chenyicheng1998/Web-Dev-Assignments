const Tour = require("./tourLib");

// GET /tours
const getAllTours = (req, res) => {
  const tours = Tour.getAll();
  res.status(200).json(tours);
};

// POST /tours
const createTour = (req, res) => {
  const { name, info, image, price } = req.body;

  if (!name || !info || !image || !price) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const newTour = Tour.addOne(name, info, image, price);

  if (newTour) {
    res.status(201).json(newTour);
  } else {
    res.status(500).json({ message: "Failed to create tour" });
  }
};

// GET /tours/:tourId
const getTourById = (req, res) => {
  const tourId = req.params.tourId;
  const tour = Tour.findById(tourId);

  if (tour) {
    res.status(200).json(tour);
  } else {
    res.status(404).json({ message: "Tour not found" });
  }
};

// PUT /tours/:tourId
const updateTour = (req, res) => {
  const tourId = req.params.tourId;
  const { name, info, image, price } = req.body;

  if (!name && !info && !image && !price) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const updatedTour = Tour.updateOneById(tourId, { name, info, image, price });

  if (updatedTour) {
    res.status(200).json(updatedTour);
  } else {
    res.status(404).json({ message: "Tour not found" });
  }
};

// DELETE /tours/:tourId
const deleteTour = (req, res) => {
  const tourId = req.params.tourId;
  const isDeleted = Tour.deleteOneById(tourId);

  if (isDeleted) {
    res.status(204).json({ message: "Tour deleted successfully" });
  } else {
    res.status(404).json({ message: "Tour not found" });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
};
