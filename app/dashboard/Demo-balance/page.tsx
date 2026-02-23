'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

type BalanceHistoryItem = {
  id: string;
  adminId: string;
  action: string;
  targetUserId: string;
  entityType: string;
  entityId: string;
  changes?: {
    newBalance: number;
    amountAdded: number;
  };
  reason: string;
  createdAt: string;
  admin?: {
    id: string;
    email: string;
  };
  targetUser?: {
    id: string;
    email: string;
    balance: number;
  };
};

export default function AdminAddBalance() {
  const auth = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [amount, setAmount] = useState<number | "">("");
  const [reason, setReason] = useState<string>("");
  const [mode, setMode] = useState<"add" | "set">("add");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<BalanceHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

  // Safe client-only token setup
  useEffect(() => {
    setMounted(true);
    if (auth?.token) {
      setToken(auth.token);
    }
  }, [auth]);

  const fetchHistory = async () => {
    if (!token || !API_URL) return;

    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_URL}/demo-balance-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const response = await res.json();
      if (response.success && Array.isArray(response.data)) {
        setHistory(response.data);
      } else {
        console.error("Unexpected API response structure:", response);
        setHistory([]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setMessage("Failed to load balance history");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (token && mounted) {
      fetchHistory();
    }
  }, [token, mounted]);

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
      const res = await fetch(`${API_URL}/users/demo-balance/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, reason, mode }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setAmount("");
        setReason("");
        setMode("add");
        await fetchHistory();
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Don't render anything until mounted to prevent hydration errors
  if (!mounted) {
    return null;
  }

  if (!token) return <p className="text-white p-10">Loading...</p>;
  if (!API_URL) return <p className="text-red-400 p-10">API URL not configured</p>;

  return (
    <div className="min-h-screen bg-black flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-4xl bg-[#111111] border border-gray-800 shadow-2xl rounded-xl p-10">
        <h2 className="text-2xl font-bold text-white mb-8">Add Balance to All Users</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-300 font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter amount"
              min="1"
              step="1"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter reason (e.g., Monthly bonus)"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "add" | "set")}
              className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            >
              <option value="add">Add to existing balance</option>
              <option value="set">Set new balance</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
            disabled={loading || !amount || !reason}
          >
            {loading
              ? mode === "add"
                ? "Adding..."
                : "Setting..."
              : mode === "add"
              ? "Add Balance to All Users"
              : "Set Balance for All Users"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message.includes("Failed") ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* HISTORY TABLE */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Balance History</h3>
            <button
              onClick={fetchHistory}
              disabled={loadingHistory}
              className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
            >
              {loadingHistory ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loadingHistory ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-2">Loading history...</p>
            </div>
          ) : sortedHistory.length === 0 ? (
            <div className="text-center py-8 bg-black border border-gray-800 rounded-lg">
              <p className="text-gray-500">No previous balance actions found.</p>
            </div>
          ) : (
            <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-900 text-gray-300 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Reason</th>
                      <th className="px-4 py-3 text-left">Admin</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {sortedHistory.map((action) => (
                      <tr key={action.id} className="hover:bg-gray-900/50 transition">
                        <td className="px-4 py-3 text-white font-medium">
                          +{action.changes?.amountAdded ?? 0}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-white">{action.targetUser?.email ?? 'Unknown User'}</div>
                          <div className="text-xs text-gray-500">
                            Balance: {action.changes?.newBalance ?? action.targetUser?.balance ?? 0}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{action.reason || "—"}</td>
                        <td className="px-4 py-3 text-gray-400">{action.admin?.email ?? 'System'}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(action.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-900 px-4 py-2 text-xs text-gray-400 border-t border-gray-800">
                Total: {sortedHistory.length} transactions
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}