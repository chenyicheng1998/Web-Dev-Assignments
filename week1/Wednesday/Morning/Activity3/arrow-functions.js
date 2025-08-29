// Regular function
function sayHello() {
  return "Hello, world!";
}

// Arrow Function
const sayHelloArrow = () => "Hello, world!";



// Regular function
function double(x) {
    return x * 2;
}

// Arrow Function
const doubleArrow = x => x * 2;



// Regular function
function add(x, y) {
    return x + y;
}

// Arrow Function
const addArrow = (x, y) => x + y;



// Regular function
const person = {
    name: "Alice",
    sayHi: function() {
        return "Hi, " + this.name + "!";
    }
};

// Arrow Function
const personArrow = {
    name: "Alice",
    sayHi: () => "Hi, " + this.name + "!" // 'this' will not work as expected here
};


// Callback Function
const numbers = [1, 2, 3, 4, 5];
const doubled = [];
numbers.forEach(function(num) {
  doubled.push(num * 2);
});


// Arrow Function
numbers.forEach(num =>  doubled.push(num * 2));

