import { Layout } from "../components/Layout";

export function Profile() {
  return (
    <Layout title="Profil Pengguna" description="Informasi data diri dan pengaturan akun keuangan ArthaKita Anda.">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Header Profil */}
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 pb-6">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
            alt="Profile Zahra Amanda"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/20"
          />
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Zahra Amanda</h3>
            <p className="text-xs text-slate-400">Anggota Aktif sejak Januari 2025</p>
            <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full">
              Akun Premium
            </span>
          </div>
        </div>

        {/* Informasi Akun & Pengaturan */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Informasi Akun
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] block font-semibold">Nama Lengkap</span>
              <p className="font-semibold text-slate-800">Zahra Amanda</p>
            </div>

            <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] block font-semibold">Alamat Email</span>
              <p className="font-semibold text-slate-800">zahra@arthakita.id</p>
            </div>

            <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] block font-semibold">Pekerjaan</span>
              <p className="font-semibold text-slate-800">Senior UX Researcher</p>
            </div>

            <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] block font-semibold">Mata Uang Utama</span>
              <p className="font-semibold text-slate-800">Rupiah (IDR)</p>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
            Edit Profil
          </button>
          <button className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all">
            Ubah Kata Sandi
          </button>
        </div>
      </div>
    </Layout>
  );
}