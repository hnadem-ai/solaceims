import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
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
    estimatedValue: {
      type: Number,
      required: true,
    },
    utilities: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Inventory", inventorySchema);
