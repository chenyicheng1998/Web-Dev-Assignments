import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const JobPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const deleteJob = async (id) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete job: ${errorText}`);
      }
      console.log("Job deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log("id: ", id);
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const onDeleteClick = (jobId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?" + jobId
    );
    if (!confirm) return;

    deleteJob(jobId);
  };

  return (
    <div className="job-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{job.title}</h2>
          <p><strong>Type:</strong> {job.type}</p>
          <p><strong>Description:</strong> {job.description}</p>
          <p><strong>Company:</strong> {job.company.name}</p>
          <p><strong>Email:</strong> {job.company.contactEmail}</p>
          <p><strong>Phone:</strong> {job.company.contactPhone}</p>
          {job.company.website && (
            <p><strong>Website:</strong> <a href={job.company.website} target="_blank" rel="noopener noreferrer">{job.company.website}</a></p>
          )}
          {job.company.size && (
            <p><strong>Company Size:</strong> {job.company.size} employees</p>
          )}
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> ${job.salary?.toLocaleString()}</p>
          <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Posted Date:</strong> {new Date(job.postedDate).toLocaleDateString()}</p>
          {job.applicationDeadline && (
            <p><strong>Application Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
          )}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <p><strong>Requirements:</strong></p>
              <ul>
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          {isAuthenticated && (
            <>
              <button onClick={() => onDeleteClick(job._id)}>delete</button>
              <button onClick={() => navigate(`/edit-job/${job._id}`)}>
                edit
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default JobPage;
