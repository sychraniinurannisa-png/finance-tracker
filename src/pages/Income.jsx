import { Layout } from "../components/Layout";
import { supabase } from "../SupabaseClients"; 
import { useEffect, useState } from "react";

export function Income() {
  const [incomes, setIncomes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIncomes() {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select('id, description, amount,transaction_date')
          .eq("type", "income") 
          .order("transaction_date", { ascending: false });

        if (error) throw error;
        setIncomes(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchIncomes();
  }, []); 

  const totalIncome = incomes.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );

  return (
    <Layout
      title="Arus Pemasukan"
      description="Rincian detail riwayat pemasukan dan pendapatan uang Anda."
    >
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-800">
            Rincian Arus Pendapatan
          </h3>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">
            Total: Rp {totalIncome.toLocaleString("id-ID")}
          </span>
        </div>

        {error && <p className="text-xs text-rose-500">Error: {error}</p>}

        <div className="space-y-3">
          {/* MAP DATA TRANSACTIONS */}
          {incomes.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-money-bill-wave text-sm"></i>
                </div>
                <div>
                  {/* Menampilkan deskripsi dari database */}
                  <h5 className="text-xs font-bold text-slate-800">
                    {item.description || "Pemasukan"}
                  </h5>
                  <p className="text-[10px] text-slate-400">Pemasukan</p>
                </div>
              </div>
              <div className="text-right">
                {/* Menampilkan amount dari database */}
                <span className="text-xs font-black text-emerald-600">
                  +Rp {Number(item.amount).toLocaleString("id-ID")}
                </span>
                {/* Menampilkan tanggal dari database */}
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
          ))}
        </div>
      </div>
    </Layout>
  );
}