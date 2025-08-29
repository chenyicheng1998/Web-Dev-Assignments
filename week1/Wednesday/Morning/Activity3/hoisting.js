// Step 1: Refactoring
// 1.
const cube = function (x) {
  return x * x * x;
}

// 2.
const fullName = function (first, last) {
  return first + " " + last;
}

// 3.
const power = function (base, exp) {
  if (exp === 0) {
    return 1;
  }
  return base * power(base, exp - 1);
}

// 4.
const sumCubes = function (numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total = total + cube(numbers[i]);
  }
  return total;
}

// Step 2: Mechanics of Hoisting

// 1. Why does JavaScript output undefined instead of throwing an error in the following code?
console.log(message);
var message = 'Hi there!';
// Due to variable hoisting, var message is declared (but not initialized) at the top of the scope. So console.log(message) accesses the variable exists but has the value undefined, rather than causing a ReferenceError.


// 2. Why does JavaScript throw an error instead of logging undefined in the following code?
console.log(message);
let message = 'Hi there!';
// let variables are hoisted but remain in the Temporal Dead Zone (TDZ) until initialization. Accessing them before declaration throws a ReferenceError instead of returning undefined.

// 3. Explain precisely what happens when the following code is executed.
console.log(showMessage());
const showMessage = function () {
  return 'Hi there!';
};
// A ReferenceError is thrown because const variables are hoisted but remain uninitialized in the Temporal Dead Zone (TDZ). Accessing showMessage before its declaration is not allowed.

// 4. Why does JavaScript not throw any errors when the following code is executed?
console.log(showMessage());
function showMessage() {
  return 'Hi there!';
}
// Function declarations are fully hoisted - both the declaration and implementation are moved to the top of the scope. So showMessage() is available before its code position.


// Step 3: Code Restructuring
// 1.
let values = [10, 20, 30];
for (let i = 0; i < values.length; i++) {
  console.log(values[i]);
}

// 2.
let lastLogin = '1/1/1970';
console.log(welcome('Charlie', 'Munger'));
function welcome(first, last) {
  return `Welcome, ${first} ${last}! You last logged in on ${lastLogin}.`
};

