## Question 1
In the file `backend/models/jobModel.js`, explain the purpose of the following code snippet:
```js
//add  virtual field id
jobSchema.set("toJSON", {
  virtuals: true, // include virtual fields in the JSON output
  transform: (doc, ret) => {
    ret.id = ret._id; // Add a new field `id` that copies the value of `_id`
    return ret;
  },
});
```

- This is because MongoDB uses `_id` as the default primary key.  
However, React prefer working with `id` instead of `_id`.
- `virtuals: true` ensures that schema virtuals are included when converting to JSON.

---
## Question 2
In `backend/app.js`, explain the role of this line:
```js
app.use(cors());
```
- This tells your Express app to use `CORS middleware` provided by the `cors` package.  
- It automatically sets the necessary HTTP response headers to allow cross-origin requests.

## Question 3
In frontend/vite.config.js, describe the purpose of the following configuration:
```js
proxy: {
  "/api": {
    target: "http://localhost:4000",
    changeOrigin: true,
  },
},
```
- When the frontend make a request to `/api/...`, the Vite dev server will intercept it.  
- So we can instead of request directly to the frontend server.