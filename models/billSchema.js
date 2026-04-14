import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    serialNo: {
      type: Number,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Head",
      required: true,
    },
    vendorBillNo: {
      type: String,
      required: true,
      trim: true,
    },
    comments: {
      type: String,
      trim: true,
    },
    items: [
      {
        item: {
          type: String,
          trim: true,
          required: true,
        },
        unit: {
          type: String,
          required: true,
          trim: true
        },
        rate: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        comments: {
          type: String,
          trim: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Bill", billSchema);
