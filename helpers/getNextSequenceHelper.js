import Counter from "../models/counterSchema.js";

async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
    }
  );

  return counter.seq;
}

export default getNextSequence;
