import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ResumeData } from './types';

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview = ({ data }: ResumePreviewProps) => {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Your Name';
  const contactLine = [data.email, data.phone].filter(Boolean).join(' • ');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 bg-secondary/5"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Live Preview
        </h3>
        <span className="text-xs text-muted-foreground">A4 Format</span>
      </div>

      {/* A4 container: 210mm × 297mm ratio ≈ 1:1.414 */}
      <div className="flex justify-center">
        <ScrollArea className="h-[680px] w-full max-w-[480px]">
          <div
            className="bg-white text-gray-900 shadow-2xl mx-auto"
            style={{
              width: '480px',
              minHeight: '679px', /* 480 × 1.414 */
              padding: '40px',
              fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
          >
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
              <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
                {fullName}
              </h2>
              {data.jobTitle && (
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">
                  {data.jobTitle}
                </p>
              )}
              {contactLine && (
                <p className="text-gray-600 text-xs mt-2">{contactLine}</p>
              )}
            </div>

            {/* Skills */}
            {data.skills.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em] mb-2 border-b border-gray-200 pb-1">
                  Skills
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {data.skills.join(' • ')}
                </p>
              </div>
            )}

            {/* Experience */}
            {(data.jobTitle || data.company || data.experienceDescription) && (
              <div className="mb-5">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em] mb-2 border-b border-gray-200 pb-1">
                  Experience
                </h3>
                <div>
                  {data.jobTitle && (
                    <p className="font-semibold text-sm text-gray-900">
                      {data.jobTitle}
                    </p>
                  )}
                  {data.company && (
                    <p className="text-xs text-gray-500">{data.company}</p>
                  )}
                  {data.experienceDescription && (
                    <p className="text-xs text-gray-700 mt-1.5 leading-relaxed whitespace-pre-wrap">
                      {data.experienceDescription}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {(data.degree || data.institution) && (
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em] mb-2 border-b border-gray-200 pb-1">
                  Education
                </h3>
                {data.degree && (
                  <p className="font-semibold text-sm text-gray-900">
                    {data.degree}
                  </p>
                )}
                {data.institution && (
                  <p className="text-xs text-gray-500">{data.institution}</p>
                )}
              </div>
            )}

            {/* Empty state */}
            {!data.firstName && !data.lastName && !data.jobTitle && data.skills.length === 0 && (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm italic">
                Start typing to see your resume come to life...
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
};

export default ResumePreview;
