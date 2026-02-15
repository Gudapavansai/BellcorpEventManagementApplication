import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Share2, Heart, ShieldCheck, Star, Clock, Map as MapIcon, Sparkles, ArrowLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEvent();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/events/${id}`);
      setEvent(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post(`/api/events/${id}/register`);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'You are officially on the guest list!' });
        fetchEvent(); // Refresh status immediately
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to complete registration.' });
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      setRegistering(true);
      try {
        await axios.delete(`/api/events/registration/${id}`);
        setMessage({ type: 'success', text: 'Registration cancelled successfully.' });
        fetchEvent();
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to cancel.' });
      } finally {
        setRegistering(false);
      }
    }
  };

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
    </div>
  );

  if (!event) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center">
      <h2 className="text-3xl font-bold text-slate-800 mb-4">Event Not Found</h2>
      <p className="text-slate-500 mb-8">This event might have been removed or is unavailable.</p>
      <button onClick={() => navigate('/')} className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition">Return Home</button>
    </div>
  );

  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' });
  const soldOutPercentage = Math.round(((event.capacity - event.availableSeats) / event.capacity) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-600 hover:text-purple-700 font-medium transition-colors mb-6"
        >
          <ArrowLeft size={20} /> <span>Back to Events</span>
        </button>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-8 group"
        >
          <img 
            src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600'} 
            alt={event.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight"
            >
              {event.name}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 text-white/90 text-sm font-medium"
            >
              <div className="flex items-center gap-1.5 bg-yellow-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-yellow-500/30 text-yellow-300">
                <Star size={16} fill="#fde047" stroke="#fde047" />
                <span>Premium Event</span>
              </div>
              <span className="opacity-50 text-xl">•</span>
              <span className="text-white font-semibold">By {event.organizer}</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Key Details Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-50 rounded-2xl flex flex-col items-center justify-center text-purple-700 font-bold border border-purple-100">
                    <span className="text-sm uppercase tracking-wider">{month}</span>
                    <span className="text-2xl leading-none">{day}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{eventDate.toLocaleDateString(undefined, { weekday: 'long' })}</h4>
                    <p className="text-slate-500 text-sm font-medium">{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Onwards</p>
                  </div>
                </div>

                <div className="w-px bg-slate-200 hidden md:block"></div>

                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-700 border border-purple-100">
                    <MapIcon size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Location</h4>
                    <p className="text-slate-500 text-sm font-medium">{event.location}</p>
                  </div>
                </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-2xl font-bold text-slate-900 m-0">Event Highlights</h3>
                <Sparkles size={24} className="text-purple-600" />
              </div>
              
              <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {event.description}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 not-prose">
                <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-emerald-600" size={24} />
                    <h5 className="font-bold text-emerald-900">Verified Experience</h5>
                  </div>
                  <p className="text-sm text-emerald-700/80">This event is verified by the BellCrop team for quality and authenticity.</p>
                </div>
                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="text-purple-600" size={24} />
                    <h5 className="font-bold text-purple-900">Seamless Entry</h5>
                  </div>
                  <p className="text-sm text-purple-700/80">Digital pass valid for instant entry upon arrival at the venue.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 lg:sticky lg:top-24 h-fit" 
          >
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="font-bold text-lg text-slate-800">Registration</div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors">
                    <Share2 size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {message.text && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                  >
                    <ShieldCheck size={18} className="flex-shrink-0" />
                    {message.text}
                  </motion.div>
                )}

                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-500">Spot Status</span>
                    <span className={`text-base font-extrabold ${event.isFull ? 'text-red-500' : 'text-purple-700'}`}>
                      {event.isFull ? 'Waitlist Only' : `${event.availableSeats} Available`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${soldOutPercentage}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className={`h-full rounded-full ${event.isFull ? 'bg-red-500' : 'bg-purple-700'}`}
                    ></motion.div>
                  </div>
                </div>

                {event.isRegistered ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center font-bold border border-green-100">
                      ✓ You're already registered!
                    </div>
                    <button 
                      onClick={handleCancelRegistration}
                      disabled={registering}
                      className="w-full py-3.5 px-4 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      {registering ? 'Cancelling...' : 'Cancel Registration'}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleRegister} 
                    disabled={registering || event.isFull}
                    className="w-full py-4 px-6 bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:bg-purple-800 hover:shadow-purple-700/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {registering ? 'Processing...' : (event.isFull ? 'Sold Out' : (user ? 'Reserve My Spot' : 'Login to Register'))}
                  </button>
                )}

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <p className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                    <Users size={14} className="text-slate-400" /> Join {event.capacity - event.availableSeats}+ others attending
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetails;
