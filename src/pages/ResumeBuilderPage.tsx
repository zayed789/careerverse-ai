import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import AtsSection from '@/components/resume/AtsSection';
import { initialResumeData, type ResumeData } from '@/components/resume/types';
import { toast } from '@/hooks/use-toast';

const ResumeBuilderPage = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const hasName =
    (resumeData.firstName?.trim() ?? '') !== '' || (resumeData.lastName?.trim() ?? '') !== '';
  const hasSkills = (resumeData.skillCategories ?? []).some((c) => c.skills.length > 0);
  const hasExperience = (resumeData.experiences ?? []).length > 0;
  const isFormValid = hasName && (hasSkills || hasExperience);

  const handleDownloadPdf = useCallback(async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      // A4 dimensions in mm
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const w = imgWidth * ratio;
      const h = imgHeight * ratio;
      const x = (pdfWidth - w) / 2;
      pdf.addImage(imgData, 'PNG', x, 0, w, h);
      const fileName = [resumeData.firstName, resumeData.lastName].filter(Boolean).join('_') || 'resume';
      pdf.save(`${fileName}_resume.pdf`);
      toast({ title: 'PDF Downloaded', description: 'Your resume has been saved.' });
    } catch {
      toast({ title: 'Download failed', description: 'Could not generate PDF.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  }, [resumeData.firstName, resumeData.lastName]);

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
              disabled={!isFormValid || isGenerating}
              onClick={handleDownloadPdf}
              className={`w-full glow-button text-white border-0 h-12 transition-all ${
                !isFormValid ? 'opacity-50 cursor-not-allowed !shadow-none' : ''
              }`}
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Download className="w-5 h-5 mr-2" />
              )}
              {isGenerating ? 'Generating PDF…' : 'Generate & Download PDF'}
            </Button>

            <AtsSection />
          </div>

          {/* Right column: Live A4 Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ResumePreview ref={previewRef} data={resumeData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilderPage;
