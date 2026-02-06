import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Rocket, Trophy } from 'lucide-react';

const yearPlans = [
  {
    year: '1st Year',
    icon: GraduationCap,
    title: 'Foundation Building',
    color: 'from-blue-500 to-cyan-500',
    suggestions: [
      'Master programming fundamentals (Python/Java)',
      'Learn data structures basics',
      'Build simple projects',
      'Join coding communities',
      'Start competitive programming',
    ],
  },
  {
    year: '2nd Year',
    icon: Briefcase,
    title: 'Skill Development',
    color: 'from-purple-500 to-pink-500',
    suggestions: [
      'Choose specialization domain',
      'Learn frameworks & tools',
      'Contribute to open source',
      'Apply for internships',
      'Build portfolio projects',
    ],
  },
  {
    year: '3rd Year',
    icon: Rocket,
    title: 'Industry Exposure',
    color: 'from-orange-500 to-amber-500',
    suggestions: [
      'Complete industry internship',
      'Master system design',
      'Learn cloud technologies',
      'Network with professionals',
      'Prepare for placements',
    ],
  },
  {
    year: '4th Year',
    icon: Trophy,
    title: 'Career Launch',
    color: 'from-green-500 to-emerald-500',
    suggestions: [
      'Ace technical interviews',
      'Negotiate offers strategically',
      'Complete final projects',
      'Get certifications',
      'Plan career trajectory',
    ],
  },
];

const YearPlannerSection = () => {
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
            Your <span className="gradient-text">Year-by-Year</span> Career Plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Strategic guidance for each year of your engineering journey
          </p>
        </motion.div>

        {/* Year cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {yearPlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="feature-card group"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Header */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {plan.year}
                  </span>
                  <h3 className="text-lg font-bold mt-1">{plan.title}</h3>
                </div>

                {/* Suggestions */}
                <ul className="space-y-2">
                  {plan.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${plan.color} mt-1.5 shrink-0`} />
                      {suggestion}
                    </li>
                  ))}
                </ul>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default YearPlannerSection;
