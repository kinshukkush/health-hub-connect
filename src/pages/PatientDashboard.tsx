import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/context/AppointmentContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getPatientAppointments, updateAppointmentStatus } = useAppointments();
  
  const appointments = user ? getPatientAppointments(user.id) : [];
  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'approved' || apt.status === 'pending')
    .slice(0, 3);
  
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  const handleCancel = async (id: string) => {
    await updateAppointmentStatus(id, 'cancelled');
    toast.success('Appointment cancelled');
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your healthcare journey
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/doctors">
              <Stethoscope className="h-4 w-4" />
              Find a Doctor
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Appointments"
            value={stats.total}
            icon={Calendar}
            variant="primary"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle2}
            variant="success"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={FileText}
            variant="info"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="group hover:shadow-lg hover:border-primary/20 transition-all">
            <CardContent className="p-6">
              <Link to="/doctors" className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Stethoscope className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Find Doctors</h3>
                    <p className="text-sm text-muted-foreground">Search specialists</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:border-primary/20 transition-all">
            <CardContent className="p-6">
              <Link to="/appointments" className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success transition-colors">
                    <Calendar className="h-6 w-6 text-success group-hover:text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">My Appointments</h3>
                    <p className="text-sm text-muted-foreground">View all bookings</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-success transition-colors" />
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:border-primary/20 transition-all">
            <CardContent className="p-6">
              <Link to="/records" className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center group-hover:bg-info transition-colors">
                    <FileText className="h-6 w-6 text-info group-hover:text-info-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Medical Records</h3>
                    <p className="text-sm text-muted-foreground">Access your files</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-info transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/appointments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    showActions
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming appointments</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link to="/doctors">Book Now</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
