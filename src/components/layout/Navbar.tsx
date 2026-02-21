import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Moon, Sun, User, Menu, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { isDark, toggleTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const initials = profile?.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <motion.div
          className="hidden sm:flex items-center flex-1 max-w-md"
          animate={{ scale: searchFocused ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search domains, courses, roadmaps..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.div>
          </motion.button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {user ? (
            /* Logged-in: Avatar dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-glow-gradient flex items-center justify-center text-sm font-bold text-white">
                    {initials || <User className="w-4 h-4" />}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card">
                <div className="px-3 py-2 border-b border-border/50">
                  <p className="text-sm font-medium">{profile?.name || user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Logged-out: Sign In / Get Started */
            <div className="flex items-center gap-2 ml-2">
              <Link to="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button size="sm" className="glow-button text-white border-0 hidden md:inline-flex">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
