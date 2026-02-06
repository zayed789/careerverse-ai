import { motion } from 'framer-motion';
import { BookOpen, Play, Award, ExternalLink, Clock, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const courseCategories = [
  {
    domain: 'Web Development',
    courses: [
      { title: 'Meta Frontend Developer', platform: 'Coursera', type: 'Certification', level: 'Beginner', duration: '7 months', rating: 4.8, free: false },
      { title: 'Full Stack Open', platform: 'University of Helsinki', type: 'Course', level: 'Intermediate', duration: '14 weeks', rating: 4.9, free: true },
      { title: 'JavaScript Mastery', platform: 'YouTube', type: 'Playlist', level: 'Beginner', duration: '10 hours', rating: 4.7, free: true },
    ],
  },
  {
    domain: 'Data Science',
    courses: [
      { title: 'Google Data Analytics', platform: 'Coursera', type: 'Certification', level: 'Beginner', duration: '6 months', rating: 4.8, free: false },
      { title: 'Python for Data Science', platform: 'edX', type: 'Course', level: 'Beginner', duration: '8 weeks', rating: 4.6, free: true },
      { title: 'Statistics Fundamentals', platform: 'YouTube', type: 'Playlist', level: 'Beginner', duration: '5 hours', rating: 4.5, free: true },
    ],
  },
  {
    domain: 'Cloud Computing',
    courses: [
      { title: 'AWS Solutions Architect', platform: 'AWS', type: 'Certification', level: 'Intermediate', duration: '4 months', rating: 4.9, free: false },
      { title: 'Azure Fundamentals', platform: 'Microsoft Learn', type: 'Course', level: 'Beginner', duration: '4 weeks', rating: 4.7, free: true },
      { title: 'GCP Cloud Engineer', platform: 'Coursera', type: 'Certification', level: 'Intermediate', duration: '5 months', rating: 4.6, free: false },
    ],
  },
  {
    domain: 'DevOps',
    courses: [
      { title: 'Docker & Kubernetes', platform: 'Udemy', type: 'Course', level: 'Intermediate', duration: '20 hours', rating: 4.8, free: false },
      { title: 'CI/CD with Jenkins', platform: 'YouTube', type: 'Playlist', level: 'Intermediate', duration: '8 hours', rating: 4.5, free: true },
      { title: 'Terraform Associate', platform: 'HashiCorp', type: 'Certification', level: 'Intermediate', duration: '2 months', rating: 4.7, free: false },
    ],
  },
];

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
            Handpicked courses, certifications, and playlists for every skill level
          </p>
        </motion.div>

        {/* Course categories */}
        <div className="space-y-12">
          {courseCategories.map((category, catIndex) => (
            <motion.div
              key={category.domain}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                {category.domain}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.courses.map((course, index) => (
                  <motion.div
                    key={course.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="feature-card group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {course.type === 'Certification' && <Award className="w-5 h-5 text-amber-400" />}
                        {course.type === 'Course' && <BookOpen className="w-5 h-5 text-primary" />}
                        {course.type === 'Playlist' && <Play className="w-5 h-5 text-red-400" />}
                        <span className="text-xs font-medium text-muted-foreground">{course.platform}</span>
                      </div>
                      {course.free ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400">
                          FREE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/20 text-primary">
                          PAID
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold mb-3 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    {/* Meta */}
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

                    {/* CTA */}
                    <button className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all">
                      Start Learning <ExternalLink className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CoursesPage;
