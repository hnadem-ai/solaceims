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
import Counter from './models/counterSchema.js';
import Head from './models/headSchema.js';
import mongoose from "mongoose";

const app = express();
dotenv.config();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE']
}))
app.use(express.json());

// APIs (method: 'GET')

app.get("/api/project", async (req, res) => {
  try {
    const { q, lastId } = req.query;
    const filter = {};

    if (q?.trim()) {
      filter.name = { $regex: q.trim(), $options: "i" };
    }

    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({ message: "Invalid lastId!" });
      }
      filter._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const projects = await Project.find(filter)
      .populate("bank", "accNum name")
      .sort({ _id: -1 })
      .limit(20);

    return res.status(200).json({
      projects,
      nextLastId: projects.at(-1)?._id ?? null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.get("/api/bank", async (req, res) => {
  try {
    console.log("'/api/bank' Request Received");

    const { q, lastId } = req.query;
    let filter = {};

    if (q && q.trim() !== "") {
      filter.$or = [
        { name: { $regex: q.trim(), $options: "i" } },
        { accNum: { $regex: q.trim(), $options: "i" } },
      ];
    }

    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({ message: "Invalid lastId!" });
      }
      filter._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const banks = await Bank.find(filter)
      .sort({ _id: -1 })
      .limit(20);

    return res.status(200).json({
      banks,
      nextLastId: banks.length > 0 ? banks[banks.length - 1]._id : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.get("/api/bill", async (req, res) => {
  try {
    const { q, lastId, limit = 20 } = req.query;

    let filter = {};

    if (q && q.trim()) {
      const search = q.trim();

      // 🔍 1. Find matching vendors
      const vendors = await Vendor.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      console.log(vendors)

      const vendorIds = vendors.map(v => v._id);

      // 🔍 2. Apply combined filter
      filter.$or = [
        {
          // serialNo search
          $expr: {
            $regexMatch: {
              input: { $toString: "$serialNo" },
              regex: search,
              options: "i",
            },
          },
        },
        {
          // vendor name search
          vendor: { $in: vendorIds },
        },
      ];
    }

    // 🔑 Pagination
    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({ message: "Invalid lastId!" });
      }
      filter._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const bills = await Bill.find(filter)
      .populate("vendor", "name")
      .sort({ _id: -1 })
      .limit(Number(limit));

    return res.status(200).json({
      bills,
      nextLastId: bills.at(-1)?._id ?? null,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.get("/api/vendor", async (req, res) => {
  try {
    console.log("hello from vendor get all");

    const { q, lastId } = req.query;
    let filter = {};

    if (q && q.trim() !== "") {
      filter.name = { $regex: q.trim(), $options: "i" };
    }

    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({ message: "Invalid lastId!" });
      }
      filter._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const vendors = await Vendor.find(filter)
      .sort({ _id: -1 })
      .limit(20);

    return res.status(200).json({
      vendors,
      nextLastId: vendors.length > 0 ? vendors[vendors.length - 1]._id : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.get("/api/head", async (req, res) => {
  try {
    console.log("hello from head get all");

    const { q, lastId } = req.query;
    let filter = {};

    if (q && q.trim() !== "") {
      filter.name = { $regex: q.trim(), $options: "i" };
    }

    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({ message: "Invalid lastId!" });
      }
      filter._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const heads = await Head.find(filter)
      .sort({ _id: -1 })
      .limit(20);

    return res.status(200).json({
      heads,
      nextLastId: heads.length > 0 ? heads[heads.length - 1]._id : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.get("/api/sale", async (req, res) => {
  try {
    const { q, lastId } = req.query;
    let filter = {};

    if (q && q.trim() !== "") {
      filter.$or = [
        { fileNo: { $regex: q.trim(), $options: "i" } },
        { projectName: { $regex: q.trim(), $options: "i" } },
        { name: { $regex: q.trim(), $options: "i" } },
      ];
    }

    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({ message: "Invalid lastId!" });
      }
      filter._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const sales = await Sale.find(filter)
      .select("_id project projectName fileNo inventory TotalPrice")
      .sort({ _id: -1 })
      .limit(20);

    return res.status(200).json({
      sales,
      nextLastId: sales.length > 0 ? sales[sales.length - 1]._id : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.get("/api/sale/:projectId", async (req, res) => {
  try {
    const { q, lastId } = req.query;
    const projectId = req.params.projectId;

    let filter = {
      project: projectId,
    };

    if (q && q.trim() !== "") {
      filter.$or = [
        { fileNo: { $regex: q.trim(), $options: "i" } },
        { projectName: { $regex: q.trim(), $options: "i" } },
        { name: { $regex: q.trim(), $options: "i" } },
      ];
    }

    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({ message: "Invalid lastId!" });
      }
      filter._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const sales = await Sale.find(filter)
      .select("_id project projectName fileNo name TotalPrice inventory")
      .sort({ _id: -1 })
      .limit(20);

    return res.status(200).json({
      sales,
      nextLastId: sales.length > 0 ? sales[sales.length - 1]._id : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.get("/api/debit-voucher", async (req, res) => {
  try {
    const { lastId } = req.query;
    let filter = {};

    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({ message: "Invalid lastId!" });
      }
      filter._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const debitVouchers = await DebitVoucher.find(filter)
      .sort({ _id: -1 })
      .limit(20);

    return res.status(200).json({
      debitVouchers,
      nextLastId: debitVouchers.length > 0 ? debitVouchers[debitVouchers.length - 1]._id : null,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.get("/api/credit-receipt", async (req, res) => {
  try {
    const { lastId } = req.query;
    let filter = {};

    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({ message: "Invalid lastId!" });
      }
      filter._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const creditReceipts = await CreditReceipt.find(filter)
      .sort({ _id: -1 })
      .limit(20);

    return res.status(200).json({
      creditReceipts,
      nextLastId: creditReceipts.length > 0 ? creditReceipts[creditReceipts.length - 1]._id : null,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

// APIs (method: 'GET'): Getting one document!

app.get("/api/project/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'No Project was found!' });
    return res.status(200).json({ project });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

app.get("/api/bank/:id", async (req, res) => {
  try {
    const bankId = req.params.id;
    const bank = await Bank.findById(bankId);
    if (!bank) return res.status(404).json({ message: 'No Bank was found!' });
    return res.status(200).json({ bank });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

app.get("/api/bill/:id", async (req, res) => {
  try {
    const billId = req.params.id;
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: 'No Bill was found!' });
    return res.status(200).json({ bill });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

app.get("/api/vendor/:id", async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'No Vendor was found!' });
    return res.status(200).json({ vendor });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

app.get("/api/sale/:id", async (req, res) => {
  try {
    const saleId = req.params.id;
    const sale = await Sale.findById(saleId).lean();
    if (!sale) return res.status(404).json({ message: 'No Sale was found!' });
    return res.status(200).json({ sale });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

app.get("/api/debit-voucher/:id", async (req, res) => {
  try {
    const debitVoucherId = req.params.id;
    const debitVoucher = await DebitVoucher.findById(debitVoucherId);
    if (!debitVoucher) return res.status(404).json({ message: 'No Debit Voucher was found!' });
    return res.status(200).json({ debitVoucher });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

app.get("/api/credit-receipt/:id", async (req, res) => {
  try {
    const creditReceiptId = req.params.id;
    const creditReceipt = await Vendor.findById(creditReceiptId);
    if (!creditReceipt) return res.status(404).json({ message: 'No Credit Receipt was found!' });
    return res.status(200).json({ creditReceipt });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

// APIs (method: 'POST')

app.post("/api/project", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    if (!project) {
      return res.status(400).json({ message: "Couldn't create a new Project!" })
    }
    return res.status(200).json({ project, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' })
  }
});

app.post("/api/bank", async (req, res) => {
  try {
    const bank = await Bank.create(req.body);
    if (!bank) {
      return res.status(400).json({ message: "Couldn't create a new Bank!" })
    }
    return res.status(200).json({ bank, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' })
  }
});

app.post("/api/bill", async (req, res) => {
  try {
    console.log('hello from bill post')
    const { vendor, vendorBillNo, comments, head, items, totalAmount } = req.body;

    const counter = await Counter.findOneAndUpdate(
      { _id: "Bill" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const payload = {
      vendor,
      vendorBillNo,
      comments,
      head,
      items,
      totalAmount,
      serialNo: counter.seq, // ✅ auto serial number
    };

    const bill = await Bill.create(payload);

    if (!bill) {
      return res.status(400).json({ message: "Couldn't create a new Bill!" });
    }

    return res.status(200).json({ bill, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.post("/api/vendor", async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    if (!vendor) {
      return res.status(400).json({ message: "Couldn't create a new Vendor!" })
    }
    return res.status(200).json({ vendor, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' })
  }
});

app.post("/api/inventory", async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body).lean();
    if (!inventory) {
      return res.status(400).json({ message: "Couldn't create a new Inventory!" })
    }
    return res.status(200).json({ inventory, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error!' })
  }
});

app.post("/api/sale", async (req, res) => {
  try {
    // Whitelist fields to prevent unexpected data

    const projectId = req.body.project;

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'Project ID is not valid!' });
    }

    const project = await Project.findById(projectId).select('name');

    if (!project) {
      return res.status(404).json({ message: 'No project found!' });
    }

    const projectName = project.name;

    const payload = {
      project: req.body.project,
      projectName,
      fileNo: req.body.fileNo,
      inventory: req.body.inventory,
      size: req.body.size,
      saleType: req.body.saleType,

      name: req.body.name,
      fatherOrHusbandName: req.body.fatherOrHusbandName,
      postalAddress: req.body.postalAddress,
      residentialAddress: req.body.residentialAddress,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      nationality: req.body.nationality,
      cnic: req.body.cnic,

      nomineeName: req.body.nomineeName,
      nomineeCnic: req.body.nomineeCnic,
      nomineeRelationship: req.body.nomineeRelationship,
      nomineeAddress: req.body.nomineeAddress,

      unitCost: req.body.unitCost,
      utilitycharges: req.body.utilitycharges,
      westOpen: req.body.westOpen,
      parkFacing: req.body.parkFacing,
      corner: req.body.corner,
      TotalPrice: req.body.TotalPrice,

      installments: req.body.installments,
      comments: req.body.comments,
    };

    const sale = await Sale.create(payload);

    return res.status(201).json({ sale, success: true });
  } catch (err) {
    console.log(err);

    // ✅ Mongoose validation errors -> 400
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // ✅ Bad ObjectId casting -> 400
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        field: err.path,
        message: `Invalid ${err.path}`,
      });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

app.post("/api/debit-voucher", async (req, res) => {
  try {
    console.log("Debit Voucher");

    const counter = await Counter.findOneAndUpdate(
      { _id: "DebitVoucher" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const {
      project,
      date,
      paidTo,
      targetModel,
      payInstrument,
      instrumentNo,
      instrumentDate,
      bill,
      bank,
      amount,
      payStatus,
      heads,
      subHeads,
    } = req.body;

    // ✅ 1) REQUIRED FIELDS CHECKS (with specific messages)

    if (!project) {
      return res.status(400).json({
        success: false,
        field: "project",
        message: "Project is required.",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        field: "date",
        message: "Date is required.",
      });
    }

    if (!paidTo) {
      return res.status(400).json({
        success: false,
        field: "paidTo",
        message: "PaidTo is required.",
      });
    }

    if (!targetModel) {
      return res.status(400).json({
        success: false,
        field: "targetModel",
        message: "targetModel is required (Project/Vendor).",
      });
    }

    if (!["Project", "Vendor"].includes(targetModel)) {
      return res.status(400).json({
        success: false,
        field: "targetModel",
        message: "Invalid targetModel. Must be 'Project' or 'Vendor'.",
      });
    }

    if (!payInstrument) {
      return res.status(400).json({
        success: false,
        field: "payInstrument",
        message:
          "payInstrument is required (Cash, Cheque, Post Dated Cheque, Online Transfer).",
      });
    }

    if (
      !["Cash", "Post Dated Cheque", "Cheque", "Online Transfer"].includes(
        payInstrument
      )
    ) {
      return res.status(400).json({
        success: false,
        field: "payInstrument",
        message:
          "Invalid payInstrument. Allowed: Cash, Cheque, Post Dated Cheque, Online Transfer.",
      });
    }

    if (amount == null || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        field: "amount",
        message: "Amount is required and must be greater than 0.",
      });
    }

    if (!payStatus) {
      return res.status(400).json({
        success: false,
        field: "payStatus",
        message: "payStatus is required (Paid, Due, Unpaid).",
      });
    }

    if (!["Paid", "Due", "Unpaid"].includes(payStatus)) {
      return res.status(400).json({
        success: false,
        field: "payStatus",
        message: "Invalid payStatus. Must be Paid, Due, or Unpaid.",
      });
    }

    // ✅ 2) CONDITIONAL RULES
    const isCheque =
      payInstrument === "Cheque" || payInstrument === "Post Dated Cheque";
    const isOnline = payInstrument === "Online Transfer";
    const isCash = payInstrument === "Cash";

    // ✅ If cheque: require instrumentNo + instrumentDate + bank (if you want)
    if (isCheque) {
      if (!instrumentNo) {
        return res.status(400).json({
          success: false,
          field: "instrumentNo",
          message: "instrumentNo is required for Cheque / Post Dated Cheque.",
        });
      }

      if (!instrumentDate) {
        return res.status(400).json({
          success: false,
          field: "instrumentDate",
          message: "instrumentDate is required for Cheque / Post Dated Cheque.",
        });
      }

      if (!bank) {
        return res.status(400).json({
          success: false,
          field: "bank",
          message: "bank is required for Cheque / Post Dated Cheque.",
        });
      }
    }

    // ✅ If online transfer: require bank
    if (isOnline) {
      if (!bank) {
        return res.status(400).json({
          success: false,
          field: "bank",
          message: "bank is required for Online Transfer.",
        });
      }
    }

    // ✅ If cash: instrumentNo and instrumentDate should not be required
    // (No error needed, but we sanitize below)

    // ✅ bill is optional in your schema, so don't force it
    // ✅ bank is optional in schema, so only force when needed above

    // ✅ 3) CREATE
    const debitVoucher = await DebitVoucher.create({
      serialNo: counter.seq,
      project,
      date,
      paidTo,
      targetModel,
      payInstrument,
      amount: Number(amount),
      payStatus,

      instrumentNo: isCash ? "" : instrumentNo,
      instrumentDate: isCash ? null : instrumentDate,

      bill: bill || undefined,
      bank: bank || undefined,

      heads: Array.isArray(heads) ? heads : [],
      subHeads: Array.isArray(subHeads) ? subHeads : [],
    });

    return res.status(201).json({
      success: true,
      debitVoucher,
      message: "Debit Voucher created successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.post("/api/credit-receipt", async (req, res) => {
  try {
    console.log("Credit Receipt");

    const counter = await Counter.findOneAndUpdate(
      { _id: "CreditReceipt" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const {
      project,
      date,
      creditor,
      targetModel,
      creditorBank,
      amount,
      payInstrument,
      chequeStatus,
      instrumentNo,
      instrumentDate,
      bank,
      comments,
    } = req.body;

    if (!project) {
      return res.status(400).json({
        success: false,
        field: "project",
        message: "Project is required.",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        field: "date",
        message: "Date is required.",
      });
    }

    if (!creditor) {
      return res.status(400).json({
        success: false,
        field: "creditor",
        message: "Creditor is required.",
      });
    }

    if (!targetModel) {
      return res.status(400).json({
        success: false,
        field: "targetModel",
        message: "targetModel is required (Project/Sale).",
      });
    }

    if (!["Project", "Sale"].includes(targetModel)) {
      return res.status(400).json({
        success: false,
        field: "targetModel",
        message: "Invalid targetModel. Must be 'Project' or 'Sale'.",
      });
    }

    if (amount == null || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        field: "amount",
        message: "Amount is required and must be greater than 0.",
      });
    }

    if (!payInstrument) {
      return res.status(400).json({
        success: false,
        field: "payInstrument",
        message:
          "payInstrument is required (Cash, Cheque, Post Dated Cheque, Online Transfer).",
      });
    }

    if (
      !["Cash", "Post Dated Cheque", "Cheque", "Online Transfer"].includes(
        payInstrument
      )
    ) {
      return res.status(400).json({
        success: false,
        field: "payInstrument",
        message:
          "Invalid payInstrument. Allowed: Cash, Cheque, Post Dated Cheque, Online Transfer.",
      });
    }

    const isCheque =
      payInstrument === "Cheque" || payInstrument === "Post Dated Cheque";
    const isOnline = payInstrument === "Online Transfer";
    const isCash = payInstrument === "Cash";

    if (isCheque) {
      if (!instrumentNo) {
        return res.status(400).json({
          success: false,
          field: "instrumentNo",
          message: "instrumentNo is required for Cheque / Post Dated Cheque.",
        });
      }

      if (!instrumentDate) {
        return res.status(400).json({
          success: false,
          field: "instrumentDate",
          message: "instrumentDate is required for Cheque / Post Dated Cheque.",
        });
      }

      if (!chequeStatus) {
        return res.status(400).json({
          success: false,
          field: "chequeStatus",
          message: "chequeStatus is required for Cheque / Post Dated Cheque.",
        });
      }
    }

    if (isOnline) {
      if (!instrumentNo) {
        return res.status(400).json({
          success: false,
          field: "instrumentNo",
          message: "instrumentNo is required for Online Transfer.",
        });
      }

      if (!instrumentDate) {
        return res.status(400).json({
          success: false,
          field: "instrumentDate",
          message: "instrumentDate is required for Online Transfer.",
        });
      }
    }

    if (targetModel === "Sale" && !creditorBank) {
      return res.status(400).json({
        success: false,
        field: "creditorBank",
        message: "creditorBank is required when targetModel is Sale.",
      });
    }

    const creditReceipt = await CreditReceipt.create({
      serialNo: counter.seq,
      project,
      date,
      creditor,
      targetModel,
      creditorBank: creditorBank || undefined,
      amount: Number(amount),
      payInstrument,
      chequeStatus: isCheque ? chequeStatus : undefined,
      instrumentNo: isCash ? "" : instrumentNo,
      instrumentDate: isCash ? null : instrumentDate,
      bank: bank || undefined,
      comments: comments || undefined,
    });

    return res.status(201).json({
      success: true,
      creditReceipt,
      message: "Credit Receipt created successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.post("/api/head", async (req, res) => {
  try {
    const { name, subHeads = [] } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Head name is required!" });
    }

    if (!Array.isArray(subHeads)) {
      return res.status(400).json({ message: "subHeads must be an array!" });
    }

    const cleanedSubHeads = subHeads.map((subHead) => ({
      name: subHead.name?.trim(),
    }));

    const newHead = await Head.create({
      name: name.trim(),
      subHeads: cleanedSubHeads,
    });

    return res.status(201).json({
      message: "Head created successfully!",
      head: newHead,
    });
  } catch (err) {
    console.error("Create Head Error:", err);

    if (err.code === 11000) {
      return res.status(409).json({ message: "Head already exists!" });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error!" });
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
