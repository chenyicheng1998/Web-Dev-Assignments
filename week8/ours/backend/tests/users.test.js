const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // app.js already connects to DB
const api = supertest(app);
const User = require("../models/userModel");

// Clean the users collection before each test
beforeEach(async () => {
  await User.deleteMany({});
});

describe("User Routes", () => {
  describe("POST /api/users/signup", () => {
    it("✅ should signup a new user with valid credentials", async () => {
      const userData = {
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
      };

      const result = await api.post("/api/users/signup").send(userData);

      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty("token");
      expect(result.body).toHaveProperty("username");

      // Extra check: user is actually saved in DB
      const savedUser = await User.findOne({ username: userData.username });
      expect(savedUser).not.toBeNull();
      expect(savedUser.name).toBe(userData.name);
    });

    it("❌ should return an error with missing required fields", async () => {
      const userData = {
        name: "John Doe",
        username: "johndoe123",
        password: "R3g5T7#gh",
        phone_number: "09-123-47890",
        // missing gender, date_of_birth, address
      };

      const result = await api.post("/api/users/signup").send(userData);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });

    it("❌ should return an error with duplicate username", async () => {
      const userData = {
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
      };

      // First signup
      await api.post("/api/users/signup").send(userData);

      // Try to signup with same username
      const result = await api.post("/api/users/signup").send(userData);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
      expect(result.body.error).toContain("User already exists");
    });
  });

  describe("POST /api/users/login", () => {
    it("✅ should login a user with valid credentials", async () => {
      // First signup
      await api.post("/api/users/signup").send({
        name: "Jane Doe",
        username: "janedoe123",
        password: "R3g5T7#gh",
        phone_number: "09-123-47890",
        gender: "Female",
        date_of_birth: "1992-05-15",
        address: {
          street: "456 Oak St",
          city: "Espoo",
          state: "Uusimaa",
          zipCode: "02100"
        }
      });

      // Then login
      const result = await api.post("/api/users/login").send({
        username: "janedoe123",
        password: "R3g5T7#gh",
      });

      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("token");
      expect(result.body).toHaveProperty("username");
      expect(result.body.username).toBe("janedoe123");
    });

    it("❌ should return an error with wrong password", async () => {
      // First signup
      await api.post("/api/users/signup").send({
        name: "Jane Doe",
        username: "janedoe123",
        password: "R3g5T7#gh",
        phone_number: "09-123-47890",
        gender: "Female",
        date_of_birth: "1992-05-15",
        address: {
          street: "456 Oak St",
          city: "Espoo",
          state: "Uusimaa",
          zipCode: "02100"
        }
      });

      const result = await api.post("/api/users/login").send({
        username: "janedoe123",
        password: "wrongpassword",
      });

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });

    it("❌ should return an error with non-existent username", async () => {
      const result = await api.post("/api/users/login").send({
        username: "nonexistent",
        password: "R3g5T7#gh",
      });

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });
  });
});

// Close DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});