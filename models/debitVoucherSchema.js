import mongoose from "mongoose";

const debitVoucherSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    serialNo: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    paidTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetModel",
      required: true,
    },
    targetModel: {
      type: String,
      required: true,
      enum: ["Project", "Vendor"],
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
    bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
    },
    bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
    payStatus: {
      type: String,
      required: true,
      enum: ["paid", "in-progress", "unpaid"],
    },
    heads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Head",
      },
    ],
    subHeads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubHead",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DebitVoucher", debitVoucherSchema);
