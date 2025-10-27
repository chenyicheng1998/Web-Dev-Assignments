import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPropertyPage = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Apartment");
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

  const addProperty = async (newProperty) => {
    try {
      console.log("Adding property:", newProperty);
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProperty),
      });
      if (!res.ok) {
        throw new Error("Failed to add property");
      }
      return true;
    } catch (error) {
      console.error("Error adding property:", error);
      return false;
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const newProperty = {
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

    const success = await addProperty(newProperty);
    if (success) {
      console.log("Property Added Successfully");
      navigate("/");
    } else {
      console.error("Failed to add the property");
    }
  };

  return (
    <div className="create">
      <h2>Add a New Property</h2>
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
        <button type="submit">Add Property</button>
      </form>
    </div>
  );
};

export default AddPropertyPage;