import React, { memo } from 'react';
import { Doctor } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Languages, Award, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group hover:shadow-xl hover:border-primary/40 transition-all duration-300 overflow-hidden relative">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-6 relative">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="h-20 w-20 rounded-xl object-cover ring-2 ring-primary/20 shadow-lg"
              />
              {doctor.available && (
                <motion.span 
                  className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-card"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
              <div className="absolute -top-1 -right-1 bg-primary/10 backdrop-blur-sm rounded-full p-1">
                <Award className="h-3 w-3 text-primary" />
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                    {doctor.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-primary font-medium">
                      {doctor.specialization}
                    </p>
                    <GraduationCap className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
                <Badge variant={doctor.available ? 'success' : 'secondary'} className="shadow-sm">
                  {doctor.available ? '● Available' : 'Busy'}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mt-2 font-medium">
                {doctor.qualification} • {doctor.experience} years exp.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 flex items-center gap-6 text-sm">
            <motion.div 
              className="flex items-center gap-1.5"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="h-4 w-4 text-warning fill-warning" />
              <span className="font-semibold">{doctor.rating}</span>
              <span className="text-muted-foreground">({doctor.reviewCount} reviews)</span>
            </motion.div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{doctor.hospital}</span>
            </div>
          </div>

          {/* Languages */}
          <div className="mt-4 flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex gap-1.5 flex-wrap">
              {doctor.languages.map((lang, index) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="text-xs shadow-sm">
                    {lang}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fee & Next Available */}
          <div className="mt-5 p-3 rounded-lg bg-muted/50 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Consultation:</span>
              <span className="font-bold text-lg text-primary">${doctor.consultationFee}</span>
            </div>
            {doctor.available && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4 animate-pulse-gentle" />
                <span className="text-xs">Next: {doctor.nextAvailable}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 group/btn hover:border-primary hover:text-primary transition-all"
              onClick={() => onViewProfile(doctor)}
            >
              View Profile
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </Button>
            <Button
              variant="default"
              className="flex-1 shadow-md hover:shadow-lg hover:scale-105 transition-all"
              disabled={!doctor.available}
              onClick={() => onBookAppointment(doctor)}
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

DoctorCard.displayName = 'DoctorCard';

