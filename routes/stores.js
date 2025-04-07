const express = require("express");
const Store = require("../models/Store");
const router = express.Router();
const Medicine = require("../models/Medicine");
const mongoose = require("mongoose");

// Get all stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a medicine to store inventory
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid medicine ID" });
    }

    const medicine = await Medicine.findById(id).populate(
      "availability.storeId",
      "name location"
    ); // Adjust as needed for store fields

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (err) {
    console.error("Error fetching medicine by ID:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Search medicines and get related stores
router.post("/medicines/search-with-stores", async (req, res) => {
  try {
    const { query } = req.body;

    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    if (medicines.length === 0) {
      return res.json({
        medicines: [],
        stores: [],
        message: "No stores found with these medicines",
      });
    }

    const medicineIds = medicines.map((medicine) => medicine._id);

    const stores = await Store.find({
      "inventory.medicineId": { $in: medicineIds },
    }).populate("inventory.medicineId");

    const formattedStores = stores.map((store) => ({
      _id: store._id,
      name: store.name,
      address: store.address,
      contact: store.contact,
      inventory: store.inventory
        .filter((item) => medicineIds.includes(item.medicineId._id))
        .map((item) => ({
          medicine: {
            _id: item.medicineId._id,
            name: item.medicineId.name,
            description: item.medicineId.description,
          },
          quantity: item.quantity,
        })),
    }));

    res.json({ medicines, stores: formattedStores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/inventory",
  async (req, res) => {
    try {
      const { medicineId, storeId, quantity } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(medicineId) ||
        !mongoose.Types.ObjectId.isValid(storeId)
      ) {
        return res
          .status(400)
          .json({ message: "Invalid medicine or store ID" });
      }

      const medicine = await Medicine.findById(medicineId);
      const store = await Store.findById(storeId);

      if (!medicine || !store) {
        return res.status(404).json({ message: "Medicine or store not found" });
      }

      const existingAvailability = medicine.availability.find(
        (entry) => entry.storeId.toString() === storeId
      );

      if (existingAvailability) {
        existingAvailability.quantity += quantity;
      } else {
        medicine.availability.push({ storeId, quantity });
      }

      await medicine.save();

      res.status(200).json({
        message: "Inventory updated successfully",
        medicine,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


router.get("/store-requests/:storeId", async (req, res) => {
  try {
    const requests = await Request.find({
      storeId: req.params.storeId,
      status: "pending",
    })
      .populate("medicineId", "name")
      .populate("userId", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
});

router.get("/admin/stores/pending", async (req, res) => {
  try {
    const stores = await Store.find({ status: "pending" });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stores", error });
  }
});

router.put("/admin/store/:id", async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  try {
    await Store.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `Store ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Error updating store status", error });
  }
});

module.exports = router;
