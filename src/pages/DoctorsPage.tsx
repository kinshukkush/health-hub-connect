import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { DoctorCardSkeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDoctors } from '@/hooks/useDoctors';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/context/AppointmentContext';
import { Doctor } from '@/types';
import { specializations } from '@/data/mockData';
import { Search, Filter, ChevronLeft, ChevronRight, Star, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const DoctorsPage: React.FC = () => {
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState('All Specializations');
  const [page, setPage] = useState(1);

  const { doctors, isLoading, totalPages, totalCount } = useDoctors({
    searchQuery,
    specialization,
    page,
    pageSize: 6,
  });

  // Modal states
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Booking form
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileModal(true);
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
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  ];

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Find Doctors</h1>
          <p className="text-muted-foreground mt-1">
            Search and book appointments with our specialists
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialization, or hospital..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={specialization}
            onValueChange={(value) => {
              setSpecialization(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-[220px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {doctors.length} of {totalCount} doctors
        </p>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <DoctorCardSkeleton key={i} />)
            : doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onViewProfile={handleViewProfile}
                  onBookAppointment={handleBookAppointment}
                />
              ))}
        </div>

        {/* Empty State */}
        {!isLoading && doctors.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Profile Modal */}
        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
          <DialogContent className="max-w-lg">
            {selectedDoctor && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div>
                      <DialogTitle>{selectedDoctor.name}</DialogTitle>
                      <DialogDescription className="text-primary">
                        {selectedDoctor.specialization}
                      </DialogDescription>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedDoctor.qualification} • {selectedDoctor.experience} years
                      </p>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="font-medium">{selectedDoctor.rating}</span>
                      <span className="text-muted-foreground">({selectedDoctor.reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedDoctor.hospital}
                  </div>

                  <p className="text-sm">{selectedDoctor.bio}</p>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Consultation Fee</p>
                    <p className="text-2xl font-bold text-primary">${selectedDoctor.consultationFee}</p>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!selectedDoctor.available}
                    onClick={() => {
                      setShowProfileModal(false);
                      handleBookAppointment(selectedDoctor);
                    }}
                  >
                    {selectedDoctor.available ? 'Book Appointment' : 'Not Available'}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Booking Modal */}
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Appointment</DialogTitle>
              <DialogDescription>
                {selectedDoctor && `Schedule an appointment with ${selectedDoctor.name}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label>Select Time</Label>
                <Select value={bookingTime} onValueChange={setBookingTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reason for Visit</Label>
                <Textarea
                  placeholder="Describe your symptoms or reason for the appointment..."
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  rows={3}
                />
              </div>

              <Button className="w-full" onClick={handleSubmitBooking}>
                <Calendar className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};
