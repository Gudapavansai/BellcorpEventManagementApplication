import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="BellCrop Studio" className="h-28 w-auto object-contain" />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Connecting people through extraordinary experiences. Discover, Share, and Enjoy the best events around you.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/" className="hover:text-purple-700 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-purple-700 transition-colors">About Us</Link></li>
              <li><Link to="/events" className="hover:text-purple-700 transition-colors">All Events</Link></li>
              <li><Link to="/contact" className="hover:text-purple-700 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Categories</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/category/music" className="hover:text-purple-700 transition-colors">Music & Concerts</Link></li>
              <li><Link to="/category/tech" className="hover:text-purple-700 transition-colors">Tech & Startups</Link></li>
              <li><Link to="/category/workshops" className="hover:text-purple-700 transition-colors">Workshops</Link></li>
              <li><Link to="/category/arts" className="hover:text-purple-700 transition-colors">Arts & Culture</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Stay Updated</h4>
            <p className="text-slate-500 text-sm mb-4">Subscribe to our newsletter for the latest events.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button className="bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-lg hover:shadow-purple-700/30">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium text-center md:text-left">
            © {new Date().getFullYear()} BellCrop Event Management. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-bold text-slate-400">
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
