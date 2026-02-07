import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import AtsSection from '@/components/resume/AtsSection';
import { initialResumeData, type ResumeData } from '@/components/resume/types';

const ResumeBuilderPage = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  const isFormValid =
    (resumeData.firstName.trim() !== '' || resumeData.lastName.trim() !== '') &&
    resumeData.skills.length > 0 &&
    resumeData.jobTitle.trim() !== '';

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
            Build Your <span className="gradient-text">ATS-Optimized Resume</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Create a professional resume that passes applicant tracking systems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Form + ATS */}
          <div className="space-y-8">
            <ResumeForm data={resumeData} onChange={setResumeData} />

            <Button
              disabled={!isFormValid}
              className={`w-full glow-button text-white border-0 h-12 transition-all ${
                !isFormValid ? 'opacity-50 cursor-not-allowed !shadow-none' : ''
              }`}
            >
              <Download className="w-5 h-5 mr-2" />
              Generate & Download PDF
            </Button>

            <AtsSection />
          </div>

          {/* Right column: Live A4 Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilderPage;
