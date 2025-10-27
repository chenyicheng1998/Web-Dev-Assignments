const express = require("express");
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyControllers");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.get("/", getAllProperties);
router.get("/:propertyId", getPropertyById);

router.use(requireAuth);

router.post("/", createProperty);
router.put("/:propertyId", updateProperty);
router.delete("/:propertyId", deleteProperty);

module.exports = router;