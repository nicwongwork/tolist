import { Duty } from '../types/duty.interface';

const API_URL = 'http://localhost:5000/api/duties';

export const dutyService = {
  // Read
  async getAll(): Promise<Duty[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch duties from server');
    return res.json();
  },

  // Create
  async create(name: string): Promise<Duty> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to create duty');
    return res.json();
  },

  // Update
  async update(id: string, name: string): Promise<Duty> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to update duty');
    return res.json();
  },

  // Delete
  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete duty');
  },
};