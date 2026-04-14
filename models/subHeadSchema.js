import mongoose from "mongoose";

const headSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
})

export default mongoose.model("SubHead", headSchema);