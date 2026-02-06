import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Mail, MessageSquare, ChevronDown, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do I get started with CareerVerse AI?',
    answer: 'Simply create an account, complete your profile with your skills and goals, and our AI will generate personalized roadmaps and recommendations for you.',
  },
  {
    question: 'Is the platform free to use?',
    answer: 'We offer a free tier with access to basic features like domain exploration and roadmaps. Premium features like AI-powered resume building and skill gap analysis require a subscription.',
  },
  {
    question: 'How accurate are the AI-generated roadmaps?',
    answer: 'Our roadmaps are curated by industry experts and continuously updated based on market trends. The AI personalizes them based on your unique profile and goals.',
  },
  {
    question: 'Can I download my resume as a PDF?',
    answer: 'Yes! Our resume builder generates ATS-optimized resumes that you can download as PDF files, ready to submit to any job application.',
  },
  {
    question: 'How does the Skill Gap Analyzer work?',
    answer: 'Simply paste a job description and your current skills. Our AI compares them to identify missing skills and provides actionable recommendations to bridge the gap.',
  },
  {
    question: 'Are the trend insights based on real data?',
    answer: 'Yes, our trend analyzer uses data from job boards, company hiring patterns, and industry reports to provide accurate insights into the job market.',
  },
];

const HelpPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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
            How Can We <span className="gradient-text">Help?</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Find answers to common questions or reach out to our team
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="glass-card px-4 border-0"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="text-left font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Contact Us
            </h2>

            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input placeholder="Your name" className="bg-secondary/50" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="your@email.com" className="bg-secondary/50" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input placeholder="How can we help?" className="bg-secondary/50" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  placeholder="Describe your question or issue..."
                  className="bg-secondary/50 min-h-[120px]"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full glow-button text-white border-0 h-12"
                disabled={submitted}
              >
                {submitted ? (
                  'Message Sent! ✓'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>

            {/* Quick Links */}
            <div className="mt-6 glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Quick Support
              </h3>
              <div className="space-y-3">
                <a href="mailto:support@careerverse.ai" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  support@careerverse.ai
                </a>
                <p className="text-sm text-muted-foreground">
                  Response time: Within 24 hours
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpPage;
