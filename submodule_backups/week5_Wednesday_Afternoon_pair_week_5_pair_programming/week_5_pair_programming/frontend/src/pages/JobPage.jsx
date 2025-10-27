import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const JobPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

 
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`); 
        if (!res.ok) throw new Error("Failed to load job");
        const data = await res.json();
        if (!ignore) setJob(data);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

 
  const deleteJob = async () => {
    if (!confirm("Delete this job?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      navigate("/"); 
    } catch (e) {
      alert(e.message);
      console.error(e);
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p>Type: {job.type}</p>
      <p>Description: {job.description}</p>

      
      <p>Company: {job.company?.name}</p>
      <p>Contact Email: {job.company?.contactEmail}</p>
      <p>Contact Phone: {job.company?.contactPhone}</p>

      <p>Location: {job.location}</p>
      <p>Salary: {job.salary}</p>
      <p>Posted Date: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "—"}</p>

      <Link to={`/edit-job/${id}`}>
        <button>Edit Job</button>
      </Link>

      <button onClick={deleteJob} style={{ marginLeft: 8 }}>Delete Job</button>
    </div>
  );
};

export default JobPage;
