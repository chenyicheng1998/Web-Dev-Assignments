import { Link } from "react-router-dom";

const JobListings = ({ jobs }) => {
  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div className="job-preview" key={job.id}>
          <Link to={`/jobs/${job.id}`}>
            <h2>{job.title}</h2>
          </Link>
          <p>Type: {job.type}</p>
          <p>Company: {job.company.name}</p>
          <p>Location: {job.location}</p>
          <p>Salary: ${job.salary?.toLocaleString()}</p>
          <p>Experience Level: {job.experienceLevel}</p>
          <p>Status: {job.status}</p>
          {job.applicationDeadline && (
            <p>Application Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default JobListings;
