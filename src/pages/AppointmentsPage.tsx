import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { AppointmentCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/context/AppointmentContext';
import { AppointmentStatus } from '@/types';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { getPatientAppointments, updateAppointmentStatus, isLoading } = useAppointments();
  const [activeTab, setActiveTab] = useState('all');

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

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Appointments</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your appointments
            </p>
          </div>
          <Button asChild>
            <Link to="/doctors">Book New Appointment</Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
            <TabsTrigger value="all" className="gap-2">
              <Calendar className="h-4 w-4 hidden md:inline" />
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4 hidden md:inline" />
              Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle2 className="h-4 w-4 hidden md:inline" />
              Approved ({statusCounts.approved})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <XCircle className="h-4 w-4 hidden md:inline" />
              Completed ({statusCounts.completed})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <AppointmentCardSkeleton key={i} />
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
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'all'
                    ? "You haven't booked any appointments yet"
                    : `No ${activeTab} appointments`}
                </p>
                <Button variant="outline" asChild>
                  <Link to="/doctors">Find a Doctor</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};
