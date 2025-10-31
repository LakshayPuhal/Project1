// src/components/TaskList.tsx
import { useEffect, useState } from 'react';
import { tasksApi, Task } from '../api';
import TaskItem from './TaskItem';

type Filter = 'all' | 'active' | 'completed';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getAll(filter);
      setTasks(data);
    } catch (err) {
      alert('Failed to load tasks.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const filteredTasks = tasks.filter(t =>
    filter === 'active' ? !t.completed :
    filter === 'completed' ? t.completed : true
  );

  return (
    <>
      {/* Filters */}
      <div className="flex justify-center gap-2 my-8 flex-wrap">
        {(['all', 'active', 'completed'] as Filter[]).map((f) => {
          const count = tasks.filter(t => 
            f === 'active' ? !t.completed : 
            f === 'completed' ? t.completed : true
          ).length;

          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all transform hover:scale-105 ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 shadow hover:shadow-md'
              }`}
            >
              {f} {f !== 'all' && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 min-h-96">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-lg">
            {filter === 'all' ? "No tasks yet. Let's get started!" : `No ${filter} tasks.`}
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-sm text-gray-500">
        {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} {filter !== 'all' && filter}
      </footer>
    </>
  );
}