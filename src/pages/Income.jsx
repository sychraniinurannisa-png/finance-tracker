import { Layout } from "../components/Layout";
export function Income() {
  return (
    <Layout title="Arus Pemasukan" description="Rincian detail riwayat pemasukan dan pendapatan uang Anda.">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-800">Rincian Arus Pendapatan</h3>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">Total: Rp 25.000.000</span>
        </div>

        <div className="space-y-3">
          {/* Income Item 1 */}
          <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-money-bill-wave text-sm"></i>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Gaji Utama Bulanan</h5>
                <p className="text-[10px] text-slate-400">Diterima tanggal 15 setiap bulan • PT Maju Jaya</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-600">+Rp 15.000.000</span>
              <p className="text-[9px] text-slate-400">15 Jul 2026</p>
            </div>
          </div>

          {/* Income Item 2 */}
          <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-code text-sm"></i>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Proyek Freelance Desain</h5>
                <p className="text-[10px] text-slate-400">Pekerjaan sampingan logo branding</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-600">+Rp 9.550.000</span>
              <p className="text-[9px] text-slate-400">11 Jul 2026</p>
            </div>
          </div>

          {/* Income Item 3 */}
          <div className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-chart-line text-sm"></i>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Dividen Saham Bank Mandiri</h5>
                <p className="text-[10px] text-slate-400">Hasil pembagian laba tahunan emiten</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-600">+Rp 450.000</span>
              <p className="text-[9px] text-slate-400">08 Jul 2026</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
