import mongoose from "mongoose";

const medicineformSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },  
    medicineName: { type: String, required: true },
    genericName: { type: String, required: false },
    dosage: { type: String, required: true },
    medicineType : {
        type: String,
        required: true,
        enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Inhaler', 'Drops', 'Other']
    },

    frequency: { type: String, required: true ,enum: ['Once a day', 'Twice a day', 'Thrice a day', 'As needed','custom']},
    timeslots : {
        type: [String], 
        default: []
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: false },
    whenToTake: {
        type: String,
        required: true,
        enum: ['Before Food', 'After Food', 'With Food', 'Empty Stomach','Anytime']
    },
    specialInstructions: { type: String, required: false, default: '' },
    possibleSideEffects: { type: String, required: false, default: '' },
    currentStock: { type: String, required: false },
    lowStockAlert: { type: String, required: false },
    refillReminder: { type: Boolean, required: false  },
    automaticRefill: { type: Boolean, required: false },
    
}, { timestamps: true });

export const MedicineForm = mongoose.model('medicineform', medicineformSchema);