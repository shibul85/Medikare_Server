const mongoose = require('mongoose');

const healthIssueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // name is required
    },
    description: {
        type: String,
        required: true, // description is required
    },
    relatedMedicines: [{
        type: String, // Assuming it's a list of medicine names
        required: false,
    }],
});

const HealthIssue = mongoose.model('HealthIssue', healthIssueSchema);

module.exports = HealthIssue;
