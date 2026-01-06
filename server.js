import express from "express";
import cors from "cors";
import connectDB from "./db/connect.js";
import dotenv from 'dotenv';
import Project from './models/projectSchema.js';
import Bank from './models/bankSchema.js';
import Bill from './models/billSchema.js';
import Vendor from './models/vendorSchema.js';
import Inventory from './models/inventorySchema.js';
import Sale from './models/saleSchema.js';
import DebitVoucher from './models/debitVoucherSchema.js';
import CreditReceipt from './models/creditReceiptSchema.js';

const app = express();
dotenv.config();
app.use(cors({
  origin: '*',
  methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'UPDATE' ]
}))
app.use(express.json());

app.post("/api/project", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    if(!project){
      return res.status(400).json({message: "Couldn't create a new Project!"})
    }
    return res.status(200).json({project, success: true});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Internal Server Error!'})
  }
});

app.post("/api/bank", async (req, res) => {
  try {
    const bank = await Bank.create(req.body);
    if(!bank){
      return res.status(400).json({message: "Couldn't create a new Bank!"})
    }
    return res.status(200).json({bank, success: true});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Internal Server Error!'})
  }
});

app.post("/api/bill", async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    if(!bill){
      return res.status(400).json({message: "Couldn't create a new Bill!"})
    }
    return res.status(200).json({bill, success: true});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Internal Server Error!'})
  }
});

app.post("/api/vendor", async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    if(!vendor){
      return res.status(400).json({message: "Couldn't create a new Vendor!"})
    }
    return res.status(200).json({vendor, success: true});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Internal Server Error!'})
  }
});

app.post("/api/inventory", async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body).lean();
    if(!inventory){
      return res.status(400).json({message: "Couldn't create a new Inventory!"})
    }
    return res.status(200).json({inventory, success: true});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Internal Server Error!'})
  }
});

app.post("/api/sale", async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    if(!sale){
      return res.status(400).json({message: "Couldn't create a new Sale!"})
    }
    return res.status(200).json({sale, success: true});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Internal Server Error!'})
  }
});

app.post("/api/debit-voucher", async (req, res) => {
  try {
    const debitVoucher = await DebitVoucher.create(req.body);
    if(!debitVoucher){
      return res.status(400).json({message: "Couldn't create a new Debit Voucher!"})
    }
    return res.status(200).json({debitVoucher, success: true});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Internal Server Error!'})
  }
});

app.post("/api/credit-receipt", async (req, res) => {
  try {
    const creditReceipt = await CreditReceipt.create(req.body);
    if(!creditReceipt){
      return res.status(400).json({message: "Couldn't create a new Credit Receipt!"})
    }
    return res.status(200).json({creditReceipt, success: true});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Internal Server Error!'})
  }
});

connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.SERVER_PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });
