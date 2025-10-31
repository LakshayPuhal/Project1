// src/components/TaskItem.tsx
import { useState } from 'react';   // ← ADD THIS LINE
import { tasksApi } from '../api';

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

interface Props {
  task: Task;
  onUpdate: () => void;
}

export default function TaskItem({ task, onUpdate }: Props) {
  const [deleting, setDeleting] = useState(false);

  const toggleComplete = async () => {
    try {
      await tasksApi.toggle(task.id, !task.completed);
      onUpdate();
    } catch (err) {
      alert('Failed to update task.');
    }
  };

  const deleteTask = async () => {
    if (!confirm('Delete this task?')) return;
    setDeleting(true);
    try {
      await tasksApi.delete(task.id);
      onUpdate();
    } catch (err) {
      alert('Failed to delete task.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <li
      className={`group flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
        deleting ? 'opacity-50' : ''
      }`}
    >
      <label className="flex items-center gap-3 cursor-pointer flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleComplete}
          className="w-6 h-6 text-blue-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
        />
        <span
          className={`text-lg font-medium transition-all ${
            task.completed
              ? 'line-through text-gray-400'
              : 'text-gray-800'
          }`}
        >
          {task.description}
        </span>
      </label>

      <button
        onClick={deleteTask}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 font-bold text-2xl transition-all duration-200 transform hover:scale-110"
        aria-label="Delete task"
      >
        {deleting ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75" />
          </svg>
        ) : (
          '×'
        )}
      </button>
    </li>
  );
}