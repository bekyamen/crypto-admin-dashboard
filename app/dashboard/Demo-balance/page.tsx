"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

type BalanceAction = {
  id: string;
  changes: { amountAdded: number; newBalance: number };
  reason: string;
  createdAt: string;
};

export default function AdminAddBalance() {
  const { token } = useAuth();
  const [amount, setAmount] = useState<number | "">("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<BalanceAction[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

  const fetchHistory = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/balance-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !reason) {
      setMessage("Please enter amount and reason");
      return;
    }
    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/users/add-balance/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, reason }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`${amount} has been added as demo balance.`);
        setAmount("");
        setReason("");
        fetchHistory();
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-4xl bg-[#111111] border border-gray-800 shadow-2xl rounded-xl p-10">
        <h2 className="text-2xl font-bold text-white mb-8">
          Add Balance to All Users
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-300 font-medium">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium">
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter reason"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Balance to All Users"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-green-400 font-medium">
            {message}
          </p>
        )}

        <div className="mt-10">
          <h3 className="text-xl font-semibold text-white mb-4">
            Balance History
          </h3>

          {history.length === 0 ? (
            <p className="text-gray-500">
              No previous balance actions found.
            </p>
          ) : (
            <ul className="space-y-3 max-h-80 overflow-y-auto bg-black border border-gray-800 p-5 rounded-lg">
              {history.map((action) => (
                <li
                  key={action.id}
                  className="text-gray-300 border-b border-gray-800 pb-2"
                >
                  <span className="text-white font-medium">
                    {action.changes.amountAdded}
                  </span>{" "}
                  added as demo balance
                  <span className="text-gray-500 text-sm ml-2">
                    ({action.reason}) —{" "}
                    {new Date(action.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

