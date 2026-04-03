import express from "express";
import Pincode from "../models/Pincode.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const q = req.query.q?.trim();

    if (!q) return res.json([]);

    let results = [];

    if (q.length >= 3) {
      results = await Pincode.find(
        { $text: { $search: q } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(10);
    } else {
      results = await Pincode.find({
        $or: [
          { officeName: { $regex: q, $options: "i" } },
          { taluk: { $regex: q, $options: "i" } },
          { districtName: { $regex: q, $options: "i" } },
        ],
      }).limit(10);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { state, district, taluk, page = 1, limit = 20 } = req.query;

    const query = {};
    if (state) query.stateName = state;
    if (district) query.districtName = district;
    if (taluk) query.taluk = taluk;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const data = await Pincode.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Pincode.countDocuments(query);

    res.json({
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:pincode", async (req, res) => {
  try {
    const pin = Number(req.params.pincode);
    const records = await Pincode.find({ pincode: pin });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;