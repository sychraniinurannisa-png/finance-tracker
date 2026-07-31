import { Layout } from "../components/Layout";
import { supabase } from "../SupabaseClients";
import { useEffect, useState } from "react";

export function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("id, description, amount, transaction_date")
          .eq("type", "expense") 
          .order("transaction_date", { ascending: false });

        if (error) throw error;
        setExpenses(data || []);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchExpenses();
  }, []);

  const totalExpense = expenses.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );

  return (
    <Layout
      title="Arus Pengeluaran"
      description="Daftar pengeluaran uang secara detail untuk pos belanja Anda."
    >
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-5">
        {/* Header Rincian */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-800">Rincian Arus Pengeluaran</h3>
          <span className="text-xs bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold">
            Total: Rp {totalExpense.toLocaleString("id-ID")}
          </span>
        </div>

        {error && <p className="text-xs text-rose-500">Error: {error}</p>}

        {/* Daftar Transaksi Pengeluaran */}
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-5">
              Belum ada riwayat pengeluaran.
            </p>
          ) : (
            expenses.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-basket-shopping text-sm"></i>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">
                      {item.description || "Pengeluaran"}
                    </h5>
                    <p className="text-[10px] text-slate-400">Pengeluaran</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-rose-600">
                    -Rp {Number(item.amount).toLocaleString("id-ID")}
                  </span>
                  <p className="text-[9px] text-slate-400">
                    {new Date(item.transaction_date).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}