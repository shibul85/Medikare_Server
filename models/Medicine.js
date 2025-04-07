const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: String,
    description: String,
    availability: [
        {
            storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
            quantity: Number,
        },
    ],
}, { collection: 'medicines', default: { availability: null } }); // Set default value as null

module.exports = mongoose.model('Medicine', medicineSchema);
