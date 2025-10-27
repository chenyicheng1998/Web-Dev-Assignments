
# Iteration 6: loginUser
## Purpose of userSchema.statics.login  
Encapsulates login logic (email/password validation, bcrypt comparison) within the model, following MVC principles and making the code reusable.

## User.findOne() vs this.findOne()
 - `User.findOne()`: Used outside the model (in controllers)
 - `this.findOne()`: Used inside model static methods (this refers to the User model class)
 - Use `this` in model methods to avoid hardcoding the model name

## bcrypt import location
In the static methods approach, bcrypt belongs in userModel.js because password hashing/validation is model-level logic, keeping concerns separated and improving security.

## Preferred Approach
We prefer static methods.
 - Cleaner separation of concerns
 - More maintainable code
 - Better follows MVC pattern
 - Easier to test and reuse

---

# Iteration 7: signupUser
## userSchema.statics.signup purpose
Moves validation and user creation logic into the model, keeping the controller clean and focused on HTTP handling.

## User.create() vs this.create()
 - `User.create()`: Used in controllers (external)
 - `this.create()`: Used inside model static methods (`this` refers to the model itself)
 - `this` avoids hardcoding and makes code more flexible

## validator import location
In static methods version, validator is in the controller because validation is handled at the controller level rather than in the model.

## Preferred Approach
We prefer static methods.
 - Better separation of concerns
 - Model handles data logic
 - Controller handles HTTP logic
 - More maintainable and testable