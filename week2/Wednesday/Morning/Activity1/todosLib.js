
let todosArray = [];
let nextId = 1;

function addOne(task, completed = false, dueDate) {
  // Check if any parameter is empty or undefined
  if (!task || !dueDate) {
    return false;
  }

  const newTodo = {
    id: nextId++,   // Assigns a unique id and increments it
    task,
    completed,
    dueDate
  };

  todosArray.push(newTodo);
  return newTodo;
}

function getAll() {
  return todosArray;
}

function findById(id) {
  const numericId = Number(id); // Converts the ID to a number
  const todo = todosArray.find(item => item.id === numericId); // Finds the todos with the matching ID
  return todo || false; // Returns the todos or false if not found
}

function updateOneById(id, updatedData) {
  const todo = findById(id);
  if (todo) {
    // Update properties only if they are provided in updatedData
    if (updatedData.task) todo.task = updatedData.task;
    if (typeof updatedData.completed === "boolean") todo.completed = updatedData.completed;
    if (updatedData.dueDate) todo.dueDate = updatedData.dueDate;
    return todo; // Returns the updated todos object
  }
  return false;
}

function deleteOneById(id) {
  const todo = findById(id);
  if (todo) {
    const initialLength = todosArray.length;
    todosArray = todosArray.filter(item => item.id !== Number(id)); // Filters out the todos with the matching ID
    return todosArray.length < initialLength; // Returns true if the array length decreased, indicating successful deletion
  }
  return false; // Returns false if the todos was not found
}




if (require.main === module) {
  let result = addOne("Buy groceries", false, "2025-08-30");
  console.log("Added:", result);

  result = addOne("Finish project", false, "2025-09-05");
  console.log("Added:", result);

  console.log("getAll called:", getAll());

  console.log("findById(1):", findById(1));

  console.log("updateOneById(1):", updateOneById(1, { completed: true, task: "Buy groceries and snacks" }));

  console.log("findById(1) after update:", findById(1));

  console.log("deleteOneById(1):", deleteOneById(1));

  console.log("findById(1) after delete:", findById(1));
}


const ToDos = {
  getAll,
  addOne,
  findById,
  updateOneById,
  deleteOneById
};

module.exports = ToDos;
