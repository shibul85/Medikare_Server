const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');

const removeDuplicateAvailability = async () => {
  try {
    await mongoose.connect('mongodb+srv://panigrahiratnakar61:medikare61@cluster0.pi6fe.mongodb.net/medkare?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB!");

        // Fetch all medicines from the database
        const medicines = await Medicine.find();

        // Loop through each medicine
        for (let medicine of medicines) {
          // Create a set to track unique storeId values
          const seenStoreIds = new Set();
          
          // Filter out duplicate storeId entries
          medicine.availability = medicine.availability.filter((store) => {
            if (seenStoreIds.has(store.storeId.toString())) {
              return false; // If storeId is already seen, remove the entry
            }
            seenStoreIds.add(store.storeId.toString());
            return true;
          });
    
          // Save the updated medicine document with unique availability entries
          await medicine.save();
          console.log(`Removed duplicate availability entries for medicine: ${medicine.name}`);
        }
    
        console.log("Duplicate availability entries removed successfully!");
        mongoose.disconnect();
      } catch (error) {
        console.error("Error removing duplicate availability entries:", error);
      }
    };
    
    // Run the function to remove duplicate availability entries
    removeDuplicateAvailability();