import React, { memo } from 'react';
import { Appointment, AppointmentStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Stethoscope, FileText, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AppointmentCardProps {
  appointment: Appointment;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  isAdmin?: boolean;
}

const statusConfig: Record<AppointmentStatus, { variant: 'success' | 'pending' | 'destructive' | 'secondary' | 'info'; label: string; color: string }> = {
  pending: { variant: 'pending', label: 'Pending', color: 'from-yellow-500/20 to-orange-500/20' },
  approved: { variant: 'success', label: 'Approved', color: 'from-green-500/20 to-emerald-500/20' },
  rejected: { variant: 'destructive', label: 'Rejected', color: 'from-red-500/20 to-pink-500/20' },
  completed: { variant: 'info', label: 'Completed', color: 'from-blue-500/20 to-cyan-500/20' },
  cancelled: { variant: 'secondary', label: 'Cancelled', color: 'from-gray-500/20 to-slate-500/20' },
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden relative group">
        {/* Status gradient overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          status.color
        )} />
        
        <CardContent className="p-5 md:p-6 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Main Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <motion.div
                      className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <User className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {isAdmin ? appointment.patientName : appointment.doctorName}
                      </h3>
                      <p className="text-sm text-primary font-medium">
                        {isAdmin ? appointment.patientEmail : appointment.doctorSpecialization}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge variant={status.variant as any} className="shadow-sm">
                  {status.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <motion.div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium">{appointment.date}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium">{appointment.time}</span>
                </motion.div>
                {isAdmin && (
                  <motion.div 
                    className="flex items-center gap-2 col-span-full p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Stethoscope className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{appointment.doctorName}</span>
                  </motion.div>
                )}
              </div>

              {appointment.reason && (
                <div className="flex items-start gap-2 text-sm p-3 rounded-lg bg-muted/30 border border-border/50">
                  <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{appointment.reason}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            {showActions && appointment.status === 'pending' && (
              <motion.div 
                className="flex gap-2 md:flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
              {isAdmin ? (
                <>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onApprove?.(appointment.id)}
                    className="flex-1 shadow-md hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject?.(appointment.id)}
                    className="flex-1 shadow-md hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCancel?.(appointment.id)}
                  className="hover:scale-105 transition-all"
                >
                  Cancel
                </Button>
              )}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

AppointmentCard.displayName = 'AppointmentCard';
