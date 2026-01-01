import React, { createContext, useContext, useState, useCallback } from 'react';
import { Appointment, AppointmentStatus } from '@/types';
import { mockAppointments } from '@/data/mockData';

interface AppointmentContextType {
  appointments: Appointment[];
  isLoading: boolean;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, notes?: string) => Promise<boolean>;
  getPatientAppointments: (patientId: string) => Appointment[];
  getAllAppointments: () => Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isLoading, setIsLoading] = useState(false);

  const createAppointment = useCallback(async (
    appointmentData: Omit<Appointment, 'id' | 'createdAt'>
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    setIsLoading(false);
    return true;
  }, []);

  const updateAppointmentStatus = useCallback(async (
    id: string,
    status: AppointmentStatus,
    notes?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id ? { ...apt, status, notes: notes || apt.notes } : apt
      )
    );
    
    setIsLoading(false);
    return true;
  }, []);

  const getPatientAppointments = useCallback((patientId: string): Appointment[] => {
    return appointments.filter(apt => apt.patientId === patientId);
  }, [appointments]);

  const getAllAppointments = useCallback((): Appointment[] => {
    return appointments;
  }, [appointments]);

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        isLoading,
        createAppointment,
        updateAppointmentStatus,
        getPatientAppointments,
        getAllAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
