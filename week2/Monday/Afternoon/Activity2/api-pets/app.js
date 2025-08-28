const express = require("express");
const app = express();

const {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} = require("./petHandlers"); 

// Middleware to parse JSON
app.use(express.json());

// ROUTES

// GET /pets
app.get("/pets", getAllPets);

// POST /pets
app.post("/pets", createPet);

// GET /pets/:petId
app.get("/pets/:petId", getPetById);

// PUT /pets/:petId
app.put("/pets/:petId", updatePet);

// DELETE /pets/:petId
app.delete("/pets/:petId", deletePet);

const port = 4000;
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});