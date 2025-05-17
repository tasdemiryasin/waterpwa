"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getWeekDates = () => {
  const now = new Date();
  const week = [];
  const todayIdx = now.getDay();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - todayIdx + i);
    week.push(d.toISOString().slice(0, 10));
  }
  return week;
};

export default function Statistics() {
  const [weekData, setWeekData] = useState<number[]>([]);
  const [target, setTarget] = useState(2000);
  const [todayIdx, setTodayIdx] = useState(new Date().getDay());
  const [todayAmount, setTodayAmount] = useState(0);

  // Refresh data on storage change (for live updates)
  useEffect(() => {
    const update = () => {
      const data = JSON.parse(localStorage.getItem("water-data") || "{}") || {};
      const t = Number(localStorage.getItem("water-target")) || 2000;
      setTarget(t);
      const week = getWeekDates();
      const weekAmounts = week.map((date) => data[date]?.amount || 0);
      setWeekData(weekAmounts);
      setTodayIdx(new Date().getDay());
      setTodayAmount(weekAmounts[new Date().getDay()]);
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  // Also update on focus (for SPA navigation)
  useEffect(() => {
    const onFocus = () => {
      const data = JSON.parse(localStorage.getItem("water-data") || "{}") || {};
      const week = getWeekDates();
      const weekAmounts = week.map((date) => data[date]?.amount || 0);
      setWeekData(weekAmounts);
      setTodayAmount(weekAmounts[new Date().getDay()]);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Use target as the 100% reference for bar height
  const chartHeightPx = 256; // h-64 in Tailwind
  const targetPx = chartHeightPx; // Target line at 100%

  return (
    <main className="flex flex-col items-center min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mt-8 mb-2">📊 Weekly Statistics</h1>
      <div className="mb-2 text-lg text-gray-700">
        Today: <span className="font-semibold">{todayAmount} ml</span>
      </div>
      <div className="w-full max-w-xl px-4">
        <div className="flex items-end h-64 border-b border-gray-200 relative" style={{ height: chartHeightPx }}>
          {/* Target line at 100% of chart height */}
          <div
            className="absolute left-0 w-full border-t-2 border-dashed border-red-400"
            style={{ bottom: 0, top: `${chartHeightPx - targetPx}px`, zIndex: 10 }}
          />
          {/* Bars */}
          {weekData.map((amt, i) => {
            // Bar height is proportional to target (not max of week)
            const barPx = Math.min((amt / target) * chartHeightPx, chartHeightPx);
            const hitTarget = amt >= target;
            return (
              <div key={i} className="flex-1 flex flex-col items-center mx-1">
                <div
                  className={`w-8 rounded-t-lg ${hitTarget ? "bg-green-400" : "bg-blue-400"} ${i === todayIdx ? "ring-2 ring-black" : ""}`}
                  style={{ height: `${barPx}px`, transition: "height 0.3s" }}
                  title={daysOfWeek[i]}
                />
                <div className="text-xs mt-2 text-gray-500" style={{ minWidth: 40, textAlign: "center" }}>
                  {daysOfWeek[i].slice(0, 3)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          {weekData.map((amt, i) => (
            <span key={i}>{amt}ml</span>
          ))}
        </div>
      </div>
      <nav className="flex gap-8 text-lg mt-8">
        <Link href="/">Home</Link>
        <Link href="/statistics">Statistics</Link>
        <Link href="/settings">Settings</Link>
      </nav>
    </main>
  );
}
