import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertTriangle, Lightbulb, XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { AtsResult, AtsFeedbackItem } from './types';

const PLACEHOLDER_RESULT: AtsResult = {
  score: 72,
  feedback: [
    { type: 'strength', text: 'Clear section headers improve readability' },
    { type: 'strength', text: 'Contact information is properly formatted' },
    { type: 'missing', text: 'Missing keywords: "CI/CD", "Agile", "REST APIs"' },
    { type: 'formatting', text: 'Use standard fonts — avoid graphics or tables' },
    { type: 'suggestion', text: 'Add measurable achievements with numbers' },
    { type: 'suggestion', text: 'Include a professional summary section' },
  ],
};

const feedbackIcons: Record<AtsFeedbackItem['type'], typeof CheckCircle2> = {
  strength: CheckCircle2,
  missing: XCircle,
  formatting: AlertTriangle,
  suggestion: Lightbulb,
};

const feedbackColors: Record<AtsFeedbackItem['type'], string> = {
  strength: 'text-emerald-400',
  missing: 'text-red-400',
  formatting: 'text-amber-400',
  suggestion: 'text-sky-400',
};

const feedbackLabels: Record<AtsFeedbackItem['type'], string> = {
  strength: 'Strength',
  missing: 'Missing',
  formatting: 'Formatting',
  suggestion: 'Suggestion',
};

const AtsSection = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Future AI hook state — ready for n8n integration
  const [_uploadedResumeText] = useState<string>('');
  const [_atsScore] = useState<number | null>(null);
  const [_atsFeedback] = useState<AtsFeedbackItem[]>([]);

  const handleFile = useCallback((file: File) => {
    if (file.type !== 'application/pdf') return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit
    setUploadedFile(file);
    // Simulate ATS analysis with placeholder
    setTimeout(() => setAtsResult(PLACEHOLDER_RESULT), 1200);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearUpload = () => {
    setUploadedFile(null);
    setAtsResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        Upload Resume for ATS Check
      </h3>

      {/* Drop zone */}
      {!uploadedFile && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
            ${isDragging
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5'
            }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            Drag & drop your resume PDF here
          </p>
          <p className="text-xs text-muted-foreground/60 mb-4">PDF only • Max 5 MB</p>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            Upload PDF
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {/* Uploaded file indicator */}
      {uploadedFile && !atsResult && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
          <FileText className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
          <span className="text-xs text-muted-foreground">Analyzing…</span>
        </div>
      )}

      {/* ATS Result */}
      <AnimatePresence>
        {atsResult && uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* File + clear */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
              <button onClick={clearUpload} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score */}
            <div className="text-center py-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                ATS Compatibility Score
              </p>
              <span className={`text-5xl font-bold ${getScoreColor(atsResult.score)}`}>
                {atsResult.score}
              </span>
              <span className="text-lg text-muted-foreground">/100</span>
              <div className="mt-3 max-w-xs mx-auto">
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${atsResult.score}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${getScoreBarColor(atsResult.score)}`}
                  />
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-2">
              {atsResult.feedback.map((item, idx) => {
                const Icon = feedbackIcons[item.type];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20"
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${feedbackColors[item.type]}`} />
                    <div>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${feedbackColors[item.type]}`}>
                        {feedbackLabels[item.type]}
                      </span>
                      <p className="text-sm text-foreground/80">{item.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AtsSection;
