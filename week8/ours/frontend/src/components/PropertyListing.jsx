import { Link } from "react-router-dom";

const PropertyListing = ({ property }) => {
  return (
    <div className="property-preview">
      <Link to={`/properties/${property._id}`}>
        <h2>{property.title}</h2>
        <p>Type: {property.type}</p>
        <p>Description: {property.description}</p>
        <p>Price: ${property.price.toLocaleString()}</p>
        <p>Location: {property.location.city}, {property.location.state}</p>
        <p>Square Feet: {property.squareFeet}</p>
        <p>Year Built: {property.yearBuilt}</p>
      </Link>
    </div>
  );
};

export default PropertyListing;