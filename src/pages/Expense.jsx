import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { supabase } from "../SupabaseClients";

export function Expense() {
  // Main states
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Form states
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState(getTodayString());

  function getTodayString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 4500);
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  // Reset halaman ke 1 ketika filter/pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id,
          amount,
          description,
          transaction_date,
          category_id,
          categories (
            id,
            name
          )
        `)
        .eq("type", "expense")
        .order("transaction_date", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (err) {
      triggerAlert("error", "Gagal memuat data pengeluaran: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedTransaction(null);
    setAmount("");
    setCategoryId("");
    setDescription("");
    setTransactionDate(getTodayString());
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setModalMode("edit");
    setSelectedTransaction(transaction);
    setAmount(transaction.amount.toString());
    setCategoryId(transaction.category_id || "");
    setDescription(transaction.description || "");
    const rawDate = transaction.transaction_date
      ? new Date(transaction.transaction_date)
      : new Date();
    const yyyy = rawDate.getFullYear();
    const mm = String(rawDate.getMonth() + 1).padStart(2, "0");
    const dd = String(rawDate.getDate()).padStart(2, "0");
    setTransactionDate(`${yyyy}-${mm}-${dd}`);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      triggerAlert("error", "Nominal pengeluaran harus lebih besar dari 0");
      return;
    }

    try {
      setSubmitLoading(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        triggerAlert("error", "Sesi Anda telah habis. Silakan login kembali.");
        return;
      }

      const selectedDate = new Date(transactionDate);
      const now = new Date();
      selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

      const payload = {
        amount: parseFloat(amount),
        category_id: categoryId || null,
        description: description || null,
        transaction_date: selectedDate.toISOString(),
        type: "expense",
        user_id: session.user.id,
      };

      if (modalMode === "add") {
        const { error } = await supabase.from("transactions").insert([payload]);
        if (error) throw error;
        triggerAlert("success", "Pengeluaran berhasil ditambahkan!");
      } else {
        const { error } = await supabase
          .from("transactions")
          .update({
            amount: payload.amount,
            category_id: payload.category_id,
            description: payload.description,
            transaction_date: payload.transaction_date,
          })
          .eq("id", selectedTransaction.id);
        if (error) throw error;
        triggerAlert("success", "Pengeluaran berhasil diubah!");
      }

      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      triggerAlert("error", `Gagal menyimpan data: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const triggerDelete = (transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;
    try {
      setSubmitLoading(true);
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionToDelete.id);

      if (error) throw error;
      triggerAlert("success", "Pengeluaran berhasil dihapus!");
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
      fetchExpenses();
    } catch (err) {
      triggerAlert("error", `Gagal menghapus data: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;
  const transactionCount = expenses.length;

  const filteredExpenses = expenses
    .filter((item) => {
      const matchSearch = item.description
        ? item.description.toLowerCase().includes(searchTerm.toLowerCase())
        : false || searchTerm === "";
      const matchCategory = selectedCategory === "" || item.category_id === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.transaction_date) - new Date(a.transaction_date);
      }
      if (sortBy === "oldest") {
        return new Date(a.transaction_date) - new Date(b.transaction_date);
      }
      if (sortBy === "highest") {
        return b.amount - a.amount;
      }
      if (sortBy === "lowest") {
        return a.amount - b.amount;
      }
      return 0;
    });

  // Hitung data untuk pagination
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Layout title="Arus Pengeluaran" description="Kelola dan pantau seluruh catatan pengeluaran kas keuangan Anda.">
      {alert.message && (
        <div className={`fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm transition-all duration-300 animate-slide-up ${
          alert.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <i className={`fa-solid ${alert.type === "success" ? "fa-circle-check text-emerald-500" : "fa-circle-exclamation text-rose-500"} text-lg`}></i>
          <span className="font-medium">{alert.message}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-5 text-white shadow-sm shadow-rose-500/10 flex flex-col justify-between h-32 group hover:shadow-md hover:shadow-rose-500/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-100 uppercase tracking-wider">Total Pengeluaran</span>
            <span className="bg-white/15 p-2 rounded-xl text-white text-xs">
              <i className="fa-solid fa-arrow-trend-down"></i>
            </span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black">{formatRupiah(totalAmount)}</h3>
            <p className="text-[10px] text-rose-100/80 mt-1">Akumulasi seluruh riwayat pengeluaran</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-32 hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-rata Transaksi</span>
            <span className="bg-slate-50 text-slate-500 p-2 rounded-xl text-xs">
              <i className="fa-solid fa-calculator"></i>
            </span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-800">{formatRupiah(averageAmount)}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Nilai rata-rata per transaksi keluar</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-32 hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Frekuensi Keluar</span>
            <span className="bg-slate-50 text-slate-500 p-2 rounded-xl text-xs">
              <i className="fa-solid fa-receipt"></i>
            </span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-800">{transactionCount} Kali</h3>
            <p className="text-[10px] text-slate-400 mt-1">Jumlah seluruh pengeluaran tercatat</p>
          </div>
        </div>
      </div>

      {/* Filter, Search, and Add Section */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-sm text-slate-800">Rincian Arus Pengeluaran</h3>
          <button 
            onClick={openAddModal}
            className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-rose-500/10 active:scale-[0.98] flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Tambah Pengeluaran</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-4">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Cari deskripsi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-500 transition-all placeholder:text-slate-400 text-slate-700"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-500 transition-all text-slate-650 appearance-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none text-[10px]"></i>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-500 transition-all text-slate-650 appearance-none"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="highest">Nominal Terbesar</option>
              <option value="lowest">Nominal Terkecil</option>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none text-[10px]"></i>
          </div>
        </div>

        {/* Transactions List */}
        <div className="pt-2">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border border-slate-100 rounded-xl flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-32 bg-slate-200 rounded"></div>
                      <div className="h-2.5 w-48 bg-slate-150 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="h-3.5 w-24 bg-slate-200 rounded ml-auto"></div>
                    <div className="h-2 w-14 bg-slate-150 rounded ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-350">
                <i className="fa-solid fa-[#111827] fa-receipt text-2xl"></i>
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-700">Tidak Ada Data Pengeluaran</h5>
                <p className="text-[10px] text-slate-400 max-w-[280px]">
                  {searchTerm || selectedCategory 
                    ? "Coba ganti filter atau kata pencarian Anda." 
                    : "Belum ada catatan pengeluaran. Klik tombol di atas untuk membuat catatan."}
                </p>
              </div>
              {!searchTerm && !selectedCategory && (
                <button
                  onClick={openAddModal}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Buat Catatan Baru
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedExpenses.map((item) => {
                const categoryName = item.categories?.name;
                return (
                  <div 
                    key={item.id}
                    className="p-4 bg-slate-50/20 border border-slate-100 rounded-xl hover:border-slate-250 hover:bg-slate-50/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-800 truncate">
                            {item.description || "Pengeluaran Uang"}
                          </h5>
                          <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-medium shrink-0">
                            {categoryName || "Tanpa Kategori"}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          Tercatat pada {formatDate(item.transaction_date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-black text-rose-600">-{formatRupiah(item.amount)}</span>
                        <p className="text-[9px] text-slate-400 font-medium">Terbayar</p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Ubah Data"
                        >
                          <i className="fa-solid fa-pen text-[10px]"></i>
                        </button>
                        <button 
                          onClick={() => triggerDelete(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Hapus Data"
                        >
                          <i className="fa-solid fa-trash text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigasi Pagination */}
          {filteredExpenses.length > ITEMS_PER_PAGE && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-4">
              <span className="text-[11px] text-slate-500 font-medium">
                Menampilkan <span className="font-bold text-slate-700">{startIndex + 1}</span> -{" "}
                <span className="font-bold text-slate-700">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredExpenses.length)}
                </span>{" "}
                dari <span className="font-bold text-slate-700">{filteredExpenses.length}</span> data
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  <i className="fa-solid fa-chevron-left text-[10px]"></i>
                  <span>Prev</span>
                </button>

                <div className="px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg">
                  {currentPage} / {totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  <span>Next</span>
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !submitLoading && setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl border border-slate-100 transform transition-all duration-300 scale-100 overflow-hidden">
            <button 
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              onClick={() => !submitLoading && setIsModalOpen(false)}
              disabled={submitLoading}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {modalMode === "add" ? "Tambah Pengeluaran Baru" : "Ubah Data Pengeluaran"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {modalMode === "add" 
                    ? "Isi formulir berikut untuk menambahkan riwayat pengeluaran uang Anda." 
                    : "Perbarui informasi transaksi pengeluaran terpilih di bawah ini."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="amount" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Jumlah Nominal (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input 
                      type="number" 
                      id="amount" 
                      required 
                      placeholder="0"
                      min="1"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={submitLoading}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="categoryId" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Kategori Pengeluaran
                    </label>
                    <a href="/kategori" className="text-[9px] font-bold text-rose-600 hover:text-rose-700">
                      Kelola Kategori <i className="fa-solid fa-chevron-right text-[7px] ml-0.5"></i>
                    </a>
                  </div>
                  <div className="relative">
                    <select 
                      id="categoryId"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      disabled={submitLoading}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-all text-slate-650 appearance-none"
                    >
                      <option value="">-- Pilih Kategori (Opsional) --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="transactionDate" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Tanggal Transaksi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="date" 
                      id="transactionDate" 
                      required
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                      disabled={submitLoading}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-all text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Deskripsi / Catatan
                  </label>
                  <textarea 
                    id="description" 
                    placeholder="Contoh: Pembelian bahan makanan mingguan di supermarket"
                    value={description}
                    rows="3"
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={submitLoading}
                    maxLength="250"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-all text-slate-700 placeholder:text-slate-400 resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitLoading}
                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all text-center"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-rose-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {submitLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk text-xs"></i>
                        <span>Simpan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !submitLoading && setIsDeleteModalOpen(false)}
          ></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 text-center space-y-5">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-lg">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-slate-800">Hapus Catatan Pengeluaran?</h3>
              <p className="text-[10px] text-slate-400 max-w-[250px] mx-auto">
                Tindakan ini tidak dapat dibatalkan. Riwayat transaksi "{transactionToDelete?.description || "Pengeluaran"}" sebesar <span className="font-bold text-rose-600">{formatRupiah(transactionToDelete?.amount || 0)}</span> akan terhapus permanen.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={submitLoading}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                disabled={submitLoading}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-md shadow-rose-650/10 flex items-center justify-center gap-1.5"
              >
                {submitLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <i className="fa-solid fa-trash text-[10px]"></i>
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}