import { Layout } from "../components/Layout";
export function Dashboard (){
    return(
        <Layout>
            <div id="tab-dashboard" class="tab-content space-y-6">
      
      
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Utama</span>
            <div className="bg-emerald-50 text-emerald-500 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-wallet text-xs"></i>
            </div>
          </div>
          <h3 className="text-2xl font-black text-emerald-600">Rp 18.250.000</h3>
          <p className="text-[10px] text-emerald-600/80 mt-2 font-medium">
            <i className="fa-solid fa-arrow-trend-up"></i> +8.2% dari bulan lalu
          </p>
        </div>

        
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemasukan</span>
            <div className="bg-blue-50 text-blue-500 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-circle-arrow-up text-xs"></i>
            </div>
          </div>
          <h3 className="text-2xl font-black text-blue-600">Rp 25.000.000</h3>
          <p className="text-[10px] text-blue-500/80 mt-2 font-medium">
            <i className="fa-solid fa-check"></i> Sesuai target pendapatan
          </p>
        </div>

        
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengeluaran</span>
            <div className="bg-rose-50 text-rose-500 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-circle-arrow-down text-xs"></i>
            </div>
          </div>
          <h3 className="text-2xl font-black text-rose-600">Rp 6.750.000</h3>
          <p className="text-[10px] text-rose-600/80 mt-2 font-medium">
            <i className="fa-solid fa-arrow-trend-down"></i> -12.4% dari bulan lalu
          </p>
        </div>

      
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rasio Tabungan</span>
            <div className="bg-amber-50 text-amber-500 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-piggy-bank text-xs"></i>
            </div>
          </div>
          <h3 className="text-2xl font-black text-amber-600">73%</h3>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden border border-slate-200/30">
            <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full" style={{width: "73%"}}></div>
          </div>
        </div>
      </section>

      
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800">Transaksi Terakhir</h4>
            <button onclick="switchTab('pengeluaran')" class="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-all">Lihat Semua</button>
          </div>

          <div className="space-y-2.5">
            
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-arrow-trend-up text-xs"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Gaji Utama Bulanan</p>
                  <p className="text-[10px] text-slate-400">15 Jul 2026 • Gaji</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">+Rp 15.000.000</span>
            </div>
            
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-arrow-trend-down text-xs"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Belanja Bulanan Carrefour</p>
                  <p className="text-[10px] text-slate-400">12 Jul 2026 • Makanan</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700">-Rp 1.850.000</span>
            </div>
            
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-arrow-trend-down text-xs"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Pembayaran Listrik & WiFi</p>
                  <p className="text-[10px] text-slate-400">10 Jul 2026 • Tagihan</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700">-Rp 850.000</span>
            </div>
            
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-arrow-trend-up text-xs"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Dividen Saham Bank Mandiri</p>
                  <p className="text-[10px] text-slate-400">08 Jul 2026 • Investasi</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">+Rp 450.000</span>
            </div>
          </div>
        </div>

        
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800">Anggaran Bulanan</h4>
            <button onclick="switchTab('kategori')" class="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-all">Atur</button>
          </div>

          <div className="space-y-3.5">
            
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-slate-600">Makanan & Minuman</span>
                <span className="text-slate-400">52% Terpakai</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{width: '52%'}}></div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-slate-600">Transportasi</span>
                <span className="text-slate-400">21% Terpakai</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full" style={{width: '21%'}}></div>
              </div>
            </div>
           
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-slate-600">Tagihan & Listrik</span>
                <span className="text-rose-500 font-bold">90% Hampir Habis!</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
        </Layout>
    )
}