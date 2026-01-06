import mongoose from "mongoose";

const creditReceiptSchema = mongoose.Schema(
  {
    serialNo: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    payInstrument: {
      type: String,
      required: true,
      enum: ["Cash", "Post Dated Cheque", "Cheque", "Online Transfer"],
    },
    instrumentNo: {
      type: String,
      trim: true,
    },
    instrumentDate: Date,
    instrumentNo: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    chequeStatus: {
      type: String,
      trim: true,
      enum: ["paid", "bounced", "unpaid"],
    },
  }
);

export default mongoose.model("CreditReceipt", creditReceiptSchema);
