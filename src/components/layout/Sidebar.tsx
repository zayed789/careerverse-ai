import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Map,
  Sparkles,
  BookOpen,
  FileText,
  BarChart3,
  TrendingUp,
  Calendar,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Compass,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/domains', icon: Compass, label: 'Explore Domains' },
  { path: '/roadmaps', icon: Map, label: 'Roadmaps' },
  { path: '/roadmap-generator', icon: Sparkles, label: 'AI Roadmap Generator' },
  { path: '/courses', icon: BookOpen, label: 'Courses' },
  { path: '/resume-builder', icon: FileText, label: 'Resume Builder' },
  { path: '/skill-gap', icon: BarChart3, label: 'Skill Gap Analyzer' },
  { path: '/trends', icon: TrendingUp, label: 'Trend Analyzer' },
  
  { path: '/planner', icon: Calendar, label: 'Planner' },
  { path: '/help', icon: HelpCircle, label: 'Help' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r border-border/50 bg-sidebar/80 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border/50">
        <motion.div
          className="flex items-center gap-3"
          animate={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-glow-gradient flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-lg bg-glow-gradient blur-lg opacity-50" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg gradient-text whitespace-nowrap overflow-hidden"
              >
                CareerVerse AI
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'nav-link group',
                    isActive && 'active'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Active indicator glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 rounded-lg bg-primary/10 -z-10"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-border/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
