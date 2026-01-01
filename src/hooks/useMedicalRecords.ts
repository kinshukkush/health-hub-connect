import { useState, useCallback } from 'react';
import { MedicalRecord } from '@/types';
import { mockMedicalRecords } from '@/data/mockData';

export function useMedicalRecords(patientId: string) {
  const [records, setRecords] = useState<MedicalRecord[]>(
    mockMedicalRecords.filter(r => r.patientId === patientId)
  );
  const [isLoading, setIsLoading] = useState(false);

  const uploadRecord = useCallback(async (
    record: Omit<MedicalRecord, 'id' | 'uploadedAt'>
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRecord: MedicalRecord = {
      ...record,
      id: `rec${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    
    setRecords(prev => [...prev, newRecord]);
    setIsLoading(false);
    return true;
  }, []);

  const deleteRecord = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setRecords(prev => prev.filter(r => r.id !== id));
    setIsLoading(false);
    return true;
  }, []);

  return {
    records,
    isLoading,
    uploadRecord,
    deleteRecord,
  };
}
