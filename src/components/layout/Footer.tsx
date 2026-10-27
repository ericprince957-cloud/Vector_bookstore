import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to a newsletter API
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter */}
        <div className="mb-12 p-6 sm:p-8 bg-gray-800 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold text-lg">Stay in the loop</h3>
              <p className="text-sm text-gray-400 mt-1">
                Get new releases, discounts and free resources straight to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap"
              >
                {subscribed ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span className="text-lg font-bold text-white">BookVault</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Practical digital books for learning, building and growing. 
              Quality ebooks designed for Nigerian students, professionals and entrepreneurs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/books" className="text-sm hover:text-emerald-400 transition-colors">Browse Books</Link></li>
              <li><Link to="/categories" className="text-sm hover:text-emerald-400 transition-colors">Categories</Link></li>
              <li><Link to="/about" className="text-sm hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-emerald-400 transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-emerald-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/books?category=technology" className="text-sm hover:text-emerald-400 transition-colors">Technology</Link></li>
              <li><Link to="/books?category=personal-finance" className="text-sm hover:text-emerald-400 transition-colors">Personal Finance</Link></li>
              <li><Link to="/books?category=business" className="text-sm hover:text-emerald-400 transition-colors">Business</Link></li>
              <li><Link to="/books?category=digital-skills" className="text-sm hover:text-emerald-400 transition-colors">Digital Skills</Link></li>
              <li><Link to="/books?category=productivity" className="text-sm hover:text-emerald-400 transition-colors">Productivity</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@bookvault.ng</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} BookVault. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-300">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-300">Terms of Service</Link>
            <Link to="/refund-policy" className="text-sm text-gray-500 hover:text-gray-300">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
