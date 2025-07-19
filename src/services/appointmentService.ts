import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';
import type { Appointment } from '@/lib/data';

const appointmentsCollection = collection(db, 'appointments');

export const getAppointments = async (): Promise<Appointment[]> => {
  const q = query(appointmentsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const appointments = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];
  
  // Since we query by timestamp, we'll sort client-side for a more user-friendly order.
  return appointments.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time.split(' ')[0]}`);
    const dateB = new Date(`${b.date} ${b.time.split(' ')[0]}`);
    return dateA.getTime() - dateB.getTime();
  });
};

export const addAppointment = async (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
  const docRef = await addDoc(appointmentsCollection, {
    ...appointmentData,
    createdAt: serverTimestamp(),
  });
  const newDocSnap = await getDoc(docRef);
  // Firestore can take a moment to assign the server timestamp.
  // We'll wait for the data to be available.
  const newDoc = newDocSnap.data();
  return { id: newDocSnap.id, ...newDoc } as Appointment;
};

export const updateAppointment = async (id: string, appointmentData: Partial<Omit<Appointment, 'id'>>): Promise<Appointment> => {
  const appointmentDoc = doc(db, 'appointments', id);
  await updateDoc(appointmentDoc, {
      ...appointmentData,
      updatedAt: serverTimestamp()
  });
  const updatedDoc = await getDoc(appointmentDoc);
  return { id: updatedDoc.id, ...updatedDoc.data() } as Appointment;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  const appointmentDoc = doc(db, 'appointments', id);
  await deleteDoc(appointmentDoc);
};