import React, { memo } from 'react';
import { Appointment, AppointmentStatus } from '@/types';
import { cn } from '@/lib/utils';

interface AppointmentCardProps {
  appointment: Appointment;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  isAdmin?: boolean;
  showTimeline?: boolean;
}

const statusSteps = ['Booked', 'Confirmed', 'In Progress', 'Completed'];

const getStepStatus = (appointmentStatus: AppointmentStatus, stepIndex: number): 'completed' | 'active' | 'pending' => {
  const statusMap: Record<AppointmentStatus, number> = {
    pending: 0,
    approved: 1,
    rejected: -1,
    cancelled: -1,
    completed: 3,
  };
  
  const currentStep = statusMap[appointmentStatus];
  if (currentStep === -1) return 'pending';
  if (stepIndex < currentStep) return 'completed';
  if (stepIndex === currentStep) return 'active';
  return 'pending';
};

const getStatusStyles = (status: AppointmentStatus) => {
  switch (status) {
    case 'approved':
      return 'text-[#00D4A1] border-[#00D4A1]';
    case 'pending':
      return 'text-[#F5A623] border-[#F5A623]';
    case 'completed':
      return 'text-[#00C8FF] border-[#00C8FF]';
    case 'rejected':
    case 'cancelled':
      return 'text-[#FF4D6D] border-[#FF4D6D]';
    default:
      return 'text-[#8A9BB5] border-[#8A9BB5]';
  }
};

export const AppointmentCard: React.FC<AppointmentCardProps> = memo(({
  appointment,
  showActions = false,
  onApprove,
  onReject,
  onCancel,
  isAdmin = false,
  showTimeline = false,
}) => {
  return (
    <div className="bg-[#111827] border border-[#1E293B] hover:border-[#00C8FF33] transition-all duration-300 p-5 hover:-translate-y-0.5">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Main Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-['DM_Serif_Display'] text-lg text-[#F0F4FF]">
                {isAdmin ? appointment.patientName : appointment.doctorName}
              </h3>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#00C8FF] mt-1">
                {isAdmin ? appointment.patientEmail : appointment.doctorSpecialization}
              </p>
            </div>
            <span className={cn(
              "text-[10px] tracking-[0.15em] uppercase px-2 py-1 border bg-transparent shrink-0",
              getStatusStyles(appointment.status)
            )}>
              {appointment.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[#4A5568]">Date:</span>
              <span className="font-mono text-[#F0F4FF]">{appointment.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#4A5568]">Time:</span>
              <span className="font-mono text-[#F0F4FF]">{appointment.time}</span>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <span className="text-[#4A5568]">Doctor:</span>
                <span className="text-[#F0F4FF]">{appointment.doctorName}</span>
              </div>
            )}
          </div>

          {appointment.reason && (
            <p className="text-sm text-[#8A9BB5] bg-[#0B0F1A] p-3 border-l-2 border-[#1E293B]">
              {appointment.reason}
            </p>
          )}

          {/* Status Timeline */}
          {showTimeline && appointment.status !== 'rejected' && appointment.status !== 'cancelled' && (
            <div className="mt-4 pt-4 border-t border-[#1E293B]">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => {
                  const stepStatus = getStepStatus(appointment.status, index);
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                          stepStatus === 'completed' && "bg-[#00C8FF] border-[#00C8FF]",
                          stepStatus === 'active' && "border-[#00C8FF] bg-transparent",
                          stepStatus === 'pending' && "border-[#1E293B] bg-transparent"
                        )}>
                          {stepStatus === 'completed' && (
                            <span className="text-[#0B0F1A] text-xs">✓</span>
                          )}
                          {stepStatus === 'active' && (
                            <span className="w-2 h-2 rounded-full bg-[#00C8FF]" />
                          )}
                        </div>
                        <span className={cn(
                          "text-[8px] tracking-[0.1em] uppercase mt-1",
                          stepStatus === 'pending' ? "text-[#4A5568]" : "text-[#8A9BB5]"
                        )}>
                          {step}
                        </span>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={cn(
                          "flex-1 h-px mx-2",
                          getStepStatus(appointment.status, index + 1) !== 'pending' ? "bg-[#00C8FF]" : "bg-[#1E293B]"
                        )} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && appointment.status === 'pending' && (
          <div className="flex gap-2 md:flex-col shrink-0">
            {isAdmin ? (
              <>
                <button
                  onClick={() => onApprove?.(appointment.id)}
                  className="px-4 py-2 bg-[#00D4A1] text-[#0B0F1A] text-xs tracking-wider uppercase font-semibold hover:bg-[#00D4A1]/80 transition-colors active:scale-[0.98]"
                  aria-label="Approve appointment"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject?.(appointment.id)}
                  className="px-4 py-2 bg-[#FF4D6D] text-[#F0F4FF] text-xs tracking-wider uppercase font-semibold hover:bg-[#FF4D6D]/80 transition-colors active:scale-[0.98]"
                  aria-label="Reject appointment"
                >
                  Reject
                </button>
              </>
            ) : (
              <button
                onClick={() => onCancel?.(appointment.id)}
                className="px-4 py-2 border border-[#1E293B] text-[#8A9BB5] text-xs tracking-wider uppercase hover:border-[#FF4D6D] hover:text-[#FF4D6D] transition-colors active:scale-[0.98]"
                aria-label="Cancel appointment"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

AppointmentCard.displayName = 'AppointmentCard';
