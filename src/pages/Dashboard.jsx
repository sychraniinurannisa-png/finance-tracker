import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { supabase } from "../supabaseClient";

export function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Ambil seluruh data transaksi beserta nama kategorinya
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id,
          amount,
          type,
          description,
          transaction_date,
          categories (
            name
          )
        `)
        .order("transaction_date", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. Hitung Total Pemasukan
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // 2. Hitung Total Pengeluaran
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // 3. Hitung Saldo Utama (Pemasukan - Pengeluaran)
  const totalBalance = totalIncome - totalExpense;

  // 4. Hitung Rasio Tabungan % (Sisa Saldo / Total Pemasukan * 100)
  const savingsRatio = totalIncome > 0 
    ? Math.max(0, Math.round((totalBalance / totalIncome) * 100)) 
    : 0;

  // 5. Ambil 4 Transaksi Terakhir untuk Widget List
  const recentTransactions = transactions.slice(0, 4);

  // Helper Format Currency
  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper Format Tanggal
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Layout title="Ringkasan Dashboard" description="Statistik finansial dan gambaran umum keuangan Anda hari ini.">
      {/* Cards Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Card Saldo Utama */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Saldo Utama
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-emerald-600">
              {loading ? "..." : formatRupiah(totalBalance)}
            </h3>
            <p className="text-[10px] text-emerald-600/80 font-medium mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Akumulasi sisa dana
            </p>
          </div>
        </div>

        {/* Card Pemasukan */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pemasukan
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
              <i className="fa-solid fa-arrow-up"></i>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-blue-600">
              {loading ? "..." : formatRupiah(totalIncome)}
            </h3>
            <p className="text-[10px] text-blue-500 font-medium mt-1">
              <i className="fa-solid fa-check mr-1"></i> Total uang masuk
            </p>
          </div>
        </div>

        {/* Card Pengeluaran */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pengeluaran
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xs">
              <i className="fa-solid fa-arrow-down"></i>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-rose-600">
              {loading ? "..." : formatRupiah(totalExpense)}
            </h3>
            <p className="text-[10px] text-rose-500 font-medium mt-1">
              <i className="fa-solid fa-arrow-trend-down mr-1"></i> Total uang keluar
            </p>
          </div>
        </div>

        {/* Card Rasio Tabungan */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Rasio Tabungan
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xs">
              <i className="fa-solid fa-piggy-bank"></i>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-500">
              {loading ? "..." : `${savingsRatio}%`}
            </h3>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-amber-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(savingsRatio, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Section: Transaksi Terakhir */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">Transaksi Terakhir</h3>
          </div>

          <div className="space-y-3 pt-1">
            {loading ? (
              <div className="text-center py-8 text-xs text-slate-400">Memuat transaksi...</div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">Belum ada transaksi recorded.</div>
            ) : (
              recentTransactions.map((item) => {
                const isIncome = item.type === "income";
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs ${
                        isIncome ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                      }`}>
                        <i className={`fa-solid ${isIncome ? "fa-arrow-trend-up" : "fa-arrow-trend-down"}`}></i>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">
                          {item.description || (isIncome ? "Pemasukan Uang" : "Pengeluaran Uang")}
                        </h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {formatDate(item.transaction_date)} • {item.categories?.name || "Tanpa Kategori"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className={`text-xs font-black ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                        {isIncome ? `+${formatRupiah(item.amount)}` : `-${formatRupiah(item.amount)}`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section Tambahan Placeholder (Contoh: Anggaran Bulanan) */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">Anggaran Bulanan</h3>
            <span className="text-xs font-bold text-emerald-600 cursor-pointer">Atur</span>
          </div>
          
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-medium text-slate-600 mb-1">
                <span>Makanan & Minuman</span>
                <span>52% Terpakai</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: "52%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-600 mb-1">
                <span>Transportasi</span>
                <span>21% Terpakai</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "21%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-600 mb-1">
                <span>Tagihan & Listrik</span>
                <span className="text-rose-500 font-bold">90% Hampir Habis!</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "90%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}