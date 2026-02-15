import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Calendar, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(sessionStorage.getItem('hb_search') || '');
  const [category, setCategory] = useState(sessionStorage.getItem('hb_category') || '');
  const [date, setDate] = useState(sessionStorage.getItem('hb_date') || '');
  const [location, setLocation] = useState(sessionStorage.getItem('hb_location') || '');
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredEvents = events.filter(event => event.image);
  const displayedEvents = filteredEvents.slice(0, visibleCount);

  const categories = ['Music', 'Tech', 'Workshop', 'Conference', 'Sports', 'Food', 'Other'];

  useEffect(() => {
    sessionStorage.setItem('hb_search', search);
    sessionStorage.setItem('hb_category', category);
    sessionStorage.setItem('hb_date', date);
    sessionStorage.setItem('hb_location', location);
    
    const delayDebounceFn = setTimeout(() => {
      fetchEvents();
    }, 400); // 400ms debounce for better performance

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, location, date]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/events', {
        params: {
          category,
          name: search,
          location,
          date
        }
      });
      setEvents(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    fetchEvents();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative min-h-[500px] rounded-3xl overflow-hidden shadow-2xl mt-8 mb-16 mx-auto group">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" 
               alt="Hero"
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent z-10" />

          {/* Content */}
          <div className="relative z-20 w-full h-full flex flex-col lg:flex-row justify-between items-center p-8 lg:p-16 gap-10">
            {/* Left Side: Text */}
            <div className="text-white max-w-xl text-center lg:text-left pt-12 lg:pt-0">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
                Event Management <br /> Platform
              </h1>
              <p className="text-lg text-gray-200 mb-8 max-w-lg mx-auto lg:mx-0">
                Discover local events, workshops, and gatherings. Join a community of enthusiasts and create memories that last.
              </p>
              <button 
                onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3.5 text-base font-semibold rounded-xl bg-purple-700 text-white hover:bg-purple-600 transition-all shadow-lg hover:shadow-purple-700/30 transform hover:-translate-y-1"
               >
                Get Started
              </button>
            </div>

            {/* Right Side: Search Form */}
            <form onSubmit={handleSearch} className="w-full max-w-md flex flex-col gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex items-center gap-3 bg-white rounded-xl px-4 h-12 shadow-sm focus-within:ring-2 focus-within:ring-purple-600 transition-all">
                <Search size={20} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 flex items-center gap-2 bg-white rounded-xl px-3 h-12 shadow-sm focus-within:ring-2 focus-within:ring-purple-600 transition-all">
                   <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                   <input 
                    type="text" 
                    placeholder="Location" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-sm text-gray-800 placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2 bg-white rounded-xl px-3 h-12 shadow-sm focus-within:ring-2 focus-within:ring-purple-600 transition-all">
                  <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-sm text-gray-800 placeholder-gray-400 font-sans"
                  />
                </div>

                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`appearance-none bg-white rounded-xl px-4 h-12 w-full shadow-sm text-sm outline-none focus:ring-2 focus:ring-purple-600 ${category ? 'text-gray-800' : 'text-gray-400'}`}
                  >
                    <option value="">Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="text-gray-800">{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="mt-2 h-12 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-700/30 transition-all active:scale-95"
              >
                Search Events
              </button>
            </form>
          </div>
        </div>
      </div>

      <div id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 border-l-4 border-purple-700 pl-4">Event Listings</h2>


        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {displayedEvents.map((event) => (
                  <motion.div 
                    layout
                    key={event._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-purple-200 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-30">
                       <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${
                         event.isFull 
                         ? 'bg-red-500/90 text-white' 
                         : event.availableSeats < 50 
                         ? 'bg-orange-500/90 text-white' 
                         : 'bg-emerald-500/90 text-white'
                       }`}>
                         {event.isFull ? 'Sold Out' : event.availableSeats < 50 ? 'Almost Full' : 'Registration Open'}
                       </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000'} 
                        alt={event.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6 flex-grow flex flex-col bg-white">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-purple-100">
                           {event.category}
                         </span>
                         <span className="text-slate-300">•</span>
                         <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            <Calendar size={12} className="text-purple-600" />
                            {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                         </div>
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors">
                        {event.name}
                      </h3>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2.5 text-sm text-slate-500 font-medium">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                             <User size={12} className="text-slate-400" />
                          </div>
                          <span className="truncate">Hosted by <span className="text-slate-900">{event.organizer}</span></span>
                        </div>
                        
                        <div className="flex items-center gap-2.5 text-sm text-slate-500 font-medium">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                             <MapPin size={12} className="text-slate-400" />
                          </div>
                          <span className="truncate" title={event.location}>{event.location}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-5 border-t border-slate-100 flex justify-between items-center">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Pass Status</span>
                            <span className={`text-xs font-bold ${event.isFull ? 'text-red-500' : 'text-slate-900'}`}>
                               {event.isFull ? 'Waitlisted' : `${event.availableSeats} Seats left`}
                            </span>
                         </div>
                         <Link 
                          to={`/event/${event._id}`} 
                          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white group-hover:bg-purple-700 text-xs font-black rounded-xl transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-purple-700/20"
                         >
                            Book Spot
                         </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {visibleCount < filteredEvents.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-purple-700 transition-colors shadow-sm hover:shadow-md"
                >
                  Show More Events
                </button>
              </div>
            )}
          </>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <h3 className="text-xl text-slate-500 font-medium">No experiences found matching your criteria.</h3>
            <p className="text-slate-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
