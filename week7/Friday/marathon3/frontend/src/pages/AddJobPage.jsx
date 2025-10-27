import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddJobPage = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Full-Time");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry");
  const [status, setStatus] = useState("open");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [requirements, setRequirements] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const navigate = useNavigate();

  const addJob = async (newJob) => {
    try {
      console.log("Adding job:", newJob);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newJob),
      });
      if (!res.ok) {
        throw new Error("Failed to add job");
      }
      return true;
    } catch (error) {
      console.error("Error adding job:", error);
      return false;
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const newJob = {
      title,
      type,
      description,
      company: {
        name: companyName,
        contactEmail,
        contactPhone,
        website: companyWebsite || undefined,
        size: companySize ? parseInt(companySize) : undefined,
      },
      location,
      salary: parseInt(salary),
      experienceLevel,
      status,
      applicationDeadline: applicationDeadline || undefined,
      requirements: requirements.split(',').map(req => req.trim()).filter(req => req),
    };

    const success = await addJob(newJob);
    if (success) {
      console.log("Job Added Successfully");
      navigate("/");
    } else {
      console.error("Failed to add the job");
    }
  };

  return (
    <div className="create">
      <h2>Add a New Job</h2>
      <form onSubmit={submitForm}>
        <label>Job title:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Job type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
        </select>

        <label>Job Description:</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Company Name:</label>
        <input
          type="text"
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <label>Contact Email:</label>
        <input
          type="email"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <label>Contact Phone:</label>
        <input
          type="text"
          required
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
        <label>Company Website:</label>
        <input
          type="url"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
          placeholder="https://example.com"
        />
        <label>Company Size (Number of employees):</label>
        <input
          type="number"
          value={companySize}
          onChange={(e) => setCompanySize(e.target.value)}
          min="1"
        />
        <label>Location:</label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, State or Remote"
        />
        <label>Salary:</label>
        <input
          type="number"
          required
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          min="0"
          placeholder="Annual salary"
        />
        <label>Experience Level:</label>
        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <label>Application Deadline:</label>
        <input
          type="date"
          value={applicationDeadline}
          onChange={(e) => setApplicationDeadline(e.target.value)}
        />
        <label>Requirements (comma-separated):</label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="React, Node.js, MongoDB, etc."
        ></textarea>
        <button>Add Job</button>
      </form>
    </div>
  );
};

export default AddJobPage;
