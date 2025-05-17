"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const getToday = () => new Date().toISOString().slice(0, 10);

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [increment, setIncrement] = useState(250); // default 250ml
  const [target, setTarget] = useState(2000); // default 2L

  useEffect(() => {
    const today = getToday();
    const data = JSON.parse(localStorage.getItem("water-data") || "{}") || {};
    setAmount(data[today]?.amount || 0);
    setIncrement(Number(localStorage.getItem("water-increment")) || 250);
    setTarget(Number(localStorage.getItem("water-target")) || 2000);
  }, []);

  const handleAdd = () => {
    const today = getToday();
    const data = JSON.parse(localStorage.getItem("water-data") || "{}") || {};
    const newAmount = (data[today]?.amount || 0) + increment;
    data[today] = { amount: newAmount };
    localStorage.setItem("water-data", JSON.stringify(data));
    setAmount(newAmount);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-2 mt-8">💧 Water Tracker</h1>
      <div className="text-6xl font-semibold mb-2">{amount} ml</div>
      <div className="text-gray-500 mb-8">Today&apos;s Consumption</div>
      <button
        className="bg-black text-white rounded-full px-8 py-4 text-xl font-medium shadow-lg transition hover:bg-gray-800 mb-8"
        onClick={handleAdd}
      >
        +{increment} ml
      </button>
      <div className="text-gray-400 mb-8">Target: {target} ml</div>
      <nav className="flex gap-8 text-lg">
        <Link href="/">Home</Link>
        <Link href="/statistics">Statistics</Link>
        <Link href="/settings">Settings</Link>
      </nav>
    </main>
  );
}
