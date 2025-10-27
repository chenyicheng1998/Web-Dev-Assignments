const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Property = require("../models/propertyModel");
const User = require("../models/userModel");

let testUserId;

const properties = [
  {
    title: "Beautiful Downtown Apartment",
    type: "Apartment",
    description: "A stunning apartment in the heart of the city with modern amenities.",
    price: 350000,
    location: {
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    squareFeet: 1200,
    yearBuilt: 2015
  },
  {
    title: "Cozy Suburban House",
    type: "House",
    description: "A charming 3-bedroom house in a quiet neighborhood.",
    price: 450000,
    location: {
      address: "456 Oak Avenue",
      city: "Boston",
      state: "MA",
      zipCode: "02101"
    },
    squareFeet: 2100,
    yearBuilt: 2010
  },
];

describe("Property Controller", () => {
  beforeAll(async () => {
    // Create a test user to use for all properties
    await User.deleteMany({});
    const testUser = await User.create({
      name: "Test User",
      username: "testuser123",
      password: "hashedpassword123",
      phone_number: "09-123-45678",
      gender: "Other",
      date_of_birth: "1990-01-01",
      address: {
        street: "123 Test St",
        city: "Test City",
        state: "Test State",
        zipCode: "12345"
      }
    });
    testUserId = testUser._id;
  });

  beforeEach(async () => {
    await Property.deleteMany({});
    // Add user_id to all test properties
    const propertiesWithUserId = properties.map(property => ({
      ...property,
      user_id: testUserId
    }));
    await Property.insertMany(propertiesWithUserId);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  // Test GET /api/properties
  describe("GET /api/properties", () => {
    it("should return all properties as JSON when GET /api/properties is called", async () => {
      const response = await api
        .get("/api/properties")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toHaveLength(properties.length);
      expect(response.body[0].title).toBe(properties[0].title);
    });
  });

  // Test POST /api/properties
  describe("POST /api/properties", () => {
    it("should create a new property when POST /api/properties is called", async () => {
      const newProperty = {
        title: "Modern Commercial Building",
        type: "Commercial",
        description: "A state-of-the-art office building in the business district.",
        price: 1200000,
        location: {
          address: "789 Business Blvd",
          city: "Chicago",
          state: "IL",
          zipCode: "60601"
        },
        squareFeet: 5000,
        yearBuilt: 2020,
        user_id: testUserId
      };

      const response = await api
        .post("/api/properties")
        .send(newProperty)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      expect(response.body.title).toBe(newProperty.title);
      expect(response.body.price).toBe(newProperty.price);

      const propertiesAfterPost = await Property.find({});
      expect(propertiesAfterPost).toHaveLength(properties.length + 1);
      const propertyTitles = propertiesAfterPost.map((property) => property.title);
      expect(propertyTitles).toContain(newProperty.title);
    });

    it("should return 400 for invalid property data", async () => {
      const invalidProperty = {
        title: "Invalid Property",
        user_id: testUserId
        // Missing other required fields like type, description, etc.
      };

      await api
        .post("/api/properties")
        .send(invalidProperty)
        .expect(400);
    });
  });

  // Test GET /api/properties/:id
  describe("GET /api/properties/:id", () => {
    it("should return one property by ID when GET /api/properties/:id is called", async () => {
      const property = await Property.findOne();
      const response = await api
        .get(`/api/properties/${property._id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.title).toBe(property.title);
      expect(response.body.price).toBe(property.price);
    });

    it("should return 404 for a non-existing property ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await api.get(`/api/properties/${nonExistentId}`).expect(404);
    });

    it("should return 400 for invalid property ID format", async () => {
      const invalidId = "12345";
      await api.get(`/api/properties/${invalidId}`).expect(400);
    });
  });

  // Test PUT /api/properties/:id
  describe("PUT /api/properties/:id", () => {
    it("should update one property with partial data when PUT /api/properties/:id is called", async () => {
      const property = await Property.findOne();
      const updatedProperty = {
        description: "Updated description for this beautiful property",
        price: 375000,
      };

      const response = await api
        .put(`/api/properties/${property._id}`)
        .send(updatedProperty)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.description).toBe(updatedProperty.description);
      expect(response.body.price).toBe(updatedProperty.price);

      const updatedPropertyCheck = await Property.findById(property._id);
      expect(updatedPropertyCheck.description).toBe(updatedProperty.description);
      expect(updatedPropertyCheck.price).toBe(updatedProperty.price);
    });

    it("should update property location data", async () => {
      const property = await Property.findOne();
      const updatedProperty = {
        location: {
          address: "999 Updated Street",
          city: "Updated City",
          state: "UC",
          zipCode: "99999"
        }
      };

      const response = await api
        .put(`/api/properties/${property._id}`)
        .send(updatedProperty)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.location.address).toBe(updatedProperty.location.address);
      expect(response.body.location.city).toBe(updatedProperty.location.city);
    });

    it("should return 400 for invalid property ID when PUT /api/properties/:id", async () => {
      const invalidId = "12345";
      await api.put(`/api/properties/${invalidId}`).send({}).expect(400);
    });

    it("should return 404 for non-existing property ID when PUT /api/properties/:id", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await api.put(`/api/properties/${nonExistentId}`).send({}).expect(404);
    });
  });

  // Test DELETE /api/properties/:id
  describe("DELETE /api/properties/:id", () => {
    it("should delete one property by ID when DELETE /api/properties/:id is called", async () => {
      const property = await Property.findOne();
      await api.delete(`/api/properties/${property._id}`).expect(204);

      const deletedPropertyCheck = await Property.findById(property._id);
      expect(deletedPropertyCheck).toBeNull();

      const remainingProperties = await Property.find({});
      expect(remainingProperties).toHaveLength(properties.length - 1);
    });

    it("should return 400 for invalid property ID when DELETE /api/properties/:id", async () => {
      const invalidId = "12345";
      await api.delete(`/api/properties/${invalidId}`).expect(400);
    });

    it("should return 404 for non-existing property ID when DELETE /api/properties/:id", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await api.delete(`/api/properties/${nonExistentId}`).expect(404);
    });
  });
});