"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Settings() {
  const [increment, setIncrement] = useState(250);
  const [target, setTarget] = useState(2000);
  const [reminder, setReminder] = useState(60); // in minutes
  const [reminderActive, setReminderActive] = useState(false);
  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Request notification permission and set up interval
  useEffect(() => {
    if (!reminderActive) {
      if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
      return;
    }
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
    // Vibrate
    const vibrate = () => {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    };
    // Show notification
    const notify = () => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Time to drink water! 💧", {
          body: "Stay hydrated. Tap to open WaterPWA.",
          icon: "/favicon.ico"
        });
      }
      vibrate();
      // No custom sound: rely on system notification sound
    };
    // Initial notification
    notify();
    // Set interval
    reminderIntervalRef.current = setInterval(notify, reminder * 60 * 1000);
    return () => {
      if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
    };
  }, [reminder, reminderActive]);

  useEffect(() => {
    setIncrement(Number(localStorage.getItem("water-increment")) || 250);
    setTarget(Number(localStorage.getItem("water-target")) || 2000);
    setReminder(Number(localStorage.getItem("water-reminder")) || 60);
    setReminderActive(localStorage.getItem("water-reminder-active") === "true");
  }, []);

  const handleSave = () => {
    localStorage.setItem("water-increment", String(increment));
    localStorage.setItem("water-target", String(target));
    localStorage.setItem("water-reminder", String(reminder));
    localStorage.setItem("water-reminder-active", String(reminderActive));
    alert("Settings saved!");
  };

  const handleReset = () => {
    localStorage.clear();
    alert("All data reset.");
    window.location.reload();
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mt-8 mb-4">⚙️ Settings</h1>
      <div className="w-full max-w-md px-4 flex flex-col gap-6">
        <label className="flex flex-col">
          <span className="mb-1">Increment Amount (ml)</span>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={increment}
            min={50}
            step={50}
            onChange={e => setIncrement(Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1">Daily Target (ml)</span>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={target}
            min={500}
            step={100}
            onChange={e => setTarget(Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1">Reminder Interval (minutes)</span>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={reminder}
            min={5}
            step={5}
            onChange={e => setReminder(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={reminderActive}
            onChange={e => setReminderActive(e.target.checked)}
          />
          <span>Enable Reminder Notifications</span>
        </label>
        <button
          className="bg-black text-white rounded px-6 py-2 font-medium hover:bg-gray-800"
          onClick={handleSave}
        >
          Save Settings
        </button>
        <button
          className="bg-red-500 text-white rounded px-6 py-2 font-medium hover:bg-red-700"
          onClick={handleReset}
        >
          Reset All Data
        </button>
      </div>
      <nav className="flex gap-8 text-lg mt-8">
        <Link href="/">Home</Link>
        <Link href="/statistics">Statistics</Link>
        <Link href="/settings">Settings</Link>
      </nav>
    </main>
  );
}
