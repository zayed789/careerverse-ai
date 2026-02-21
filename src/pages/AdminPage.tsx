import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Download, Users, BarChart3 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProfileRow {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  domain: string | null;
  skills: string[] | null;
}

interface MetricRow {
  id: string;
  user_id: string;
  dsa_score: number | null;
  aptitude_score: number | null;
  ats_score: number | null;
  skill_gap_score: number | null;
  interview_score: number | null;
  readiness_score: number | null;
  updated_at: string;
}

const downloadCSV = (data: Record<string, unknown>[], filename: string) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h];
        const str = Array.isArray(val) ? val.join('; ') : String(val ?? '');
        return `"${str.replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminPage = () => {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [pRes, mRes] = await Promise.all([
        supabase.from('profiles').select('id, user_id, name, email, role, domain, skills'),
        supabase.from('user_metrics').select('id, user_id, dsa_score, aptitude_score, ats_score, skill_gap_score, interview_score, readiness_score, updated_at'),
      ]);
      if (pRes.data) setProfiles(pRes.data as ProfileRow[]);
      if (mRes.data) setMetrics(mRes.data as MetricRow[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Profiles Table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">All Profiles</h2>
              <span className="text-sm text-muted-foreground">({profiles.length})</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => downloadCSV(profiles as unknown as Record<string, unknown>[], 'profiles')}>
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Skills</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-foreground">{p.name ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{p.email ?? '—'}</TableCell>
                    <TableCell>{p.role ?? '—'}</TableCell>
                    <TableCell>{p.domain ?? '—'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{p.skills?.join(', ') ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Metrics Table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">User Metrics</h2>
              <span className="text-sm text-muted-foreground">({metrics.length})</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => downloadCSV(metrics as unknown as Record<string, unknown>[], 'user_metrics')}>
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>DSA</TableHead>
                  <TableHead>Aptitude</TableHead>
                  <TableHead>ATS</TableHead>
                  <TableHead>Skill Gap</TableHead>
                  <TableHead>Interview</TableHead>
                  <TableHead>Readiness</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground max-w-[120px] truncate">{m.user_id}</TableCell>
                    <TableCell>{m.dsa_score ?? 0}</TableCell>
                    <TableCell>{m.aptitude_score ?? 0}</TableCell>
                    <TableCell>{m.ats_score ?? 0}</TableCell>
                    <TableCell>{m.skill_gap_score ?? 0}</TableCell>
                    <TableCell>{m.interview_score ?? 0}</TableCell>
                    <TableCell>{m.readiness_score ?? 0}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(m.updated_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AdminPage;
