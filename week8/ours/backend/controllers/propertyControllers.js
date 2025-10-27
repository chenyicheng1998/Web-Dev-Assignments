const mongoose = require("mongoose");
const Property = require("../models/propertyModel");

// Get all properties
const getAllProperties = async (req, res) => {

  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Create a new property
const createProperty = async (req, res) => {

  try {
    const user_id = req.user._id;
    const newProperty = new Property({
      ...req.body,
      user_id,
    });
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get property by ID
const getPropertyById = async (req, res) => {
  const { propertyId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(404).json({ error: "No such property" });
  }

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      console.log("Property not found");
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update property by ID
const updateProperty = async (req, res) => {
  const { propertyId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(404).json({ error: "No such property" });
  }

  try {
    // const user_id = req.user._id;
    const property = await Property.findOneAndUpdate(
      { _id: propertyId },
      { ...req.body },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete property by ID
const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(404).json({ error: "No such property" });
  }

  try {
    // const user_id = req.user._id;
    const property = await Property.findOneAndDelete({ _id: propertyId });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
};