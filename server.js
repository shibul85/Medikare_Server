const express = require('express');
const mongoose = require('mongoose')
const connectDB = require('./config');
const medicinesRoute = require('./routes/medicines');
const storesRoute = require('./routes/stores');
const healthIssuesRoute = require('./routes/healthIssues');
const inventoryRoute = require('./routes/inventory');
const billsRoute = require('./routes/bills');
const cors = require('cors');

const app = express();
connectDB();
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB:', mongoose.connection.db.databaseName);
});
app.use(cors());


const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/medicines', medicinesRoute);
app.use('/api/stores', storesRoute);
app.use('/api/healthissues', healthIssuesRoute);
app.use('/api/inventory', inventoryRoute);
app.use('/api/bills', billsRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
