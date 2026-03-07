import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertTriangle, Lightbulb, XCircle, X, Loader2, BarChart3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const ATS_WEBHOOK_URL = 'https://roxx5071.app.n8n.cloud/webhook-test/ats';

interface AtsWebhookResponse {
  ats_score: number;
  strengths: string[];
  missing_keywords: string[];
  formatting_issues: string[];
  suggestions: string[];
}

/* ── Score helpers ─────────────────────────────────── */

const getScoreColor = (s: number) =>
  s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : 'text-red-400';

const getScoreBarColor = (s: number) =>
  s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-amber-500' : 'bg-red-500';

const getScoreRingColor = (s: number) =>
  s >= 80 ? 'stroke-emerald-500' : s >= 60 ? 'stroke-amber-500' : 'stroke-red-500';

/* ── Tiny sub-components ──────────────────────────── */

const SectionHeader = ({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon className={`w-4 h-4 ${color}`} />
    <h4 className={`text-sm font-semibold uppercase tracking-wider ${color}`}>{label}</h4>
    <div className="flex-1 h-px bg-border/40" />
  </div>
);

const FeedbackCard = ({ text, delay }: { text: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="p-3 rounded-lg bg-secondary/20 border border-border/30"
  >
    <p className="text-sm text-foreground/85 leading-relaxed">{text}</p>
  </motion.div>
);

const KeywordChip = ({ text, delay }: { text: string; delay: number }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20"
  >
    <XCircle className="w-3 h-3" />
    {text}
  </motion.span>
);

/* ── Score Ring (SVG circular indicator) ──────────── */

const ScoreRing = ({ score }: { score: number }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" className="stroke-secondary" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={radius} fill="none"
          className={getScoreRingColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
};

/* ── Main Component ───────────────────────────────── */

const AtsSection = () => {
  const { updateScore } = useAppContext();
  const { user } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsWebhookResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hydrate previous ATS results from DB
  useEffect(() => {
    if (!user) return;
    const hydrate = async () => {
      const { data } = await supabase
        .from('user_metrics')
        .select('ats_score, ats_feedback, ats_feedback_summary, keyword_match_percentage')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data && typeof data.ats_score === 'number' && data.ats_score > 0) {
        const feedback = Array.isArray((data as any).ats_feedback) ? (data as any).ats_feedback : null;
        if (feedback) {
          setAtsResult({
            ats_score: data.ats_score,
            strengths: feedback.filter((f: any) => f.type === 'strength').map((f: any) => f.text),
            missing_keywords: feedback.filter((f: any) => f.type === 'missing').map((f: any) => f.text),
            formatting_issues: feedback.filter((f: any) => f.type === 'formatting').map((f: any) => f.text),
            suggestions: feedback.filter((f: any) => f.type === 'suggestion').map((f: any) => f.text),
          });
          setHasAnalysis(true);
        }
      }
    };
    hydrate();
  }, [user]);

  // Cleanup object URL on unmount or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
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

      const raw = await response.json();
      const data: AtsWebhookResponse = Array.isArray(raw) ? raw[0] : raw;
      if (!data || typeof data.ats_score !== 'number') {
        throw new Error('Invalid response from ATS analysis');
      }
      setAtsResult(data);
      setHasAnalysis(true);
      updateScore('ats', data.ats_score);

      // Persist full ATS results to DB
      if (user) {
        const feedbackItems = [
          ...(data.strengths || []).map((t: string) => ({ type: 'strength', text: t })),
          ...(data.missing_keywords || []).map((t: string) => ({ type: 'missing', text: t })),
          ...(data.formatting_issues || []).map((t: string) => ({ type: 'formatting', text: t })),
          ...(data.suggestions || []).map((t: string) => ({ type: 'suggestion', text: t })),
        ];
        await supabase
          .from('user_metrics')
          .update({
            ats_score: data.ats_score,
            ats_feedback: feedbackItems,
            ats_feedback_summary: (data.suggestions || []).join('; '),
          } as any)
          .eq('user_id', user.id);
      }
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
    // Revoke old preview URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedFile(file);
    setAtsResult(null);
    setError(null);
    analyzeResume(file);
  }, [analyzeResume, previewUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const clearUpload = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUploadedFile(null);
    setAtsResult(null);
    setHasAnalysis(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasStrengths = (atsResult?.strengths?.length ?? 0) > 0;
  const hasMissing = (atsResult?.missing_keywords?.length ?? 0) > 0;
  const hasFormatting = (atsResult?.formatting_issues?.length ?? 0) > 0;
  const hasSuggestions = (atsResult?.suggestions?.length ?? 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        Upload Resume for ATS Check
      </h3>

      {/* ── Drop zone ── */}
      {!uploadedFile && !isAnalyzing && !hasAnalysis && (
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
          <p className="text-sm text-muted-foreground mb-1">Drag & drop your resume PDF here</p>
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

      {/* ── Inline PDF Preview ── */}
      {!uploadedFile && !isAnalyzing && !hasAnalysis && (
        <div className="mt-4 rounded-xl border border-border/30 bg-secondary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Upload a PDF resume to preview</p>
        </div>
      )}
      {uploadedFile && previewUrl && (
        <div className="mt-4 rounded-xl border border-border/40 shadow-[0_0_15px_hsl(var(--primary)/0.15)] p-5 flex flex-col items-center gap-3 bg-secondary/10">
          <FileText className="w-8 h-8 text-primary" />
          <p className="text-sm text-foreground/80 truncate max-w-full">{uploadedFile.name}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(previewUrl, '_blank')}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Open PDF Preview
          </Button>
        </div>
      )}

      {/* ── Analyzing ── */}
      {uploadedFile && isAnalyzing && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30 border border-border/30">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
          <span className="text-xs text-muted-foreground animate-pulse">Analyzing…</span>
        </div>
      )}

      {/* ── Error ── */}
      {uploadedFile && !isAnalyzing && error && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
            <button onClick={() => previewUrl && window.open(previewUrl, '_blank')} className="text-muted-foreground hover:text-foreground transition-colors" title="Preview file">
              <Eye className="w-4 h-4" />
            </button>
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

      {/* ── ATS Result ── */}
      <AnimatePresence>
        {atsResult && hasAnalysis && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* File bar */}
            {uploadedFile && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
                <button onClick={() => previewUrl && window.open(previewUrl, '_blank')} className="text-muted-foreground hover:text-foreground transition-colors" title="Preview file">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={clearUpload} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Score ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="py-2"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-4">
                ATS Compatibility Score
              </p>
              <ScoreRing score={atsResult.ats_score} />
              {/* Linear bar below ring */}
              <div className="mt-4 max-w-xs mx-auto">
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${atsResult.ats_score}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    className={`h-full rounded-full ${getScoreBarColor(atsResult.ats_score)}`}
                  />
                </div>
              </div>
            </motion.div>

            {/* ── Strengths ── */}
            {hasStrengths && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <SectionHeader icon={CheckCircle2} label="Strengths" color="text-emerald-400" />
                <div className="space-y-2">
                  {atsResult.strengths.map((text, i) => (
                    <FeedbackCard key={`s-${i}`} text={text} delay={0.35 + i * 0.06} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Missing Keywords ── */}
            {hasMissing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                <SectionHeader icon={XCircle} label="Missing Keywords" color="text-red-400" />
                <div className="flex flex-wrap gap-2">
                  {atsResult.missing_keywords.map((kw, i) => (
                    <KeywordChip key={`m-${i}`} text={kw} delay={0.5 + i * 0.05} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Formatting Issues ── */}
            {hasFormatting && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <SectionHeader icon={AlertTriangle} label="Formatting" color="text-amber-400" />
                <div className="space-y-2">
                  {atsResult.formatting_issues.map((text, i) => (
                    <FeedbackCard key={`f-${i}`} text={text} delay={0.65 + i * 0.06} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Suggestions ── */}
            {hasSuggestions && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
                <SectionHeader icon={Lightbulb} label="Suggestions" color="text-sky-400" />
                <div className="space-y-2">
                  {atsResult.suggestions.map((text, i) => (
                    <FeedbackCard key={`sg-${i}`} text={text} delay={0.8 + i * 0.06} />
                  ))}
                </div>
              </motion.div>
            )}
            {/* Re-analyze button for hydrated results */}
            {!uploadedFile && (
              <Button onClick={clearUpload} variant="outline" className="w-full mt-4">
                Upload New Resume & Re-analyze
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Preview Dialog removed — Chrome blocks blob URLs in iframes/objects.
          Preview is handled via "Open PDF Preview" button using window.open(). */}
    </motion.div>
  );
};

export default AtsSection;
