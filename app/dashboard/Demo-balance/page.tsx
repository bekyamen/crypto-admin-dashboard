'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

type BalanceHistoryItem = {
  targetUserId: string;
  email: string;
  previousBalance: number;
  newBalance: number;
  amountAdded: number;
  reason?: string;
  action: "add" | "set";
};

export default function AdminAddBalance() {
  const auth = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [amount, setAmount] = useState<number | "">("");
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState<"add" | "set">("add");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [history, setHistory] = useState<BalanceHistoryItem[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

  useEffect(() => {
    setMounted(true);
    if (auth?.token) {
      setToken(auth.token);
    }
  }, [auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !reason) {
      setMessage("Please enter amount and reason");
      return;
    }

    if (!token || !API_URL) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/users/demo-balance/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          reason,
          mode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);

        // 🔥 directly use backend history
        if (Array.isArray(data.data)) {
          setHistory(data.data);
        }

        setAmount("");
        setReason("");
        setMode("add");
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;
  if (!token) return <p className="text-white p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-4xl bg-[#111111] border border-gray-800 rounded-xl p-10">

        <h2 className="text-2xl font-bold mb-8">Balance Management</h2>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
            placeholder="Enter amount"
          />

          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
            placeholder="Enter reason"
          />

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "add" | "set")}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
          >
            <option value="add">Add Balance</option>
            <option value="set">Set Balance</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-lg font-semibold"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-green-400">{message}</p>
        )}

        {/* ================= HISTORY TABLE ================= */}
        {history.length > 0 && (
          <div className="mt-10 bg-black border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {history.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-900/50">
                    
                    {/* ✅ Amount Column (NO MORE +0) */}
                    <td className="px-4 py-3">
                      {item.action === "add" ? (
                        <div>
                          <span className="text-green-400 font-medium">
                            +{item.amountAdded}
                          </span>
                          <div className="text-xs text-gray-500">
                            {item.previousBalance} → {item.newBalance}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-blue-400 font-medium">
                            {item.newBalance}
                          </span>
                          <div className="text-xs text-gray-500">
                            was {item.previousBalance}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-white">
                      {item.email}
                    </td>

                    <td className="px-4 py-3 text-gray-400">
                      {item.reason || "—"}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}