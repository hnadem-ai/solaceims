import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    accNum: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    accHolder: {
      type: String,
      required: true,
      trim: true,
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Bank", bankSchema);
