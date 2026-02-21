import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navigationItems = [
  { label: "Home", path: "/", keywords: ["landing", "main"] },
  { label: "Dashboard", path: "/dashboard", keywords: ["stats", "overview", "analytics"] },
  { label: "Explore Domains", path: "/domains", keywords: ["fields", "explore", "tech"] },
  { label: "DSA Arena", path: "/dsa-arena", keywords: ["coding", "problems", "algorithms", "data structures"] },
  { label: "Aptitude Challenge", path: "/aptitude", keywords: ["reasoning", "quant", "verbal", "logic"] },
  { label: "Roadmaps", path: "/roadmaps", keywords: ["path", "learning", "guide"] },
  { label: "AI Roadmap Generator", path: "/roadmap-generator", keywords: ["generate", "ai", "custom"] },
  { label: "Courses", path: "/courses", keywords: ["learn", "tutorials", "study"] },
  { label: "Resume Builder", path: "/resume-builder", keywords: ["cv", "resume", "career"] },
  { label: "Skill Gap Analyzer", path: "/skill-gap", keywords: ["skills", "gap", "analysis"] },
  { label: "Mock Interview", path: "/mock-interview", keywords: ["interview", "practice", "prep"] },
  { label: "Planner", path: "/planner", keywords: ["calendar", "schedule", "plan"] },
  { label: "Help", path: "/help", keywords: ["support", "faq", "contact"] },
];

const NavSearch = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? navigationItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q))
        );
      })
    : [];

  const handleSelect = useCallback(
    (path: string) => {
      navigate(path);
      setQuery('');
      setOpen(false);
      inputRef.current?.blur();
    },
    [navigate],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || filtered.length === 0) {
      if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
        break;
      case 'Enter':
        e.preventDefault();
        handleSelect(filtered[activeIndex].path);
        break;
      case 'Escape':
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reset active index when results change
  useEffect(() => { setActiveIndex(0); }, [query]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { if (query.trim()) setOpen(true); }}
        onKeyDown={handleKeyDown}
        placeholder="Search domains, courses, roadmaps..."
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
      />

      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-lg border border-border bg-popover shadow-lg overflow-hidden"
          >
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">No results found</p>
            ) : (
              <ul className="max-h-[264px] overflow-y-auto py-1">
                {filtered.slice(0, 10).map((item, i) => (
                  <li key={item.path}>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleSelect(item.path); }}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer",
                        i === activeIndex
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent/50"
                      )}
                    >
                      <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{item.label}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{item.path}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavSearch;
