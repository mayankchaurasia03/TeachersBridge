import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Wallet, LogOut, LayoutDashboard, ChevronDown, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = user?.role === 'student'
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Profile', path: '/profile', icon: UserCircle },
      ]
    : [
        { label: 'Browse', path: '/teach', icon: LayoutDashboard },
        { label: 'Wallet', path: '/wallet', icon: Wallet },
        { label: 'Profile', path: '/profile', icon: UserCircle },
      ];

  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" data-testid="header-logo">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-['Outfit'] text-xl font-bold text-slate-900">TeacherBridge</span>
        </Link>

        {user && (
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}

            <div className="ml-3 pl-3 border-l border-slate-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button data-testid="user-menu-btn" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="hidden sm:block max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <span className={`inline-block mt-1 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      user.role === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`} data-testid="user-role-badge">{user.role}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="logout-btn" onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {!user && (
          <div className="flex items-center gap-3">
            <Link to="/login" data-testid="header-login-btn" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors px-4 py-2">Sign In</Link>
            <Link to="/signup" data-testid="header-signup-btn" className="bg-blue-600 text-white hover:bg-blue-700 font-semibold text-sm rounded-lg px-5 py-2.5 shadow-sm transition-all active:scale-[0.98]">Get Started</Link>
          </div>
        )}
      </div>
    </header>
  );
}
