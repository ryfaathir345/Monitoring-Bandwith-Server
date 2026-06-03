// frontend/src/components/BandwidthChart.jsx
// Grafik garis realtime yang menampilkan bandwidth IN dan OUT
// Menggunakan library Recharts

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function BandwidthChart({ devices }) {
  // chartData menyimpan history data untuk ditampilkan di grafik
  // Format: [{ time: '12:00:01', 'Core Router': 500, ... }, ...]
  const [chartData, setChartData] = useState([]);
  const maxPoints = 20; // Tampilkan max 20 data point di grafik

  useEffect(() => {
    if (!devices || devices.length === 0) return;

    const time = new Date().toLocaleTimeString("id-ID");

    // Buat satu data point dari snapshot devices saat ini
    const point = { time };
    devices.forEach((device) => {
      point[device.name] = device.bandwidthIn;
    });

    // Tambahkan ke history, buang yang paling lama jika melebihi maxPoints
    setChartData((prev) => {
      const updated = [...prev, point];
      return updated.slice(-maxPoints);
    });
  }, [devices]);

  // Warna untuk setiap device
  const colors = ["#60a5fa", "#34d399", "#f87171", "#fbbf24", "#a78bfa"];

  // Ambil nama semua device untuk dibuat jadi Line
  const deviceNames = devices ? devices.map((d) => d.name) : [];

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <h3 className="text-white font-semibold mb-4">
        📈 Bandwidth Realtime (Mbps)
      </h3>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-500">
          Menunggu data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} unit=" Mbps" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
            {deviceNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default BandwidthChart;
