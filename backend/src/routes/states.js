import express from "express";
import Pincode from "../models/Pincode.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const states = await Pincode.distinct("stateName");
    res.json(states.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:state/districts", async (req, res) => {
  try {
    const districts = await Pincode.distinct("districtName", {
      stateName: req.params.state,
    });
    res.json(districts.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:state/districts/:district/taluks", async (req, res) => {
  try {
    const taluks = await Pincode.distinct("taluk", {
      stateName: req.params.state,
      districtName: req.params.district,
    });
    res.json(taluks.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;