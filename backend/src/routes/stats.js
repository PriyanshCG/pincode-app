import express from "express";
import Pincode from "../models/Pincode.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [totalPincodes, states, deliveryOffices, nonDeliveryOffices] =
      await Promise.all([
        Pincode.countDocuments(),
        Pincode.distinct("stateName"),
        Pincode.countDocuments({ deliveryStatus: /Delivery/i }),
        Pincode.countDocuments({ deliveryStatus: /Non-Delivery/i }),
      ]);

    res.json({
      totalPincodes,
      totalStates: states.length,
      deliveryOffices,
      nonDeliveryOffices,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/state-distribution", async (req, res) => {
  try {
    const data = await Pincode.aggregate([
      { $group: { _id: "$stateName", count: { $sum: 1 } } },
      { $project: { _id: 0, state: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/delivery-distribution", async (req, res) => {
  try {
    const data = await Pincode.aggregate([
      { $group: { _id: "$deliveryStatus", count: { $sum: 1 } } },
    ]);

    let delivery = 0;
    let nonDelivery = 0;

    data.forEach((item) => {
      if (/non/i.test(item._id)) nonDelivery += item.count;
      else delivery += item.count;
    });

    res.json({ delivery, nonDelivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;