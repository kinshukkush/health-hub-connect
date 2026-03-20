import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/context/AppointmentContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getPatientAppointments, updateAppointmentStatus } = useAppointments();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const appointments = user ? getPatientAppointments(user.id) : [];
  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'approved' || apt.status === 'pending')
    .slice(0, 4);
  
  const stats = {
    nextAppointment: upcomingAppointments.length > 0 ? upcomingAppointments[0].date : 'None',
    recordsUploaded: 12,
    doctorsFollowed: 4,
    openPrescriptions: 2,
  };

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).toUpperCase();
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleCancel = async (id: string) => {
    await updateAppointmentStatus(id, 'cancelled');
    toast.success('Appointment cancelled');
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-[#00D4A1] border-[#00D4A1]';
      case 'pending':
        return 'text-[#F5A623] border-[#F5A623]';
      default:
        return 'text-[#8A9BB5] border-[#8A9BB5]';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Hero Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-['DM_Serif_Display'] text-3xl md:text-4xl text-[#F0F4FF]">
              {getGreeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-[#8A9BB5] text-sm mt-2">
              Here's an overview of your healthcare journey
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-[#4A5568] tracking-widest">
              {formatTime(currentTime)}
            </p>
            <p className="text-[10px] text-[#4A5568] tracking-[0.2em] uppercase mt-1">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>

        {/* 4 Stat Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-[#1E293B] border-l-2 border-l-[#00C8FF] p-5 hover:border-[#00C8FF33] hover:shadow-[0_0_24px_rgba(0,200,255,0.06)] transition-all duration-300">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A9BB5]">Next Appointment</p>
            <p className="text-2xl md:text-3xl font-light text-[#00C8FF] font-mono mt-2">{stats.nextAppointment}</p>
          </div>
          <div className="bg-[#111827] border border-[#1E293B] border-l-2 border-l-[#00C8FF] p-5 hover:border-[#00C8FF33] hover:shadow-[0_0_24px_rgba(0,200,255,0.06)] transition-all duration-300">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A9BB5]">Records Uploaded</p>
            <p className="text-2xl md:text-3xl font-light text-[#00C8FF] font-mono mt-2">{stats.recordsUploaded}</p>
          </div>
          <div className="bg-[#111827] border border-[#1E293B] border-l-2 border-l-[#00C8FF] p-5 hover:border-[#00C8FF33] hover:shadow-[0_0_24px_rgba(0,200,255,0.06)] transition-all duration-300">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A9BB5]">Doctors Followed</p>
            <p className="text-2xl md:text-3xl font-light text-[#00C8FF] font-mono mt-2">{stats.doctorsFollowed}</p>
          </div>
          <div className="bg-[#111827] border border-[#1E293B] border-l-2 border-l-[#00C8FF] p-5 hover:border-[#00C8FF33] hover:shadow-[0_0_24px_rgba(0,200,255,0.06)] transition-all duration-300">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A9BB5]">Open Prescriptions</p>
            <p className="text-2xl md:text-3xl font-light text-[#00C8FF] font-mono mt-2">{stats.openPrescriptions}</p>
          </div>
        </div>

        {/* Upcoming Appointments - Horizontal Scroll */}
        <div>
          <h2 className="font-['DM_Serif_Display'] text-xl text-[#F0F4FF] mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
              {upcomingAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="w-64 shrink-0 bg-[#1A2235] border border-[#1E293B] p-4 hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <p className="font-['DM_Serif_Display'] text-lg text-[#F0F4FF]">{appointment.doctorName}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#00C8FF] mt-1">
                    {appointment.doctorSpecialization}
                  </p>
                  <div className="mt-4">
                    <p className="font-mono text-sm text-[#F0F4FF]">{appointment.date}</p>
                    <p className="font-mono text-sm text-[#8A9BB5]">{appointment.time}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={cn(
                      "text-[10px] tracking-[0.15em] uppercase px-2 py-1 border bg-transparent",
                      getStatusStyles(appointment.status)
                    )}>
                      {appointment.status}
                    </span>
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="text-[10px] tracking-[0.1em] uppercase text-[#8A9BB5] hover:text-[#FF4D6D] transition-colors"
                        aria-label="Cancel appointment"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#111827] border border-[#1E293B] p-8 text-center">
              <p className="text-[#8A9BB5]">No upcoming appointments</p>
              <Link 
                to="/doctors"
                className="inline-block mt-4 text-sm tracking-[0.1em] uppercase text-[#00C8FF] hover:text-[#33D4FF] transition-colors"
              >
                Book Now →
              </Link>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/doctors"
            className="border border-[#1E293B] text-[#8A9BB5] hover:border-[#00C8FF] hover:text-[#00C8FF] text-sm tracking-wide transition-all duration-200 px-6 py-3 text-center active:scale-[0.98]"
            aria-label="Book appointment"
          >
            Book Appointment
          </Link>
          <Link 
            to="/records"
            className="border border-[#1E293B] text-[#8A9BB5] hover:border-[#00C8FF] hover:text-[#00C8FF] text-sm tracking-wide transition-all duration-200 px-6 py-3 text-center active:scale-[0.98]"
            aria-label="Upload record"
          >
            Upload Record
          </Link>
          <Link 
            to="/doctors"
            className="border border-[#1E293B] text-[#8A9BB5] hover:border-[#00C8FF] hover:text-[#00C8FF] text-sm tracking-wide transition-all duration-200 px-6 py-3 text-center active:scale-[0.98]"
            aria-label="Find doctor"
          >
            Find Doctor
          </Link>
          <Link 
            to="/appointments"
            className="border border-[#1E293B] text-[#8A9BB5] hover:border-[#00C8FF] hover:text-[#00C8FF] text-sm tracking-wide transition-all duration-200 px-6 py-3 text-center active:scale-[0.98]"
            aria-label="View history"
          >
            View History
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};
