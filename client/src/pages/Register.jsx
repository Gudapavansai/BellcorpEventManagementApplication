import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password } = formData;

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return setError('All fields are required');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    
    setError('');
    setLoading(true);
    
    const result = await register(name, email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-purple-200/50 border border-slate-100 relative overflow-hidden"
      >
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl" />

        <div className="text-center relative">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto h-16 w-16 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-purple-600/20 mb-6"
          >
            <Sparkles size={32} />
          </motion.div>
          
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Join BellCrop</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
            Start discovering and attending amazing events around you today.
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 overflow-hidden"
            >
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form className="mt-8 space-y-5 relative" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-600 text-slate-400">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-600 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={onChange}
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Secure Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-600 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 py-2">
             <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-600" />
             <p className="text-[11px] text-slate-500 font-medium">
               By clicking Create Account, you agree to our <span className="text-purple-600 font-bold hover:underline cursor-pointer">Terms</span> and <span className="text-purple-600 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
             </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center items-center gap-3 py-4 bg-slate-900 text-white text-sm font-black rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/10 hover:bg-purple-700 hover:shadow-purple-700/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
             )}
          </motion.button>
        </form>
        
        <div className="pt-8 text-center border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="inline-flex items-center gap-1 font-black text-purple-600 hover:text-purple-700 transition-colors">
                 Sign In Here <ArrowRight size={16} />
              </Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
