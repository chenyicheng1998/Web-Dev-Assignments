const Feedback = require("./feedbackLib");

// GET /feedbacks
const getAllFeedbacks = (req, res) => {
  const feedbacks = Feedback.getAll();
  res.json(feedbacks);
};

// POST /feedbacks
const createFeedback = (req, res) => {
  const { sender, message, rating } = req.body;

  const newFeedback = Feedback.addOne(sender, message, rating);

  if (newFeedback) {
    res.json(newFeedback);
  } else {
    res.status(500).json({ message: "Failed to create feedback" });
  }
};

// GET /feedbacks/:feedbackId
const getFeedbackById = (req, res) => {
  const feedbackId = req.params.feedbackId;
  const feedback = Feedback.findById(feedbackId);

  if (feedback) {
    res.json(feedback);
  } else {
    res.status(404).json({ message: "Feedback not found" });
  }
};

// PUT /feedbacks/:feedbackId
const updateFeedback = (req, res) => {
  const feedbackId = req.params.feedbackId;
  const { sender, message, rating } = req.body;

  const updatedFeedback = Feedback.updateOneById(feedbackId, { sender, message, rating });

  if (updatedFeedback) {
    res.json(updatedFeedback);
  } else {
    res.status(404).json({ message: "Feedback not found" });
  }
};

// DELETE /feedbacks/:feedbackId
const deleteFeedback = (req, res) => {
  const feedbackId = req.params.feedbackId;
  const isDeleted = Feedback.deleteOneById(feedbackId);

  if (isDeleted) {
    res.json({ message: "Feedback deleted successfully" });
  } else {
    res.status(404).json({ message: "Feedback not found" });
  }
};

module.exports = {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};