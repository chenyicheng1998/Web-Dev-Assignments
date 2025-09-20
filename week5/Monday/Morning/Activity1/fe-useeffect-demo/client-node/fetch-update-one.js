const apiUrl = "http://localhost:3001/api/blogs";


const blogId = "68c6ce5db8335fcf4d34312a";

const updatedData = {
  title: "Here is an updated title",
  body: "here is updated body",
  author: "Sami",
};

const updateBlog = async (blogId, updatedData) => {







  const response = await fetch(`${apiUrl}/${blogId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });



  


  if (!response.ok) {
    throw new Error("Failed to update the blog");
  }

  const updatedBlog = await response.json();
  console.log("Blog updated:", updatedBlog);
};

// const updateBlog = async (blogId, updatedData) => {
//   try {
//     const response = await fetch(`${apiUrl}/${blogId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedData),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update the blog");
//     }

//     const updatedBlog = await response.json();
//     console.log("Blog updated:", updatedBlog);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

updateBlog(blogId, updatedData);
