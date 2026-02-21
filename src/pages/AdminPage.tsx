import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart3, Download, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ProfileRow {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  domain: string | null;
  skills: string[] | null;
  experience: string | null;
}

interface MetricRow {
  id: string;
  user_id: string;
  dsa_score: number | null;
  aptitude_score: number | null;
  ats_score: number | null;
  skill_gap_score: number | null;
  interview_score: number | null;
  consistency_score: number | null;
  updated_at: string;
}

const downloadCSV = (data: Record<string, unknown>[], filename: string) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
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
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const [p, m] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('user_metrics').select('*'),
      ]);
      if (p.data) setProfiles(p.data as ProfileRow[]);
      if (m.data) setMetrics(m.data as MetricRow[]);
    };
    fetch();
  }, []);

  const filteredProfiles = profiles.filter(p =>
    [p.name, p.email, p.role, p.domain].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full max-w-md px-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />

        {/* Profiles Table */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> All Profiles ({filteredProfiles.length})
            </h2>
            <Button variant="outline" size="sm" onClick={() => downloadCSV(profiles as unknown as Record<string, unknown>[], 'profiles.csv')}>
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          </div>
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-muted-foreground font-medium">Name</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">Email</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">Role</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">Domain</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">Skills</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">Experience</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map(p => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">{p.name ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {p.role ?? 'Student'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{p.domain ?? '—'}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{p.skills?.join(', ') ?? '—'}</td>
                    <td className="px-4 py-3">{p.experience ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Metrics Table */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> User Metrics ({metrics.length})
            </h2>
            <Button variant="outline" size="sm" onClick={() => downloadCSV(metrics as unknown as Record<string, unknown>[], 'user_metrics.csv')}>
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          </div>
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-muted-foreground font-medium">User ID</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">DSA</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">Aptitude</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">ATS</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">Skill Gap</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">Interview</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">Consistency</th>
                  <th className="px-4 py-3 text-muted-foreground font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map(m => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{m.user_id.slice(0, 8)}…</td>
                    <td className="px-4 py-3">{m.dsa_score ?? 0}</td>
                    <td className="px-4 py-3">{m.aptitude_score ?? 0}</td>
                    <td className="px-4 py-3">{m.ats_score ?? 0}</td>
                    <td className="px-4 py-3">{m.skill_gap_score ?? 0}</td>
                    <td className="px-4 py-3">{m.interview_score ?? 0}</td>
                    <td className="px-4 py-3">{m.consistency_score ?? 0}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(m.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AdminPage;
