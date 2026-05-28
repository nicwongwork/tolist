import { renderHook, waitFor } from '@testing-library/react';
import { useDuties } from '../hooks/useDuties';
import { dutyService } from '../services/duty.service';

jest.mock('antd', () => ({
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../services/duty.service');

const mockedDutyService = jest.mocked(dutyService);

describe('Frontend Custom Hook Unit Tests', () => {
  it('should fetch duties successfully and turn off loading', async () => {
    const mockServerDuties = [
      { id: '1', name: 'Mock Duty A' },
      { id: '2', name: 'Mock Duty B' }
    ];

    mockedDutyService.getAll.mockResolvedValueOnce(mockServerDuties);

    const { result } = renderHook(() => useDuties());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.duties.length).toBe(2);
    expect(result.current.duties[0].name).toBe('Mock Duty A');
  });

  it('should handle API create error properly', async () => {
    mockedDutyService.getAll.mockResolvedValueOnce([]);
    mockedDutyService.create.mockRejectedValueOnce(new Error('Network Fail'));

    const { result } = renderHook(() => useDuties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.handleAdd('New Task');

    expect(result.current.duties.length).toBe(0);
  });
});