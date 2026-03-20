import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const SettingsPage = () => {
  const { user } = useAuth();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSaveProfile = () => {
    toast.success('Profile settings saved successfully');
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    toast.success('Password changed successfully');
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowPasswordSection(false);
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const appointmentCount = 12;
  const recordsCount = 8;

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="font-['DM_Serif_Display'] text-3xl text-[#F0F4FF]">Settings</h1>
          <p className="text-[#8A9BB5] text-sm mt-1">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Profile Identity (35%) */}
          <div className="lg:w-[35%]">
            <div className="bg-[#111827] border border-[#1E293B] p-6 sticky top-24">
              {/* Large Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-[#00C8FF18] border-2 border-[#00C8FF33] text-4xl text-[#00C8FF] font-light font-mono flex items-center justify-center">
                  {getInitials(user?.name)}
                </div>
              </div>

              {/* Name and Role */}
              <div className="text-center mb-6">
                <h2 className="font-['DM_Serif_Display'] text-2xl text-[#F0F4FF]">{user?.name}</h2>
                <span className="inline-block mt-2 text-[9px] tracking-[0.15em] uppercase px-2 py-1 bg-[#1A2235] text-[#8A9BB5] border border-[#1E293B]">
                  {user?.role}
                </span>
              </div>

              {/* Member Since */}
              <p className="text-center text-xs text-[#4A5568] mb-6">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024'}
              </p>

              {/* Stats */}
              <div className="space-y-0">
                <div className="flex justify-between py-3 border-b border-[#1E293B]">
                  <span className="text-sm text-[#8A9BB5]">Appointments</span>
                  <span className="text-sm text-[#F0F4FF] font-mono">{appointmentCount}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-[#1E293B]">
                  <span className="text-sm text-[#8A9BB5]">Records</span>
                  <span className="text-sm text-[#F0F4FF] font-mono">{recordsCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Editable Form (65%) */}
          <div className="lg:w-[65%] space-y-6">
            {/* Personal Info Section */}
            <div className="bg-[#111827] border border-[#1E293B] p-6">
              <h3 className="text-[9px] tracking-[0.25em] uppercase text-[#4A5568] mb-6">Personal Information</h3>
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="bg-[#00C8FF] text-[#0B0F1A] font-semibold text-sm tracking-wider uppercase px-6 py-3 hover:bg-[#33D4FF] transition-all active:scale-[0.98]"
                  aria-label="Save changes"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-[#111827] border border-[#1E293B] p-6">
              <h3 className="text-[9px] tracking-[0.25em] uppercase text-[#4A5568] mb-6">Notifications</h3>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <div>
                    <p className="text-sm text-[#F0F4FF]">Email Notifications</p>
                    <p className="text-xs text-[#4A5568] mt-0.5">Receive updates via email</p>
                  </div>
                  <div 
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative cursor-pointer",
                      emailNotifications ? "bg-[#00C8FF]" : "bg-[#1E293B]"
                    )}
                    onClick={() => setEmailNotifications(!emailNotifications)}
                  >
                    <div 
                      className={cn(
                        "w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform",
                        emailNotifications ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </div>
                </label>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <div>
                    <p className="text-sm text-[#F0F4FF]">SMS Notifications</p>
                    <p className="text-xs text-[#4A5568] mt-0.5">Get text message alerts</p>
                  </div>
                  <div 
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative cursor-pointer",
                      smsNotifications ? "bg-[#00C8FF]" : "bg-[#1E293B]"
                    )}
                    onClick={() => setSmsNotifications(!smsNotifications)}
                  >
                    <div 
                      className={cn(
                        "w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform",
                        smsNotifications ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </div>
                </label>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <div>
                    <p className="text-sm text-[#F0F4FF]">Appointment Reminders</p>
                    <p className="text-xs text-[#4A5568] mt-0.5">Reminders before appointments</p>
                  </div>
                  <div 
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative cursor-pointer",
                      appointmentReminders ? "bg-[#00C8FF]" : "bg-[#1E293B]"
                    )}
                    onClick={() => setAppointmentReminders(!appointmentReminders)}
                  >
                    <div 
                      className={cn(
                        "w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform",
                        appointmentReminders ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-[#111827] border border-[#1E293B] p-6">
              <h3 className="text-[9px] tracking-[0.25em] uppercase text-[#4A5568] mb-6">Security</h3>
              
              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-sm text-[#00C8FF] hover:text-[#33D4FF] transition-colors"
                aria-expanded={showPasswordSection}
              >
                {showPasswordSection ? '[−]' : '[+]'} Change Password
              </button>

              {showPasswordSection && (
                <div className="mt-6 space-y-5 animate-fade-in">
                  <div>
                    <label htmlFor="current-password" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                      className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                      className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-[10px] tracking-[0.2em] uppercase text-[#8A9BB5] mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                      className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] px-4 py-3 text-sm rounded-[4px] focus:border-[#00C8FF] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="bg-[#00C8FF] text-[#0B0F1A] font-semibold text-sm tracking-wider uppercase px-6 py-3 hover:bg-[#33D4FF] transition-all active:scale-[0.98]"
                    aria-label="Update password"
                  >
                    Update Password
                  </button>
                </div>
              )}

              <p className="text-xs text-[#4A5568] mt-4">
                Last password change: Never
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
