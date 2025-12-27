import mongoose from "mongoose";

const programLeadSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ProgramLead = mongoose.model("ProgramLead", programLeadSchema);

export default ProgramLead;
