import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    datetime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed'],
        default: 'scheduled'
    },
    enabled: {
        type: Boolean,
        default: true
    },
    ringtone: {
        type: String,
        default: 'classic'
    }
}, { timestamps: true });

const Reminder = mongoose.model("Reminder", reminderSchema);

export default Reminder;
