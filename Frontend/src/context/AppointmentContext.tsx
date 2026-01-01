import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Appointment, AppointmentStatus } from '@/types';
import { appointmentAPI } from '@/lib/api';

interface AppointmentContextType {
  appointments: Appointment[];
  isLoading: boolean;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, notes?: string) => Promise<boolean>;
  getPatientAppointments: (patientId: string) => Appointment[];
  getAllAppointments: () => Appointment[];
  refreshAppointments: () => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAppointments = useCallback(async () => {
    try {
      const appointments = await appointmentAPI.getAll();
      setAppointments(appointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  }, []);

  useEffect(() => {
    // Load appointments on mount if user is logged in
    const token = localStorage.getItem('healthhub_token');
    if (token) {
      refreshAppointments();
    }
  }, [refreshAppointments]);

  const createAppointment = useCallback(async (
    appointmentData: Omit<Appointment, 'id' | 'createdAt'>
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const newAppointment = await appointmentAPI.create(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (
    id: string,
    status: AppointmentStatus,
    notes?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const updatedAppointment = await appointmentAPI.update(id, { status, notes });
      setAppointments(prev =>
        prev.map(apt => apt.id === id ? updatedAppointment : apt)
      );
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to update appointment:', error);
      setIsLoading(false);
      return false;
    }
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
        refreshAppointments,
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
