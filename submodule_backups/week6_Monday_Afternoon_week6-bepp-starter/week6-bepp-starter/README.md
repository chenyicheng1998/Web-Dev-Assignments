### What does this line of code do?
```js
req.user = await User.findOne({ _id }).select("_id");
```
 - Finds a user by their MongoDB _id and assigns the user document (containing only the _id field) to req.user.



### What are these functions (`userSchema.statics.signup()` and `userSchema.statics.login()`)?

 - These are custom static methods defined on the Mongoose schema that encapsulate the business logic for user registration and authentication.

---
### Why are they used?

 - Keep authentication logic within the model layer (separation of concerns)

 - Reusable across different parts of the application

 - Encapsulate complex operations like password hashing and validation

 - Follow MVC pattern by moving business logic out of controllers

### Pros:

 - Clean controllers: Controllers become thin, only handling HTTP requests/responses

 - Reusability: Can be called from multiple places (API, CLI, etc.)

 - Testability: Easy to unit test the authentication logic in isolation

 - Maintainability: All user-related logic stays in the User model

### Cons:

 - Model bloat: Can make models large if too many methods are added

 - Tight coupling: Logic is tied to Mongoose/MongoDB

 - Limited flexibility: Harder to switch databases or ORMs

### Alternative approaches:

 - Service layer: Separate service classes that handle business logic

 - Repository pattern: Data access layer + business logic service layer

 - Middleware functions: For simpler cases, logic in route middleware

 - Third-party auth services: Auth0, Firebase Auth, etc.

 - Dependency injection: More decoupled architecture with injected services