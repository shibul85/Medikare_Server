const express = require('express');
const Store = require('../models/Store');
const Medicine = require('../models/Medicine');
const Bill = require('../models/Bill');
const router = express.Router();

router.post('/store/:storeId/bills', async (req, res) => {
    const { month, year } = req.body;
    const storeId = req.params.storeId;

    try {
        const sales = await Sales.aggregate([
            { $match: { storeId, month, year } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$amount' },
                    totalTax: { $sum: '$tax' },
                },
            },
        ]);

        const newBill = new Bill({
            storeId,
            month,
            year,
            totalSales: sales[0]?.totalSales || 0,
            taxPaid: sales[0]?.totalTax || 0,
        });
        await newBill.save();
        res.status(201).json({ message: 'Bill generated', bill: newBill });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;