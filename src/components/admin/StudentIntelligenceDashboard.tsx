import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface StudentRow {
  user_id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  readiness_score: number | null;
  dsa_score: number | null;
  aptitude_score: number | null;
  ats_score: number | null;
  skill_gap_score: number | null;
  interview_score: number | null;
  updated_at: string;
}

type SortKey = keyof Pick<
  StudentRow,
  | 'name'
  | 'email'
  | 'readiness_score'
  | 'dsa_score'
  | 'aptitude_score'
  | 'ats_score'
  | 'skill_gap_score'
  | 'interview_score'
  | 'updated_at'
>;

const n = (v: number | null) => v ?? 0;

const scoreFilters: { key: string; label: string }[] = [
  { key: 'dsa_score', label: 'DSA Score' },
  { key: 'aptitude_score', label: 'Aptitude Score' },
  { key: 'ats_score', label: 'ATS Score' },
  { key: 'skill_gap_score', label: 'Skill Gap Score' },
  { key: 'interview_score', label: 'Interview Score' },
];

const StudentIntelligenceDashboard = () => {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [readinessMin, setReadinessMin] = useState(0);
  const [ranges, setRanges] = useState<Record<string, [number, number]>>(
    Object.fromEntries(scoreFilters.map((f) => [f.key, [0, 100]]))
  );
  const [sortKey, setSortKey] = useState<SortKey>('readiness_score');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('user_metrics')
        .select(
          'user_id, name, email, role, readiness_score, dsa_score, aptitude_score, ats_score, skill_gap_score, interview_score, updated_at'
        );
      if (data) setStudents(data as StudentRow[]);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return students
      .filter((s) => (s.role ?? 'Student') !== 'admin')
      .filter((s) => n(s.readiness_score) >= readinessMin)
      .filter((s) =>
        scoreFilters.every((f) => {
          const v = n(s[f.key as keyof StudentRow] as number | null);
          const [min, max] = ranges[f.key];
          return v >= min && v <= max;
        })
      )
      .sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        if (av < bv) return sortAsc ? -1 : 1;
        if (av > bv) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [students, readinessMin, ranges, sortKey, sortAsc]);

  const totalStudents = filtered.length;
  const readyCount = filtered.filter((s) => n(s.readiness_score) > 80).length;
  const needsImprovement = filtered.filter((s) => n(s.readiness_score) < 50).length;

  const chartData = useMemo(() => {
    const buckets = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10}–${i * 10 + 10}`,
      count: 0,
    }));
    filtered.forEach((s) => {
      const idx = Math.min(Math.floor(n(s.readiness_score) / 10), 9);
      buckets[idx].count++;
    });
    return buckets;
  }, [filtered]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="px-3 py-3 text-muted-foreground font-medium cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => toggleSort(k)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className="w-3 h-3" />
      </span>
    </th>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold gradient-text">Student Intelligence Dashboard</h2>

      {/* Filter Panel */}
      <Card className="sticky top-16 z-20 bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Readiness Index ≥ {readinessMin}
            </label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[readinessMin]}
              onValueChange={([v]) => setReadinessMin(v)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scoreFilters.map((f) => {
              const [min, max] = ranges[f.key];
              return (
                <div key={f.key}>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    {f.label}: {min} – {max}
                  </label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[min, max]}
                    onValueChange={([a, b]) =>
                      setRanges((r) => ({ ...r, [f.key]: [a, b] }))
                    }
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{readyCount}</p>
              <p className="text-xs text-muted-foreground">Ready for Placement</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold">{needsImprovement}</p>
              <p className="text-xs text-muted-foreground">Needs Improvement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Readiness Index Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: 'Students', color: 'hsl(var(--primary))' },
            }}
            className="h-[220px] w-full"
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <SortHeader label="Name" k="name" />
              <SortHeader label="Email" k="email" />
              <SortHeader label="Readiness" k="readiness_score" />
              <SortHeader label="DSA" k="dsa_score" />
              <SortHeader label="Aptitude" k="aptitude_score" />
              <SortHeader label="ATS" k="ats_score" />
              <SortHeader label="Skill Gap" k="skill_gap_score" />
              <SortHeader label="Interview" k="interview_score" />
              <SortHeader label="Updated" k="updated_at" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                  No students match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr
                  key={s.user_id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-3 py-3">{s.name ?? '—'}</td>
                  <td className="px-3 py-3 text-muted-foreground">{s.email ?? '—'}</td>
                  <td className="px-3 py-3 font-semibold gradient-text">{n(s.readiness_score)}</td>
                  <td className="px-3 py-3">{n(s.dsa_score)}</td>
                  <td className="px-3 py-3">{n(s.aptitude_score)}</td>
                  <td className="px-3 py-3">{n(s.ats_score)}</td>
                  <td className="px-3 py-3">{n(s.skill_gap_score)}</td>
                  <td className="px-3 py-3">{n(s.interview_score)}</td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">
                    {new Date(s.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
};

export default StudentIntelligenceDashboard;
