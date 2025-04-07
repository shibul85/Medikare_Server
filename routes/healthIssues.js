const express = require('express');
const HealthIssue = require('../models/HealthIssue');
const router = express.Router();

// Get all health issues
router.get('/', async (req, res) => {
    try {
        const healthIssues = await HealthIssue.find();
        res.json(healthIssues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new health issue
router.post('/', async (req, res) => {
    try {
        const { name, description, relatedMedicines } = req.body;

        // Create a new health issue
        const healthIssue = new HealthIssue({
            name,
            description,
            relatedMedicines,
        });

        // Save the health issue to the database
        await healthIssue.save();
        res.status(201).json(healthIssue);  // Respond with the newly created health issue
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all health issues and their related medicines
router.get('/healthIssues', async (req, res) => {
    try {
        const healthIssues = await HealthIssue.find();
        const medicines = await Medicine.find(); // fetch all medicines
        
        // Merge the medicines data with related medicines in health issues
        const healthIssuesWithMedicines = healthIssues.map(issue => {
            const relatedMedicines = issue.relatedMedicines.map(medicineName => {
                return medicines.find(med => med.name === medicineName); // match by name
            });
            return {
                ...issue._doc,
                relatedMedicines: relatedMedicines
            };
        });

        res.json(healthIssuesWithMedicines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
