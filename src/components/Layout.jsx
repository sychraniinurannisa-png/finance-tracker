import { useEffect } from "react"

export function Layout({children}) {
    useEffect (()=>{
        document.body.classList.add('bg-slate-50', 'text-slate-800', 'min-h-screen', 'flex', 'flex-col', 'md:flex-row')
    })
    return (
        <div>
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 p-5 z-30 justify-between">
            <div className="space-y-8">
            
            <div className="flex items-center gap-3 px-2">
                <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">Finance Tracker</h1>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Atur Finansialmu</p>
                </div>
            </div>

            
            <nav className="space-y-1" id="desktop-menu">
                <button onclick="switchTab('dashboard')" data-target="dashboard" class="menu-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all bg-emerald-50 text-emerald-700">
                <i className="fa-solid fa-chart-pie text-base"></i>
                <span>Dashboard</span>
                </button>
                <button onclick="switchTab('pemasukan')" data-target="pemasukan" class="menu-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-slate-500 hover:text-slate-850 hover:bg-slate-50">
                <i className="fa-solid fa-circle-arrow-up text-base"></i>
                <span>Pemasukan</span>
                </button>
                <button onclick="switchTab('pengeluaran')" data-target="pengeluaran" class="menu-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-slate-500 hover:text-slate-850 hover:bg-slate-50">
                <i className="fa-solid fa-circle-arrow-down text-base"></i>
                <span>Pengeluaran</span>
                </button>
                <button onclick="switchTab('kategori')" data-target="kategori" class="menu-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-slate-500 hover:text-slate-850 hover:bg-slate-50">
                <i className="fa-solid fa-tags text-base"></i>
                <span>Kategori</span>
                </button>
                <button onclick="switchTab('profil')" data-target="profil" class="menu-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-slate-500 hover:text-slate-850 hover:bg-slate-50">
                <i className="fa-solid fa-circle-user text-base"></i>
                <span>Profil</span>
                </button>
            </nav>
            </div>

    
    <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" alt="Profile" class="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20" />
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-slate-800 truncate">Zahra Amanda</h4>
          <p className="text-[10px] text-slate-400 truncate">Premium Member</p>
        </div>
      </div>
      <button onclick="handleLogout()" title="Keluar dari Akun" class="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors shrink-0">
        <i className="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  </aside>

  <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl w-[92%] max-w-md py-2.5 px-4 flex justify-around items-center" id="mobile-menu">
    <button onclick="switchTab('dashboard')" data-target="dashboard" class="menu-btn flex flex-col items-center gap-1 text-emerald-600 transition-all">
      <i className="fa-solid fa-chart-pie text-base"></i>
      <span className="text-[9px] font-bold">Dashboard</span>
    </button>
    <button onclick="switchTab('pemasukan')" data-target="pemasukan" class="menu-btn flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-all">
      <i className="fa-solid fa-circle-arrow-up text-base"></i>
      <span className="text-[9px] font-bold">Pemasukan</span>
    </button>
    <button onclick="switchTab('pengeluaran')" data-target="pengeluaran" class="menu-btn flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-all">
      <i className="fa-solid fa-circle-arrow-down text-base"></i>
      <span className="text-[9px] font-bold">Pengeluaran</span>
    </button>
    <button onclick="switchTab('kategori')" data-target="kategori" class="menu-btn flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-all">
      <i className="fa-solid fa-tags text-base"></i>
      <span className="text-[9px] font-bold">Kategori</span>
    </button>
    <button onclick="switchTab('profil')" data-target="profil" class="menu-btn flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-all">
      <i className="fa-solid fa-circle-user text-base"></i>
      <span className="text-[9px] font-bold">Profil</span>
    </button>
  </nav>

  <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full space-y-6">
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900" id="section-title">Ringkasan Dasbor</h2>
        <p className="text-xs text-slate-400" id="section-desc">Statistik finansial dan gambaran umum keuangan Anda hari ini.</p>
      </div>
      <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 border border-slate-200/50 rounded-full text-slate-600 align-self-start sm:align-self-auto" id="live-date">Sabtu, 18 Juli 2026</span>
    </header>
    {children}
  </main>
        </div>
    )

}