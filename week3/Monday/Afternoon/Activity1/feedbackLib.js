/* 
// The data model for message is as follows
{
  "sender": "John Smith",
  "message": "Great session on React components! I found the examples very helpful.",
  "rating": 5
}
*/

let messageArray = [];

let nextId = 1;

const getAll = () => {
  return messageArray;
}

const addOne = (sender, message, rating) => {
  // Check if any parameter is empty or undefined
  if (!sender || !message || rating === undefined) {
    return false;
  }

  const newMessage = {
    id: nextId++,
    sender,
    message,
    rating,
  };

  messageArray.push(newMessage);
  return newMessage;
}

const findById = id => {
  const msg = messageArray.find((item) => item.id == id);
  return msg ? msg : false;
}

const updateOneById = (id, updatedData) => {
  const msg = findById(id);
  if (msg) {
    if (updatedData.sender) {
      msg.sender = updatedData.sender;
    }
    if (updatedData.message) {
      msg.message = updatedData.message;
    }
    if (updatedData.rating !== undefined) {
      msg.rating = updatedData.rating;
    }
    return msg;
  }
  return false;
}

const deleteOneById = id => {
  const msg = findById(id);
  if (msg) {
    const initialLength = messageArray.length;
    messageArray = messageArray.filter((item) => item.id != id);
    return messageArray.length < initialLength;
  }
  return false;
}

if (require.main === module) {
  // Add message
  let result = addOne("John Smith", "Great session on React components! I found the examples very helpful.", 5);
  console.log(result);

  // Add another message
  result = addOne("Alice Johnson", "Could you share more details on lifecycle methods?", 4);
  console.log(result);

  console.log("getAll called:", getAll());

  console.log("findById called:", findById(1));

  console.log("updateOne called:", updateOneById(1, { rating: 4 }));
  console.log("findById called after item updated:", findById(1));

  console.log("deleteOneById called:", deleteOneById(1));
  console.log("findById called after item deleted:", findById(1));
}

Message = {
  getAll,
  addOne,
  findById,
  updateOneById,
  deleteOneById,
};

module.exports = Message;
