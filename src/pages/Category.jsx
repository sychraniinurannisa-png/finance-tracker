import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { supabase } from "../supabaseClients";

export function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk form tambah kategori
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk Modal Hapus
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const getCategoryIcon = (categoryName = "") => {
    const name = categoryName.toLowerCase();

    if (name.includes("makan") || name.includes("minum") || name.includes("kuliner") || name.includes("jajanan")) {
      return "fa-bowl-food";
    }
    if (name.includes("trans") || name.includes("bensin") || name.includes("parkir") || name.includes("mobil") || name.includes("motor")) {
      return "fa-car";
    }
    if (name.includes("belanja") || name.includes("shop") || name.includes("pasar") || name.includes("mall")) {
      return "fa-bag-shopping";
    }
    if (name.includes("tagihan") || name.includes("listrik") || name.includes("air") || name.includes("wifi") || name.includes("pulsa")) {
      return "fa-file-invoice-dollar";
    }
    if (name.includes("gaji") || name.includes("income") || name.includes("pendapatan") || name.includes("upah")) {
      return "fa-wallet";
    }
    if (name.includes("hiburan") || name.includes("main") || name.includes("game") || name.includes("nonton")) {
      return "fa-gamepad";
    }
    if (name.includes("sehat") || name.includes("obat") || name.includes("dokter") || name.includes("medis")) {
      return "fa-user-nurse";
    }
    if (name.includes("didik") || name.includes("sekolah") || name.includes("kursus") || name.includes("buku")) {
      return "fa-graduation-cap";
    }

    return "fa-tags";
  };

  // Fungsi untuk mendapatkan class warna ikon (background & teks) dan class warna garis
  const getCategoryTheme = (categoryName = "", index = 0) => {
    const name = categoryName.toLowerCase();

    if (name.includes("makan") || name.includes("minum") || name.includes("kuliner") || name.includes("jajanan")) {
      return { icon: "bg-amber-100 text-amber-600", bar: "bg-amber-500" };
    }
    if (name.includes("trans") || name.includes("bensin") || name.includes("parkir") || name.includes("mobil") || name.includes("motor")) {
      return { icon: "bg-blue-100 text-blue-600", bar: "bg-blue-500" };
    }
    if (name.includes("belanja") || name.includes("shop") || name.includes("pasar") || name.includes("mall")) {
      return { icon: "bg-purple-100 text-purple-600", bar: "bg-purple-500" };
    }
    if (name.includes("tagihan") || name.includes("listrik") || name.includes("air") || name.includes("wifi") || name.includes("pulsa")) {
      return { icon: "bg-rose-100 text-rose-600", bar: "bg-rose-500" };
    }
    if (name.includes("gaji") || name.includes("income") || name.includes("pendapatan") || name.includes("upah")) {
      return { icon: "bg-emerald-100 text-emerald-600", bar: "bg-emerald-500" };
    }
    if (name.includes("hiburan") || name.includes("main") || name.includes("game") || name.includes("nonton")) {
      return { icon: "bg-indigo-100 text-indigo-600", bar: "bg-indigo-500" };
    }
    if (name.includes("sehat") || name.includes("obat") || name.includes("dokter") || name.includes("medis")) {
      return { icon: "bg-teal-100 text-teal-600", bar: "bg-teal-500" };
    }
    if (name.includes("didik") || name.includes("sekolah") || name.includes("kursus") || name.includes("buku")) {
      return { icon: "bg-sky-100 text-sky-600", bar: "bg-sky-500" };
    }

    // Palette warna opsional jika nama tidak cocok dengan kata kunci
    const palette = [
      { icon: "bg-orange-100 text-orange-600", bar: "bg-orange-500" },
      { icon: "bg-pink-100 text-pink-600", bar: "bg-pink-500" },
      { icon: "bg-cyan-100 text-cyan-600", bar: "bg-cyan-500" },
      { icon: "bg-violet-100 text-violet-600", bar: "bg-violet-500" },
      { icon: "bg-lime-100 text-lime-600", bar: "bg-lime-500" },
    ];

    return palette[index % palette.length];
  };

  const fetchCategoryData = async () => {
    try {
      setLoading(true);

      const { data: categoryData, error: catError } = await supabase
        .from("categories")
        .select("id, name");

      if (catError) throw catError;

      const { data: transactionData, error: transError } = await supabase
        .from("transactions")
        .select("category_id, amount");

      if (transError) throw transError;

      const processedCategories = (categoryData || []).map((cat) => {
        const totalUsed = (transactionData || [])
          .filter((t) => t.category_id === cat.id)
          .reduce((sum, item) => sum + Number(item.amount), 0);

        const limit = 3500000;
        const percentage =
          limit > 0 ? Math.min(Math.round((totalUsed / limit) * 100), 100) : 0;

        return {
          ...cat,
          percentage: percentage,
        };
      });

      setCategories(processedCategories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase
        .from("categories")
        .insert([{ name: newCategory.trim() }]);

      if (error) throw error;

      setNewCategory("");
      await fetchCategoryData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryToDelete.id);

      if (error) throw error;

      setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout
      title="Batas Kategori"
      description="Pengaturan dan sisa batas maksimal anggaran pengeluaran bulanan."
    >
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-5">
        <div>
          <h3 className="font-bold text-sm text-slate-800">
            Kategori & Limit Anggaran
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Daftar pagu pengeluaran maksimal Anda bulan ini
          </p>
        </div>

        {/* Form Tambah Kategori */}
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            type="text"
            placeholder="Ketik nama kategori baru..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Tambah"}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Memuat data kategori...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Belum ada kategori yang ditambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category, index) => {
              const theme = getCategoryTheme(category.name, index);

              return (
                <div
                  key={category.id}
                  className="p-4 bg-slate-50/40 border border-slate-200/60 rounded-xl space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`p-2 rounded-lg text-xs ${theme.icon}`}>
                        <i className={`fa-solid ${getCategoryIcon(category.name)}`}></i>
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {category.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">
                        {category.percentage}%
                      </span>

                      <button
                        onClick={() => setCategoryToDelete(category)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        title="Hapus Kategori"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar dengan Warna Dinamis sesuai tema */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`${theme.bar} h-full rounded-full transition-all duration-300`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* POP-UP MODAL CONFIRMATION */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-xl space-y-4 border border-slate-100">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              !
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-slate-800">
                Hapus Kategori?
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Kategori{" "}
                <span className="font-bold text-rose-500">
                  "{categoryToDelete.name}"
                </span>{" "}
                akan terhapus secara permanen.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}