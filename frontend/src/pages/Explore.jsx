import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearchLocation } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "";

export default function Explore() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");

  const [data, setData] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    setLoadingStates(true);
    axios
      .get(`${API}/api/states`)
      .then((res) => setStates(res.data))
      .catch(() => { })
      .finally(() => setLoadingStates(false));
  }, []);

  useEffect(() => {
    if (!state) return;
    axios.get(`${API}/api/states/${state}/districts`).then((res) => {
      setDistricts(res.data);
      setDistrict("");
      setTaluks([]);
    });
  }, [state]);

  useEffect(() => {
    if (!district) return;
    axios
      .get(`${API}/api/states/${state}/districts/${district}/taluks`)
      .then((res) => {
        setTaluks(res.data);
        setTaluk("");
      });
  }, [district]);

  useEffect(() => {
    setLoadingData(true);
    axios
      .get(`${API}/api/pincodes`, {
        params: { state, district, taluk },
      })
      .then((res) => setData(res.data.data || []))
      .catch(() => setData([]))
      .finally(() => setLoadingData(false));
  }, [state, district, taluk]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* NAVBAR */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <FaSearchLocation /> PIN Explorer
        </h1>
        <span className="text-gray-500">India Postal System</span>
      </div>

      <div className="p-6 max-w-6xl mx-auto">

        {/* FILTER CARD */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Filter Locations
          </h2>

          {loadingStates ? (
            <div className="flex items-center gap-2 text-blue-500">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading states, please wait...
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              <select
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setState(e.target.value)}
                value={state}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                disabled={!state}
                onChange={(e) => setDistrict(e.target.value)}
                value={district}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                disabled={!district}
                onChange={(e) => setTaluk(e.target.value)}
                value={taluk}
              >
                <option value="">Select Taluk</option>
                {taluks.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* DATA TABLE */}
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
              {loadingData ? (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-blue-500">
                    <div className="flex justify-center items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Loading data...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
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