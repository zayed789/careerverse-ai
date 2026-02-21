import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Linkedin, Github } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ResumeData } from './types';

interface ResumePreviewProps {
  data: ResumeData;
}

/* helper: true when at least one field in an object has content */
const hasContent = (...vals: string[]) => vals.some((v) => v.trim().length > 0);

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data }, ref) => {
  const fullName =
    [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Your Name';
  const contactParts = [data.email, data.phone].filter(Boolean);

  const allSkillsFlat = data.skillCategories.flatMap((c) => c.skills);
  const hasAnyContent =
    hasContent(data.firstName, data.lastName, data.summary) ||
    allSkillsFlat.length > 0 ||
    data.projects.length > 0 ||
    data.experiences.length > 0 ||
    data.educations.length > 0 ||
    data.certifications.length > 0 ||
    data.coursework.length > 0;

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

      {/* A4 container: 210mm × 297mm ratio ≈ 1 : 1.414 */}
      <div className="flex justify-center">
        <ScrollArea className="h-[680px] w-full max-w-[480px]">
          <div
            ref={ref}
            className="bg-white text-gray-900 shadow-2xl mx-auto"
            style={{
              width: '480px',
              minHeight: '679px',
              padding: '36px 40px',
              fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
          >
            {/* ── Header ── */}
            <div className="text-center mb-4 pb-3 border-b-2 border-gray-300">
              <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
                {fullName}
              </h2>
              {contactParts.length > 0 && (
                <p className="text-gray-600 text-xs mt-1.5">
                  {contactParts.join(' • ')}
                </p>
              )}
              {(data.linkedin || data.github) && (
                <div className="flex items-center justify-center gap-4 mt-1.5 text-xs text-gray-500">
                  {data.linkedin && (
                    <span className="flex items-center gap-1">
                      <Linkedin className="w-3 h-3" />
                      <a href={data.linkedin} target="_blank" rel="noopener noreferrer"
                        className="underline hover:text-gray-800">{data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</a>
                    </span>
                  )}
                  {data.github && (
                    <span className="flex items-center gap-1">
                      <Github className="w-3 h-3" />
                      <a href={data.github} target="_blank" rel="noopener noreferrer"
                        className="underline hover:text-gray-800">{data.github.replace(/https?:\/\/(www\.)?/, '')}</a>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ── Professional Summary ── */}
            {data.summary.trim() && (
              <div className="mb-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em] mb-1.5 border-b border-gray-200 pb-1">
                  Professional Summary
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {data.summary}
                </p>
              </div>
            )}

            {/* ── Technical Skills ── */}
            {data.skillCategories.some((c) => c.skills.length > 0) && (
              <div className="mb-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em] mb-1.5 border-b border-gray-200 pb-1">
                  Technical Skills
                </h3>
                {data.skillCategories
                  .filter((c) => c.skills.length > 0)
                  .map((cat, i) => (
                    <p key={i} className="text-xs text-gray-700 leading-relaxed">
                      <span className="font-semibold">{cat.category || 'Other'}:</span>{' '}
                      {cat.skills.join(', ')}
                    </p>
                  ))}
              </div>
            )}

            {/* ── Projects ── */}
            {data.projects.length > 0 &&
              data.projects.some((p) => hasContent(p.title, p.description)) && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em] mb-1.5 border-b border-gray-200 pb-1">
                    Projects
                  </h3>
                  {data.projects.map(
                    (proj, i) =>
                      hasContent(proj.title, proj.description) && (
                        <div key={i} className={i > 0 ? 'mt-2' : ''}>
                          {proj.title && <p className="font-semibold text-sm text-gray-900">{proj.title}</p>}
                          {proj.description && <p className="text-xs text-gray-700 mt-0.5 leading-relaxed whitespace-pre-wrap">{proj.description}</p>}
                          {proj.contributions && <p className="text-xs text-gray-700 mt-0.5 leading-relaxed whitespace-pre-wrap">{proj.contributions}</p>}
                          {proj.tools.length > 0 && <p className="text-xs text-gray-500 mt-0.5 italic">Tech: {proj.tools.join(', ')}</p>}
                        </div>
                      ),
                  )}
                </div>
              )}

            {/* ── Experience ── */}
            {data.experiences.length > 0 &&
              data.experiences.some((e) => hasContent(e.jobTitle, e.organization)) && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em] mb-1.5 border-b border-gray-200 pb-1">
                    Experience
                  </h3>
                  {data.experiences.map(
                    (exp, i) =>
                      hasContent(exp.jobTitle, exp.organization) && (
                        <div key={i} className={i > 0 ? 'mt-2' : ''}>
                          <div className="flex justify-between items-baseline">
                            <p className="font-semibold text-sm text-gray-900">{exp.jobTitle}</p>
                            {exp.dateRange && <span className="text-xs text-gray-500 shrink-0 ml-2">{exp.dateRange}</span>}
                          </div>
                          {exp.organization && <p className="text-xs text-gray-500">{exp.organization}</p>}
                          {exp.description && <p className="text-xs text-gray-700 mt-0.5 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                        </div>
                      ),
                  )}
                </div>
              )}

            {/* ── Education ── */}
            {data.educations.length > 0 &&
              data.educations.some((e) => hasContent(e.degree, e.institution)) && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em] mb-1.5 border-b border-gray-200 pb-1">
                    Education
                  </h3>
                  {data.educations.map(
                    (ed, i) =>
                      hasContent(ed.degree, ed.institution) && (
                        <div key={i} className={i > 0 ? 'mt-2' : ''}>
                          <div className="flex justify-between items-baseline">
                            <p className="font-semibold text-sm text-gray-900">{ed.degree}</p>
                            {ed.yearRange && <span className="text-xs text-gray-500 shrink-0 ml-2">{ed.yearRange}</span>}
                          </div>
                          {ed.institution && <p className="text-xs text-gray-500">{ed.institution}</p>}
                          {ed.gpa && <p className="text-xs text-gray-500">GPA: {ed.gpa}</p>}
                        </div>
                      ),
                  )}
                </div>
              )}

            {/* ── Certifications ── */}
            {data.certifications.length > 0 &&
              data.certifications.some((c) => c.name.trim()) && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em] mb-1.5 border-b border-gray-200 pb-1">
                    Certifications
                  </h3>
                  {data.certifications.map(
                    (cert, i) =>
                      cert.name.trim() && (
                        <p key={i} className="text-xs text-gray-700">
                          <span className="font-semibold">{cert.name}</span>
                          {cert.organization && ` — ${cert.organization}`}
                          {cert.credentialId && (
                            <span className="text-gray-400 ml-1">(ID: {cert.credentialId})</span>
                          )}
                        </p>
                      ),
                  )}
                </div>
              )}

            {/* ── Relevant Coursework ── */}
            {data.coursework.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.15em] mb-1.5 border-b border-gray-200 pb-1">
                  Relevant Coursework
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {data.coursework.join(' • ')}
                </p>
              </div>
            )}

            {/* ── Empty state ── */}
            {!hasAnyContent && (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm italic">
                Start typing to see your resume come to life…
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
