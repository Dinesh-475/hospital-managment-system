
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 w-full">
      <div className="flex items-center space-x-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
        </Button>
        <div className="relative w-64 md:w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search patients, doctors..." 
                className="pl-9 bg-background/50 border-input/50 focus:bg-background transition-all rounded-full"
            />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
        </Button>

        <div className="flex items-center space-x-3 pl-4 border-l border-border">
            <div className="text-right hidden md:block">
                <p className="text-sm font-medium leading-none">{user?.name || 'Dr. Alex Cameron'}</p>
                <p className="text-xs text-muted-foreground mt-1">{user?.role || 'Chief Surgeon'}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-[2px]">
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                     {/* Placeholder Avatar */}
                    {user?.profilePictureUrl ? (
                        <img src={user.profilePictureUrl} alt="User" className="h-full w-full object-cover" />
                    ) : (
                        <span className="font-bold text-primary">AC</span>
                    )}
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
