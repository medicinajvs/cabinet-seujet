import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, appId } from '../config/firebase';

// Adicionado o parâmetro 'readyToFetch'
export const useAppointments = (user, isDoctor, readyToFetch) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. SEMÁFORO: Se não estiver pronto ou não tiver usuário, PARE.
    if (!user || !readyToFetch) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const apptsRef = collection(db, 'artifacts', appId, 'public', 'data', 'appointments');
    let q;

    try {
      // 2. FILTRO (Segurança)
      if (isDoctor) {
        q = query(apptsRef, where('doctorEmail', '==', user.email));
      } else {
        q = query(apptsRef, where('userId', '==', user.uid));
      }

      // 3. LISTENER
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          data.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setAppointments(data);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error("Erro em Appointments:", err.message);
          // Não limpamos os dados antigos em caso de erro temporário
          setLoading(false);
          // Apenas define erro se não for permissão temporária
          if (err.code !== 'permission-denied') {
             setError(err.message);
          }
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Erro query:", err);
      setLoading(false);
    }

  }, [user, isDoctor, readyToFetch]); // <--- Dependência crucial

  return { appointments, loading, error };
};