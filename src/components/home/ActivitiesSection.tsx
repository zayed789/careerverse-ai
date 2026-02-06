import { motion } from 'framer-motion';
import { Brain, Puzzle, Laugh, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const activities = [
  {
    icon: Brain,
    title: 'Domain Quiz',
    description: '100 questions to discover your perfect tech domain based on interests and skills.',
    count: '100 Questions',
    color: 'from-blue-500 to-indigo-500',
    link: '/quiz',
    cta: 'Start Quiz',
  },
  {
    icon: Puzzle,
    title: 'Domain Puzzles',
    description: 'Challenge yourself with 100 logical puzzles designed to sharpen your problem-solving.',
    count: '100 Puzzles',
    color: 'from-purple-500 to-pink-500',
    link: '/puzzles',
    cta: 'Solve Puzzles',
  },
  {
    icon: Laugh,
    title: 'Tech Jokes',
    description: 'Take a break with our curated collection of developer humor and tech jokes.',
    count: '100 Jokes',
    color: 'from-amber-500 to-orange-500',
    link: '/jokes',
    cta: 'Have Fun',
  },
];

const ActivitiesSection = () => {
  return (
    <section className="py-20 relative">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Learn, Practice, <span className="gradient-text">Have Fun</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive activities to enhance your learning journey
          </p>
        </motion.div>

        {/* Activity cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Link to={activity.link} className="block">
                  <div className="feature-card h-full group">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                    {/* Icon and count */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                        {activity.count}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3">{activity.title}</h3>
                    <p className="text-muted-foreground mb-6">{activity.description}</p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                      {activity.cta}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
