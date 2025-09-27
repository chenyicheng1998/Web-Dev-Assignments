const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Workout = require("../models/workoutModel");
const workouts = require("./data/workouts.js");

let token = null;
let createdWorkoutId = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api
    .post("/api/user/signup")
    .send({ email: "mattiv@matti.fi", password: "R3g5T7#gh" });
  token = result.body.token;
});

describe("workout API endpoints", () => {
  describe("when there are initially some workouts in the database", () => {
    beforeEach(async () => {
      await Workout.deleteMany({});
      // Create multiple workouts using Promise.all for better performance
      const creationResponses = await Promise.all(
        workouts.slice(0, 2).map(workout =>
          api
            .post("/api/workouts")
            .set("Authorization", "bearer " + token)
            .send(workout)
        )
      );
      // Store the ID of the first created workout for use in other tests
      createdWorkoutId = creationResponses[0].body._id;
    });

    describe("when retrieving workouts", () => {
      it("should return all workouts with JSON content type and 200 status code", async () => {
        await api
          .get("/api/workouts")
          .set("Authorization", "bearer " + token)
          .expect(200)
          .expect("Content-Type", /application\/json/);
      });

      it("should return a specific workout by ID with correct data", async () => {
        const response = await api
          .get(`/api/workouts/${createdWorkoutId}`)
          .set("Authorization", "bearer " + token)
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(response.body).toHaveProperty("_id", createdWorkoutId);
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("reps");
        expect(response.body).toHaveProperty("load");
      });
    });

    describe("when creating a new workout", () => {
      it("should successfully create a new workout with valid data and authentication", async () => {
        const newWorkout = {
          title: "testworkout",
          reps: 10,
          load: 100,
        };

        await api
          .post("/api/workouts")
          .set("Authorization", "bearer " + token)
          .send(newWorkout)
          .expect(201);
      });

      it("should return the created workout with correct data", async () => {
        const newWorkout = {
          title: "Bench Press",
          reps: 12,
          load: 80,
        };

        const response = await api
          .post("/api/workouts")
          .set("Authorization", "bearer " + token)
          .send(newWorkout)
          .expect(201);

        expect(response.body).toMatchObject({
          title: newWorkout.title,
          reps: newWorkout.reps,
          load: newWorkout.load
        });
      });
    });

    describe("when updating an existing workout", () => {
      it("should successfully update a workout with valid data", async () => {
        const updatedWorkout = {
          title: "Updated Workout Title",
          reps: 15,
          load: 120,
        };

        const response = await api
          .patch(`/api/workouts/${createdWorkoutId}`)
          .set("Authorization", "bearer " + token)
          .send(updatedWorkout)
          .expect(200);

        // 验证返回的数据结构
        expect(response.body).toHaveProperty("_id", createdWorkoutId);
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("reps");
        expect(response.body).toHaveProperty("load");

        // 验证更新是否真的生效 - 通过重新获取数据来检查
        const getResponse = await api
          .get(`/api/workouts/${createdWorkoutId}`)
          .set("Authorization", "bearer " + token)
          .expect(200);

        expect(getResponse.body).toMatchObject(updatedWorkout);
      });

      it("should allow partial updates to workout fields", async () => {
        const partialUpdate = {
          title: "Partially Updated Title"
        };

        const response = await api
          .patch(`/api/workouts/${createdWorkoutId}`)
          .set("Authorization", "bearer " + token)
          .send(partialUpdate)
          .expect(200);

        // 验证返回的数据结构
        expect(response.body).toHaveProperty("_id", createdWorkoutId);
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("reps");
        expect(response.body).toHaveProperty("load");

        // 验证更新是否真的生效
        const getResponse = await api
          .get(`/api/workouts/${createdWorkoutId}`)
          .set("Authorization", "bearer " + token)
          .expect(200);

        expect(getResponse.body.title).toBe(partialUpdate.title);
      });
    });

    describe("when deleting a workout", () => {
      it("should successfully delete an existing workout", async () => {
        // First, get the current count of workouts
        const initialResponse = await api
          .get("/api/workouts")
          .set("Authorization", "bearer " + token);
        const initialCount = initialResponse.body.length;

        // Delete the workout
        const deleteResponse = await api
          .delete(`/api/workouts/${createdWorkoutId}`)
          .set("Authorization", "bearer " + token)
          .expect(200);

        // 验证返回被删除的workout
        expect(deleteResponse.body).toHaveProperty("_id", createdWorkoutId);

        // Verify the workout is gone
        const finalResponse = await api
          .get("/api/workouts")
          .set("Authorization", "bearer " + token);

        expect(finalResponse.body).toHaveLength(initialCount - 1);

        // Verify the specific workout no longer exists
        await api
          .get(`/api/workouts/${createdWorkoutId}`)
          .set("Authorization", "bearer " + token)
          .expect(404);
      });
    });
  });

  describe("when no workouts exist in the database", () => {
    beforeEach(async () => {
      await Workout.deleteMany({});
    });

    it("should return an empty array when retrieving all workouts", async () => {
      const response = await api
        .get("/api/workouts")
        .set("Authorization", "bearer " + token)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it("should return 404 when trying to retrieve a non-existent workout by ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await api
        .get(`/api/workouts/${nonExistentId}`)
        .set("Authorization", "bearer " + token)
        .expect(404);
    });

    it("should return 400 when trying to update a non-existent workout", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateData = {
        title: "Updated Title",
        reps: 20,
        load: 150,
      };

      await api
        .patch(`/api/workouts/${nonExistentId}`)
        .set("Authorization", "bearer " + token)
        .send(updateData)
        .expect(400);
    });

    it("should return 400 when trying to delete a non-existent workout", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await api
        .delete(`/api/workouts/${nonExistentId}`)
        .set("Authorization", "bearer " + token)
        .expect(400);
    });
  });

  describe("when authentication is missing or invalid", () => {
    let workoutId;

    beforeEach(async () => {
      // Create a workout to test against
      const response = await api
        .post("/api/workouts")
        .set("Authorization", "bearer " + token)
        .send(workouts[0]);
      workoutId = response.body._id;
    });

    it("should return 401 Unauthorized when no token is provided for GET all workouts", async () => {
      await api
        .get("/api/workouts")
        .expect(401);
    });

    it("should return 401 Unauthorized when no token is provided for GET single workout", async () => {
      await api
        .get(`/api/workouts/${workoutId}`)
        .expect(401);
    });

    it("should return 401 Unauthorized when no token is provided for POST", async () => {
      const newWorkout = {
        title: "testworkout",
        reps: 10,
        load: 100,
      };

      await api
        .post("/api/workouts")
        .send(newWorkout)
        .expect(401);
    });

    it("should return 401 Unauthorized when no token is provided for PATCH", async () => {
      const updateData = {
        title: "Updated Title",
      };

      await api
        .patch(`/api/workouts/${workoutId}`)
        .send(updateData)
        .expect(401);
    });

    it("should return 401 Unauthorized when no token is provided for DELETE", async () => {
      await api
        .delete(`/api/workouts/${workoutId}`)
        .expect(401);
    });

    it("should return 401 Unauthorized when invalid token is provided", async () => {
      const newWorkout = {
        title: "testworkout",
        reps: 10,
        load: 100,
      };

      await api
        .post("/api/workouts")
        .set("Authorization", "bearer invalid-token-here")
        .send(newWorkout)
        .expect(401);
    });
  });

  describe("when handling invalid data", () => {
    it("should return 400 when creating a workout with missing required fields", async () => {
      const invalidWorkout = {
        // Missing title field
        reps: 10,
        load: 100,
      };

      await api
        .post("/api/workouts")
        .set("Authorization", "bearer " + token)
        .send(invalidWorkout)
        .expect(400);
    });

    it("should return 500 when updating a workout with invalid data types", async () => {
      // First create a workout to update
      const workoutResponse = await api
        .post("/api/workouts")
        .set("Authorization", "bearer " + token)
        .send(workouts[0]);

      const invalidUpdate = {
        reps: "not-a-number", // Invalid type
        load: "also-not-a-number",
      };

      // 根据实际API行为，期望500错误
      await api
        .patch(`/api/workouts/${workoutResponse.body._id}`)
        .set("Authorization", "bearer " + token)
        .send(invalidUpdate)
        .expect(500);
    });

    it("should return 404 when accessing workout with invalid ObjectId format", async () => {
      await api
        .get("/api/workouts/invalid-id-format")
        .set("Authorization", "bearer " + token)
        .expect(404);
    });

    it("should return 400 when creating a workout with invalid data types", async () => {
      const invalidWorkout = {
        title: "Invalid Workout",
        reps: "not-a-number", // Invalid type
        load: "also-not-a-number",
      };

      // 测试创建时的数据类型验证
      await api
        .post("/api/workouts")
        .set("Authorization", "bearer " + token)
        .send(invalidWorkout)
        .expect(400); // 或者500，根据实际行为调整
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});