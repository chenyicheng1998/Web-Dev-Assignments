const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Express app (already connects to DB)
const api = supertest(app);
const Property = require("../models/propertyModel");
const User = require("../models/userModel");

// Seed data
const properties = [
  {
    title: "Modern Downtown Apartment",
    type: "Apartment",
    description: "Beautiful modern apartment in the heart of downtown Helsinki.",
    price: 450000,
    location: {
      address: "123 Keskuskatu",
      city: "Helsinki",
      state: "Uusimaa",
      zipCode: "00100"
    },
    squareFeet: 850,
    yearBuilt: 2020
  },
  {
    title: "Cozy Family House",
    type: "House",
    description: "Perfect family home with a large garden in quiet neighborhood.",
    price: 650000,
    location: {
      address: "456 Kotikatu",
      city: "Espoo",
      state: "Uusimaa",
      zipCode: "02100"
    },
    squareFeet: 1200,
    yearBuilt: 2015
  },
];

let token = null;

// Create a user and get a token before all tests
beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    name: "John Doe",
    username: "johndoe123",
    password: "R3g5T7#gh",
    phone_number: "09-123-47890",
    gender: "Male",
    date_of_birth: "1990-01-01",
    address: {
      street: "123 Main St",
      city: "Helsinki",
      state: "Uusimaa",
      zipCode: "00100"
    }
  });
  token = result.body.token;
});

describe("Protected Property Routes", () => {
  beforeEach(async () => {
    await Property.deleteMany({});
    await Promise.all([
      api.post("/api/properties").set("Authorization", "Bearer " + token).send(properties[0]),
      api.post("/api/properties").set("Authorization", "Bearer " + token).send(properties[1]),
    ]);
  });

  // ---------------- GET ALL (No auth required) ----------------
  it("should return all properties as JSON when GET /api/properties is called", async () => {
    const response = await api
      .get("/api/properties")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(properties.length);
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("price");
    expect(response.body[0]).toHaveProperty("location");
  });

  // ---------------- GET by ID (No auth required) ----------------
  it("should return one property by ID when GET /api/properties/:id is called", async () => {
    const property = await Property.findOne();
    const response = await api
      .get(`/api/properties/${property._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(property.title);
    expect(response.body._id).toBe(property._id.toString());
  });

  it("should return 404 for non-existing property ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/properties/${nonExistentId}`).expect(404);
  });

  it("should return 404 for invalid property ID format", async () => {
    const invalidId = "12345";
    await api.get(`/api/properties/${invalidId}`).expect(404);
  });

  // ---------------- POST (Auth required) ----------------
  it("should create one property when POST /api/properties is called with auth", async () => {
    const newProperty = {
      title: "Luxury Penthouse",
      type: "Apartment",
      description: "Stunning penthouse with panoramic city views.",
      price: 1200000,
      location: {
        address: "789 Skyline Ave",
        city: "Helsinki",
        state: "Uusimaa",
        zipCode: "00200"
      },
      squareFeet: 1500,
      yearBuilt: 2022
    };

    const response = await api
      .post("/api/properties")
      .set("Authorization", "Bearer " + token)
      .send(newProperty)
      .expect(201);

    expect(response.body.title).toBe(newProperty.title);
    expect(response.body.price).toBe(newProperty.price);
    expect(response.body).toHaveProperty("user_id");

    // Verify it's saved in DB
    const savedProperty = await Property.findById(response.body._id);
    expect(savedProperty).not.toBeNull();
  });

  it("should return 401 if no token is provided for POST", async () => {
    const newProperty = {
      title: "Unauthorized Property",
      type: "House",
      description: "This should fail without auth.",
      price: 300000,
      location: {
        address: "123 Fail St",
        city: "Helsinki",
        state: "Uusimaa",
        zipCode: "00100"
      },
      squareFeet: 900,
      yearBuilt: 2010
    };

    await api.post("/api/properties").send(newProperty).expect(401);
  });

  // ---------------- PUT (Auth required) ----------------
  it("should update one property by ID when PUT /api/properties/:id is called with auth", async () => {
    const property = await Property.findOne();
    const updatedProperty = {
      description: "Updated property description with new features.",
      price: 500000
    };

    const response = await api
      .put(`/api/properties/${property._id}`)
      .set("Authorization", "Bearer " + token)
      .send(updatedProperty)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.description).toBe(updatedProperty.description);
    expect(response.body.price).toBe(updatedProperty.price);

    const updatedPropertyCheck = await Property.findById(property._id);
    expect(updatedPropertyCheck.price).toBe(updatedProperty.price);
  });

  it("should return 401 if no token is provided for PUT", async () => {
    const property = await Property.findOne();
    const updatedProperty = { price: 600000 };

    await api
      .put(`/api/properties/${property._id}`)
      .send(updatedProperty)
      .expect(401);
  });

  it("should return 404 for invalid property ID when PUT", async () => {
    const invalidId = "12345";
    await api
      .put(`/api/properties/${invalidId}`)
      .set("Authorization", "Bearer " + token)
      .send({ price: 500000 })
      .expect(404);
  });

  // ---------------- DELETE (Auth required) ----------------
  it("should delete one property by ID when DELETE /api/properties/:id is called with auth", async () => {
    const property = await Property.findOne();
    await api
      .delete(`/api/properties/${property._id}`)
      .set("Authorization", "Bearer " + token)
      .expect(204);

    const deletedPropertyCheck = await Property.findById(property._id);
    expect(deletedPropertyCheck).toBeNull();
  });

  it("should return 401 if no token is provided for DELETE", async () => {
    const property = await Property.findOne();
    await api
      .delete(`/api/properties/${property._id}`)
      .expect(401);
  });

  it("should return 404 for invalid property ID when DELETE", async () => {
    const invalidId = "12345";
    await api
      .delete(`/api/properties/${invalidId}`)
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });

  it("should return 404 for non-existing property ID when DELETE", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api
      .delete(`/api/properties/${nonExistentId}`)
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});