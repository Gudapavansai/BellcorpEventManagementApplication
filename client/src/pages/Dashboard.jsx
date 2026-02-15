import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, CheckCircle, Clock, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      const res = await axios.get('/api/events/user/my-registrations');
      setRegistrations(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    if (window.confirm('Are you sure you want to cancel your registration for this event?')) {
      try {
        await axios.delete(`/api/events/registration/${eventId}`);
        fetchMyRegistrations();
      } catch (err) {
        alert(err.response?.data?.message || 'Error cancelling registration');
      }
    }
  };

  const today = new Date();
  const upcoming = registrations.filter(reg => reg.event && new Date(reg.event.date) >= today);
  const past = registrations.filter(reg => reg.event && new Date(reg.event.date) < today);

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20 bg-slate-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-center"
        >
          <div className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">Member Portal</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Hey, {user?.name.split(' ')[0]}! 👋</h2>
          <p className="text-lg text-slate-600">You have {upcoming.length} upcoming events and {past.length} past experiences.</p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-purple-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Calendar size={24} className="text-white" />
              </div>
              <h4 className="text-lg font-bold opacity-90">Active Passes</h4>
            </div>
            <h2 className="text-5xl font-extrabold mb-2">{upcoming.length}</h2>
            <p className="text-white/80 font-medium">Confirmed upcoming experiences</p>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100" 
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-orange-100 rounded-2xl">
                <CheckCircle size={24} className="text-orange-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-700">Total Memories</h4>
            </div>
            <h2 className="text-5xl font-extrabold text-slate-900 mb-2">{registrations.length}</h2>
            <p className="text-slate-500 font-medium">Lifelong stories collected</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex gap-1">
            {['upcoming', 'past', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-purple-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                {tab === 'all' ? 'All Registrations' : tab === 'upcoming' ? 'Upcoming Events' : 'Past History'}
              </button>
            ))}
          </div>
        </div>

        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {activeTab === 'upcoming' && <><Clock size={24} className="text-purple-700" /> Upcoming Experiences</>}
              {activeTab === 'past' && <><CheckCircle size={24} className="text-slate-400" /> Journey History</>}
              {activeTab === 'all' && <><Calendar size={24} className="text-slate-600" /> All Registrations</>}
            </h3>
            {upcoming.length > 0 && activeTab === 'upcoming' && (
              <Link to="/" className="text-purple-700 hover:text-purple-800 font-bold text-sm flex items-center gap-1 group">
                Find More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="space-y-6">
            {/* Render Logic based on Active Tab */}
            {(() => {
              let dataToRender = [];
              if (activeTab === 'upcoming') dataToRender = upcoming;
              else if (activeTab === 'past') dataToRender = past;
              else dataToRender = registrations;

              if (dataToRender.length > 0) {
                return dataToRender.map((reg, index) => (
                  <motion.div 
                    key={reg._id} 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300 flex flex-col md:flex-row gap-6 group"
                  >
                    <div className="w-full md:w-64 h-48 md:h-auto rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img src={reg.event?.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-purple-700 uppercase tracking-wide shadow-sm">
                        {reg.event?.category}
                      </div>
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors mb-2">{reg.event?.name}</h4>
                          <div className="space-y-2">
                             <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Calendar size={16} className="text-purple-600" /> 
                                <span className="font-medium">{reg.event && new Date(reg.event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                             </div>
                             <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin size={16} className="text-purple-600" /> 
                                <span className="font-medium">{reg.event?.location}</span>
                             </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 text-center min-w-[100px]">
                           <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                           <span className="block text-sm font-bold text-green-600 flex items-center justify-center gap-1">
                             <CheckCircle size={14} /> Confirmed
                           </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 mt-auto">
                        <Link 
                          to={`/event/${reg.event?._id}`} 
                          className="px-5 py-2.5 bg-purple-50 text-purple-700 font-bold rounded-xl hover:bg-purple-100 transition-colors text-sm flex-1 md:flex-none text-center"
                        >
                          View Ticket
                        </Link>
                        {new Date(reg.event?.date) >= today && (
                          <button 
                            onClick={() => handleCancelRegistration(reg.event?._id)}
                            className="px-5 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors text-sm border border-transparent hover:border-red-100 md:ml-auto"
                          >
                            Cancel Pass
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ));
              } else {
                 return (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                      <Search size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No events found in this tab.</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Time to explore new experiences and fill up your schedule!</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition-colors shadow-lg hover:shadow-purple-700/30">
                      Explore Experiences <ArrowRight size={18} />
                    </Link>
                  </div>
                );
              }
            })()}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Dashboard;
