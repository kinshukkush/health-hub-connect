import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockUsers, mockAppointments } from '@/data/mockData';
import { Search, Users, Mail, Phone, Calendar, FileText } from 'lucide-react';

export const AdminPatientsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const patients = mockUsers.filter(u => u.role === 'patient');

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPatientAppointments = (patientId: string) => {
    return mockAppointments.filter(apt => apt.patientId === patientId);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground mt-1">
            View and manage patient information
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Patients Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => {
            const appointments = getPatientAppointments(patient.id);
            return (
              <Card key={patient.id} className="hover:shadow-lg hover:border-primary/20 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{patient.name}</h3>
                      <Badge variant="secondary" className="mt-1">Patient</Badge>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    {patient.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{patient.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined: {patient.createdAt}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>{appointments.length} appointments</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No patients found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
