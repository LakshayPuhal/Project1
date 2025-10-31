// src/api.ts
import axios from 'axios';

// Hardcoded for local dev only
const API_BASE = 'http://localhost:5001/api';

const api = axios.create({ baseURL: API_BASE });

export type Task = {
  id: number;
  description: string;
  completed: boolean;
};

export const tasksApi = {
  getAll: (filter: 'all' | 'active' | 'completed' = 'all') =>
    api.get<Task[]>(`/tasks?filter=${filter}`).then(r => r.data),

  create: (description: string) =>
    api.post<Task>('/tasks', { description }).then(r => r.data),

  toggle: (id: number, completed: boolean) =>
    api.put<Task>(`/tasks/${id}`, { completed }).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/tasks/${id}`),
};