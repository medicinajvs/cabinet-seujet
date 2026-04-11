import { useState, useEffect } from 'react';
import { CLOUDFLARE_API_URL } from '../data/constants';

export const useAppointments = (user, isDoctor, authInitialized) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authInitialized || !user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    // Busca o histórico usando a API do Cloudflare
    fetch(`${CLOUDFLARE_API_URL}/appointments?userId=${user.uid}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro na API");
        return res.json();
      })
      .then((data) => {
        // Ordena por data
        const sortedData = data.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateB - dateA;
        });
        setAppointments(sortedData);
      })
      .catch((err) => {
        console.error("Erro ao buscar histórico via Cloudflare:", err);
        setAppointments([]);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [user, authInitialized]);

  return { appointments, loading };
};