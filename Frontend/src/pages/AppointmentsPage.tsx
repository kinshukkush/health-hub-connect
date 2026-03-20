import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/context/AppointmentContext';
import { AppointmentStatus } from '@/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { getPatientAppointments, updateAppointmentStatus, isLoading } = useAppointments();
  const [activeTab, setActiveTab] = useState<'all' | AppointmentStatus>('all');

  const appointments = user ? getPatientAppointments(user.id) : [];

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'all') return true;
    return apt.status === activeTab;
  });

  const handleCancel = async (id: string) => {
    await updateAppointmentStatus(id, 'cancelled');
    toast.success('Appointment cancelled');
  };

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  const tabs = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'pending', label: 'Pending', count: statusCounts.pending },
    { key: 'approved', label: 'Approved', count: statusCounts.approved },
    { key: 'completed', label: 'Completed', count: statusCounts.completed },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-['DM_Serif_Display'] text-3xl text-[#F0F4FF]">My Appointments</h1>
            <p className="text-[#8A9BB5] text-sm mt-1">
              View and manage all your appointments
            </p>
          </div>
          <Link
            to="/doctors"
            className="bg-[#00C8FF] text-[#0B0F1A] font-semibold text-sm tracking-wider uppercase px-6 py-3 hover:bg-[#33D4FF] transition-all active:scale-[0.98] text-center"
          >
            Book New Appointment
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#1E293B]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                "pb-3 text-sm tracking-[0.1em] uppercase transition-all flex items-center gap-2",
                activeTab === tab.key
                  ? "text-[#00C8FF] border-b-2 border-[#00C8FF]"
                  : "text-[#8A9BB5] hover:text-[#F0F4FF]"
              )}
              aria-label={`${tab.label} appointments`}
            >
              {tab.label}
              <span className={cn(
                "text-[10px] px-1.5 py-0.5",
                activeTab === tab.key
                  ? "bg-[#00C8FF18] text-[#00C8FF]"
                  : "bg-[#1A2235] text-[#4A5568]"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#111827] border border-[#1E293B] p-5 h-32 animate-pulse" />
            ))}
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showActions={appointment.status === 'pending'}
                onCancel={handleCancel}
                showTimeline={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#111827] border border-[#1E293B]">
            <p className="text-lg text-[#8A9BB5] mb-2">No appointments found</p>
            <p className="text-sm text-[#4A5568] mb-4">
              {activeTab === 'all'
                ? "You haven't booked any appointments yet"
                : `No ${activeTab} appointments`}
            </p>
            <Link
              to="/doctors"
              className="inline-block text-sm tracking-[0.1em] uppercase text-[#00C8FF] hover:text-[#33D4FF] transition-colors"
            >
              Find a Doctor →
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
