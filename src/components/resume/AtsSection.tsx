import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertTriangle, Lightbulb, XCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ATS_WEBHOOK_URL = 'https://figo6788.app.n8n.cloud/webhook-test/resume-ats';

const feedbackIcons = {
  strength: CheckCircle2,
  missing: XCircle,
  formatting: AlertTriangle,
  suggestion: Lightbulb,
} as const;

const feedbackColors = {
  strength: 'text-emerald-400',
  missing: 'text-red-400',
  formatting: 'text-amber-400',
  suggestion: 'text-sky-400',
} as const;

const feedbackLabels = {
  strength: 'Strength',
  missing: 'Missing Keyword',
  formatting: 'Formatting',
  suggestion: 'Suggestion',
} as const;

type FeedbackType = keyof typeof feedbackIcons;

const FeedbackRow = ({ type, text, delay }: { type: FeedbackType; text: string; delay: number }) => {
  const Icon = feedbackIcons[type];
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20"
    >
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${feedbackColors[type]}`} />
      <div>
        <span className={`text-[10px] uppercase tracking-wider font-semibold ${feedbackColors[type]}`}>
          {feedbackLabels[type]}
        </span>
        <p className="text-sm text-foreground/80">{text}</p>
      </div>
    </motion.div>
  );
};

interface AtsWebhookResponse {
  ats_score: number;
  strengths: string[];
  missing_keywords: string[];
  formatting_issues: string[];
  suggestions: string[];
}

const AtsSection = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsWebhookResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeResume = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setAtsResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(ATS_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed (${response.status})`);
      }

      const data: AtsWebhookResponse = await response.json();
      setAtsResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      toast({ title: 'ATS Analysis Error', description: message, variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      toast({ title: 'Invalid file', description: 'Please upload a PDF file.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum file size is 5 MB.', variant: 'destructive' });
      return;
    }
    setUploadedFile(file);
    setAtsResult(null);
    setError(null);
    analyzeResume(file);
  }, [analyzeResume]);

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

  const canUpload = !isAnalyzing;

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
      {!uploadedFile && canUpload && (
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

      {/* Analyzing state */}
      {uploadedFile && isAnalyzing && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
          <span className="text-xs text-muted-foreground">Analyzing…</span>
        </div>
      )}

      {/* Error state */}
      {uploadedFile && !isAnalyzing && error && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
            <button onClick={clearUpload} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* ATS Result */}
      <AnimatePresence>
        {atsResult && uploadedFile && !isAnalyzing && (
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
              <span className={`text-5xl font-bold ${getScoreColor(atsResult.ats_score)}`}>
                {atsResult.ats_score}
              </span>
              <span className="text-lg text-muted-foreground">/100</span>
              <div className="mt-3 max-w-xs mx-auto">
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${atsResult.ats_score}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${getScoreBarColor(atsResult.ats_score)}`}
                  />
                </div>
              </div>
            </div>

            {/* Feedback sections */}
            <div className="space-y-2">
              {atsResult.strengths?.length > 0 && atsResult.strengths.map((text, idx) => (
                <FeedbackRow key={`s-${idx}`} type="strength" text={text} delay={idx * 0.08} />
              ))}
              {atsResult.missing_keywords?.length > 0 && atsResult.missing_keywords.map((text, idx) => (
                <FeedbackRow key={`m-${idx}`} type="missing" text={text} delay={(atsResult.strengths?.length ?? 0 + idx) * 0.08} />
              ))}
              {atsResult.formatting_issues?.length > 0 && atsResult.formatting_issues.map((text, idx) => (
                <FeedbackRow key={`f-${idx}`} type="formatting" text={text} delay={idx * 0.08} />
              ))}
              {atsResult.suggestions?.length > 0 && atsResult.suggestions.map((text, idx) => (
                <FeedbackRow key={`sg-${idx}`} type="suggestion" text={text} delay={idx * 0.08} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AtsSection;
