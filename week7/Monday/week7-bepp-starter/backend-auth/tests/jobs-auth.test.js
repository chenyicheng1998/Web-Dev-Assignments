const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Express app (already connects to DB)
const api = supertest(app);
const Job = require("../models/jobModel");
const User = require("../models/userModel");

// Seed data
const jobs = [
  {
    title: "Frontend Developer",
    type: "Full-time",
    description: "We are looking for a skilled Frontend Developer to join our team.",
    company: {
      name: "Tech Solutions Inc",
      contactEmail: "hr@techsolutions.com",
      contactPhone: "+1234567890"
    }
  },
  {
    title: "Backend Developer",
    type: "Part-time",
    description: "Experienced Backend Developer needed for exciting projects.",
    company: {
      name: "Digital Innovations Ltd",
      contactEmail: "jobs@digitalinnovations.com",
      contactPhone: "+0987654321"
    }
  },
];

let token = null;
let userId = null;

// Create a user and get a token before all tests
beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    name: "John Doe",
    email: "john@example.com",
    password: "R3g5T7#gh",
    phone_number: "1234567890",
    gender: "Male",
    date_of_birth: "1990-01-01",
    membership_status: "Inactive",
  });
  token = result.body.token;

  // Get the user ID from the database since it's not returned in the response
  const user = await User.findOne({ email: "john@example.com" });

  userId = user._id.toString();
});

describe("Protected Job Routes", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    // Add user_id to seed data
    const jobsWithUserId = jobs.map(job => ({ ...job, user_id: userId }));
    await Promise.all([
      api.post("/api/jobs").set("Authorization", "Bearer " + token).send(jobsWithUserId[0]),
      api.post("/api/jobs").set("Authorization", "Bearer " + token).send(jobsWithUserId[1]),
    ]);
  });

  // ---------------- GET (unprotected routes) ----------------
  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
  });

  it("should return one job by ID when GET /api/jobs/:jobId is called", async () => {
    const job = await Job.findOne();
    const response = await api
      .get(`/api/jobs/${job._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(job.title);
  });

  // ---------------- POST (protected) ----------------
  it("should create one job when POST /api/jobs is called with valid token", async () => {
    const newJob = {
      title: "Full Stack Developer",
      type: "Contract",
      description: "We need a versatile Full Stack Developer for a 6-month project.",
      company: {
        name: "StartUp Ventures",
        contactEmail: "hiring@startupventures.com",
        contactPhone: "+1122334455"
      }
    };

    const response = await api
      .post("/api/jobs")
      .set("Authorization", "Bearer " + token)
      .send(newJob)
      .expect(201);

    expect(response.body.title).toBe(newJob.title);
    expect(response.body.user_id).toBe(userId);
  });

  it("should return 401 if no token is provided for POST /api/jobs", async () => {
    const newJob = {
      title: "Full Stack Developer",
      type: "Contract",
      description: "We need a versatile Full Stack Developer for a 6-month project.",
      company: {
        name: "StartUp Ventures",
        contactEmail: "hiring@startupventures.com",
        contactPhone: "+1122334455"
      }
    };

    await api.post("/api/jobs").send(newJob).expect(401);
  });

  it("should return 401 if invalid token is provided for POST /api/jobs", async () => {
    const newJob = {
      title: "Full Stack Developer",
      type: "Contract",
      description: "We need a versatile Full Stack Developer for a 6-month project.",
      company: {
        name: "StartUp Ventures",
        contactEmail: "hiring@startupventures.com",
        contactPhone: "+1122334455"
      }
    };

    await api
      .post("/api/jobs")
      .set("Authorization", "Bearer invalidtoken")
      .send(newJob)
      .expect(401);
  });

  // ---------------- PUT (protected) ----------------
  it("should update one job by ID when PUT /api/jobs/:jobId is called with valid token", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated job description for better clarity.",
      type: "Remote"
    };

    const response = await api
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", "Bearer " + token)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.description).toBe(updatedJob.description);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.type).toBe(updatedJob.type);
  });

  it("should return 401 if no token is provided for PUT /api/jobs/:jobId", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated job description",
      type: "Remote"
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .send(updatedJob)
      .expect(401);
  });

  it("should return 401 if invalid token is provided for PUT /api/jobs/:jobId", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated job description",
      type: "Remote"
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", "Bearer invalidtoken")
      .send(updatedJob)
      .expect(401);
  });

  // ---------------- DELETE (protected) ----------------
  it("should delete one job by ID when DELETE /api/jobs/:jobId is called with valid token", async () => {
    const job = await Job.findOne();
    await api
      .delete(`/api/jobs/${job._id}`)
      .set("Authorization", "Bearer " + token)
      .expect(204);

    const jobCheck = await Job.findById(job._id);
    expect(jobCheck).toBeNull();
  });

  it("should return 401 if no token is provided for DELETE /api/jobs/:jobId", async () => {
    const job = await Job.findOne();
    await api
      .delete(`/api/jobs/${job._id}`)
      .expect(401);
  });

  it("should return 401 if invalid token is provided for DELETE /api/jobs/:jobId", async () => {
    const job = await Job.findOne();
    await api
      .delete(`/api/jobs/${job._id}`)
      .set("Authorization", "Bearer invalidtoken")
      .expect(401);
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
