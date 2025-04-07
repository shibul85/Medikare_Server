const Store = require("../models/Store");
const Notification = require("../models/Notification");

exports.approveStoreRequest = async (req, res) => {
  const { storeId, action } = req.body;

  try {
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    store.isApproved = action === "approve";
    await store.save();

    // Notify the store
    await Notification.create({
      storeId,
      message: `Your request has been ${action}d.`,
      status: action,
    });

    res.status(200).json({ message: `Store ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error });
  }
};
