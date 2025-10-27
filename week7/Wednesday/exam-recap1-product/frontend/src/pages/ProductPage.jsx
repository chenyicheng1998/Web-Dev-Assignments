import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      if (!res.ok) {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("id: ", id);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const onDeleteClick = (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product? " + productId
    );
    if (!confirmDelete) return;

    deleteProduct(productId);
    navigate("/");
  };

  return (
    <div className="product-details">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{product.title}</h2>
          <p>Category: {product.category}</p>
          <p>Description: {product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Stock: {product.stockQuantity}</p>
          <p>Supplier: {product.supplier?.name}</p>
        {isAuthenticated &&(
            <>
            <button onClick={() => onDeleteClick(product._id)}>Delete</button>
            <button onClick={() => navigate(`/edit-product/${product._id}`)}>edit</button>
            </>
        )}
          
        </>
      )}
    </div>
  );
};

export default ProductPage;
