import express from "express";
import Pincode from "../models/Pincode.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { state, district, taluk } = req.query;

    const query = {};
    if (state) query.stateName = state;
    if (district) query.districtName = district;
    if (taluk) query.taluk = taluk;

    const cursor = Pincode.find(query).cursor();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=pincodes.csv");

    res.write(
      "officeName,pincode,officeType,deliveryStatus,divisionName,regionName,circleName,taluk,districtName,stateName\n"
    );

    for await (const doc of cursor) {
      res.write(
        `"${doc.officeName}",${doc.pincode},"${doc.officeType}","${doc.deliveryStatus}","${doc.divisionName}","${doc.regionName}","${doc.circleName}","${doc.taluk}","${doc.districtName}","${doc.stateName}"\n`
      );
    }

    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;