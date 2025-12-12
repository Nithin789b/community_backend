import DonateForm from "../Models/donationformModel.js";


// SUBMIT DONATION FORM
export const submitDonationForm = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found."
      });
    }
    console.log(req.body);

    const {
      age,
      height,
      weight,
      hb,
      bp,
      bloodGroup,
      bloodComponents,
      hasDonatedPreviously,
      diseases,
      lastDonationDate,
      medications,
      surgeries,
      recentProcedures,
      liveAccess
    } = req.body;

    // REQUIRED FIELD CHECK
    if (!age || !height || !weight || !hb || !bp || !bloodGroup || !bloodComponents) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields."
      });
    }

    // ARRAY VALIDATION
    const arrayFields = { diseases, medications, surgeries };

    for (const [key, value] of Object.entries(arrayFields)) {
      if (!Array.isArray(value)) {
        return res.status(400).json({
          success: false,
          message: `Invalid format for '${key}'. Expected an array.`
        });
      }
    }

    const newForm = await DonateForm.create({
      user: userId,
      Age : age,
      Height : height,
      Weight : weight,
      Hb : hb,
      Bp : bp,
      bloodgroup : bloodGroup,
      likeToDonate :bloodComponents,
      DonationHistory: {donatePreviously : hasDonatedPreviously , lastDonationDate : lastDonationDate },
      recentActivities : recentProcedures,
      diseases,
      medications,
      surgeriesHistory : surgeries,
      shareLocation : liveAccess
    });
    
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



// GET ALL DONATION FORMS
export const getAllDonationForms = async (req, res) => {
  try {
    const forms = await DonateForm.find()
      .populate("user", "name email mobile gender");

    return res.status(200).json({
      success: true,
      count: forms.length,
      donors: forms
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
