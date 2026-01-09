import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    detail: {
      type: String,
      trim: true,
    },
    bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
    inventoryCounter: {
      type: Number,
      default: 0,
    },
    inventory: [
      {
        serialNo: {
          type: Number,
          required: true,
        },
        floor: {
          type: Number,
          required: true,
        },
        unitNo: {
          type: String,
          trim: true,
        },
        size: {
          type: Number,
          required: true,
        },
        estimatedValue: {
          type: Number,
          required: true,
        },
        utilities: {
          type: Number,
        },
        remarks: {
          type: String,
          trim: true,
        },
      },
    ],
    status: {
      type: String,
      trim: true,
      enum: ["future", "ongoing", "completed"],
      default: 'ongoing',
    },
  },
  {
    timestamps: true, // recommended
  }
);

export default mongoose.model("Project", projectSchema);
