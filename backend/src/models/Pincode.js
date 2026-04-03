import mongoose from "mongoose";

const pincodeSchema = new mongoose.Schema(
  {
    officeName: String,
    pincode: Number,
    officeType: String,
    deliveryStatus: String,
    divisionName: String,
    regionName: String,
    circleName: String,
    taluk: String,
    districtName: String,
    stateName: String,
  },
  { timestamps: true }
);

pincodeSchema.index({ stateName: 1, districtName: 1, taluk: 1 });
pincodeSchema.index({ pincode: 1 });
pincodeSchema.index({
  officeName: "text",
  taluk: "text",
  districtName: "text",
});

const Pincode = mongoose.model("Pincode", pincodeSchema);

export default Pincode;