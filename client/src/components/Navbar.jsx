import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, UserPlus, Menu, X, Bookmark, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm py-2`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 relative w-48 flex items-center z-50">
             <motion.div
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="left-0"
             >
               <img src={logo} alt="BellCrop Studio" className="h-28 w-auto object-contain" />
             </motion.div>
          </Link>

          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-base font-medium transition-colors duration-200 flex items-center gap-2 ${isActive('/') ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>
              Explore
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className={`text-base font-medium transition-colors duration-200 flex items-center gap-2 ${isActive('/dashboard') ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>
                  My Events
                </Link>
                <Link to="/create-event" className={`text-base font-medium transition-colors duration-200 flex items-center gap-2 ${isActive('/create-event') ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>
                  Host Event
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold">
                      {user.name[0]}
                    </div>
                    <span className="font-semibold text-base text-gray-700">{user.name.split(' ')[0]}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-medium text-base transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`text-base font-medium transition-colors duration-200 ${isActive('/login') ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>
                  Login
                </Link>
                <Link to="/register" className="flex items-center gap-2 bg-purple-700 text-white px-5 py-2 rounded-full text-base font-semibold shadow-md hover:bg-purple-800 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  <UserPlus size={16} />
                  <span>Join Now</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-gray-600 hover:text-purple-700 transition-colors" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl rounded-b-2xl overflow-hidden"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col p-4 space-y-2">
                <Link to="/" className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${isActive('/') ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50 hover:text-purple-700'}`}>
                  Explore
                </Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${isActive('/dashboard') ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50 hover:text-purple-700'}`}>
                      My Events
                    </Link>
                    <Link to="/create-event" className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${isActive('/create-event') ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50 hover:text-purple-700'}`}>
                      Host Event
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 my-2">
                      <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center text-sm font-bold">
                        {user.name[0]}
                      </div>
                      <span className="font-semibold text-gray-800">{user.name}</span>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 font-semibold bg-red-50 hover:bg-red-100 rounded-lg transition-colors mt-2"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${isActive('/login') ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50 hover:text-purple-700'}`}>
                      Login
                    </Link>
                    <Link to="/register" className="flex items-center justify-center gap-2 bg-purple-700 text-white px-4 py-3 rounded-lg font-bold shadow-md hover:bg-purple-800 transition-colors mt-2">
                      <UserPlus size={18} />
                      <span>Join Now</span>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
