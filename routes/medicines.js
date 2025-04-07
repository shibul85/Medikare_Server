const express = require('express');
const Medicine = require('../models/Medicine');
const { default: mongoose } = require('mongoose');
const router = express.Router();

// Get all medicines
router.get('/', async (req, res) => {
    try {
        console.log("Fetching medicines...");
        const medicines = await mongoose.connection.db.collection('medicines').find().toArray();
        console.log("Fetched medicines:", medicines);
        res.json(medicines);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
      const medicine = await Medicine.findById(req.params.id)
        .populate('availability.storeId')  // Populate storeId with store details
        .exec();
  
      if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found' });
      }
  
      res.json(medicine);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Add a new medicine
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate input
        if (!name || !description) {
            return res.status(400).json({ message: 'All fields are required: name, description' });
        }

        // Create a new medicine with default availability
        const newMedicine = new Medicine({
            name,
            description,
            availability: [], // Default to an empty array
        });
        await newMedicine.save();

        res.status(201).json({ message: 'Medicine added successfully', medicine: newMedicine });
    } catch (err) {
        console.error("Error adding medicine:", err.message);
        res.status(500).json({ message: err.message });
    }
});


// Search for medicines
router.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        const medicines = await Medicine.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ],
        });
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/request-medicine', async (req, res) => {
    const { userId, medicineId, storeId, quantity } = req.body;
    try {
      const newRequest = new Request({
        userId,
        medicineId,
        storeId,
        quantity,
        status: 'pending', // status can be 'pending', 'accepted', or 'rejected'
      });
      await newRequest.save();
      res.status(201).json({ message: 'Request submitted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting request', error });
    }
  });
  

module.exports = router;
