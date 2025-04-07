const express = require('express');
const Store = require('../models/Store');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const router = express.Router();
const mongoose = require('mongoose');

// Get inventory for a store
router.get('/:storeId/inventory', async (req, res) => {
    try {
        const { storeId } = req.params;
        const inventory = await Inventory.find({ storeId }).populate('medicineId', 'name');
        res.status(200).json(inventory);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

// Add inventory for a store
// router.post('/:storeId/inventory', async (req, res) => {
//     try {
//         const { storeId } = req.params;
//         const { medicines } = req.body; // Array of { medicineId, quantity }

//         for (const med of medicines) {
//             const existingItem = await Inventory.findOne({
//                 storeId,
//                 medicineId: med.medicineId,
//             });

//             if (existingItem) {
//                 existingItem.quantity += med.quantity;
//                 await existingItem.save();
//             } else {
//                 const newInventory = new Inventory({
//                     storeId,
//                     medicineId: med.medicineId,
//                     quantity: med.quantity,
//                 });
//                 await newInventory.save();
//             }
//         }

//         res.status(201).json({ message: 'Inventory updated successfully' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: err.message });
//     }
// });

// // Update inventory quantity
// router.patch('/:storeId/inventory/:medicineId', async (req, res) => {
//     try {
//         const { storeId, medicineId } = req.params;
//         const { quantity } = req.body;

//         const updatedInventory = await Inventory.findOneAndUpdate(
//             { storeId, medicineId },
//             { quantity },
//             { new: true }
//         );

//         if (!updatedInventory) {
//             return res.status(404).json({ message: 'Inventory item not found' });
//         }

//         res.status(200).json({ message: 'Inventory quantity updated', updatedInventory });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: err.message });
//     }
// });


// Export the router, not the model
module.exports = router;

