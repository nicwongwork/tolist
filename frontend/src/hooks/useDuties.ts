import { useState, useEffect, useCallback } from 'react';
import { Duty } from '../types/duty.interface';
import { dutyService } from '../services/duty.service';
import { message } from 'antd';

export const useDuties = () => {
  const [duties, setDuties] = useState<Duty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all duties from backend
  const fetchDuties = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dutyService.getAll();
      setDuties(data);
    } catch (err: any) {
      // Correct error communication to user
      message.error(err.message || 'Failed to connect to server. Please check backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new duty
  const handleAdd = async (name: string) => {
    try {
      const newItem = await dutyService.create(name);
      setDuties(prev => [...prev, newItem]);
      message.success('Duty created successfully');
    } catch (err) {
      message.error('Failed to create duty');
    }
  };

  // Update an existing duty
  const handleUpdate = async (id: string, name: string) => {
    try {
      const updatedItem = await dutyService.update(id, name);
      setDuties(prev => prev.map(item => item.id === id ? updatedItem : item));
      message.success('Duty updated successfully');
    } catch (err) {
      message.error('Failed to update duty');
    }
  };

  // Delete a duty
  const handleDelete = async (id: string) => {
    try {
      await dutyService.delete(id);
      setDuties(prev => prev.filter(item => item.id !== id));
      message.success('Duty deleted successfully');
    } catch (err) {
      message.error('Failed to delete duty');
    }
  };

  // Initial load on component mount
  useEffect(() => {
    fetchDuties();
  }, [fetchDuties]);

  return { duties, loading, handleAdd, handleUpdate, handleDelete };
};