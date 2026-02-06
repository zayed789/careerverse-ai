import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Moon, Sun, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [isDark, setIsDark] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
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

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-glow-gradient flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card">
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="glow-button text-white border-0">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
