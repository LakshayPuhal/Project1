import { useState } from 'react';
import { tasksApi } from '../api';

interface Props {
  onTaskAdded: () => void;
}

export default function TaskInput({ onTaskAdded }: Props) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      await tasksApi.create(trimmed);
      setDescription('');
      onTaskAdded();
    } catch (err) {
      alert('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-5 bg-white rounded-2xl shadow-lg">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 px-5 py-3 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={!description.trim() || loading}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transform transition hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75" />
          </svg>
        ) : (
          <>
            <span>Add</span>
            <span className="text-xl">+</span>
          </>
        )}
      </button>
    </form>
  );
}