import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearchLocation } from "react-icons/fa";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

export default function Explore() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/api/states").then((res) => setStates(res.data));
  }, []);

  useEffect(() => {
    if (!state) return;

    axios.get(`/api/states/${state}/districts`).then((res) => {
      setDistricts(res.data);
      setDistrict("");
      setTaluks([]);
    });
  }, [state]);

  useEffect(() => {
    if (!district) return;

    axios
      .get(`/api/states/${state}/districts/${district}/taluks`)
      .then((res) => {
        setTaluks(res.data);
        setTaluk("");
      });
  }, [district]);

  useEffect(() => {
    axios
      .get("/api/pincodes", {
        params: { state, district, taluk },
      })
      .then((res) => setData(res.data.data || []));
  }, [state, district, taluk]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* 🔥 NAVBAR */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <FaSearchLocation /> PIN Explorer
        </h1>
        <span className="text-gray-500">India Postal System</span>
      </div>

      <div className="p-6 max-w-6xl mx-auto">

        {/* 🔥 FILTER CARD */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Filter Locations
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <select
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              disabled={!state}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <select
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              disabled={!district}
              onChange={(e) => setTaluk(e.target.value)}
            >
              <option value="">Select Taluk</option>
              {taluks.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 🔥 DATA TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">Office</th>
                <th className="p-3">Pincode</th>
                <th className="p-3">District</th>
                <th className="p-3">State</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    No Data Found
                  </td>
                </tr>
              ) : (
                data.map((item, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{item.officeName}</td>
                    <td className="p-3 font-semibold text-blue-600">
                      {item.pincode}
                    </td>
                    <td className="p-3">{item.districtName}</td>
                    <td className="p-3">{item.stateName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}