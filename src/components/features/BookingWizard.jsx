import React, { useState } from 'react';
import { MapPin, Video, CheckCircle, ShieldCheck, FileText } from 'lucide-react';
import { collection, doc, writeBatch, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, appId } from '../../config/firebase';
import { PRIVACY_POLICY_TEXT } from '../../data/constants';

const BookingWizard = ({ doctors, user, onClose, lang = 'fr' }) => {
  const [step, setStep] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [consultationType, setConsultationType] = useState(null); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState("");
  const [consent, setConsent] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [];
  for (let i = 8; i <= 17; i++) {
    timeSlots.push(`${i}:00`);
    timeSlots.push(`${i}:30`);
  }

  // FILTRO
  const bookableDoctors = doctors.filter(d => d.bookable);

  const checkAvailability = async (doctorId, date, time) => {
    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'appointments'),
      where('doctorId', '==', doctorId),
      where('date', '==', date),
      where('time', '==', time)
    );
    const snapshot = await getDocs(q);
    const hasConflict = snapshot.docs.some(doc => doc.data().status !== 'cancelled');
    return !hasConflict;
  };

  const handleBook = async () => {
    if (!user) { alert("Veuillez vous connecter / Please login."); return; }
    if (!user.emailVerified) { alert("Veuillez vérifier votre email / Please verify your email."); return; }
    if (!consent) { alert("Consentement obligatoire / Consent required."); return; }
    
    setIsSubmitting(true);
    
    try {
      const isAvailable = await checkAvailability(selectedDoc.id || selectedDoc.name, selectedDate, selectedTime);
      if (!isAvailable) {
        alert("Ce créneau n'est plus disponible / Slot not available.");
        setIsSubmitting(false);
        return;
      }

      const batch = writeBatch(db);
      const newApptRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'appointments'));
      const appointmentId = newApptRef.id;
      const privateRecordRef = doc(db, 'artifacts', appId, 'private', 'medical_records', appointmentId);
      const logRef = doc(collection(db, 'artifacts', appId, 'private', 'logs'));
      const timestamp = new Date().toISOString();

      const publicData = {
        userId: user.uid,
        userName: user.displayName || "Patient",
        doctorName: selectedDoc.name,
        doctorEmail: selectedDoc.email,
        doctorId: selectedDoc.id || selectedDoc.name, 
        type: consultationType,
        date: selectedDate,
        time: selectedTime,
        status: 'scheduled',
        createdAt: timestamp
      };

      batch.set(newApptRef, publicData);
      batch.set(privateRecordRef, {
        appointmentId: appointmentId,
        userId: user.uid,
        userEmail: user.email,
        reason: reason,
        consent: true,
        consentTimestamp: serverTimestamp(),
        doctorInternalNotes: "" 
      });
      batch.set(logRef, {
        action: 'CREATE_APPOINTMENT',
        actorId: user.uid,
        actorEmail: user.email,
        targetId: appointmentId,
        details: `Rendez-vous: ${selectedDate} ${selectedTime}`,
        timestamp: serverTimestamp(),
        ip: "client-side"
      });

      await batch.commit();
      setStep(4); 
    } catch (error) {
      console.error("Error booking:", error);
      alert("Erreur: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showPolicy) {
    return (
      <div className="h-[400px] flex flex-col">
        <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="text-[#008080]"/> Politique de Confidentialité</h4>
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded text-sm text-gray-700 whitespace-pre-line border">
          {PRIVACY_POLICY_TEXT}
        </div>
        <button onClick={() => setShowPolicy(false)} className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded font-bold hover:bg-gray-300">
          Retour / Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[400px]">
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded"></div>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-[#008080] text-white' : 'bg-gray-200 text-gray-500'}`}>
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-center mb-6 text-gray-800">
            {lang === 'fr' ? "Choisissez votre praticien" : "Choose your practitioner"}
          </h4>
          
          {/* CORREÇÃO AQUI: Layout Flex Centralizado */}
          <div className="flex flex-wrap justify-center gap-4">
            {bookableDoctors.map((doc, idx) => (
              <div key={doc.id || idx} onClick={() => { setSelectedDoc(doc); setStep(2); }} className="cursor-pointer border-2 border-transparent hover:border-[#008080] hover:bg-teal-50 bg-white p-4 rounded-xl shadow-sm transition flex flex-col items-center text-center gap-3 w-full sm:w-64">
                <img src={doc.image || "https://via.placeholder.com/150"} className="w-20 h-20 rounded-full object-cover" alt={doc.name} />
                <div>
                    <h5 className="font-bold text-gray-800">{doc.name}</h5>
                    <p className="text-xs text-gray-500">
                        {typeof doc.specialty === 'object' ? doc.specialty[lang] : doc.specialty}
                    </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-center text-gray-800">
             {lang === 'fr' ? "Type de consultation" : "Consultation Type"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <button onClick={() => { setConsultationType('onsite'); setStep(3); }} className="p-6 border rounded-xl hover:border-[#008080] hover:bg-teal-50 flex flex-col items-center gap-3 transition group bg-white">
              <MapPin size={32} className="text-gray-400 group-hover:text-[#008080]" />
              <span className="font-bold text-gray-800">{lang === 'fr' ? "Au Cabinet" : "At the Clinic"}</span>
            </button>
            <button onClick={() => { setConsultationType('video'); setStep(3); }} className="p-6 border rounded-xl hover:border-[#008080] hover:bg-teal-50 flex flex-col items-center gap-3 transition group bg-white">
              <Video size={32} className="text-gray-400 group-hover:text-[#008080]" />
              <span className="font-bold text-gray-800">{lang === 'fr' ? "Téléconsultation" : "Video Consultation"}</span>
            </button>
          </div>
          <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:underline w-full text-center">Retour</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-center text-gray-800">Détails</h4>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <label className="block text-sm font-bold mb-2 text-gray-700">Date</label>
              <input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(null); }} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#008080] outline-none text-gray-900 bg-white" />
            </div>
            <div className="md:w-1/2">
              <label className="block text-sm font-bold mb-2 text-gray-700">Horaire / Time</label>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                {timeSlots.map(time => (
                  <button key={time} onClick={() => setSelectedTime(time)} className={`py-2 px-3 text-sm rounded border transition ${selectedTime === time ? 'bg-[#008080] text-white border-[#008080]' : 'hover:bg-gray-100 bg-white text-gray-700'}`}>{time}</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
               <FileText size={16} /> Motif <span className="text-xs font-normal text-gray-500">(Confidentiel)</span>
            </label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="..." className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#008080] outline-none text-gray-900 bg-white h-24 resize-none"></textarea>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
             <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1 w-4 h-4 text-[#008080] rounded focus:ring-[#008080]" />
                <span className="text-xs text-gray-600">
                   J'accepte / I accept: <button type="button" onClick={(e) => { e.preventDefault(); setShowPolicy(true); }} className="text-[#008080] underline font-bold">Politique de Confidentialité</button>.
                </span>
             </label>
          </div>
          <div className="pt-4 border-t flex justify-between items-center">
            <button onClick={() => setStep(2)} className="text-gray-600 hover:text-gray-900">Retour</button>
            <button disabled={!selectedTime || !consent || isSubmitting} onClick={handleBook} className={`px-6 py-2 rounded-full font-bold text-white transition flex items-center gap-2 ${selectedTime && consent && !isSubmitting ? 'bg-[#008080] hover:bg-[#006666]' : 'bg-gray-300 cursor-not-allowed'}`}>
              {isSubmitting ? "..." : "Confirmer"}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-in zoom-in duration-300"><CheckCircle size={40} /></div>
          <h4 className="text-2xl font-bold text-gray-800">Confirmé !</h4>
          <p className="text-gray-600">Votre rendez-vous avec <strong>{selectedDoc.name}</strong> est enregistré.</p>
          <div className="pt-6">
            <button onClick={onClose} className="px-8 py-3 bg-[#008080] text-white rounded-full font-bold hover:bg-[#006666] shadow-lg transition transform hover:scale-105">Fermer / Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWizard;