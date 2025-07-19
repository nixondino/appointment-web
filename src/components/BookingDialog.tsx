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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Doctor, Appointment } from '@/lib/data';

const appointmentSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters."),
  date: z.date({ required_error: "A date is required." }),
  time: z.string({ required_error: "A time is required." }),
  reason: z.string().min(10, "Please provide a brief reason for your visit."),
  doctorName: z.string(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  appointmentToEdit?: Appointment | null;
  onSave: (data: Omit<Appointment, 'id'>) => void;
}

export function BookingDialog({ isOpen, onClose, doctor, appointmentToEdit, onSave }: BookingDialogProps) {
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

  useEffect(() => {
    if (doctor && selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      setAvailableTimes(doctor.availability[dateString] || []);
      form.setValue('time', ''); // Reset time when date changes
    } else {
      setAvailableTimes([]);
    }
  }, [doctor, selectedDate, form]);

  useEffect(() => {
    if (isOpen) {
      const defaultValues: Partial<AppointmentFormValues> = appointmentToEdit
        ? {
            patientName: appointmentToEdit.patientName,
            date: new Date(appointmentToEdit.date),
            time: appointmentToEdit.time,
            reason: appointmentToEdit.reason,
            doctorName: appointmentToEdit.doctorName,
          }
        : {
            patientName: '',
            date: undefined,
            time: '',
            reason: '',
            doctorName: doctor?.name || '',
          };
      form.reset(defaultValues as AppointmentFormValues);
    }
  }, [isOpen, doctor, appointmentToEdit, form]);
  
  const handleSubmit = (values: AppointmentFormValues) => {
    onSave({
      ...values,
      date: format(values.date, 'PPP'),
    });
    form.reset();
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{appointmentToEdit ? "Edit Appointment" : "Book an Appointment"}</DialogTitle>
          <DialogDescription>
            {`Schedule your visit with Dr. ${doctor.name}. Please fill out the details below.`}
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
                            const dateString = format(date, 'yyyy-MM-dd');
                            return date < new Date(new Date().setHours(0,0,0,0)) || !doctor.availability[dateString];
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDate || availableTimes.length === 0}>
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
              <Button type="submit">Save Appointment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
