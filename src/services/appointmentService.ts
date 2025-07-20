// src/services/appointmentService.ts

export interface Appointment {
  id: string;
  name: string;
  date: string;
  time: string;
  reason: string;
}

const appointments: Appointment[] = [
  { id: '1', name: 'John Doe', date: '2024-12-25', time: '10:00 AM', reason: 'Follow-up' },
  { id: '2', name: 'Jane Smith', date: '2024-12-26', time: '11:30 AM', reason: 'Initial consultation' },
];

export const getAppointments = async (): Promise<Appointment[]> => {
  // In a real application, you would fetch this data from an API
  return Promise.resolve(appointments);
};

export const createAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
  const newAppointment: Appointment = {
    id: (appointments.length + 1).toString(),
    ...appointment,
  };
  appointments.push(newAppointment);
  // In a real application, you would send this data to an API
  return Promise.resolve(newAppointment);
};
