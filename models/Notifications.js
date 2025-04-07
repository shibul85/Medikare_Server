const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
  quantity: Number,
  message: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
