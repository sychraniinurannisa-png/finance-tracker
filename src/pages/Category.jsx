import { Layout } from "../components/Layout";
import { supabase } from "../SupabaseClients";
import { useEffect, useState } from "react";
export function Category () {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null) 

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error} = await supabase 
         .from('categories')
         .select('id, name')
      if (error) throw error;   
      setCategories(data)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchCategories();
  })
    return(
        <Layout title="Batas Kategori" description="Pengaturan dan sisa batas maksimal anggaran pengeluaran bulanan.">
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-5">
        <div>
          <h3 className="font-bold text-sm text-slate-800">Kategori & Limit Anggaran</h3>
          <p className="text-xs text-slate-400 mt-1">Daftar pagu pengeluaran maksimal Anda bulan ini</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Cat 1 */}
          {categories.map((category) =>(
            <div className="p-4 bg-slate-50/30 border border-slate-200/60 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-600 rounded-lg text-xs">
                  <i className="fa-solid fa-bowl-food"></i>
                </span>
                <span className="text-xs font-bold text-slate-800">{category.name}n</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">52%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '52%' }}></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Terpakai: Rp 1.850.000</span>
              <span>Batas: Rp 3.500.000</span>
            </div>
          </div>
          ))}
          
        </div>
      </div>
    </Layout>
  );
}
    