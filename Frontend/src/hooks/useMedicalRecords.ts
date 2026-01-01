import { useState, useCallback, useEffect } from 'react';
import { MedicalRecord } from '@/types';
import { recordAPI } from '@/lib/api';

export function useMedicalRecords(patientId: string) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      const allRecords = await recordAPI.getAll();
      setRecords(allRecords.filter((r: MedicalRecord) => r.patientId === patientId));
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const uploadRecord = useCallback(async (
    record: Omit<MedicalRecord, 'id' | 'uploadedAt'>
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const newRecord = await recordAPI.create(record);
      setRecords(prev => [...prev, newRecord]);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to upload record:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const deleteRecord = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await recordAPI.delete(id);
      setRecords(prev => prev.filter(r => r.id !== id));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to delete record:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  return {
    records,
    isLoading,
    uploadRecord,
    deleteRecord,
  };
}
