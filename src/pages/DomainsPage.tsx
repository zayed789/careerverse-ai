import { motion } from 'framer-motion';
import {
  Globe,
  Database,
  Shield,
  Cloud,
  Network,
  Brain,
  Container,
  Smartphone,
  ArrowRight,
  BookOpen,
  Briefcase,
  DollarSign,
  Award,
} from 'lucide-react';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

const domains = [
  {
    id: 'web',
    icon: Globe,
    title: 'Web Development',
    color: 'from-blue-500 to-cyan-500',
    description: 'Build modern, responsive web applications using cutting-edge technologies.',
    roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
    techStack: ['React', 'Node.js', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    salaryRange: '$70K - $150K',
    topCompanies: ['Google', 'Meta', 'Amazon', 'Netflix', 'Airbnb'],
    skills: ['HTML/CSS', 'JavaScript', 'REST APIs', 'Databases', 'Git'],
    certifications: ['Meta Frontend Developer', 'AWS Certified Developer'],
  },
  {
    id: 'data',
    icon: Database,
    title: 'Data Analyst',
    color: 'from-green-500 to-emerald-500',
    description: 'Transform raw data into actionable insights that drive business decisions.',
    roles: ['Data Analyst', 'Business Analyst', 'BI Developer'],
    techStack: ['Python', 'SQL', 'Tableau', 'Power BI', 'Excel'],
    salaryRange: '$60K - $120K',
    topCompanies: ['Google', 'Microsoft', 'McKinsey', 'Deloitte', 'IBM'],
    skills: ['Statistics', 'Data Visualization', 'SQL', 'Python', 'Excel'],
    certifications: ['Google Data Analytics', 'IBM Data Analyst'],
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Cyber Security',
    color: 'from-red-500 to-orange-500',
    description: 'Protect organizations from cyber threats and ensure data security.',
    roles: ['Security Analyst', 'Penetration Tester', 'Security Engineer'],
    techStack: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Python'],
    salaryRange: '$80K - $160K',
    topCompanies: ['CrowdStrike', 'Palo Alto', 'Cisco', 'Microsoft', 'FireEye'],
    skills: ['Network Security', 'Ethical Hacking', 'SIEM', 'Incident Response'],
    certifications: ['CompTIA Security+', 'CISSP', 'CEH'],
  },
  {
    id: 'cloud',
    icon: Cloud,
    title: 'Cloud Engineering',
    color: 'from-purple-500 to-violet-500',
    description: 'Design, build, and manage scalable cloud infrastructure.',
    roles: ['Cloud Engineer', 'Cloud Architect', 'DevOps Engineer'],
    techStack: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
    salaryRange: '$90K - $180K',
    topCompanies: ['AWS', 'Microsoft', 'Google', 'Oracle', 'Salesforce'],
    skills: ['IaC', 'Containerization', 'CI/CD', 'Networking', 'Linux'],
    certifications: ['AWS Solutions Architect', 'Azure Administrator'],
  },
  {
    id: 'network',
    icon: Network,
    title: 'Network Engineering',
    color: 'from-amber-500 to-yellow-500',
    description: 'Design and maintain the backbone of digital communications.',
    roles: ['Network Engineer', 'Network Architect', 'Systems Administrator'],
    techStack: ['Cisco IOS', 'Juniper', 'Python', 'Ansible', 'Wireshark'],
    salaryRange: '$65K - $130K',
    topCompanies: ['Cisco', 'Juniper', 'AT&T', 'Verizon', 'Arista'],
    skills: ['TCP/IP', 'Routing/Switching', 'Firewalls', 'VPNs', 'Automation'],
    certifications: ['CCNA', 'CCNP', 'CompTIA Network+'],
  },
  {
    id: 'aiml',
    icon: Brain,
    title: 'AI/ML Engineering',
    color: 'from-pink-500 to-rose-500',
    description: 'Build intelligent systems that learn and adapt from data.',
    roles: ['ML Engineer', 'Data Scientist', 'AI Researcher'],
    techStack: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Jupyter'],
    salaryRange: '$100K - $200K',
    topCompanies: ['OpenAI', 'DeepMind', 'Google', 'Meta', 'NVIDIA'],
    skills: ['Mathematics', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps'],
    certifications: ['TensorFlow Developer', 'AWS ML Specialty'],
  },
  {
    id: 'devops',
    icon: Container,
    title: 'DevOps Engineering',
    color: 'from-indigo-500 to-blue-500',
    description: 'Bridge development and operations for faster, reliable deployments.',
    roles: ['DevOps Engineer', 'SRE', 'Platform Engineer'],
    techStack: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Prometheus'],
    salaryRange: '$85K - $170K',
    topCompanies: ['Google', 'Amazon', 'Netflix', 'Spotify', 'Uber'],
    skills: ['CI/CD', 'Monitoring', 'Automation', 'Cloud', 'Scripting'],
    certifications: ['CKA', 'AWS DevOps Professional', 'HashiCorp Terraform'],
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile Development',
    color: 'from-teal-500 to-cyan-500',
    description: 'Create seamless mobile experiences for iOS and Android.',
    roles: ['iOS Developer', 'Android Developer', 'React Native Developer'],
    techStack: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Firebase'],
    salaryRange: '$75K - $160K',
    topCompanies: ['Apple', 'Google', 'Meta', 'Uber', 'Airbnb'],
    skills: ['UI/UX', 'Native APIs', 'State Management', 'Testing', 'Publishing'],
    certifications: ['Google Android Developer', 'Meta React Native'],
  },
];

const DomainsPage = () => {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

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
            Explore <span className="gradient-text">Tech Domains</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover the perfect career path that matches your interests and goals
          </p>
        </motion.div>

        {/* Domain cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            const isExpanded = expandedDomain === domain.id;

            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                layout
              >
                <div
                  className={cn(
                    'feature-card cursor-pointer overflow-hidden',
                    isExpanded && 'ring-2 ring-primary/50'
                  )}
                  onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{domain.title}</h3>
                      <p className="text-muted-foreground text-sm">{domain.description}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </div>

                  {/* Expanded content */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-border/50 space-y-6">
                      {/* Roles */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">Roles</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {domain.roles.map((role) => (
                            <span key={role} className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">Tech Stack</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {domain.techStack.map((tech) => (
                            <span key={tech} className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${domain.color} text-white`}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Salary & Companies */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-semibold">Salary Range</span>
                          </div>
                          <span className="text-lg font-bold gradient-text">{domain.salaryRange}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-semibold">Certifications</span>
                          </div>
                          <div className="space-y-1">
                            {domain.certifications.slice(0, 2).map((cert) => (
                              <div key={cert} className="text-xs text-muted-foreground">{cert}</div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Top Companies */}
                      <div>
                        <span className="text-sm font-semibold">Top Companies: </span>
                        <span className="text-sm text-muted-foreground">{domain.topCompanies.join(', ')}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default DomainsPage;
