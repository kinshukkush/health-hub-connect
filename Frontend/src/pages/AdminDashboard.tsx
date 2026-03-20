import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { useAppointments } from '@/context/AppointmentContext';
import { mockDashboardStats } from '@/data/mockData';
import { useCountUp } from '@/hooks/useCountUp';
import { toast } from 'sonner';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const weeklyData = [
  { name: 'Mon', appointments: 12 },
  { name: 'Tue', appointments: 19 },
  { name: 'Wed', appointments: 15 },
  { name: 'Thu', appointments: 22 },
  { name: 'Fri', appointments: 18 },
  { name: 'Sat', appointments: 8 },
  { name: 'Sun', appointments: 5 },
];

const statusData = [
  { name: 'Approved', value: 89, color: '#00D4A1' },
  { name: 'Pending', value: 23, color: '#F5A623' },
  { name: 'Completed', value: 44, color: '#00C8FF' },
];

export const AdminDashboard: React.FC = () => {
  const { getAllAppointments, updateAppointmentStatus } = useAppointments();
  
  const appointments = getAllAppointments();
  const pendingAppointments = appointments
    .filter(apt => apt.status === 'pending')
    .slice(0, 5);

  const stats = mockDashboardStats;

  // Animated count-up values
  const { value: totalPatients } = useCountUp(stats.totalPatients);
  const { value: totalDoctors } = useCountUp(stats.totalDoctors);
  const { value: todayAppointments } = useCountUp(stats.todayAppointments);
  const { value: pendingCount } = useCountUp(stats.pendingAppointments);

  const handleApprove = async (id: string) => {
    await updateAppointmentStatus(id, 'approved');
    toast.success('Appointment approved');
  };

  const handleReject = async (id: string) => {
    await updateAppointmentStatus(id, 'rejected');
    toast.info('Appointment rejected');
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="font-['DM_Serif_Display'] text-3xl text-[#F0F4FF]">Admin Dashboard</h1>
          <p className="text-[#8A9BB5] text-sm mt-1">
            Overview of appointments and system analytics
          </p>
        </div>

        {/* Stats Grid with Animated Count-Up */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-[#1E293B] border-l-2 border-l-[#00C8FF] p-5 hover:border-[#00C8FF33] hover:shadow-[0_0_24px_rgba(0,200,255,0.06)] transition-all duration-300">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A9BB5]">Total Patients</p>
            <p className="text-3xl font-light text-[#00C8FF] font-mono mt-2">{totalPatients}</p>
          </div>
          <div className="bg-[#111827] border border-[#1E293B] border-l-2 border-l-[#00D4A1] p-5 hover:border-[#00D4A133] hover:shadow-[0_0_24px_rgba(0,212,161,0.06)] transition-all duration-300">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A9BB5]">Total Doctors</p>
            <p className="text-3xl font-light text-[#00D4A1] font-mono mt-2">{totalDoctors}</p>
          </div>
          <div className="bg-[#111827] border border-[#1E293B] border-l-2 border-l-[#00C8FF] p-5 hover:border-[#00C8FF33] hover:shadow-[0_0_24px_rgba(0,200,255,0.06)] transition-all duration-300">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A9BB5]">Appointments Today</p>
            <p className="text-3xl font-light text-[#00C8FF] font-mono mt-2">{todayAppointments}</p>
          </div>
          <div className="bg-[#111827] border border-[#1E293B] border-l-2 border-l-[#F5A623] p-5 hover:border-[#F5A62333] hover:shadow-[0_0_24px_rgba(245,166,35,0.06)] transition-all duration-300">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A9BB5]">Pending Approvals</p>
            <p className="text-3xl font-light text-[#F5A623] font-mono mt-2">{pendingCount}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Appointments Chart */}
          <div className="bg-[#111827] border border-[#1E293B] p-6">
            <h2 className="font-['DM_Serif_Display'] text-xl text-[#F0F4FF] mb-6">Weekly Appointments</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C8FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00C8FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#4A5568" fontSize={12} />
                  <YAxis stroke="#4A5568" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #1E293B',
                      borderRadius: '4px',
                      color: '#F0F4FF',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="appointments"
                    stroke="#00C8FF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAppointments)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-[#111827] border border-[#1E293B] p-6">
            <h2 className="font-['DM_Serif_Display'] text-xl text-[#F0F4FF] mb-6">Appointment Status</h2>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #1E293B',
                      borderRadius: '4px',
                      color: '#F0F4FF',
                    }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: '#8A9BB5' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pending Appointments */}
        <div className="bg-[#111827] border border-[#1E293B] p-6">
          <h2 className="font-['DM_Serif_Display'] text-xl text-[#F0F4FF] mb-6">
            Pending Appointments ({pendingAppointments.length})
          </h2>
          {pendingAppointments.length > 0 ? (
            <div className="space-y-4">
              {pendingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isAdmin
                  showActions
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#8A9BB5]">
              <p>All appointments have been processed!</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
