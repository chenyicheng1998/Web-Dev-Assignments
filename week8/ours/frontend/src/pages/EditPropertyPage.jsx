import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPropertyPage = () => {
  const [property, setProperty] = useState(null); // Initialize property state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();

  // Declare state variables for form fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const navigate = useNavigate();

  const updateProperty = async (property) => {
    try {
      console.log("Updating property:", property);
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(property),
      });
      if (!res.ok) throw new Error("Failed to update property");
      return res.ok;
    } catch (error) {
      console.error("Error updating property:", error);
      return false;
    }
  };

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setProperty(data); // Set the property data

        // Initialize form fields with fetched property data
        setTitle(data.title);
        setType(data.type);
        setDescription(data.description);
        setPrice(data.price.toString());
        setAddress(data.location.address);
        setCity(data.location.city);
        setState(data.location.state);
        setZipCode(data.location.zipCode);
        setSquareFeet(data.squareFeet.toString());
        setYearBuilt(data.yearBuilt.toString());
      } catch (error) {
        console.error("Failed to fetch property:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchProperty();
  }, [id]);

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const updatedProperty = {
      id,
      title,
      type,
      description,
      price: parseFloat(price),
      location: {
        address,
        city,
        state,
        zipCode,
      },
      squareFeet: parseInt(squareFeet),
      yearBuilt: parseInt(yearBuilt),
    };

    const success = await updateProperty(updatedProperty);
    if (success) {
      console.log("Property Updated Successfully");
      navigate(`/properties/${id}`);
    } else {
      console.error("Failed to update the property");
    }
  };

  return (
    <div className="create">
      <h2>Update Property</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={submitForm}>
          <label>Property title:</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Property type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land</option>
          </select>

          <label>Property Description:</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <label>Price:</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label>Address:</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label>City:</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <label>State:</label>
          <input
            type="text"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <label>ZIP Code:</label>
          <input
            type="text"
            required
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <label>Square Feet:</label>
          <input
            type="number"
            required
            value={squareFeet}
            onChange={(e) => setSquareFeet(e.target.value)}
          />
          <label>Year Built:</label>
          <input
            type="number"
            required
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
          />
          <button>Update Property</button>
        </form>
      )}
    </div>
  );
};

export default EditPropertyPage;