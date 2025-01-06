import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: [true, "The age is required"],
    },
    job: {
        type: String,
        required: [true, "The job is required"],
    },
    marital: {
        type: String,
        enum: ["single", "married", "divorced"],
        required: [true, "The marital is required"]
    },
    education: {
        type: String,
        enum: ["primary", "secondary", "tertiary", "unkown"],
        required: [true, "The education ís required"],
        default: "unknown"
    },
    default: {
        type: String,
        enum: ["yes", "no"],
        required: [true, "The default is required"],
    },
    balance: {
        type: Number,
        required: [true, "The balance is required"]
    },
    housing: {
        type: String,
        enum: ["yes", "no"],
        required: [true, "The housing is required"]
    },
    loan: {
        type: String,
        enum: ["yes", "no"],
        required: [true, "The loan is required"]
    },
    contact: {
        type: String,
        enum: ["cellular", "telephone", "unknown"],
        required: [true, "The contact is required"],
        default: "unknown"
    },
    day: {
        type: Number,
        required: [true, "The day ís required"]
    },
    month: {
        type: String,
        enum: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
        required: [true, "The month is required"]
    },
    duration: {
        type: Number,
        required: [true, "The duration is required"]
    },
    campain: {
        type: Number,
        required: [true, "The campain is required"]
    },
    pdays: {
        type: Number,
        required: [true, "The pdays is required"]
    },
    previous: {
        type: Number,
        required: [true, "The previous is required"]
    },
    poutcome: {
        type: String,
        enum: ["success", "fail", "other", "unknown"],
        required: [true, "The poutcome is required"],
        default: "unknown"
    },
    deposit: {
        type: String,
        enum: ["yes", "no"],
        required: [true, "The deposit is required"]
    }
});

const Data = mongoose.model('Data', dataSchema);

export default Data;
