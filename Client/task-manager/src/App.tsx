// src/App.tsx
import { useCallback, useState } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskAdded = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* HEADER — ONLY HERE */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">TaskFlow</h1>
          <p className="text-gray-600 mt-2">Stay organized, one task at a time.</p>
        </header>

        <TaskInput onTaskAdded={handleTaskAdded} />
        <TaskList key={refreshTrigger} />
      </div>
    </div>
  );
}