const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    customerName: { type: String, required: true },
    items: [
        {
            medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bill', BillSchema);
