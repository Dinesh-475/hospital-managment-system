import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, Search, Menu, X, ChevronDown,
  Home, Calendar, FileText, MessageSquare, Users, Settings
} from 'lucide-react';
import { User } from '@/types'; // Ensure correct type import based on project

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const navLinks: NavLink[] = [
  { label: 'Dashboard', href: '/', icon: <Home size={18} />, roles: ['ALL'] },
  { label: 'Appointments', href: '/appointments', icon: <Calendar size={18} />, roles: ['PATIENT', 'DOCTOR'] },
  { label: 'Book Now', href: '/appointments/book', icon: <Calendar size={18} />, roles: ['PATIENT'] },
  { label: 'Records', href: '/records', icon: <FileText size={18} />, roles: ['PATIENT', 'DOCTOR'] },
  { label: 'Messages', href: '/messages', icon: <MessageSquare size={18} />, roles: ['ALL'] },
  { label: 'Team', href: '/team', icon: <Users size={18} />, roles: ['MANAGER', 'ADMIN'] },
  { label: 'Settings', href: '/settings', icon: <Settings size={18} />, roles: ['ALL'] },
];

interface UniversalNavBarProps {
    user: User | null; // Allow null to handle initial state safely
}

export default function UniversalNavBar({ user }: UniversalNavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  if (!user) return null; // Or return a public nav bar
  
  const userNavLinks = navLinks.filter(link => 
    link.roles.includes('ALL') || (user.role && link.roles.includes(user.role))
  );

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-sm shadow-blue-900/5 ring-1 ring-black/5"
      >
        <div className="mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-extrabold text-lg font-sans">D</span>
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight hidden sm:block">
                Docvista
              </span>
            </Link>

            {/* Center Links - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {userNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`
                    relative px-4 py-2 rounded-lg font-bold text-sm
                    transition-all duration-200 flex items-center space-x-2
                    ${location.pathname === link.href
                      ? 'text-blue-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {location.pathname === link.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 rounded-lg"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center space-x-2">
                    {link.icon}
                    <span>{link.label}</span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg hover:bg-gray-100/80 transition-colors text-gray-500 hover:text-gray-900"
                aria-label="Search"
              >
                <Search size={20} />
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-lg hover:bg-gray-100/80 transition-colors text-gray-500 hover:text-gray-900"
                 aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </motion.button>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100/80 transition-colors border border-transparent hover:border-gray-200"
                   aria-label="Profile"
                >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                        {user.firstName ? user.firstName[0] : 'U'}
                    </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden ring-1 ring-black/5"
                    >
                      {/* Profile Dropdown Content */}
                      <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                        <p className="font-bold text-gray-900 text-lg">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                        <span className="inline-block mt-3 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-md uppercase tracking-wider">
                          {user.role}
                        </span>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors">
                            <Users size={16} className="text-gray-400" /> View Profile
                        </Link>
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors">
                            <Settings size={16} className="text-gray-400" /> Settings
                        </Link>
                        <div className="h-px bg-gray-100 my-1 mx-2" />
                        <button className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-sm font-bold transition-colors">
                           <div className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-8">
                     <span className="font-extrabold text-2xl text-gray-900">Menu</span>
                     <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                        <X size={20} />
                     </button>
                </div>
                {userNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-4 px-4 py-3.5 rounded-xl font-bold text-lg
                      transition-all duration-200
                      ${location.pathname === link.href
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Spacer to prevent content from being hidden behind sticky nav */}
      <div className="h-20" />
    </>
  );
}
