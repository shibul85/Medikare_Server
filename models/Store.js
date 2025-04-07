const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true }
}, { collection: 'stores' });

module.exports = mongoose.model('Store', storeSchema);
