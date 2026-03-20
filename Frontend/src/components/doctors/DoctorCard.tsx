import React, { memo } from 'react';
import { Doctor } from '@/types';

interface DoctorCardProps {
  doctor: Doctor;
  onViewProfile: (doctor: Doctor) => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = memo(({
  doctor,
  onViewProfile,
  onBookAppointment,
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-[#111827] border border-[#1E293B] hover:border-[#00C8FF44] transition-all duration-300 p-5 hover:-translate-y-0.5">
      {/* Top Row: Avatar, Name, Specialty */}
      <div className="flex items-start gap-4">
        {/* Avatar with initials */}
        <div className="w-12 h-12 bg-[#0B0F1A] border border-[#1E293B] flex items-center justify-center text-[#8A9BB5] text-sm font-medium shrink-0">
          {getInitials(doctor.name)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-['DM_Serif_Display'] text-lg text-[#F0F4FF] truncate">
              {doctor.name}
            </h3>
            {/* Availability dot */}
            {doctor.available ? (
              <span 
                className="w-2 h-2 rounded-full bg-[#00D4A1] animate-pulse-dot shrink-0"
                aria-label="Available"
              />
            ) : (
              <span 
                className="w-2 h-2 rounded-full bg-[#4A5568] shrink-0"
                aria-label="Not available"
              />
            )}
          </div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#00C8FF] mt-1">
            {doctor.specialization}
          </p>
        </div>
      </div>

      {/* Middle: Stats Pills */}
      <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
        <span className="px-2 py-1 bg-[#1A2235] border border-[#1E293B] text-[#8A9BB5]">
          {doctor.experience} yrs
        </span>
        <span className="px-2 py-1 bg-[#1A2235] border border-[#1E293B] text-[#8A9BB5]">
          ${doctor.consultationFee}
        </span>
        <span className="px-2 py-1 bg-[#1A2235] border border-[#1E293B] text-[#8A9BB5] flex items-center gap-1">
          <span className="text-[#F5A623]">★</span>
          {doctor.rating}
        </span>
      </div>

      {/* Bottom: Book Consultation */}
      <button
        onClick={() => onBookAppointment(doctor)}
        disabled={!doctor.available}
        className="w-full mt-4 pt-3 border-t border-[#1E293B] text-xs tracking-widest uppercase text-[#00C8FF] hover:text-[#33D4FF] transition-colors disabled:text-[#4A5568] disabled:cursor-not-allowed text-left"
        aria-label={`Book consultation with ${doctor.name}`}
      >
        {doctor.available ? 'Book Consultation →' : 'Not Available'}
      </button>
    </div>
  );
});

DoctorCard.displayName = 'DoctorCard';

