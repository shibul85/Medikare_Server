const express = require('express');
const MedicineRequest = require('../models/MedicineRequest');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to request medicine
router.post('/requestMedicine', verifyToken, async (req, res) => {
  const { storeId, medicineId, quantity } = req.body;

  try {
    const newRequest = new MedicineRequest({
      userId: req.user.id,  // The ID of the user making the request
      storeId,
      medicineId,
      quantity,
    });
    await newRequest.save();
    res.status(201).json({ message: 'Medicine request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error while requesting medicine', error });
  }
});

// Admin can view all requests and approve/reject stores
router.get('/admin/requests', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const requests = await MedicineRequest.find().populate('storeId').populate('medicineId');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
});

// Admin can approve or reject a store's request
router.post('/admin/approveStore', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { storeId, action } = req.body;  // action can be 'approve' or 'reject'

  try {
    if (action === 'approve') {
      // Implement logic to approve the store
      // e.g., update store status to 'approved'
    } else if (action === 'reject') {
      // Reject the store
      // e.g., remove store from the list or mark as 'rejected'
    }
    res.status(200).json({ message: `Store ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error processing store request', error });
  }
});

module.exports = router;
