import React, { memo } from 'react';
import { Doctor } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Languages } from 'lucide-react';

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
  return (
    <Card className="group hover:shadow-card hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="h-16 w-16 rounded-xl object-cover ring-2 ring-primary/10"
            />
            {doctor.available && (
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-card" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">
                  {doctor.name}
                </h3>
                <p className="text-sm text-primary font-medium">
                  {doctor.specialization}
                </p>
              </div>
              <Badge variant={doctor.available ? 'success' : 'secondary'}>
                {doctor.available ? 'Available' : 'Busy'}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              {doctor.qualification} • {doctor.experience} years exp.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-warning fill-warning" />
            <span className="font-medium">{doctor.rating}</span>
            <span className="text-muted-foreground">({doctor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{doctor.hospital}</span>
          </div>
        </div>

        {/* Languages */}
        <div className="mt-3 flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {doctor.languages.map((lang) => (
              <Badge key={lang} variant="secondary" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
        </div>

        {/* Fee & Next Available */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Consultation Fee: </span>
            <span className="font-semibold text-foreground">${doctor.consultationFee}</span>
          </div>
          {doctor.available && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Next: {doctor.nextAvailable}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewProfile(doctor)}
          >
            View Profile
          </Button>
          <Button
            variant="default"
            className="flex-1"
            disabled={!doctor.available}
            onClick={() => onBookAppointment(doctor)}
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

DoctorCard.displayName = 'DoctorCard';
