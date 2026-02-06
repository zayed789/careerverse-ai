import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Search, BarChart2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockTrendData = [
  { month: 'Jan', 'React Developer': 85, 'Python Developer': 78, 'DevOps Engineer': 72, 'ML Engineer': 65 },
  { month: 'Feb', 'React Developer': 88, 'Python Developer': 82, 'DevOps Engineer': 75, 'ML Engineer': 70 },
  { month: 'Mar', 'React Developer': 82, 'Python Developer': 85, 'DevOps Engineer': 78, 'ML Engineer': 75 },
  { month: 'Apr', 'React Developer': 90, 'Python Developer': 88, 'DevOps Engineer': 80, 'ML Engineer': 82 },
  { month: 'May', 'React Developer': 92, 'Python Developer': 90, 'DevOps Engineer': 85, 'ML Engineer': 88 },
  { month: 'Jun', 'React Developer': 95, 'Python Developer': 92, 'DevOps Engineer': 88, 'ML Engineer': 92 },
];

const roleColors: Record<string, string> = {
  'React Developer': '#3b82f6',
  'Python Developer': '#10b981',
  'DevOps Engineer': '#f59e0b',
  'ML Engineer': '#8b5cf6',
};

const TrendsPage = () => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['React Developer', 'Python Developer']);
  const [newRole, setNewRole] = useState('');

  const availableRoles = Object.keys(roleColors);

  const addRole = (role: string) => {
    if (!selectedRoles.includes(role) && selectedRoles.length < 4) {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const removeRole = (role: string) => {
    setSelectedRoles(selectedRoles.filter((r) => r !== role));
  };

  return (
    <Layout>
      <div className="section-container py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Trend</span> Analyzer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Compare hiring trends and demand across different tech roles
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 mb-8"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Compare Roles (max 4)
            </h3>
            
            {/* Selected roles */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedRoles.map((role) => (
                <motion.button
                  key={role}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => removeRole(role)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: roleColors[role] }}
                >
                  {role} ×
                </motion.button>
              ))}
            </div>

            {/* Available roles */}
            <div className="flex flex-wrap gap-2">
              {availableRoles
                .filter((role) => !selectedRoles.includes(role))
                .map((role) => (
                  <Button
                    key={role}
                    variant="outline"
                    size="sm"
                    onClick={() => addRole(role)}
                    className="border-dashed"
                  >
                    + {role}
                  </Button>
                ))}
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              Hiring Demand Over Time
            </h3>
            
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: 'Demand Index', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  {selectedRoles.map((role) => (
                    <Line
                      key={role}
                      type="monotone"
                      dataKey={role}
                      stroke={roleColors[role]}
                      strokeWidth={3}
                      dot={{ fill: roleColors[role], strokeWidth: 2 }}
                      activeDot={{ r: 8, stroke: roleColors[role], strokeWidth: 2 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mt-8"
          >
            {[
              { title: 'Fastest Growing', value: 'ML Engineer', change: '+42%', color: 'text-green-400' },
              { title: 'Most In-Demand', value: 'React Developer', change: '95 Index', color: 'text-primary' },
              { title: 'Highest Salary Growth', value: 'DevOps Engineer', change: '+15%', color: 'text-amber-400' },
            ].map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <h4 className="text-sm text-muted-foreground mb-2">{insight.title}</h4>
                <p className="text-xl font-bold mb-1">{insight.value}</p>
                <span className={`text-sm font-semibold ${insight.color}`}>{insight.change}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TrendsPage;
