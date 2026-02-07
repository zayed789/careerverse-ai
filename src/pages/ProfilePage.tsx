import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Briefcase, Code2, Target, GraduationCap,
  Save, LogOut, X, Plus, Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';

const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const roleOptions = ['Student', 'Professional', 'Admin'];
const domainOptions = [
  'Frontend Development', 'Backend Development', 'Full Stack',
  'Data Science', 'Machine Learning', 'DevOps', 'Cloud Computing',
  'Cybersecurity', 'Mobile Development', 'UI/UX Design',
];

const ProfilePage = () => {
  const { user, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Student',
    domain: user?.domain || '',
    skills: user?.skills || [],
    experience: user?.experience || 'Beginner',
    preferredRole: user?.preferredRole || '',
    learningGoals: user?.learningGoals || '',
  });

  if (!user) {
    navigate('/sign-in');
    return null;
  }

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const initials = form.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Layout>
      <div className="section-container py-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header Card */}
          <div className="glass-card p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-glow-gradient flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {initials || <User className="w-10 h-10" />}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{form.name}</h1>
                <p className="text-muted-foreground">{form.email}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {form.role}
                </span>
              </div>
              <div className="flex gap-2">
                {!editing ? (
                  <Button
                    onClick={() => setEditing(true)}
                    variant="outline"
                    className="glow-button-secondary"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button onClick={handleSave} className="glow-button text-white border-0">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
                <Button onClick={handleLogout} variant="ghost" className="text-destructive hover:text-destructive/80">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={!editing}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                  <input
                    value={form.email}
                    disabled
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm opacity-60"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    disabled={!editing}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Career Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Career Info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Career Domain</label>
                  <select
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    disabled={!editing}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="">Select domain</option>
                    {domainOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Experience Level</label>
                  <select
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    disabled={!editing}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {experienceLevels.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Preferred Role</label>
                  <input
                    value={form.preferredRole}
                    onChange={(e) => setForm({ ...form, preferredRole: e.target.value })}
                    disabled={!editing}
                    placeholder="e.g., Senior Frontend Engineer"
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm disabled:opacity-60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {skill}
                    {editing && (
                      <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
                {form.skills.length === 0 && (
                  <span className="text-sm text-muted-foreground">No skills added yet</span>
                )}
              </div>
              {editing && (
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <Button onClick={addSkill} size="sm" variant="outline" className="shrink-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Learning Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Learning Goals
              </h2>
              <textarea
                value={form.learningGoals}
                onChange={(e) => setForm({ ...form, learningGoals: e.target.value })}
                disabled={!editing}
                placeholder="Describe your learning goals..."
                rows={6}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm disabled:opacity-60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
