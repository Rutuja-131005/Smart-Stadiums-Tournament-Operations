import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons, navItems } from './Icons';

export default function Sidebar({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) {
  const { user, logout, hasRole, switchRole } = useAuth();
  const location = useLocation();

  const filteredNav = navItems.filter((item) => !item.roles || hasRole(...item.roles));

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col
        text-white border-r border-white/10
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${collapsed ? 'w-[72px]' : 'w-64'}`}
      style={{ backgroundColor: '#1F2937' }}
      aria-label="Main navigation"
      role="navigation"
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 border-b border-white/10 ${collapsed ? 'px-4 py-5 justify-center' : 'px-5 py-5'}`}>
        <Link to="/dashboard" className="flex items-center gap-3 group" onClick={() => setSidebarOpen(false)}>
          <img src="/logo.jpg" alt="Smart Stadium Logo" className="w-9 h-9 rounded-xl object-cover flex-shrink-0 group-hover:shadow-glow transition-shadow" />
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="font-bold text-sm leading-tight text-white truncate block">Smart Stadiums</span>
              <p className="text-[10px] text-fifa-gold font-semibold tracking-wider uppercase">FIFA World Cup 2026</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive ? 'bg-fifa-gold text-fifa-navy font-semibold' : 'text-white/90 hover:bg-white/10 hover:text-white'}
                ${collapsed ? 'justify-center' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-fifa-navy' : 'text-white/80'}`}>
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-fifa-navy" />}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button (Desktop only) */}
      <div className="hidden lg:block px-3 py-2 border-t border-white/10">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full justify-center flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? Icons.expand : Icons.collapse}
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className={`border-t border-white/10 ${collapsed ? 'p-3 flex justify-center' : 'p-4'}`}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold text-sm" title={user.name}>
              {user.name?.charAt(0)}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">Role:</span>
                  <select
                    value={user.role}
                    onChange={(e) => switchRole(e.target.value)}
                    className="bg-white/10 text-xs font-semibold text-fifa-gold rounded border border-white/20 px-1 py-0.5 outline-none cursor-pointer focus:border-fifa-gold"
                  >
                    <option value="admin" className="text-gray-900 font-semibold">Admin</option>
                    <option value="staff" className="text-gray-900 font-semibold">Organizer</option>
                    <option value="security" className="text-gray-900 font-semibold">Security</option>
                    <option value="volunteer" className="text-gray-900 font-semibold">Volunteer</option>
                    <option value="fan" className="text-gray-900 font-semibold">Fan</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
