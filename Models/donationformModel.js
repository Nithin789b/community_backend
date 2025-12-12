import mongoose from 'mongoose';

const donateformSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    Age: { type: String, required: true },
    Weight: { type: String, required: true },
    Hb: { type: String, required: true },
    Bp: { type: String, required: true },

    bloodgroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },

    likeToDonate: {
        type: [String],
        required: true,
        enum: ['whole Blood', 'Plasma', 'Platelets', 'RBC', 'WBC']
    },

    DonationHistory: [
        {
            donatePreviously: {
                type: String,
                required: true,
                enum: ['yes', 'no']
            },
            lastDonationDate: {
                type: String,
                required: false
            }
        }

        
    ],

   
    recentActivities: {
        type: [String], 
        default: []
    },

    
    diseases: {
        type: [String], 
        default: []
    },

   
    medications: {
        type: [String], 
        default: []
    },

    surgeriesHistory: {
        type: [String], 
        default: []
    },

    shareLocation: {
        type: Boolean,
        required: true,
        default: false
    }

}, { timestamps: true });

const DonateForm = mongoose.model("DonateForm", donateformSchema);

export default DonateForm;