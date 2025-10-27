import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const name = useField("text");
  const username = useField("text");
  const password = useField("password");
  const phoneNumber = useField("text");
  const gender = useField("text");
  const dateOfBirth = useField("date");
  const membershipStatus = useField("text");
  const bio = useField("text");
  const address = useField("text");
  const profilePicture = useField("text");

  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({
      name: name.value,
      username: username.value,
      password: password.value,
      phone_number: phoneNumber.value,
      gender: gender.value,
      date_of_birth: dateOfBirth.value,
      membership_status: membershipStatus.value,
      bio: bio.value,
      address: address.value,
      profile_picture: profilePicture.value,
    });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} required />
        <label>Username:</label>
        <input {...username} required />
        <label>Password:</label>
        <input {...password} required />
        <label>Phone Number:</label>
        <input {...phoneNumber} required />
        <label>Gender:</label>
        <select {...gender} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <label>Date of Birth:</label>
        <input {...dateOfBirth} required />
        <label>Membership Status:</label>
        <select {...membershipStatus} required>
          <option value="">Select Membership</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="gold">Gold</option>
        </select>
        <label>Bio:</label>
        <textarea {...bio}></textarea>
        <label>Address:</label>
        <input {...address} required />
        <label>Profile Picture URL:</label>
        <input {...profilePicture} />
        <button>Sign up</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Signup;