"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { doctors as allDoctors, type Doctor, type Appointment } from '@/lib/data';

const appointmentSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters."),
  date: z.date({ required_error: "A date is required." }),
  time: z.string({ required_error: "A time is required." }),
  reason: z.string().min(10, "Please provide a brief reason for your visit."),
  doctorName: z.string({ required_error: "Please select a doctor." }),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  doctors: Doctor[];
  appointmentToEdit?: Appointment | null;
  onSave: (data: Omit<Appointment, 'id'>, id?: string) => Promise<void>;
}

export function BookingDialog({ isOpen, onClose, doctor: initialDoctor, doctors, appointmentToEdit, onSave }: BookingDialogProps) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: '',
      date: undefined,
      time: '',
      reason: '',
      doctorName: '',
    },
  });
  
  const selectedDate = form.watch('date');
  const selectedDoctorName = form.watch('doctorName');
  
  const selectedDoctor = allDoctors.find(d => d.name === selectedDoctorName);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      setAvailableTimes(selectedDoctor.availability[dateString] || []);
      form.setValue('time', ''); // Reset time when date or doctor changes
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDoctor, selectedDate, form]);

  useEffect(() => {
    if (isOpen) {
      const defaultValues: Partial<AppointmentFormValues> = appointmentToEdit
        ? {
            patientName: appointmentToEdit.patientName,
            date: parse(appointmentToEdit.date, 'PPP', new Date()),
            time: appointmentToEdit.time,
            reason: appointmentToEdit.reason,
            doctorName: appointmentToEdit.doctorName,
          }
        : {
            patientName: '',
            date: undefined,
            time: '',
            reason: '',
            doctorName: initialDoctor?.name || '',
          };
      form.reset(defaultValues as AppointmentFormValues);
    }
  }, [isOpen, initialDoctor, appointmentToEdit, form]);
  
  const handleSubmit = async (values: AppointmentFormValues) => {
    await onSave({
      ...values,
      date: format(values.date, 'PPP'),
    }, appointmentToEdit?.id);
    form.reset();
  };
  
  const currentDoctor = appointmentToEdit ? allDoctors.find(d => d.name === form.getValues('doctorName')) : initialDoctor;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{appointmentToEdit ? "Edit Appointment" : "Book an Appointment"}</DialogTitle>
          <DialogDescription>
            {appointmentToEdit ? 'Update the details for your appointment.' : `Schedule your visit with Dr. ${initialDoctor?.name}. Please fill out the details below.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="doctorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map(d => <SelectItem key={d.id} value={d.name}>Dr. {d.name} - {d.specialization}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                           disabled={!selectedDoctorName}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                            if (!selectedDoctor) return true;
                            const dateString = format(date, 'yyyy-MM-dd');
                            return date < new Date(new Date().setHours(0,0,0,0)) || !selectedDoctor.availability[dateString];
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDate || availableTimes.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedDate ? "Please select a date first" : "Select a time"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTimes.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Visit</FormLabel>
                  <FormControl><Textarea placeholder="e.g. Annual check-up, specific symptoms..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {appointmentToEdit ? 'Save Changes' : 'Confirm Appointment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
