import React, { memo } from 'react';
import { Appointment, AppointmentStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Stethoscope, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppointmentCardProps {
  appointment: Appointment;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  isAdmin?: boolean;
}

const statusConfig: Record<AppointmentStatus, { variant: 'success' | 'pending' | 'destructive' | 'secondary' | 'info'; label: string }> = {
  pending: { variant: 'pending', label: 'Pending' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'destructive', label: 'Rejected' },
  completed: { variant: 'info', label: 'Completed' },
  cancelled: { variant: 'secondary', label: 'Cancelled' },
};

export const AppointmentCard: React.FC<AppointmentCardProps> = memo(({
  appointment,
  showActions = false,
  onApprove,
  onReject,
  onCancel,
  isAdmin = false,
}) => {
  const status = statusConfig[appointment.status];

  return (
    <Card className="hover:shadow-card transition-all duration-200">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Main Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  {isAdmin ? appointment.patientName : appointment.doctorName}
                </h3>
                <p className="text-sm text-primary">
                  {isAdmin ? appointment.patientEmail : appointment.doctorSpecialization}
                </p>
              </div>
              <Badge variant={status.variant as any}>{status.label}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{appointment.time}</span>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2 col-span-2">
                  <Stethoscope className="h-4 w-4 text-primary" />
                  <span>{appointment.doctorName}</span>
                </div>
              )}
            </div>

            {appointment.reason && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{appointment.reason}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && appointment.status === 'pending' && (
            <div className="flex gap-2 md:flex-col">
              {isAdmin ? (
                <>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onApprove?.(appointment.id)}
                    className="flex-1"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject?.(appointment.id)}
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCancel?.(appointment.id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

AppointmentCard.displayName = 'AppointmentCard';
