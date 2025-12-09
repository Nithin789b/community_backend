import DonateForm from "../Models/donationformModel.js";

export const submitDonationForm = async (req, res) => {
    try {
        const {
            Age,
            Weight,
            Hb,
            Bp,
            bloodgroup,
            likeToDonate,
            DonationHistory,
            recentActivities,
            diseases,
            medications,
            surgeriesHistory,
            shareLocation
        } = req.body;


        if (!Age || !Weight || !Hb || !Bp || !bloodgroup || !likeToDonate) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        if (
            !Array.isArray(diseases) ||
            !Array.isArray(medications) ||
            !Array.isArray(recentActivities) ||
            !Array.isArray(surgeriesHistory)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid data format. Expected arrays for checkbox fields."
            });
        }

        const newForm = new DonateForm({
            user: req.user._id,
            Age,
            Weight,
            Hb,
            Bp,
            bloodgroup,
            likeToDonate,
            DonationHistory,
            recentActivities,
            diseases,
            medications,
            surgeriesHistory,
            shareLocation
        });

        await newForm.save();

        return res.status(201).json({
            success: true,
            message: "Donation form submitted successfully!",
            data: newForm
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


export const getAllDonationForms = async (req, res) => {
    try {
        const forms = await DonateForm.find().populate("user", "name email");

        return res.status(200).json({
            success: true,
            count: forms.length,
            data: forms
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


