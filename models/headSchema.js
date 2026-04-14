import mongoose from "mongoose";

const subHeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedName: {
      type: String,
      required: true,
    },
  },
  { _id: true }
);

subHeadSchema.pre("validate", function () {
  if (this.name) {
    this.name = this.name.trim();
    this.normalizedName = this.name.toLowerCase();
  }
});

const headSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subHeads: {
      type: [subHeadSchema],
      default: [],
    },
  },
  { timestamps: true }
);

headSchema.pre("validate", function () {
  if (this.name) {
    this.name = this.name.trim();
    this.normalizedName = this.name.toLowerCase();
  }
});

export default mongoose.model("Head", headSchema);