const apiUrl = "http://localhost:3001/api/blogs";
let id = "68c6ce5db8335fcf4d34312a";

const fetchBlog = async () => {


  const response = await fetch(`${apiUrl}/${id}`);
  console.log(`${apiUrl}/${id}`);
  

  
  // console.log(`${apiUrl}/${id}`);
  const data = await response.json();

  console.log(data);
};

fetchBlog();
