import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Clock, Star, ExternalLink, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Course {
  title: string;
  platform: string;
  level: string;
  duration: string;
  rating: string;
  pricing: string;
  url: string;
}

const WEBHOOK_URL = 'https://figo6788.app.n8n.cloud/webhook-test/courses';

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-green-500/20 text-green-400';
    case 'Intermediate':
      return 'bg-amber-500/20 text-amber-400';
    case 'Advanced':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

const CoursesPage = () => {
  const [domainInput, setDomainInput] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindCourses = async () => {
    const domain = domainInput.trim();
    if (!domain) return;

    setSelectedDomain(domain);
    setCourses([]);
    setHasSearched(true);
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) throw new Error('Webhook request failed');

      const data = await response.json();
      const root = Array.isArray(data) ? data[0] : data;
      const parsed: Course[] = Array.isArray(root?.courses) ? root.courses : [];
      setCourses(parsed);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="section-container py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Curated <span className="gradient-text">Learning Resources</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Enter a domain to discover handpicked courses, certifications, and playlists
          </p>
        </motion.div>

        {/* Domain Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 sm:p-8 mb-12 max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && domainInput.trim() && !isLoading) handleFindCourses();
                }}
                placeholder="Enter a domain (e.g. Frontend, Backend, Pentesting, Data Science…)"
                className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary/30 text-base"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleFindCourses}
              disabled={!domainInput.trim() || isLoading}
              className="glow-button h-12 px-8 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:transform-none"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <BookOpen className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Searching…' : 'Find Courses'}
            </Button>
          </div>
        </motion.div>

        {/* Dynamic Courses Container */}
        {!hasSearched ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center py-20"
          >
            <div className="glass-card inline-flex p-6 rounded-full mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">
              Enter a domain to discover relevant courses.
            </p>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-20"
          >
            <div className="glass-card inline-flex p-6 rounded-full mb-6">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground text-lg">
              Finding courses for <span className="text-primary font-semibold">"{selectedDomain}"</span>…
            </p>
          </motion.div>
        ) : courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="glass-card inline-flex p-6 rounded-full mb-6">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">
              No courses found for <span className="text-primary font-semibold">"{selectedDomain}"</span>.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              Courses for "{selectedDomain}"
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => {
                const isFree = course.pricing?.toLowerCase() === 'free';

                return (
                  <motion.div
                    key={`${course.title}-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                    className="feature-card group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">{course.platform}</span>
                      </div>
                      {isFree ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400">
                          FREE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/20 text-primary">
                          PAID
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold mb-3 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        {course.rating}
                      </span>
                    </div>

                    {course.url ? (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all cursor-pointer"
                      >
                        Start Learning <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        Start Learning <ExternalLink className="w-4 h-4" />
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default CoursesPage;
