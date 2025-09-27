const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Workout = require("../models/workoutModel");

const initialWorkouts = [
  {
    title: "test workout 1",
    reps: 11,
    load: 101,
  },
  {
    title: "test workout 2",
    reps: 12,
    load: 102,
  },
];

const workoutsInDb = async () => {
  const workouts = await Workout.find({});
  return workouts.map((workout) => workout.toJSON());
};

beforeEach(async () => {
  await Workout.deleteMany({});
  let workoutObject = new Workout(initialWorkouts[0]);
  await workoutObject.save();
  workoutObject = new Workout(initialWorkouts[1]);
  await workoutObject.save();
});

describe("when there are initially some workouts saved", () => {
  describe("when retrieving all workouts", () => {
    it("should return all workouts in the database", async () => {
      const response = await api.get("/api/workouts");
      expect(response.body).toHaveLength(initialWorkouts.length);
    });

    it("should include specific workouts in the returned list", async () => {
      const response = await api.get("/api/workouts");
      const titles = response.body.map((workout) => workout.title);
      expect(titles).toContain("test workout 2");
    });

    it("should return workouts with JSON content type", async () => {
      await api
        .get("/api/workouts")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });
  });

  describe("when adding a new workout", () => {
    it("should successfully create a new workout with valid data", async () => {
      const newWorkout = {
        title: "Situps",
        reps: 25,
        load: 10,
      };

      await api
        .post("/api/workouts")
        .send(newWorkout)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/workouts");
      const titles = response.body.map((workout) => workout.title);

      expect(response.body).toHaveLength(initialWorkouts.length + 1);
      expect(titles).toContain("Situps");
    });

    it("should return status code 201 when workout is added successfully", async () => {
      const newWorkout = {
        title: "test workout x",
        reps: 19,
        load: 109,
      };

      await api.post("/api/workouts").send(newWorkout).expect(201);
    });

    it("should not allow adding a workout without a title", async () => {
      const invalidWorkout = {
        reps: 23,
      };

      await api.post("/api/workouts").send(invalidWorkout).expect(400);

      const response = await api.get("/api/workouts");
      expect(response.body).toHaveLength(initialWorkouts.length);
    });
  });
});

describe("when deleting a workout", () => {
  it("should successfully delete an existing workout with valid ID", async () => {
    const workoutsAtStart = await workoutsInDb();
    const workoutToDelete = workoutsAtStart[0];

    await api.delete(`/api/workouts/${workoutToDelete.id}`).expect(204);

    const workoutsAtEnd = await workoutsInDb();

    expect(workoutsAtEnd).toHaveLength(initialWorkouts.length - 1);

    const remainingTitles = workoutsAtEnd.map((workout) => workout.title);
    expect(remainingTitles).not.toContain(workoutToDelete.title);
  });

  it("should return status code 204 when deletion is successful", async () => {
    const workoutsAtStart = await workoutsInDb();
    const workoutToDelete = workoutsAtStart[0];

    await api.delete(`/api/workouts/${workoutToDelete.id}`).expect(204);
  });
});

afterAll(() => {
  mongoose.connection.close();
});