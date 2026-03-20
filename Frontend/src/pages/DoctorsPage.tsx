import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { useDoctors } from '@/hooks/useDoctors';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/context/AppointmentContext';
import { Doctor } from '@/types';
import { specializations } from '@/data/mockData';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const DoctorsPage: React.FC = () => {
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [specialization, setSpecialization] = useState('All Specializations');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(1);

  const { doctors, isLoading, totalPages, totalCount } = useDoctors({
    searchQuery,
    specialization: selectedSpecializations.length > 0 ? selectedSpecializations[0] : 'All Specializations',
    page,
    pageSize: 6,
  });

  // Debounced search
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setIsSearching(false);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter by availability client-side
  const filteredDoctors = useMemo(() => {
    if (availableOnly) {
      return doctors.filter(d => d.available);
    }
    return doctors;
  }, [doctors, availableOnly]);

  // Modal states
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Booking form
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleSubmitBooking = async () => {
    if (!selectedDoctor || !user || !bookingDate || !bookingTime || !bookingReason) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = await createAppointment({
      patientId: user.id,
      patientName: user.name,
      patientEmail: user.email,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialization: selectedDoctor.specialization,
      date: bookingDate,
      time: bookingTime,
      status: 'pending',
      reason: bookingReason,
    });

    if (success) {
      toast.success('Appointment request submitted!');
      setShowBookingModal(false);
      setBookingDate('');
      setBookingTime('');
      setBookingReason('');
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];

  // Generate next 7 days for date picker
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        num: date.getDate(),
      });
    }
    return days;
  };

  const toggleSpecialization = (spec: string) => {
    if (spec === 'All Specializations') {
      setSelectedSpecializations([]);
    } else {
      setSelectedSpecializations(prev => 
        prev.includes(spec) 
          ? prev.filter(s => s !== spec)
          : [...prev, spec]
      );
    }
    setPage(1);
  };

  return (
    <MainLayout>
      <div className="flex gap-6 animate-fade-in">
        {/* Left Sidebar - Filters */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24 bg-[#111827] border-r border-[#1E293B] h-[calc(100vh-8rem)] overflow-y-auto p-5">
            {/* Specialization Filters */}
            <div className="mb-6">
              <h3 className="text-[9px] tracking-[0.25em] uppercase text-[#4A5568] mb-3">Specialization</h3>
              <div className="space-y-2">
                {specializations.slice(0, 8).map((spec) => (
                  <label key={spec} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={spec === 'All Specializations' ? selectedSpecializations.length === 0 : selectedSpecializations.includes(spec)}
                      onChange={() => toggleSpecialization(spec)}
                      className="w-4 h-4 accent-[#00C8FF] bg-[#0B0F1A] border border-[#1E293B]"
                    />
                    <span className="text-sm text-[#8A9BB5] group-hover:text-[#F0F4FF] transition-colors">
                      {spec}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="mb-6">
              <h3 className="text-[9px] tracking-[0.25em] uppercase text-[#4A5568] mb-3">Availability</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <div 
                  className={cn(
                    "w-10 h-5 rounded-full transition-colors relative",
                    availableOnly ? "bg-[#00C8FF]" : "bg-[#1E293B]"
                  )}
                  onClick={() => setAvailableOnly(!availableOnly)}
                >
                  <div 
                    className={cn(
                      "w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform",
                      availableOnly ? "translate-x-5" : "translate-x-0.5"
                    )}
                  />
                </div>
                <span className="text-sm text-[#8A9BB5]">Available Now</span>
              </label>
            </div>

            {/* Fee Range */}
            <div>
              <h3 className="text-[9px] tracking-[0.25em] uppercase text-[#4A5568] mb-3">Consultation Fee</h3>
              <input
                type="range"
                min="0"
                max="500"
                defaultValue="500"
                className="w-full accent-[#00C8FF]"
                aria-label="Fee range"
              />
              <div className="flex justify-between text-xs text-[#4A5568] mt-1">
                <span>$0</span>
                <span>$500+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-['DM_Serif_Display'] text-3xl text-[#F0F4FF]">Find Doctors</h1>
            <p className="text-[#8A9BB5] text-sm mt-1">
              Search and book appointments with our specialists
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, specialization, or hospital..."
              className="w-full bg-[#111827] border border-[#1E293B] rounded-none py-3 px-4 text-sm text-[#F0F4FF] placeholder:text-[#4A5568] focus:border-[#00C8FF] focus:outline-none transition-colors"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search doctors"
            />
            {isSearching && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5568] text-xs">
                Searching...
              </span>
            )}
          </div>

          {/* Results count */}
          <p className="text-sm text-[#8A9BB5]">
            Showing {filteredDoctors.length} of {totalCount} doctors
          </p>

          {/* Doctors Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[#111827] border border-[#1E293B] p-5 animate-pulse h-48" />
                ))
              : filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onViewProfile={handleViewProfile}
                    onBookAppointment={handleBookAppointment}
                  />
                ))}
          </div>

          {/* Empty State */}
          {!isLoading && filteredDoctors.length === 0 && (
            <div className="text-center py-12 bg-[#111827] border border-[#1E293B]">
              <p className="text-lg text-[#8A9BB5] mb-2">No doctors found</p>
              <p className="text-sm text-[#4A5568]">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-[#1E293B] text-[#8A9BB5] hover:border-[#00C8FF] hover:text-[#00C8FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-[#8A9BB5]">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-[#1E293B] text-[#8A9BB5] hover:border-[#00C8FF] hover:text-[#00C8FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal - Slide in from right */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-[#0B0F1A]/80 backdrop-blur-sm"
            onClick={() => setShowBookingModal(false)}
          />
          
          {/* Panel */}
          <div className="fixed right-0 top-0 w-full max-w-[480px] h-screen bg-[#111827] border-l border-[#1E293B] shadow-2xl animate-slide-in-right overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 p-2 text-[#8A9BB5] hover:text-[#F0F4FF] transition-colors"
              aria-label="Close booking modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              {selectedDoctor && (
                <>
                  {/* Doctor Summary */}
                  <div className="border-b border-[#1E293B] pb-6 mb-6">
                    <h2 className="font-['DM_Serif_Display'] text-2xl text-[#F0F4FF]">
                      {selectedDoctor.name}
                    </h2>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#00C8FF] mt-1">
                      {selectedDoctor.specialization}
                    </p>
                    <p className="text-sm text-[#8A9BB5] mt-2">
                      Consultation Fee: <span className="text-[#F0F4FF] font-mono">${selectedDoctor.consultationFee}</span>
                    </p>
                  </div>

                  {/* Date Picker - 7 day row */}
                  <div className="mb-6">
                    <h3 className="text-[9px] tracking-[0.25em] uppercase text-[#4A5568] mb-3">Select Date</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {getNext7Days().map((d) => (
                        <button
                          key={d.date}
                          onClick={() => setBookingDate(d.date)}
                          className={cn(
                            "w-12 h-14 flex flex-col items-center justify-center border shrink-0 transition-all",
                            bookingDate === d.date
                              ? "bg-[#00C8FF18] border-[#00C8FF] text-[#00C8FF]"
                              : "border-[#1E293B] text-[#8A9BB5] hover:border-[#00C8FF]"
                          )}
                          aria-label={`Select ${d.day} ${d.num}`}
                        >
                          <span className="text-[10px] uppercase">{d.day}</span>
                          <span className="text-lg font-mono">{d.num}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="mb-6">
                    <h3 className="text-[9px] tracking-[0.25em] uppercase text-[#4A5568] mb-3">Select Time</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setBookingTime(slot)}
                          className={cn(
                            "py-2 text-sm border transition-all",
                            bookingTime === slot
                              ? "border-[#00C8FF] bg-[#00C8FF18] text-[#00C8FF]"
                              : "border-[#1E293B] text-[#8A9BB5] hover:border-[#00C8FF]"
                          )}
                          aria-label={`Select ${slot}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-6">
                    <h3 className="text-[9px] tracking-[0.25em] uppercase text-[#4A5568] mb-3">Reason for Visit</h3>
                    <textarea
                      placeholder="Describe your symptoms or reason for the appointment..."
                      value={bookingReason}
                      onChange={(e) => setBookingReason(e.target.value)}
                      className="w-full bg-[#0B0F1A] border border-[#1E293B] text-[#F0F4FF] text-sm p-3 resize-none h-24 focus:border-[#00C8FF] focus:outline-none transition-colors placeholder:text-[#4A5568]"
                      aria-label="Reason for visit"
                    />
                  </div>

                  {/* Confirm Button */}
                  <button
                    onClick={handleSubmitBooking}
                    className="w-full bg-[#00C8FF] text-[#0B0F1A] font-semibold text-sm tracking-wider uppercase py-3 hover:bg-[#33D4FF] transition-all active:scale-[0.98]"
                    aria-label="Confirm booking"
                  >
                    Confirm Booking
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
