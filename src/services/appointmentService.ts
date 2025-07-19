import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';
import type { Appointment } from '@/lib/data';

const appointmentsCollection = collection(db, 'appointments');

export const getAppointments = async (): Promise<Appointment[]> => {
  const q = query(appointmentsCollection, orderBy('date', 'asc'), orderBy('time', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];
};

export const addAppointment = async (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
  const docRef = await addDoc(appointmentsCollection, {
    ...appointmentData,
    createdAt: serverTimestamp(),
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...newDoc.data() } as Appointment;
};

export const updateAppointment = async (id: string, appointmentData: Partial<Omit<Appointment, 'id'>>): Promise<Appointment> => {
  const appointmentDoc = doc(db, 'appointments', id);
  await updateDoc(appointmentDoc, appointmentData);
  const updatedDoc = await getDoc(appointmentDoc);
  return { id: updatedDoc.id, ...updatedDoc.data() } as Appointment;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  const appointmentDoc = doc(db, 'appointments', id);
  await deleteDoc(appointmentDoc);
};
