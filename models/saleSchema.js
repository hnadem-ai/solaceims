import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    fileNo: {
      type: String,
      required: true,
      trim: true,
    },
    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    saleType: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fatherOrHusbandName: {
      type: String,
      required: true,
      trim: true,
    },
    postalAddress: {
      type: Number,
    },
    residentialAddress: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
    cnic: {
      type: Number,
      required: true,
    },
    nomineeName: {
      type: String,
      required: true,
      trim: true,
    },
    nomineeCnic: {
      type: Number,
      required: true,
    },
    nomineeRelationship: {
      type: String,
      required: true,
      trim: true,
    },
    nomineeAddress: {
      type: String,
      required: true,
      trim: true,
    },
    unitCost: {
      type: Number,
      required: true,
    },
    utilitycharges: {
      type: String,
      required: true,
    },
    westOpen: Boolean,
    parkFacing: Boolean,
    corner: Boolean,
    TotalPrice: {
      type: Number,
      required: true,
    },
    inventory: [
      {
        date: Date,
        amount: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    comments: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Sale", saleSchema);
