const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jobs = [
  {
    title: "Senior React Developer",
    type: "Full-Time",
    description: "We are seeking a talented Front-End Developer to join our team in Boston, MA.",
    company: {
      name: "NewTek Solutions",
      contactEmail: "contact@teksolutions.com",
      contactPhone: "555-555-5555",
      website: "https://newteksolutions.com",
      size: 100
    },
    location: "Boston, MA",
    salary: 120000,
    experienceLevel: "Senior",
    status: "open",
    applicationDeadline: new Date("2024-12-31"),
    requirements: ["React", "JavaScript", "HTML", "CSS"]
  },
  {
    title: "Junior Backend Developer",
    type: "Part-Time",
    description: "Join our backend team to help build scalable APIs.",
    company: {
      name: "Tech Innovators",
      contactEmail: "hr@techinnovators.com",
      contactPhone: "555-555-1234"
    },
    location: "Remote",
    salary: 60000,
    experienceLevel: "Entry",
    status: "open",
    requirements: ["Node.js", "Express", "MongoDB"]
  },
];

// Test user data
const testUser = {
  name: "Test User",
  username: "testuser",
  password: "testpassword123",
  phone_number: "123-456-7890",
  gender: "male",
  date_of_birth: new Date("1990-01-01"),
  membership_status: "basic",
  address: "123 Test Street",
};

let token;
let userId;

describe("Job Controller", () => {
  beforeAll(async () => {
    // Create test user and get token
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const user = await User.create({
      ...testUser,
      password: hashedPassword,
    });
    userId = user._id;
    token = jwt.sign({ _id: userId }, process.env.SECRET, { expiresIn: "1h" });
  });

  beforeEach(async () => {
    await Job.deleteMany({});
    // Add user_id to jobs before inserting
    const jobsWithUserId = jobs.map(job => ({ ...job, user_id: userId }));
    await Job.insertMany(jobsWithUserId);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    mongoose.connection.close();
  });

  // Test GET /api/jobs
  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
  });

  // Test POST /api/jobs
  it("should create a new job when POST /api/jobs is called with valid token", async () => {
    const newJob = {
      title: "Mid-Level DevOps Engineer",
      type: "Full-Time",
      description: "We are looking for a DevOps Engineer to join our team.",
      company: {
        name: "Cloud Solutions",
        contactEmail: "jobs@cloudsolutions.com",
        contactPhone: "555-555-6789",
        website: "https://cloudsolutions.com",
        size: 50
      },
      location: "San Francisco, CA",
      salary: 95000,
      experienceLevel: "Mid",
      status: "open",
      requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"]
    };

    await api
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send(newJob)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
    const jobTitles = jobsAfterPost.map((job) => job.title);
    expect(jobTitles).toContain(newJob.title);
  });

  it("should return 401 when POST /api/jobs is called without token", async () => {
    const newJob = {
      title: "Unauthorized Job",
      type: "Full-Time",
      description: "This should not be created",
      company: {
        name: "Test Company",
        contactEmail: "test@test.com",
        contactPhone: "555-555-5555"
      },
      location: "Test City",
      salary: 50000,
      experienceLevel: "Entry",
      status: "open",
      requirements: ["Test"]
    };

    await api
      .post("/api/jobs")
      .send(newJob)
      .expect(401);
  });

  // Test GET /api/jobs/:id
  it("should return one job by ID when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get(`/api/jobs/${job._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing job ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/jobs/${nonExistentId}`).expect(404);
  });

  // Test PUT /api/jobs/:id
  it("should update one job with partial data when PUT /api/jobs/:id is called with valid token", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated description",
      type: "Contract",
      salary: 85000,
      experienceLevel: "Mid",
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.description).toBe(updatedJob.description);
    expect(updatedJobCheck.type).toBe(updatedJob.type);
    expect(updatedJobCheck.salary).toBe(updatedJob.salary);
    expect(updatedJobCheck.experienceLevel).toBe(updatedJob.experienceLevel);
  });

  it("should return 401 when PUT /api/jobs/:id is called without token", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Unauthorized update",
      type: "Contract",
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .send(updatedJob)
      .expect(401);
  });

  it("should return 404 for invalid job ID when PUT /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api
      .put(`/api/jobs/${invalidId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(404);
  });

  // Test DELETE /api/jobs/:id
  it("should delete one job by ID when DELETE /api/jobs/:id is called with valid token", async () => {
    const job = await Job.findOne();
    await api
      .delete(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const deletedJobCheck = await Job.findById(job._id);
    expect(deletedJobCheck).toBeNull();
  });

  it("should return 401 when DELETE /api/jobs/:id is called without token", async () => {
    const job = await Job.findOne();
    await api
      .delete(`/api/jobs/${job._id}`)
      .expect(401);
  });

  it("should return 404 for invalid job ID when DELETE /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api
      .delete(`/api/jobs/${invalidId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
