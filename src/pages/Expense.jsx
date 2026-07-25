import { Layout } from "../components/Layout";
export function Expense() {
    return (
        <Layout title="Arus Pengeluaran" description="Daftar pengeluaran uang secara detail untuk pos belanja Anda.">
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-5">
        {/* Header Rincian */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-800">Rincian Arus Pengeluaran</h3>
          <span className="text-xs bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold">
            Total: Rp 6.750.000
          </span>
        </div>

        {/* Daftar Transaksi Pengeluaran */}
        <div className="space-y-3">
          {/* Expense Item 1 */}
          <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-basket-shopping text-sm"></i>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Belanja Bulanan Carrefour</h5>
                <p className="text-[10px] text-slate-400">Pembelian sembako dan kebutuhan harian</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-rose-600">-Rp 1.850.000</span>
              <p className="text-[9px] text-slate-400">12 Jul 2026</p>
            </div>
          </div>

          {/* Expense Item 2 */}
          <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-bolt text-sm"></i>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Tagihan Listrik & WiFi IndiHome</h5>
                <p className="text-[10px] text-slate-400">Pengeluaran rutin bulanan rumah tangga</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-rose-600">-Rp 850.000</span>
              <p className="text-[9px] text-slate-400">10 Jul 2026</p>
            </div>
          </div>

          {/* Expense Item 3 */}
          <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-car text-sm"></i>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Bensin & Tol JORR</h5>
                <p className="text-[10px] text-slate-400">Mobilitas kendaraan pribadi mingguan</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-rose-600">-Rp 320.000</span>
              <p className="text-[9px] text-slate-400">05 Jul 2026</p>
            </div>
          </div>

          {/* Expense Item 4 */}
          <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-pizza-slice text-sm"></i>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Makan Siang Restoran Kopi</h5>
                <p className="text-[10px] text-slate-400">Makan siang bersama tim kantor</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-rose-600">-Rp 180.000</span>
              <p className="text-[9px] text-slate-400">03 Jul 2026</p>
            </div>
          </div>
        </div>
      </div>
        </Layout>
    )
}