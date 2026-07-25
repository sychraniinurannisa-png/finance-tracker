import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClients"
import { useNavigate } from "react-router-dom";

export function Login (){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    useEffect(()=> {
      const checkUser = async () => {
        const { data: { session}} = await supabase.auth.getSession();
        if (session) {
          navigate('/');
        }
      };
      checkUser();      
  },  [navigate]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try{
            if (isSignUp) {
                const {data, error} = await supabase.auth.signUp ({
                    email,
                    password,
                });

            if (error) throw error;
            
            setMessage('Check your email fot the confirmation link!');
         }  else {
                const {data, error} = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
            if (error) throw error;
            setMessage('Logged in Successfully!');
            navigate('/');
            }
        }   catch (error) {
            setMessage(error.error_description || error.message);
        }   finally {
            setLoading(false);
        }
        };
    
    useEffect (()=>{
        document.body.classList.add('bg-slate-50', 'text-slate-800', 'min-h-screen', 'flex', 'items-center', 'justify-center', 'py-12', 'px-4', 'sm:px-6', 'lg:px-8')
    })
    return(
                   
        <div class="max-w-md w-full space-y-8 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl">
    
    <div className="text-center space-y-3">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Finance Tracker</h2>
        <p className="text-xs text-slate-400">Dasbor Analisis Keuangan Pribadi</p>
      </div>
    </div>

    <div className="text-center">
      <h3 className="text-lg font-bold text-slate-850">Selamat Datang Kembali</h3>
      <p className="text-xs text-slate-400 mt-1">Silakan masuk untuk mengelola keuangan Anda</p>
    </div>

    <form className="mt-6 space-y-4" onSubmit={handleAuth}>
      
      <div className="space-y-1.5">
        <label for="login-email" class="block text-xs font-bold text-slate-450 uppercase tracking-wider">Alamat Email</label>
        <div className="relative">
          <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input id="login-email" 
                 type="email" 
                 required 
                 placeholder="user@mail.com" 
                 value={email}
                 onChange={(e)=> setEmail(e.target.value)} 
                 class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
                 text-sm focus:outline-none focus:border-emerald-500/80 transition-all 
                 placeholder:text-slate-400 text-slate-700"/>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label for="login-password" class="block text-xs font-bold text-slate-450 uppercase tracking-wider">Kata Sandi</label>
          <a href="#" class="text-[11px] font-bold text-emerald-600 hover:text-emerald-700">Lupa Sandi?</a>
        </div>
        <div className="relative">
          <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input id="login-password" 
                 type="password" 
                 required placeholder="••••••••" 
                 value={password} 
                 onChange={(e)=> setPassword(e.target.value)} 
                 class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 
                 rounded-xl text-sm focus:outline-none focus:border-emerald-500/80 
                 transition-all placeholder:text-slate-400 text-slate-700"/>
        </div>
      </div>
 
      <div className="flex items-center">
        <input id="remember-me" type="checkbox" checked class="h-4 w-4 text-emerald-600 border-slate-350 rounded focus:ring-emerald-500"/>
        <label for="remember-me" class="ml-2 block text-xs font-semibold text-slate-500">Ingat akun saya di perangkat ini</label>
      </div>
  
      <button id="login-submit-btn" disabled={loading} type="submit" class="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98] flex items-center justify-center gap-2">
        <span>
            {loading ? 'Processing...' : isSignUp ? 'sign Up' : 'Log In'}
        </span>
        <i className="fa-solid fa-arrow-right text-xs" id="login-btn-icon"></i>
      </button>
    </form>
  
    <div className="relative flex items-center justify-center my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200"></div>
      </div>
      <span className="relative px-3 bg-white text-xs text-slate-400 font-semibold">Atau masuk dengan</span>
    </div>
 
    <div className="grid grid-cols-1 gap-3">
      <button onclick="handleSocialLogin('Google')" class="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.97] transition-all">
        <i className="fa-brands fa-google text-red-500"></i>
        <span>Google</span>
      </button>
    </div>

    <p className="text-center text-xs text-slate-450 mt-4">
      Belum memiliki akun? <a href="#" onClick={()=> setIsSignUp(!isSignUp)} class="font-bold text-emerald-600 hover:text-emerald-700">Daftar Akun Baru</a>
    </p>
  </div>
        
    )
}