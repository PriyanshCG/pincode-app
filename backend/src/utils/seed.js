import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import Pincode from "../models/Pincode.js";

dotenv.config();

// 🔗 Connect DB
await connectDB();

const results = [];

// 🧼 Clean value function
const clean = (v) => {
  if (!v) return "";
  return v.toString().trim();
};

// 📥 Read CSV
fs.createReadStream("data/all_india_pin_code.csv", { encoding: "latin1" })
  .pipe(csv())
  .on("data", (row) => {
    // 🔥 CLEAN KEYS (IMPORTANT FIX)
    const cleanRow = {};
    for (let key in row) {
      cleanRow[key.trim()] = row[key];
    }

    // 🧠 Map data correctly
    results.push({
      officeName: clean(cleanRow.officeName),
      pincode: Number(clean(cleanRow.pincode)),
      officeType: clean(cleanRow.officeType),
      deliveryStatus: clean(cleanRow.deliveryStatus),
      divisionName: clean(cleanRow.divisionName),
      regionName: clean(cleanRow.regionName),
      circleName: clean(cleanRow.circleName),
      taluk: clean(cleanRow.taluk),
      districtName: clean(cleanRow.districtName),
      stateName: clean(cleanRow.stateName).toUpperCase(),
    });
  })
  .on("end", async () => {
    try {
      console.log("🧹 Deleting old data...");
      await Pincode.deleteMany({});

      console.log("📥 Inserting new data...");

      for (let i = 0; i < results.length; i += 2000) {
        const batch = results.slice(i, i + 2000);
        await Pincode.insertMany(batch);
        console.log(`Inserted: ${i + batch.length}`);
      }

      console.log("✅ DATA IMPORTED SUCCESSFULLY");
      process.exit();
    } catch (err) {
      console.error("❌ INSERT ERROR:", err);
      process.exit(1);
    }
  })
  .on("error", (err) => {
    console.error("❌ CSV ERROR:", err);
    process.exit(1);
  });