import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Calendar, MapPin, Users, Tag, Image as ImageIcon, FileText, Send, Building, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateEvent = () => {
  const { user } = useContext(AuthContext); // Get user context
  const [formData, setFormData] = useState({
    name: '',
    organizer: user?.name || '', // Pre-fill with user name
    location: '',
    date: '',
    description: '',
    capacity: '',
    category: 'Other',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, organizer, location, date, description, capacity, category, image } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/events', formData);
      if (res.data.success) {
        navigate(`/event/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.button 
        whileHover={{ x: -4 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </motion.button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-purple-200/50 border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 px-10 py-12 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mb-32" />
           
           <h1 className="text-4xl font-black text-white relative z-10">Host an Event</h1>
           <p className="text-slate-400 mt-2 font-medium relative z-10">Share your experience with the BellCrop community.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl text-red-700 text-sm font-bold flex items-center gap-3">
              <span className="shrink-0 h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">!</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Tag size={18} />
                </div>
                <input
                  name="name"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold"
                  placeholder="e.g. Summer Jazz Festival"
                  value={name}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Organizer *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Building size={18} />
                </div>
                <input
                  name="organizer"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold"
                  placeholder="Company or Individual"
                  value={organizer}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Location *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <MapPin size={18} />
                </div>
                <input
                  name="location"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold"
                  placeholder="City, State or Virtual"
                  value={location}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Date & Time *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Calendar size={18} />
                </div>
                <input
                  name="date"
                  type="datetime-local"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold"
                  value={date}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Capacity *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Users size={18} />
                </div>
                <input
                  name="capacity"
                  type="number"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold"
                  placeholder="Maximum attendees"
                  value={capacity}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Category *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Tag size={18} />
                </div>
                <select
                  name="category"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold appearance-none cursor-pointer"
                  value={category}
                  onChange={onChange}
                >
                  <option value="Music">Music</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Conference">Conference</option>
                  <option value="Tech">Tech</option>
                  <option value="Sports">Sports</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Image URL (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <ImageIcon size={18} />
              </div>
              <input
                name="image"
                className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold"
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Description *</label>
            <div className="relative">
              <div className="absolute top-3 left-4 pointer-events-none text-slate-400">
                <FileText size={18} />
              </div>
              <textarea
                name="description"
                required
                rows="4"
                className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold"
                placeholder="What is this event about?"
                value={description}
                onChange={onChange}
              ></textarea>
            </div>
          </div>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-600/20 hover:bg-purple-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  <span>Publish Event</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
