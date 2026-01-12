
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  Settings, 
  LogOut,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';

const Sidebar = () => {
    const dispatch = useDispatch();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Patients', path: '/patients' },
    { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: Activity, label: 'Departments', path: '/departments' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border backdrop-blur-xl bg-opacity-80">
      <div className="p-6 flex items-center space-x-3">
        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Docvista
        </span>
      </div>

      <div className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:shadow-md",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 space-x-3"
            onClick={() => dispatch(logout())}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
