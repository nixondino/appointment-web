"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Stethoscope, CalendarDays, Clock, Phone, Mail, MapPin, Edit, Trash2, HeartHandshake, Quote, User } from 'lucide-react';
import { doctors, testimonials, type Doctor } from '@/lib/data';
import type { Appointment } from '@/lib/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookingDialog } from '@/components/BookingDialog';

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    doctor: Doctor | null;
    appointmentToEdit: Appointment | null;
  }>({ isOpen: false, doctor: null, appointmentToEdit: null });

  const handleBookNow = (doctor: Doctor) => {
    setDialogState({ isOpen: true, doctor, appointmentToEdit: null });
  };

  const handleEditAppointment = (appointment: Appointment) => {
    const doctor = doctors.find(d => d.name === appointment.doctorName) || null;
    setDialogState({ isOpen: true, doctor, appointmentToEdit: appointment });
  };

  const handleDeleteAppointment = (id: number) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };
  
  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    if (dialogState.appointmentToEdit) {
      // Update existing appointment
      setAppointments(prev => prev.map(app => 
        app.id === dialogState.appointmentToEdit!.id 
          ? { ...dialogState.appointmentToEdit!, ...appointmentData } 
          : app
      ));
    } else {
      // Add new appointment
      setAppointments(prev => [
        ...prev,
        { ...appointmentData, id: Date.now() }
      ]);
    }
    setDialogState({ isOpen: false, doctor: null, appointmentToEdit: null });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative text-center py-20 md:py-32 bg-primary/20 overflow-hidden">
          <div className="container z-10 relative">
            <HeartHandshake className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary-foreground tracking-tight">Your Health, Our Priority</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80">
              Welcome to Serene Appointments. Effortlessly book and manage your medical consultations online.
            </p>
            <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <a href="#doctors">Find a Doctor</a>
            </Button>
          </div>
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white,transparent)] z-0"></div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-16 sm:py-24">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl font-headline">About Serene Appointments</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Our mission is to provide a calm, seamless, and efficient way for you to connect with trusted healthcare professionals. We believe that managing your health should be a stress-free experience.
              </p>
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section id="doctors" className="py-16 sm:py-24 bg-primary/10">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl font-headline">Meet Our Doctors</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Our team of dedicated and experienced doctors is here to provide you with the best care.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center gap-4 p-6">
                    <Image src={doctor.image} alt={doctor.name} width={80} height={80} className="rounded-full border-2 border-primary" data-ai-hint="doctor portrait" />
                    <div>
                      <CardTitle className="font-headline text-xl">{doctor.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <Stethoscope className="h-4 w-4 text-primary" /> {doctor.specialization}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-6 pt-0">
                    <p className="text-muted-foreground">{doctor.bio}</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button onClick={() => handleBookNow(doctor)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Book an Appointment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 sm:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl font-headline">Words from Our Patients</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                We are proud to have made a positive impact on our patients' lives.
              </p>
            </div>
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2">
                    <div className="p-1">
                      <Card className="h-full shadow-md">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                          <Quote className="w-8 h-8 text-primary/50 mb-4" />
                          <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint="happy person" />
                              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold text-primary-foreground">{testimonial.name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* My Appointments Section */}
        <section id="appointments" className="py-16 sm:py-24 bg-primary/10">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl font-headline">Your Upcoming Appointments</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                View, edit, or cancel your scheduled appointments below.
              </p>
            </div>
            {appointments.length > 0 ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="shadow-md overflow-hidden transition-all duration-300">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-grow space-y-2">
                        <p className="font-bold text-lg text-primary-foreground">Dr. {appointment.doctorName}</p>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-2"><User className="w-4 h-4"/>{appointment.patientName}</div>
                          <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4"/>{appointment.date}</div>
                          <div className="flex items-center gap-2"><Clock className="w-4 h-4"/>{appointment.time}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditAppointment(appointment)}><Edit className="w-4 h-4 mr-2" />Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteAppointment(appointment.id)}><Trash2 className="w-4 h-4 mr-2" />Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-lg bg-card p-8 rounded-lg shadow-sm">You have no upcoming appointments.</p>
            )}
          </div>
        </section>

      </main>
      <Footer />
      <BookingDialog 
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, doctor: null, appointmentToEdit: null })}
        doctor={dialogState.doctor}
        appointmentToEdit={dialogState.appointmentToEdit}
        onSave={handleSaveAppointment}
      />
    </div>
  );
}
