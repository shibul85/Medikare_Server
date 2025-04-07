const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    medicines: [
        {
            medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
            name: { type: String, required: true},
            quantity: { type: Number, required: true },
        },
    ],
});

module.exports = mongoose.model('Inventory', inventorySchema);
