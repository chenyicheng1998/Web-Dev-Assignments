import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProductPage = () => {
  const [product, setProduct] = useState(null); // Initialize product state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierRating, setSupplierRating] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;
  const navigate = useNavigate();

  const updateProduct = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" ,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return true;
    } catch (err) {
      console.error("Error updating product:", err);
      return false;
    }
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setProduct(data);

        // Initialize form with fetched data
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setPrice(data.price);
        setStockQuantity(data.stockQuantity);
        setSupplierName(data.supplier?.name || "");
        setSupplierEmail(data.supplier?.contactEmail || "");
        setSupplierPhone(data.supplier?.contactPhone || "");
        setSupplierRating(data.supplier?.rating || ""); 
        
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      id,
      title,
      category,
      description,
      price,
      stockQuantity,
      supplier: {
        name: supplierName,
        contactEmail: supplierEmail,
        contactPhone: supplierPhone,
        rating: Number(supplierRating),
      },
    };

    const success = await updateProduct(updatedProduct);
    if (success) {
      navigate(`/products/${id}`);
    } else {
      console.error("Failed to update the product");
    }
  };

  return (
    <div className="create">
      <h2>Update Product</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={submitForm}>
          <label>Product Title:</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Category:</label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label>Description:</label>
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

          <label>Stock Quantity:</label>
          <input
            type="number"
            required
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />

          <label>Supplier Name:</label>
          <input
            type="text"
            required
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />

          <label>Supplier Email:</label>
          <input
            type="email"
            required
            value={supplierEmail}
            onChange={(e) => setSupplierEmail(e.target.value)}
          />

          <label>Supplier Phone:</label>
          <input
            type="text"
            required
            value={supplierPhone}
            onChange={(e) => setSupplierPhone(e.target.value)}
          />

          <label>Supplier Rating (1-5):</label> 
          <input
            type="number"
            required
            min="1"
            max="5"
            value={supplierRating}
            onChange={(e) => setSupplierRating(e.target.value)}
          />

          <button>Update Product</button>
        </form>
      )}
    </div>
  );
};

export default EditProductPage;