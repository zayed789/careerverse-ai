import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Calendar, Plus, Trash2, GripVertical, CheckCircle2, Circle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  day: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PlannerPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Complete React tutorial', completed: true, day: 'Monday' },
    { id: '2', text: 'Practice data structures', completed: false, day: 'Monday' },
    { id: '3', text: 'Build portfolio project', completed: false, day: 'Tuesday' },
    { id: '4', text: 'Study system design', completed: false, day: 'Wednesday' },
    { id: '5', text: 'Apply to internships', completed: false, day: 'Friday' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: newTask.trim(),
          completed: false,
          day: selectedDay,
        },
      ]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getTasksForDay = (day: string) => tasks.filter((task) => task.day === day);

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
            Weekly <span className="gradient-text">Study Planner</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Organize your learning schedule with drag-and-drop tasks
          </p>
        </motion.div>

        {/* Add Task */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="bg-secondary/50 flex-1"
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <Button onClick={addTask} className="glow-button text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </motion.div>

        {/* Weekly Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {daysOfWeek.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {day}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {dayTasks.filter((t) => t.completed).length}/{dayTasks.length}
                  </span>
                </div>

                <Reorder.Group
                  axis="y"
                  values={dayTasks}
                  onReorder={(newOrder) => {
                    const otherTasks = tasks.filter((t) => t.day !== day);
                    setTasks([...otherTasks, ...newOrder]);
                  }}
                  className="space-y-2 min-h-[100px]"
                >
                  {dayTasks.map((task) => (
                    <Reorder.Item
                      key={task.id}
                      value={task}
                      className="bg-secondary/30 rounded-lg p-3 cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                        <span
                          className={`flex-1 text-sm ${
                            task.completed ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {task.text}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                {dayTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No tasks for this day
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { label: 'Total Tasks', value: tasks.length },
            { label: 'Completed', value: tasks.filter((t) => t.completed).length },
            { label: 'Pending', value: tasks.filter((t) => !t.completed).length },
            { label: 'Completion Rate', value: `${Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) || 0}%` },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
};

export default PlannerPage;
