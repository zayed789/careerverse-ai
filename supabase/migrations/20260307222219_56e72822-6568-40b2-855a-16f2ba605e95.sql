
ALTER TABLE public.user_metrics
  ADD COLUMN IF NOT EXISTS corporate_intel_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gst_validation_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cashflow_audit_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS document_intelligence_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS regulatory_risk_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS due_diligence_score numeric DEFAULT 0;
