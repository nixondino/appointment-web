// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, CalendarDays, Clock, Trash2, Loader2, User, Save, Building } from 'lucide-react';
import { getAppointments, deleteAppointment } from '@/services/appointmentService';
import { doctors as initialDoctors, updateDoctorAvailability, type Doctor, type Appointment } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(doctors[0]?.id ?? null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 9; h < 17; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  const selectedDoctor = useMemo(() => {
    return doctors.find(d => d.id === selectedDoctorId);
  }, [selectedDoctorId, doctors]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const fetchedAppointments = await getAppointments();
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch appointments.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [toast]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      setAvailability(selectedDoctor.availability[dateString] || []);
    } else {
      setAvailability({});
    }
  }, [selectedDoctor, selectedDate]);

  const handleDeleteAppointment = async (id: string) => {
    try {
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(app => app.id !== id));
      toast({
        title: "Success",
        description: "Appointment cancelled successfully.",
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not cancel the appointment.",
      });
    }
  };

  const handleAvailabilityChange = (time: string, checked: boolean) => {
    if (!selectedDate) return;
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const newAvailability = { ...(availability || {}) };
    if (checked) {
      if (!Array.isArray(newAvailability[dateString])) newAvailability[dateString] = [];
      newAvailability[dateString] = [...newAvailability[dateString], time].sort();
    } else {
      newAvailability[dateString] = (newAvailability[dateString] || []).filter(t => t !== time);
    }
    setAvailability(newAvailability);
  };

  const handleSaveAvailability = async () => {
    if (!selectedDoctorId || !selectedDate) return;
    setIsSaving(true);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const updatedDoctors = updateDoctorAvailability(selectedDoctorId, dateString, availability[dateString] || []);
      setDoctors(updatedDoctors);
      toast({
        title: "Success",
        description: `Availability for Dr. ${selectedDoctor?.name} on ${format(selectedDate, 'PPP')} updated.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save availability.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const dayAvailability = useMemo(() => {
    if (!selectedDate) return [];
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    return availability[dateString] || [];
  }, [availability, selectedDate]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground font-headline flex items-center gap-3">
                <Building className="h-10 w-10 text-primary" />
                Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground mt-2">Manage appointments and doctor schedules.</p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6" /> All Appointments</CardTitle>
                <CardDescription>View and manage all scheduled appointments.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.length > 0 ? appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {appointment.patientName}</TableCell>
                          <TableCell>{appointment.doctorName}</TableCell>
                          <TableCell className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground"/> {appointment.date}</TableCell>
                          <TableCell className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/> {appointment.time}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAppointment(appointment.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center h-24">No appointments found.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarDays className="h-6 w-6" /> Manage Availability</CardTitle>
                <CardDescription>Select a doctor and date to update their schedule.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Doctor</label>
                    <Select onValueChange={(val) => setSelectedDoctorId(Number(val))} defaultValue={selectedDoctorId?.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map(d => <SelectItem key={d.id} value={d.id.toString()}>Dr. {d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                  </div>
                 
                 <div className="space-y-3">
                    <label className="text-sm font-medium">Available Time Slots</label>
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
                      {timeSlots.map(time => (
                         <div key={time} className="flex items-center space-x-2">
                           <Checkbox
                            id={`time-${time}`}
                            checked={dayAvailability.includes(time)}
                            onCheckedChange={(checked) => handleAvailabilityChange(time, !!checked)}
                            disabled={!selectedDoctor || !selectedDate}
                           />
                           <label
                            htmlFor={`time-${time}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {time}
                          </label>
                         </div>
                      ))}
                    </div>
                 </div>
                 <Button onClick={handleSaveAvailability} disabled={isSaving || !selectedDoctorId || !selectedDate} className="w-full">
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Availability
                 </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    