import { format } from 'date-fns';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  bio: string;
  image: string;
  availability: {
    [key: string]: string[];
  };
}

export interface Testimonial {
  id: number;
  name: string;
  quote: string;
  image: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
}

const generateAvailability = () => {
  const availability: { [key: string]: string[] } = {};
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = format(date, 'yyyy-MM-dd');
    const times = [];
    for (let j = 9; j < 17; j++) {
      if (Math.random() > 0.3) times.push(`${j.toString().padStart(2, '0')}:00`);
      if (Math.random() > 0.5) times.push(`${j.toString().padStart(2, '0')}:30`);
    }
    if (times.length > 0) {
      availability[dateString] = times.sort();
    }
  }
  return availability;
};

export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Evelyn Reed',
    specialization: 'Cardiologist',
    bio: 'Dr. Reed has over 15 years of experience in cardiac care and is dedicated to patient wellness and preventative medicine.',
    image: 'https://placehold.co/100x100.png',
    availability: generateAvailability(),
  },
  {
    id: 2,
    name: 'Dr. Marcus Thorne',
    specialization: 'Dermatologist',
    bio: 'Specializing in both medical and cosmetic dermatology, Dr. Thorne is a leader in innovative skin treatments.',
    image: 'https://placehold.co/100x100.png',
    availability: generateAvailability(),
  },
  {
    id: 3,
    name: 'Dr. Amelia Grant',
    specialization: 'Pediatrician',
    bio: 'With a passion for children\'s health, Dr. Grant provides compassionate and comprehensive care for infants, children, and adolescents.',
    image: 'https://placehold.co/100x100.png',
    availability: generateAvailability(),
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah L.',
    quote: 'The booking process was incredibly smooth and the care I received from Dr. Reed was top-notch. Highly recommend!',
    image: 'https://placehold.co/80x80.png',
  },
  {
    id: 2,
    name: 'James P.',
    quote: 'Finally, a healthcare platform that is easy to use. I managed to book an appointment with Dr. Thorne in minutes.',
    image: 'https://placehold.co/80x80.png',
  },
  {
    id: 3,
    name: 'Emily C.',
    quote: 'Dr. Grant is wonderful with my kids. The clinic is clean, and the staff is so friendly. A great experience overall.',
    image: 'https://placehold.co/80x80.png',
  },
   {
    id: 4,
    name: 'Michael B.',
    quote: 'I appreciated the clear communication and the minimal waiting time. The whole system is very efficient.',
    image: 'https://placehold.co/80x80.png',
  },
];
